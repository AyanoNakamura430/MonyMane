import type {
  AnnualCost,
  AnnualIncome,
  FixedCost,
  Income,
  MonthlyBudget,
  SavingGoal,
  VariableCategoryBudget,
  VariableCost,
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

