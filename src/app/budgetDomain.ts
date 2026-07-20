import type {
  AnnualCost,
  AnnualIncome,
  Category,
  CategoryComparison,
  CategoryGroup,
  FixedCost,
  Income,
  MonthlyBudget,
  SavingGoal,
  VariableCategoryBudget,
  VariableCost,
  VariableCostBreakdown,
} from './types';

export function normalizeMonthlyBudgets(items: MonthlyBudget[]): MonthlyBudget[] {
  if (!Array.isArray(items)) return [];

  const budgetByMonth = new Map<string, MonthlyBudget>();
  let hasDuplicate = false;

  items.forEach((item) => {
    const current = budgetByMonth.get(item.yearMonth);
    if (!current) {
      budgetByMonth.set(item.yearMonth, item);
      return;
    }

    hasDuplicate = true;
    const currentUpdatedAt = Date.parse(current.updatedAt);
    const nextUpdatedAt = Date.parse(item.updatedAt);
    const bothDatesValid = Number.isFinite(currentUpdatedAt) && Number.isFinite(nextUpdatedAt);
    if (!bothDatesValid || currentUpdatedAt <= nextUpdatedAt) {
      budgetByMonth.set(item.yearMonth, item);
    }
  });

  return hasDuplicate ? Array.from(budgetByMonth.values()) : items;
}

function getBudgetYearMonth(item: { month?: string }, fallbackMonth: string) {
  return typeof item.month === 'string' && item.month.length >= 7
    ? item.month.slice(0, 7)
    : fallbackMonth;
}

export function planVersion2Migration({
  storedVersion,
  variableCategoryBudgets,
  monthlyBudgets,
  currentMonth,
  nowIso,
}: {
  storedVersion: number;
  variableCategoryBudgets: VariableCategoryBudget[];
  monthlyBudgets: MonthlyBudget[];
  currentMonth: string;
  nowIso: string;
}): {
  monthlyBudgets: MonthlyBudget[];
  nextVersion: 2;
  changed: boolean;
} {
  if (storedVersion >= 2 || variableCategoryBudgets.length === 0 || monthlyBudgets.length > 0) {
    return { monthlyBudgets, nextVersion: 2, changed: false };
  }

  const budgetByMonth = new Map<string, number>();
  variableCategoryBudgets.forEach((budget) => {
    const yearMonth = getBudgetYearMonth(budget, currentMonth);
    budgetByMonth.set(yearMonth, (budgetByMonth.get(yearMonth) ?? 0) + budget.budgetAmount);
  });

  return {
    monthlyBudgets: Array.from(budgetByMonth, ([yearMonth, variableExpenseBudget]) => ({
      yearMonth,
      fixedExpenseBudget: 0,
      variableExpenseBudget,
      createdAt: nowIso,
      updatedAt: nowIso,
    })),
    nextVersion: 2,
    changed: true,
  };
}

