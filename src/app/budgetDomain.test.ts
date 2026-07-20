import { describe, expect, it } from 'vitest';
import type {
  AnnualCost,
  AnnualIncome,
  FixedCost,
  Income,
  MonthlyBudget,
  VariableCategoryBudget,
  VariableCost,
} from './types';
import {
  calculateBudgetTotals,
  normalizeMonthlyBudgets,
  planVersion2Migration,
} from './budgetDomain';

const epoch = new Date(0).toISOString();

function monthlyBudget(yearMonth: string, updatedAt: string, variableExpenseBudget = 100): MonthlyBudget {
  return { yearMonth, fixedExpenseBudget: 50, variableExpenseBudget, createdAt: epoch, updatedAt };
}

function variableBudget(id: string, budgetAmount: number, month?: string): VariableCategoryBudget {
  return { id, categoryId: `category-${id}`, month, budgetAmount, createdAt: epoch, updatedAt: epoch };
}

describe('normalizeMonthlyBudgets', () => {
  it('重複がなければ同じ配列を返す', () => {
    const input = [monthlyBudget('2026-01', '2026-01-01T00:00:00.000Z')];
    expect(normalizeMonthlyBudgets(input)).toBe(input);
  });

  it('同一年月ではupdatedAtが新しい予算を残す', () => {
    const oldBudget = monthlyBudget('2026-01', '2026-01-01T00:00:00.000Z', 100);
    const newBudget = monthlyBudget('2026-01', '2026-01-02T00:00:00.000Z', 200);
    expect(normalizeMonthlyBudgets([oldBudget, newBudget])).toEqual([newBudget]);
  });

  it('updatedAtが同じ場合は後の予算を残す', () => {
    const first = monthlyBudget('2026-01', epoch, 100);
    const second = monthlyBudget('2026-01', epoch, 200);
    expect(normalizeMonthlyBudgets([first, second])).toEqual([second]);
  });

  it('複数月の並び順を維持して重複だけを置換する', () => {
    const january = monthlyBudget('2026-01', epoch, 100);
    const february = monthlyBudget('2026-02', epoch, 200);
    const januaryNew = monthlyBudget('2026-01', '2026-01-02T00:00:00.000Z', 300);
    expect(normalizeMonthlyBudgets([january, february, januaryNew])).toEqual([januaryNew, february]);
  });

  it('入力オブジェクトを変更しない', () => {
    const input = [monthlyBudget('2026-01', epoch, 100), monthlyBudget('2026-01', epoch, 200)];
    const snapshot = structuredClone(input);
    normalizeMonthlyBudgets(input);
    expect(input).toEqual(snapshot);
  });
});

describe('planVersion2Migration', () => {
  const nowIso = '2026-07-20T00:00:00.000Z';

  it('version 1のカテゴリ予算を月別のversion 2予算へ集約する', () => {
    const result = planVersion2Migration({
      storedVersion: 1,
      variableCategoryBudgets: [
        variableBudget('1', 100, '2026-01-10'),
        variableBudget('2', 250, '2026-01'),
        variableBudget('3', 400, '2026-02-01'),
      ],
      monthlyBudgets: [],
      currentMonth: '2026-07',
      nowIso,
    });
    expect(result).toEqual({
      changed: true,
      nextVersion: 2,
      monthlyBudgets: [
        { yearMonth: '2026-01', fixedExpenseBudget: 0, variableExpenseBudget: 350, createdAt: nowIso, updatedAt: nowIso },
        { yearMonth: '2026-02', fixedExpenseBudget: 0, variableExpenseBudget: 400, createdAt: nowIso, updatedAt: nowIso },
      ],
    });
  });

  it('monthがないカテゴリ予算は現在月へ集約する', () => {
    const result = planVersion2Migration({
      storedVersion: 1,
      variableCategoryBudgets: [variableBudget('1', 300)],
      monthlyBudgets: [],
      currentMonth: '2026-07',
      nowIso,
    });
    expect(result.monthlyBudgets[0]?.yearMonth).toBe('2026-07');
  });

  it('version 2は既存予算を変更しない', () => {
    const monthlyBudgets = [monthlyBudget('2026-01', epoch)];
    const result = planVersion2Migration({ storedVersion: 2, variableCategoryBudgets: [variableBudget('1', 300)], monthlyBudgets, currentMonth: '2026-07', nowIso });
    expect(result).toEqual({ monthlyBudgets, nextVersion: 2, changed: false });
    expect(result.monthlyBudgets).toBe(monthlyBudgets);
  });

  it('既存の月間予算がある場合は移行しない', () => {
    const monthlyBudgets = [monthlyBudget('2026-01', epoch)];
    const result = planVersion2Migration({ storedVersion: 1, variableCategoryBudgets: [variableBudget('1', 300)], monthlyBudgets, currentMonth: '2026-07', nowIso });
    expect(result.changed).toBe(false);
  });

  it('カテゴリ予算が空なら空のままversion 2を計画する', () => {
    const result = planVersion2Migration({ storedVersion: 1, variableCategoryBudgets: [], monthlyBudgets: [], currentMonth: '2026-07', nowIso });
    expect(result).toEqual({ monthlyBudgets: [], nextVersion: 2, changed: false });
  });
});

