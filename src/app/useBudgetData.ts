import { useEffect, useMemo, useState } from 'react';
import type {
  AnnualCost,
  AnnualIncome,
  Category,
  FixedCost,
  Income,
  LegacyVariableCategory,
  SavingGoal,
  VariableCategoryBudget,
  VariableCost,
} from './types';

export const STORAGE_KEYS = {
  incomes: 'budget-app-incomes',
  fixedCosts: 'budget-app-fixed-costs',
  variableCosts: 'budget-app-variable-costs',
  categories: 'budget-app-categories',
  variableCategories: 'budget-app-variable-categories',
  variableCategoryBudgets: 'budget-app-variable-category-budgets',
  annualIncomes: 'budget-app-annual-incomes',
  annualCosts: 'budget-app-annual-costs',
  savingGoal: 'budget-app-saving-goal',
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
  categories: Category[];
  variableCategoryBudgets: VariableCategoryBudget[];
} {
  const legacyItems = loadValue<LegacyVariableCategory[]>(STORAGE_KEYS.variableCategories, []);
  const categories: Category[] = [];
  const variableCategoryBudgets: VariableCategoryBudget[] = [];

  legacyItems.forEach((item, index) => {
    if (
      !item
      || typeof item.id !== 'string'
      || typeof item.name !== 'string'
      || typeof item.budgetAmount !== 'number'
    ) {
      return;
    }
    const name = item.name.trim();
    if (!name || !Number.isFinite(item.budgetAmount)) return;
    const duplicateCount = categories.filter((category) =>
      category.name === name || category.name.startsWith(`${name} (`),
    ).length;
    const categoryName = duplicateCount === 0 ? name : `${name} (${duplicateCount + 1})`;

    const category: Category = {
      id: item.id,
      name: categoryName,
      color: typeof item.color === 'string' ? item.color : undefined,
      icon: typeof item.icon === 'string' ? item.icon : undefined,
      memo: typeof item.memo === 'string' ? item.memo : undefined,
      createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date(0).toISOString(),
      updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : new Date(0).toISOString(),
    };
    categories.push(category);

    variableCategoryBudgets.push({
      id: `${item.id}-budget-${index}`,
      categoryId: item.id,
      budgetAmount: item.budgetAmount,
      memo: typeof item.memo === 'string' ? item.memo : undefined,
      createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date(0).toISOString(),
      updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : new Date(0).toISOString(),
    });
  });

  return { categories, variableCategoryBudgets };
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
        categoryId: item.categoryId || '',
      })) as VariableCost[],
  );
  const [categories, setCategories] = useStoredState<Category[]>(
    STORAGE_KEYS.categories,
    legacyCategoryData.categories,
  );
  const [variableCategoryBudgets, setVariableCategoryBudgets] = useStoredState<VariableCategoryBudget[]>(
    STORAGE_KEYS.variableCategoryBudgets,
    legacyCategoryData.variableCategoryBudgets,
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

  const totals = useMemo(() => {
    const targetYear = targetMonth.slice(0, 4);
    const incomeTotal = incomes
      .filter((item) => item.month.slice(0, 7) === targetMonth)
      .reduce((sum, item) => sum + item.amount, 0);
    const fixedCostTotal = fixedCosts
      .filter((item) => item.month.slice(0, 7) === targetMonth)
      .reduce((sum, item) => sum + item.amount, 0);
    const variableCostTotal = variableCosts
      .filter((item) => item.month.slice(0, 7) === targetMonth)
      .reduce((sum, item) => sum + item.amount, 0);
    const variableBudgetTotal = variableCategoryBudgets.reduce(
      (sum, item) => sum + item.budgetAmount,
      0,
    );
    const variableRemainingTotal = variableBudgetTotal - variableCostTotal;
    const variableUsageRate =
      variableBudgetTotal > 0
        ? Math.round((variableCostTotal / variableBudgetTotal) * 100)
        : 0;
    const estimatedAnnualIncomeTotal = annualIncomes.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    const estimatedAnnualFixedCostTotal = annualCosts.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    const estimatedMonthlyFreeBudget = Math.floor(
      (estimatedAnnualIncomeTotal - estimatedAnnualFixedCostTotal) / 12,
    );
    const actualRemainingBudget = incomeTotal - fixedCostTotal - variableCostTotal;
    const yearlyIncomeTotal = incomes
      .filter((item) => item.month.slice(0, 4) === targetYear)
      .reduce((sum, item) => sum + item.amount, 0);
    const yearlyFixedCostTotal = fixedCostTotal * 12;
    const yearlyVariableCostTotal = variableCosts
      .filter((item) => item.month.slice(0, 4) === targetYear)
      .reduce((sum, item) => sum + item.amount, 0);
    const yearlyBudgetTotal = variableBudgetTotal * 12;
    const yearlyActualRemainingBudget =
      yearlyIncomeTotal - yearlyFixedCostTotal - yearlyVariableCostTotal;
    const yearlyVariableRemainingTotal = yearlyBudgetTotal - yearlyVariableCostTotal;
    const yearlyVariableUsageRate =
      yearlyBudgetTotal > 0
        ? Math.max(0, Math.round((yearlyVariableCostTotal / yearlyBudgetTotal) * 100))
        : 0;

    return {
      incomeTotal,
      fixedCostTotal,
      variableCostTotal,
      variableBudgetTotal,
      variableRemainingTotal,
      variableUsageRate,
      estimatedAnnualIncomeTotal,
      estimatedAnnualFixedCostTotal,
      estimatedMonthlyFreeBudget,
      estimatedYearlyFreeBudget: estimatedAnnualIncomeTotal - estimatedAnnualFixedCostTotal,
      actualRemainingBudget,
      freeBudgetAfterSaving: actualRemainingBudget - savingGoal.amount,
      yearlyIncomeTotal,
      yearlyFixedCostTotal,
      yearlyVariableCostTotal,
      yearlyBudgetTotal,
      yearlyVariableRemainingTotal,
      yearlyVariableUsageRate,
      yearlyActualRemainingBudget,
      yearlyFreeBudgetAfterSaving: yearlyActualRemainingBudget - savingGoal.amount * 12,
    };
  }, [
    annualCosts,
    annualIncomes,
    targetMonth,
    fixedCosts,
    incomes,
    savingGoal.amount,
    variableCategoryBudgets,
    variableCosts,
  ]);

  const categoryComparisons = useMemo(() => {
    const categoryIds = new Set(categories.map((category) => category.id));
    const actualByCategory = new Map<string, number>();

    variableCosts
      .filter((item) => item.month.slice(0, 7) === targetMonth)
      .forEach((item) => {
        const categoryId = categoryIds.has(item.categoryId) ? item.categoryId : '';
        actualByCategory.set(
          categoryId,
          (actualByCategory.get(categoryId) ?? 0) + item.amount,
        );
      });

    const comparisons = variableCategoryBudgets.map((budget) => {
      const category = categories.find((item) => item.id === budget.categoryId);
      const categoryId = category?.id ?? '';
      const actualAmount = actualByCategory.get(categoryId) ?? 0;
      return {
        id: budget.id,
        categoryId,
        name: category?.name ?? '未分類',
        budgetAmount: budget.budgetAmount,
        actualAmount,
        remainingAmount: budget.budgetAmount - actualAmount,
        usageRate:
          budget.budgetAmount > 0
            ? Math.round((actualAmount / budget.budgetAmount) * 100)
            : 0,
      };
    });

    const uncategorizedActual = actualByCategory.get('') ?? 0;
    if (uncategorizedActual > 0) {
      comparisons.push({
        id: '',
        name: '未分類',
        budgetAmount: 0,
        actualAmount: uncategorizedActual,
        remainingAmount: -uncategorizedActual,
        usageRate: 0,
      });
    }

    return comparisons;
  }, [targetMonth, categories, variableCategoryBudgets, variableCosts]);

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
    categories,
    setCategories,
    variableCategoryBudgets,
    setVariableCategoryBudgets,
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