export function calculateBudgetTotals({
  targetMonth,
  incomes,
  fixedCosts,
  variableCosts,
  monthlyBudgets,
  annualIncomes,
  annualCosts,
  savingGoal,
}: {
  targetMonth: string;
  incomes: Income[];
  fixedCosts: FixedCost[];
  variableCosts: VariableCost[];
  monthlyBudgets: MonthlyBudget[];
  annualIncomes: AnnualIncome[];
  annualCosts: AnnualCost[];
  savingGoal: SavingGoal;
}) {
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
  const selectedBudget = monthlyBudgets.find((item) => item.yearMonth === targetMonth);
  const fixedBudgetTotal = selectedBudget?.fixedExpenseBudget ?? 0;
  const variableBudgetTotal = selectedBudget?.variableExpenseBudget ?? 0;
  const variableRemainingTotal = variableBudgetTotal - variableCostTotal;
  const variableUsageRate =
    variableBudgetTotal > 0
      ? Math.round((variableCostTotal / variableBudgetTotal) * 100)
      : 0;
  const fixedRemainingTotal = fixedBudgetTotal - fixedCostTotal;
  const fixedUsageRate =
    fixedBudgetTotal > 0 ? Math.round((fixedCostTotal / fixedBudgetTotal) * 100) : 0;
  const estimatedAnnualIncomeTotal = annualIncomes.reduce(
    (sum, item) => sum + (Number.isFinite(item.amount) ? item.amount : 0),
    0,
  );
  const estimatedAnnualFixedCostTotal = annualCosts.reduce(
    (sum, item) => sum + (Number.isFinite(item.amount) ? item.amount : 0),
    0,
  );
  const estimatedMonthlyIncomeTotal = Math.floor(estimatedAnnualIncomeTotal / 12);
  const estimatedMonthlyFixedCostTotal = Math.floor(estimatedAnnualFixedCostTotal / 12);
  const estimatedMonthlyFreeBudget = Math.floor(
    (estimatedAnnualIncomeTotal - estimatedAnnualFixedCostTotal) / 12,
  );
  const actualRemainingBudget = incomeTotal - fixedCostTotal - variableCostTotal;
  const yearlyIncomeTotal = incomes
    .filter((item) => item.month.slice(0, 4) === targetYear)
    .reduce((sum, item) => sum + item.amount, 0);
  const yearlyFixedCostTotal = fixedCosts
    .filter((item) => item.month.slice(0, 4) === targetYear)
    .reduce((sum, item) => sum + item.amount, 0);
  const yearlyVariableCostTotal = variableCosts
    .filter((item) => item.month.slice(0, 4) === targetYear)
    .reduce((sum, item) => sum + item.amount, 0);
  const yearlyFixedBudgetTotal = monthlyBudgets
    .filter((item) => item.yearMonth.slice(0, 4) === targetYear)
    .reduce((sum, item) => sum + item.fixedExpenseBudget, 0);
  const yearlyBudgetTotal = monthlyBudgets
    .filter((item) => item.yearMonth.slice(0, 4) === targetYear)
    .reduce((sum, item) => sum + item.variableExpenseBudget, 0);
  const yearlyActualRemainingBudget =
    yearlyIncomeTotal - yearlyFixedCostTotal - yearlyVariableCostTotal;
  const yearlyFixedRemainingTotal = yearlyFixedBudgetTotal - yearlyFixedCostTotal;
  const yearlyFixedUsageRate =
    yearlyFixedBudgetTotal > 0
      ? Math.max(0, Math.round((yearlyFixedCostTotal / yearlyFixedBudgetTotal) * 100))
      : 0;
  const yearlyVariableRemainingTotal = yearlyBudgetTotal - yearlyVariableCostTotal;
  const yearlyVariableUsageRate =
    yearlyBudgetTotal > 0
      ? Math.max(0, Math.round((yearlyVariableCostTotal / yearlyBudgetTotal) * 100))
      : 0;

  return {
    incomeTotal,
    fixedCostTotal,
    variableCostTotal,
    fixedBudgetTotal,
    fixedRemainingTotal,
    fixedUsageRate,
    variableBudgetTotal,
    variableRemainingTotal,
    variableUsageRate,
    estimatedAnnualIncomeTotal,
    estimatedAnnualFixedCostTotal,
    estimatedMonthlyIncomeTotal,
    estimatedMonthlyFixedCostTotal,
    estimatedMonthlyFreeBudget,
    estimatedYearlyFreeBudget: estimatedAnnualIncomeTotal - estimatedAnnualFixedCostTotal,
    actualRemainingBudget,
    freeBudgetAfterSaving: actualRemainingBudget - savingGoal.amount,
    yearlyIncomeTotal,
    yearlyFixedCostTotal,
    yearlyVariableCostTotal,
    yearlyFixedBudgetTotal,
    yearlyFixedRemainingTotal,
    yearlyFixedUsageRate,
    yearlyBudgetTotal,
    yearlyVariableRemainingTotal,
    yearlyVariableUsageRate,
    yearlyActualRemainingBudget,
    yearlyFreeBudgetAfterSaving: yearlyActualRemainingBudget - savingGoal.amount * 12,
  };
}