describe('calculateBudgetTotals', () => {
  function transaction<T extends Income | FixedCost | VariableCost>(id: string, amount: number, month: string): T {
    return { id, name: id, amount, month, createdAt: epoch, updatedAt: epoch } as T;
  }
  function annual<T extends AnnualIncome | AnnualCost>(id: string, amount: number): T {
    return { id, name: id, amount, createdAt: epoch, updatedAt: epoch } as T;
  }
  const totals = (overrides: Partial<Parameters<typeof calculateBudgetTotals>[0]> = {}) => calculateBudgetTotals({
    targetMonth: '2026-01', incomes: [], fixedCosts: [], variableCosts: [], monthlyBudgets: [],
    annualIncomes: [], annualCosts: [], savingGoal: { amount: 0, updatedAt: epoch }, ...overrides,
  });

  it('対象月だけの収入・固定費・変動費を別々に集計する', () => {
    const result = totals({
      incomes: [transaction<Income>('i1', 1000, '2026-01-01'), transaction<Income>('i2', 9000, '2026-02-01')],
      fixedCosts: [transaction<FixedCost>('f1', 200, '2026-01-15'), transaction<FixedCost>('f2', 900, '2025-01-01')],
      variableCosts: [transaction<VariableCost>('v1', 300, '2026-01-31'), transaction<VariableCost>('v2', 800, '2026-02-01')],
    });
    expect([result.incomeTotal, result.fixedCostTotal, result.variableCostTotal]).toEqual([1000, 200, 300]);
  });

  it('対象年だけの実績を費目別に集計する', () => {
    const result = totals({
      incomes: [transaction<Income>('i1', 1000, '2026-01-01'), transaction<Income>('i2', 2000, '2026-12-31'), transaction<Income>('i3', 9000, '2027-01-01')],
      fixedCosts: [transaction<FixedCost>('f1', 200, '2026-02-01')],
      variableCosts: [transaction<VariableCost>('v1', 300, '2026-11-01')],
    });
    expect([result.yearlyIncomeTotal, result.yearlyFixedCostTotal, result.yearlyVariableCostTotal]).toEqual([3000, 200, 300]);
  });

  it('月間予算・残額・使用率を計算する', () => {
    const result = totals({
      fixedCosts: [transaction<FixedCost>('f1', 250, '2026-01-01')],
      variableCosts: [transaction<VariableCost>('v1', 333, '2026-01-01')],
      monthlyBudgets: [{ ...monthlyBudget('2026-01', epoch, 1000), fixedExpenseBudget: 500 }],
    });
    expect([result.fixedRemainingTotal, result.fixedUsageRate, result.variableRemainingTotal, result.variableUsageRate]).toEqual([250, 50, 667, 33]);
  });

  it('年間の月間予算を合計して残額と使用率を計算する', () => {
    const result = totals({
      fixedCosts: [transaction<FixedCost>('f1', 600, '2026-12-01')],
      variableCosts: [transaction<VariableCost>('v1', 750, '2026-03-01')],
      monthlyBudgets: [{ ...monthlyBudget('2026-01', epoch, 1000), fixedExpenseBudget: 500 }, { ...monthlyBudget('2026-12', epoch, 500), fixedExpenseBudget: 500 }],
    });
    expect([result.yearlyFixedBudgetTotal, result.yearlyFixedRemainingTotal, result.yearlyFixedUsageRate]).toEqual([1000, 400, 60]);
    expect([result.yearlyBudgetTotal, result.yearlyVariableRemainingTotal, result.yearlyVariableUsageRate]).toEqual([1500, 750, 50]);
  });

  it('年間見込みを12で切り捨てて月額へ換算する', () => {
    const result = totals({ annualIncomes: [annual<AnnualIncome>('ai', 1001)], annualCosts: [annual<AnnualCost>('ac', 202)] });
    expect([result.estimatedMonthlyIncomeTotal, result.estimatedMonthlyFixedCostTotal, result.estimatedMonthlyFreeBudget]).toEqual([83, 16, 66]);
  });

  it('実績残額と貯蓄目標差引後を計算する', () => {
    const result = totals({ incomes: [transaction<Income>('i', 1000, '2026-01-01')], fixedCosts: [transaction<FixedCost>('f', 200, '2026-01-01')], variableCosts: [transaction<VariableCost>('v', 300, '2026-01-01')], savingGoal: { amount: 100, updatedAt: epoch } });
    expect([result.actualRemainingBudget, result.freeBudgetAfterSaving, result.yearlyFreeBudgetAfterSaving]).toEqual([500, 400, -700]);
  });

  it('データが0件なら各基本集計は0になる', () => {
    const result = totals();
    expect([result.incomeTotal, result.fixedCostTotal, result.variableCostTotal, result.yearlyIncomeTotal, result.yearlyFixedCostTotal, result.yearlyVariableCostTotal]).toEqual([0, 0, 0, 0, 0, 0]);
  });
});
