import { useEffect, useMemo, useState } from 'react';
import type {
  AnnualCost,
  AnnualIncome,
  Category,
  CategoryGroup,
  FixedCost,
  Income,
  LegacyVariableCategory,
  MonthlyBudget,
  SavingGoal,
  VariableCategoryBudget,
  VariableCost,
} from './types';
import {
  calculateBudgetTotals,
  calculateCategoryComparisons,
  normalizeMonthlyBudgets,
  planVersion2Migration,
} from './budgetDomain';

const DATA_VERSION = 2;
const LEGACY_GROUP_ID = 'legacy-category-group';
const LEGACY_GROUP_NAME = '旧カテゴリ';

export const STORAGE_KEYS = {
  incomes: 'budget-app-incomes',
  fixedCosts: 'budget-app-fixed-costs',
  variableCosts: 'budget-app-variable-costs',
  categoryGroups: 'budget-app-category-groups',
  categories: 'budget-app-categories',
  variableCategories: 'budget-app-variable-categories',
  variableCategoryBudgets: 'budget-app-variable-category-budgets',
  monthlyBudgets: 'budget-app-monthly-budgets',
  annualIncomes: 'budget-app-annual-incomes',
  annualCosts: 'budget-app-annual-costs',
  savingGoal: 'budget-app-saving-goal',
  version: 'budget-app-data-version',
} as const;

function loadValue<T>(key: string, fallback: T, normalize?: (value: T) => T): T {
  try {
    const value = localStorage.getItem(key);
    const parsed = value ? (JSON.parse(value) as T) : fallback;
    return normalize ? normalize(parsed) : parsed;
  } catch {
    return fallback;
  }
}

function useStoredState<T>(key: string, fallback: T, normalize?: (value: T) => T) {
  const [value, setValue] = useState<T>(() => loadValue(key, fallback, normalize));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage may be unavailable or full. Keep the in-memory state usable.
    }
  }, [key, value]);

  return [value, setValue] as const;
}

function migrateLegacyCategories(): {
  categoryGroups: CategoryGroup[];
  categories: Category[];
  variableCategoryBudgets: VariableCategoryBudget[];
} {
  const legacyItems = loadValue<LegacyVariableCategory[]>(STORAGE_KEYS.variableCategories, []);
  const existingCategories = loadValue<(Category & { groupId?: string })[]>(STORAGE_KEYS.categories, []);
  const existingGroups = loadValue<CategoryGroup[]>(STORAGE_KEYS.categoryGroups, []);
  const categories: Category[] = [];
  const variableCategoryBudgets: VariableCategoryBudget[] = [];
  const now = new Date(0).toISOString();
  const legacyGroup: CategoryGroup = {
    id: LEGACY_GROUP_ID,
    name: LEGACY_GROUP_NAME,
    color: '#717182',
    icon: 'archive',
    createdAt: now,
    updatedAt: now,
  };

  const sourceItems = existingCategories.length > 0 ? existingCategories : legacyItems;
  sourceItems.forEach((item, index) => {
    if (
      !item
      || typeof item.id !== 'string'
      || typeof item.name !== 'string'
    ) {
      return;
    }
    const name = item.name.trim();
    if (!name) return;
    const duplicateCount = categories.filter((category) =>
      category.name === name || category.name.startsWith(`${name} (`),
    ).length;
    const categoryName = duplicateCount === 0 ? name : `${name} (${duplicateCount + 1})`;

    const category: Category = {
      id: item.id,
      groupId: typeof item.groupId === 'string' && item.groupId ? item.groupId : LEGACY_GROUP_ID,
      name: categoryName,
      color: typeof item.color === 'string' ? item.color : undefined,
      icon: typeof item.icon === 'string' ? item.icon : undefined,
      memo: typeof item.memo === 'string' ? item.memo : undefined,
      createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date(0).toISOString(),
      updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : new Date(0).toISOString(),
    };
    categories.push(category);

    if ('budgetAmount' in item && typeof item.budgetAmount === 'number' && Number.isFinite(item.budgetAmount)) {
      variableCategoryBudgets.push({
        id: `${item.id}-budget-${index}`,
        categoryId: item.id,
        budgetAmount: item.budgetAmount,
        memo: typeof item.memo === 'string' ? item.memo : undefined,
        createdAt: typeof item.createdAt === 'string' ? item.createdAt : now,
        updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : now,
      });
    }
  });

  const categoryGroups = existingGroups.length > 0
    ? existingGroups
    : categories.length > 0
      ? [legacyGroup]
      : [];

  return { categoryGroups, categories, variableCategoryBudgets };
}

function normalizeCategoryGroups(groups: CategoryGroup[], categories: Category[]) {
  const validGroups = groups.filter((group) =>
    group
    && typeof group.id === 'string'
    && typeof group.name === 'string'
    && group.name.trim(),
  );
  const needsLegacyGroup = categories.some((category) => category.groupId === LEGACY_GROUP_ID);
  if (needsLegacyGroup && !validGroups.some((group) => group.id === LEGACY_GROUP_ID)) {
    return [
      {
        id: LEGACY_GROUP_ID,
        name: LEGACY_GROUP_NAME,
        color: '#717182',
        icon: 'archive',
        createdAt: new Date(0).toISOString(),
        updatedAt: new Date(0).toISOString(),
      },
      ...validGroups,
    ];
  }
  return validGroups;
}

function normalizeCategories(items: (Category & { groupId?: string })[]) {
  return items
    .filter((item) => item && typeof item.id === 'string' && typeof item.name === 'string')
    .map((item) => ({
      ...item,
      groupId: item.groupId || LEGACY_GROUP_ID,
      name: item.name.trim(),
      createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date(0).toISOString(),
      updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : new Date(0).toISOString(),
    }));
}

