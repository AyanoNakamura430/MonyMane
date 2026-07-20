export type Income = {
  id: string;
  name: string;
  amount: number;
  memo?: string;
  month: string;
  createdAt: string;
  updatedAt: string;
};

export type FixedCost = {
  id: string;
  name: string;
  amount: number;
  memo?: string;
  month: string;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  groupId: string;
  name: string;
  color?: string;
  icon?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
};

export type CategoryGroup = {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
};

export type VariableCategoryBudget = {
  id: string;
  categoryId: string;
  month?: string;
  budgetAmount: number;
  memo?: string;
  createdAt: string;
  updatedAt: string;
};

export type LegacyVariableCategory = Category & {
  budgetAmount: number;
};

export type VariableCost = {
  id: string;
  categoryGroupId?: string;
  categoryId?: string;
  name: string;
  amount: number;
  memo?: string;
  month: string;
  createdAt: string;
  updatedAt: string;
};

export type MonthlyBudget = {
  yearMonth: string;
  fixedExpenseBudget: number;
  variableExpenseBudget: number;
  createdAt: string;
  updatedAt: string;
};

export type AnnualIncome = {
  id: string;
  name: string;
  amount: number;
  memo?: string;
  createdAt: string;
  updatedAt: string;
};

export type AnnualCost = {
  id: string;
  name: string;
  amount: number;
  memo?: string;
  createdAt: string;
  updatedAt: string;
};

export type SavingGoal = {
  amount: number;
  updatedAt: string;
};

export type CategoryComparison = {
  id: string;
  categoryId: string;
  name: string;
  budgetAmount: number;
  actualAmount: number;
  remainingAmount: number;
  usageRate: number;
};

export type BreakdownEntry = {
  sourceId: string;
  amount: number;
  rate: number;
  order: number;
  kind: 'group' | 'category' | 'uncategorized' | 'deleted-group';
};

export type VariableCostBreakdown = {
  total: number;
  selectedGroupTotal: number;
  selectedGroupState: 'none' | 'existing' | 'deleted';
  entries: BreakdownEntry[];
};

export type BudgetSection =
  | 'income'
  | 'fixed'
  | 'variableCost'
  | 'categoryGroup'
  | 'category'
  | 'monthlyBudget'
  | 'annualIncome'
  | 'annual'
  | 'saving';