export function calculateCategoryComparisons({
  targetMonth,
  categories,
  variableCategoryBudgets,
  variableCosts,
}: {
  targetMonth: string;
  categories: Category[];
  variableCategoryBudgets: VariableCategoryBudget[];
  variableCosts: VariableCost[];
}): CategoryComparison[] {
  const categoryIds = new Set(categories.map((category) => category.id));
  const actualByCategory = new Map<string, number>();

  variableCosts
    .filter((item) => item.month.slice(0, 7) === targetMonth)
    .forEach((item) => {
      const categoryId = item.categoryId && categoryIds.has(item.categoryId) ? item.categoryId : '';
      actualByCategory.set(categoryId, (actualByCategory.get(categoryId) ?? 0) + item.amount);
    });

  const comparisons: CategoryComparison[] = variableCategoryBudgets.map((budget) => {
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
      categoryId: '',
      name: '未分類',
      budgetAmount: 0,
      actualAmount: uncategorizedActual,
      remainingAmount: -uncategorizedActual,
      usageRate: 0,
    });
  }

  return comparisons;
}

export function calculateVariableCostBreakdown({
  mode,
  targetMonth,
  selectedGroupId,
  variableCosts,
  categoryGroups,
  categories,
}: {
  mode: 'monthly' | 'yearly';
  targetMonth: string;
  selectedGroupId: string | null;
  variableCosts: VariableCost[];
  categoryGroups: CategoryGroup[];
  categories: Category[];
}): VariableCostBreakdown {
  const isYearly = mode === 'yearly';
  const targetYear = targetMonth.slice(0, 4);
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const groupIds = new Set(categoryGroups.map((group) => group.id));
  const targetCosts = variableCosts.filter((item) =>
    isYearly ? item.month.slice(0, 4) === targetYear : item.month.slice(0, 7) === targetMonth,
  );
  const groupTotals = new Map<string, number>();
  const categoryTotals = new Map<string, number>();

  targetCosts.forEach((cost) => {
    const category = cost.categoryId ? categoryById.get(cost.categoryId) : undefined;
    const groupId = cost.categoryGroupId || category?.groupId || '';
    groupTotals.set(groupId, (groupTotals.get(groupId) ?? 0) + cost.amount);
    if (selectedGroupId !== null && groupId === selectedGroupId) {
      const categoryId = category && category.groupId === selectedGroupId ? category.id : '';
      categoryTotals.set(categoryId, (categoryTotals.get(categoryId) ?? 0) + cost.amount);
    }
  });

  const total = Array.from(groupTotals.values()).reduce((sum, amount) => sum + amount, 0);
  const selectedGroupTotal = selectedGroupId ? groupTotals.get(selectedGroupId) ?? 0 : total;
  const sourceEntries = selectedGroupId
    ? Array.from(categoryTotals.entries())
    : Array.from(groupTotals.entries());
  const entries = sourceEntries
    .map(([sourceId, amount], order) => ({
      sourceId,
      amount,
      rate: (selectedGroupId ? selectedGroupTotal : total) > 0
        ? Math.round((amount / (selectedGroupId ? selectedGroupTotal : total)) * 1000) / 10
        : 0,
      order,
      kind: sourceId
        ? selectedGroupId
          ? 'category' as const
          : groupIds.has(sourceId)
            ? 'group' as const
            : 'deleted-group' as const
        : 'uncategorized' as const,
    }))
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  return {
    total,
    selectedGroupTotal,
    selectedGroupState: selectedGroupId
      ? groupIds.has(selectedGroupId) ? 'existing' : 'deleted'
      : 'none',
    entries,
  };
}
