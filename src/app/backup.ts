import type {
  AnnualCost,
  AnnualIncome,
  Category,
  CategoryGroup,
  FixedCost,
  Income,
  MonthlyBudget,
  SavingGoal,
  VariableCategoryBudget,
  VariableCost,
} from './types';
import { normalizeMonthlyBudgets } from './budgetDomain';

export type BackupData = {
  incomes: Income[];
  fixedCosts: FixedCost[];
  variableCosts: VariableCost[];
  categoryGroups: CategoryGroup[];
  categories: Category[];
  variableCategoryBudgets: VariableCategoryBudget[];
  monthlyBudgets: MonthlyBudget[];
  annualIncomes: AnnualIncome[];
  annualCosts: AnnualCost[];
  savingGoal: SavingGoal;
};

export type BackupFile = {
  app: 'budget-app';
  version: 1 | 2;
  exportedAt: string;
  data: BackupData;
};

export const BACKUP_APP_ID = 'budget-app';
export const BACKUP_VERSION = 2;
export const BACKUP_DATA_KEYS: (keyof BackupData)[] = [
  'incomes',
  'fixedCosts',
  'variableCosts',
  'categoryGroups',
  'categories',
  'variableCategoryBudgets',
  'monthlyBudgets',
  'annualIncomes',
  'annualCosts',
  'savingGoal',
];
export const EMPTY_BACKUP_DATA: BackupData = {
  incomes: [],
  fixedCosts: [],
  variableCosts: [],
  categoryGroups: [],
  categories: [],
  variableCategoryBudgets: [],
  monthlyBudgets: [],
  annualIncomes: [],
  annualCosts: [],
  savingGoal: { amount: 0, updatedAt: new Date(0).toISOString() },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSavingGoal(value: unknown): value is SavingGoal {
  return (
    isRecord(value)
    && typeof value.amount === 'number'
    && Number.isFinite(value.amount)
    && typeof value.updatedAt === 'string'
  );
}

function migrateLegacyBackupCategories(value: unknown): {
  categoryGroups: CategoryGroup[];
  categories: Category[];
  variableCategoryBudgets: VariableCategoryBudget[];
} | null {
  if (!Array.isArray(value)) return null;
  const legacyGroup: CategoryGroup = {
    id: 'legacy-category-group',
    name: '旧カテゴリ',
    color: '#717182',
    icon: 'archive',
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  };

  const migrated = value.reduce<{
    categories: Category[];
    variableCategoryBudgets: VariableCategoryBudget[];
  }>(
    (result, item, index) => {
      if (!isRecord(item) || typeof item.id !== 'string' || typeof item.name !== 'string') {
        return result;
      }
      const name = item.name.trim();
      if (!name || typeof item.budgetAmount !== 'number') return result;
      const duplicateCount = result.categories.filter((category) =>
        category.name === name || category.name.startsWith(`${name} (`),
      ).length;
      const categoryName = duplicateCount === 0 ? name : `${name} (${duplicateCount + 1})`;
      const createdAt = typeof item.createdAt === 'string'
        ? item.createdAt
        : new Date(0).toISOString();
      const updatedAt = typeof item.updatedAt === 'string' ? item.updatedAt : createdAt;

      result.categories.push({
        id: item.id,
        groupId: legacyGroup.id,
        name: categoryName,
        color: typeof item.color === 'string' ? item.color : undefined,
        icon: typeof item.icon === 'string' ? item.icon : undefined,
        memo: typeof item.memo === 'string' ? item.memo : undefined,
        createdAt,
        updatedAt,
      });
      result.variableCategoryBudgets.push({
        id: `${item.id}-budget-${index}`,
        categoryId: item.id,
        budgetAmount: item.budgetAmount,
        memo: typeof item.memo === 'string' ? item.memo : undefined,
        createdAt,
        updatedAt,
      });
      return result;
    },
    { categories: [], variableCategoryBudgets: [] },
  );
  return { categoryGroups: migrated.categories.length > 0 ? [legacyGroup] : [], ...migrated };
}

function normalizeBackupCategories(
  rawCategories: unknown,
  rawGroups: unknown,
): { categoryGroups: CategoryGroup[]; categories: Category[] } | null {
  if (!Array.isArray(rawCategories)) return null;
  const legacyGroup: CategoryGroup = {
    id: 'legacy-category-group',
    name: '旧カテゴリ',
    color: '#717182',
    icon: 'archive',
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  };
  const categories = rawCategories
    .filter((item): item is Record<string, unknown> =>
      isRecord(item) && typeof item.id === 'string' && typeof item.name === 'string',
    )
    .map((item) => ({
      id: item.id as string,
      groupId: typeof item.groupId === 'string' && item.groupId ? item.groupId : legacyGroup.id,
      name: (item.name as string).trim(),
      color: typeof item.color === 'string' ? item.color : undefined,
      icon: typeof item.icon === 'string' ? item.icon : undefined,
      memo: typeof item.memo === 'string' ? item.memo : undefined,
      createdAt: typeof item.createdAt === 'string'
        ? item.createdAt
        : new Date(0).toISOString(),
      updatedAt: typeof item.updatedAt === 'string'
        ? item.updatedAt
        : new Date(0).toISOString(),
    }))
    .filter((item) => item.name);
  const groups = Array.isArray(rawGroups)
    ? rawGroups.filter((item): item is CategoryGroup =>
        isRecord(item)
        && typeof item.id === 'string'
        && typeof item.name === 'string'
        && item.name.trim() !== '',
      )
    : [];
  const needsLegacyGroup = categories.some((category) => category.groupId === legacyGroup.id);
  return {
    categoryGroups: needsLegacyGroup && !groups.some((group) => group.id === legacyGroup.id)
      ? [legacyGroup, ...groups]
      : groups,
    categories,
  };
}

function migrateMonthlyBudgets(
  rawMonthlyBudgets: unknown,
  rawVariableCategoryBudgets: unknown,
  now: Date,
): MonthlyBudget[] {
  if (Array.isArray(rawMonthlyBudgets)) {
    const normalizedBudgets = normalizeMonthlyBudgets(rawMonthlyBudgets
      .filter((item): item is Record<string, unknown> =>
        isRecord(item) && typeof item.yearMonth === 'string',
      )
      .map((item) => ({
        yearMonth: (item.yearMonth as string).slice(0, 7),
        fixedExpenseBudget:
          typeof item.fixedExpenseBudget === 'number' && Number.isFinite(item.fixedExpenseBudget)
            ? Math.max(0, item.fixedExpenseBudget)
            : 0,
        variableExpenseBudget:
          typeof item.variableExpenseBudget === 'number' && Number.isFinite(item.variableExpenseBudget)
            ? Math.max(0, item.variableExpenseBudget)
            : 0,
        createdAt: typeof item.createdAt === 'string'
          ? item.createdAt
          : new Date(0).toISOString(),
        updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : '',
      })));
    return normalizedBudgets.map((item) => ({
      ...item,
      updatedAt: Number.isFinite(Date.parse(item.updatedAt))
        ? item.updatedAt
        : new Date(0).toISOString(),
    }));
  }
  if (!Array.isArray(rawVariableCategoryBudgets)) return [];
  const nowIso = now.toISOString();
  const total = rawVariableCategoryBudgets.reduce((sum, item) => {
    if (!isRecord(item) || typeof item.budgetAmount !== 'number' || !Number.isFinite(item.budgetAmount)) {
      return sum;
    }
    return sum + item.budgetAmount;
  }, 0);
  return total > 0
    ? [{
        yearMonth: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
        fixedExpenseBudget: 0,
        variableExpenseBudget: total,
        createdAt: nowIso,
        updatedAt: nowIso,
      }]
    : [];
}

export function parseBackupFile(value: unknown, now = new Date()): BackupFile | null {
  if (!isRecord(value) || value.app !== BACKUP_APP_ID || (value.version !== 1 && value.version !== 2)) {
    return null;
  }
  if (typeof value.exportedAt !== 'string' || !isRecord(value.data)) {
    return null;
  }

  const backupData = value.data;
  const requiredArraysValid = [
    'incomes',
    'fixedCosts',
    'variableCosts',
    'annualIncomes',
    'annualCosts',
  ].every((key) => Array.isArray(backupData[key]));
  const normalizedCategories = normalizeBackupCategories(
    backupData.categories,
    backupData.categoryGroups,
  );
  const migratedLegacyCategories = normalizedCategories
    ? null
    : migrateLegacyBackupCategories(backupData.variableCategories);
  if (
    !requiredArraysValid
    || (!normalizedCategories && !migratedLegacyCategories)
    || !isSavingGoal(backupData.savingGoal)
  ) {
    return null;
  }

  const categoryGroups = normalizedCategories?.categoryGroups
    ?? migratedLegacyCategories?.categoryGroups
    ?? [];
  const categories = normalizedCategories?.categories
    ?? migratedLegacyCategories?.categories
    ?? [];
  const variableCategoryBudgets = Array.isArray(backupData.variableCategoryBudgets)
    ? backupData.variableCategoryBudgets as VariableCategoryBudget[]
    : migratedLegacyCategories?.variableCategoryBudgets ?? [];
  const monthlyBudgets = migrateMonthlyBudgets(
    backupData.monthlyBudgets,
    variableCategoryBudgets,
    now,
  );

  return {
    app: BACKUP_APP_ID,
    version: BACKUP_VERSION,
    exportedAt: value.exportedAt,
    data: {
      incomes: backupData.incomes as Income[],
      fixedCosts: backupData.fixedCosts as FixedCost[],
      variableCosts: backupData.variableCosts as VariableCost[],
      categoryGroups,
      categories,
      variableCategoryBudgets,
      monthlyBudgets,
      annualIncomes: backupData.annualIncomes as AnnualIncome[],
      annualCosts: backupData.annualCosts as AnnualCost[],
      savingGoal: backupData.savingGoal,
    },
  };
}

export function parseBackupJson(
  text: string,
  now = new Date(),
):
  | { ok: true; backup: BackupFile }
  | { ok: false; reason: 'invalid-json' | 'invalid-backup' } {
  let value: unknown;
  try {
    value = JSON.parse(text) as unknown;
  } catch {
    return { ok: false, reason: 'invalid-json' };
  }

  const backup = parseBackupFile(value, now);
  return backup
    ? { ok: true, backup }
    : { ok: false, reason: 'invalid-backup' };
}