export function createId() {
  return globalThis.crypto?.randomUUID?.()
    ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function useBudgetData() {
  const currentMonth = getCurrentMonth();
  const [targetMonth, setTargetMonth] = useState(currentMonth);
  const legacyCategoryData = useMemo(() => migrateLegacyCategories(), []);
  const normalizeDate = (value?: string) => {
    if (!value) return `${currentMonth}-01`;
    return value.length === 7 ? `${value}-01` : value;
  };
  const addNormalizedDate = <T extends { month?: string }>(items: T[]) =>
    items.map((item) => ({ ...item, month: normalizeDate(item.month) }));

  const [incomes, setIncomes] = useStoredState<Income[]>(
    STORAGE_KEYS.incomes,
    [],
    (items) => addNormalizedDate(items) as Income[],
  );
  const [fixedCosts, setFixedCosts] = useStoredState<FixedCost[]>(
    STORAGE_KEYS.fixedCosts,
    [],
    (items) => addNormalizedDate(items) as FixedCost[],
  );
  const [variableCosts, setVariableCosts] = useStoredState<VariableCost[]>(
    STORAGE_KEYS.variableCosts,
    [],
    (items) =>
      addNormalizedDate(items).map((item) => ({
        ...item,
        categoryId: item.categoryId || undefined,
        categoryGroupId: item.categoryGroupId || undefined,
      })) as VariableCost[],
  );
  const [categoryGroups, setCategoryGroups] = useStoredState<CategoryGroup[]>(
    STORAGE_KEYS.categoryGroups,
    legacyCategoryData.categoryGroups,
    (items) => normalizeCategoryGroups(items, legacyCategoryData.categories),
  );
  const [categories, setCategories] = useStoredState<Category[]>(
    STORAGE_KEYS.categories,
    legacyCategoryData.categories,
    normalizeCategories,
  );
  const [variableCategoryBudgets, setVariableCategoryBudgets] = useStoredState<VariableCategoryBudget[]>(
    STORAGE_KEYS.variableCategoryBudgets,
    legacyCategoryData.variableCategoryBudgets,
  );
  const [monthlyBudgets, setMonthlyBudgets] = useStoredState<MonthlyBudget[]>(
    STORAGE_KEYS.monthlyBudgets,
    [],
    normalizeMonthlyBudgets,
  );
  const [annualIncomes, setAnnualIncomes] = useStoredState<AnnualIncome[]>(
    STORAGE_KEYS.annualIncomes,
    [],
  );
  const [annualCosts, setAnnualCosts] = useStoredState<AnnualCost[]>(
    STORAGE_KEYS.annualCosts,
    [],
  );
  const [savingGoal, setSavingGoal] = useStoredState<SavingGoal>(
    STORAGE_KEYS.savingGoal,
    { amount: 0, updatedAt: new Date(0).toISOString() },
  );

  useEffect(() => {
    const categoryById = new Map(categories.map((category) => [category.id, category]));
    setVariableCosts((current) => {
      let changed = false;
      const next = current.map((item) => {
        if (item.categoryGroupId) return item;
        const category = item.categoryId ? categoryById.get(item.categoryId) : undefined;
        const nextGroupId = category?.groupId;
        if (!nextGroupId) return item;
        changed = true;
        return { ...item, categoryGroupId: nextGroupId };
      });
      return changed ? next : current;
    });
  }, [categories, setVariableCosts]);

  useEffect(() => {
    try {
      const storedVersion = Number(localStorage.getItem(STORAGE_KEYS.version) || '0');
      if (storedVersion >= DATA_VERSION) return;
      const migration = planVersion2Migration({
        storedVersion,
        variableCategoryBudgets,
        monthlyBudgets,
        currentMonth,
        nowIso: new Date().toISOString(),
      });
      if (migration.changed) {
        setMonthlyBudgets(migration.monthlyBudgets);
      }
      localStorage.setItem(STORAGE_KEYS.version, String(DATA_VERSION));
    } catch {
      // Keep startup resilient when storage is unavailable or contains partial legacy data.
    }
  }, [currentMonth, monthlyBudgets.length, setMonthlyBudgets, variableCategoryBudgets]);

  const totals = useMemo(() => calculateBudgetTotals({
    targetMonth,
    incomes,
    fixedCosts,
    variableCosts,
    monthlyBudgets,
    annualIncomes,
    annualCosts,
    savingGoal,
  }), [
    annualCosts,
    annualIncomes,
    targetMonth,
    fixedCosts,
    incomes,
    monthlyBudgets,
    savingGoal.amount,
    variableCosts,
  ]);

  const categoryComparisons = useMemo(() => calculateCategoryComparisons({
    targetMonth,
    categories,
    variableCategoryBudgets,
    variableCosts,
  }), [targetMonth, categories, variableCategoryBudgets, variableCosts]);

  return {
    currentMonth,
    targetMonth,
    setTargetMonth,
    incomes,
    setIncomes,
    fixedCosts,
    setFixedCosts,
    variableCosts,
    setVariableCosts,
    categoryGroups,
    setCategoryGroups,
    categories,
    setCategories,
    variableCategoryBudgets,
    setVariableCategoryBudgets,
    monthlyBudgets,
    setMonthlyBudgets,
    annualIncomes,
    setAnnualIncomes,
    annualCosts,
    setAnnualCosts,
    savingGoal,
    setSavingGoal,
    totals,
    categoryComparisons,
  };
}

export type BudgetData = ReturnType<typeof useBudgetData>;
