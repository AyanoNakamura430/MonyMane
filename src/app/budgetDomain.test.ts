import { describe, expect, it } from 'vitest';
import type {
  AnnualCost,
  AnnualIncome,
  Category,
  CategoryGroup,
  FixedCost,
  Income,
  MonthlyBudget,
  VariableCategoryBudget,
  VariableCost,
} from './types';
import {
  calculateBudgetTotals,
  calculateCategoryComparisons,
  calculateVariableCostBreakdown,
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

describe('calculateVariableCostBreakdown', () => {
  const groups: CategoryGroup[] = [
    { id: 'food', name: 'Food', createdAt: epoch, updatedAt: epoch },
    { id: 'life', name: 'Life', createdAt: epoch, updatedAt: epoch },
  ];
  const categories: Category[] = [
    { id: 'groceries', groupId: 'food', name: 'Groceries', createdAt: epoch, updatedAt: epoch },
    { id: 'dining', groupId: 'food', name: 'Dining', createdAt: epoch, updatedAt: epoch },
    { id: 'daily', groupId: 'life', name: 'Daily', createdAt: epoch, updatedAt: epoch },
  ];
  const cost = (
    id: string,
    amount: number,
    month: string,
    categoryGroupId?: string,
    categoryId?: string,
  ): VariableCost => ({ id, name: id, amount, month, categoryGroupId, categoryId, createdAt: epoch, updatedAt: epoch });
  const breakdown = (
    variableCosts: VariableCost[],
    overrides: Partial<Parameters<typeof calculateVariableCostBreakdown>[0]> = {},
  ) => calculateVariableCostBreakdown({
    mode: 'monthly', targetMonth: '2026-01', selectedGroupId: null,
    variableCosts, categoryGroups: groups, categories, ...overrides,
  });

  it('月次モードでは対象月だけを集計する', () => {
    const result = breakdown([cost('jan', 100, '2026-01-31', 'food'), cost('feb', 900, '2026-02-01', 'food')]);
    expect(result.total).toBe(100);
    expect(result.entries.map(({ sourceId, amount }) => ({ sourceId, amount }))).toEqual([{ sourceId: 'food', amount: 100 }]);
  });

  it('年次モードでは対象年だけを集計する', () => {
    const result = breakdown(
      [cost('jan', 100, '2026-01-01', 'food'), cost('dec', 200, '2026-12-31', 'food'), cost('next', 900, '2027-01-01', 'food')],
      { mode: 'yearly' },
    );
    expect(result.total).toBe(300);
  });

  it('同一グループの複数カテゴリを合算する', () => {
    const result = breakdown([cost('a', 100, '2026-01-01', undefined, 'groceries'), cost('b', 250, '2026-01-02', undefined, 'dining')]);
    expect(result.entries[0]).toMatchObject({ sourceId: 'food', amount: 350, kind: 'group' });
  });

  it('非空categoryGroupIdをカテゴリの親グループより優先する', () => {
    const result = breakdown([cost('a', 100, '2026-01-01', 'life', 'groceries')]);
    expect(result.entries[0]).toMatchObject({ sourceId: 'life', amount: 100 });
  });

  it('categoryGroupId欠落時はcategoryIdから親を補完する', () => {
    expect(breakdown([cost('a', 100, '2026-01-01', undefined, 'groceries')]).entries[0]?.sourceId).toBe('food');
  });

  it('categoryGroupIdが空文字でもcategoryIdから親を補完する', () => {
    expect(breakdown([cost('a', 100, '2026-01-01', '', 'daily')]).entries[0]?.sourceId).toBe('life');
  });

  it('グループIDも有効カテゴリIDもない実績を未分類へ集計する', () => {
    const result = breakdown([cost('empty', 100, '2026-01-01'), cost('deleted', 200, '2026-01-02', undefined, 'missing')]);
    expect(result.entries[0]).toMatchObject({ sourceId: '', amount: 300, kind: 'uncategorized' });
  });

  it('存在しない非空categoryGroupIdを削除済みグループ相当として維持する', () => {
    const result = breakdown([cost('a', 100, '2026-01-01', 'deleted-group')]);
    expect(result.entries[0]).toMatchObject({ sourceId: 'deleted-group', kind: 'deleted-group' });
  });

  it('選択グループ内の複数カテゴリを別々に集計する', () => {
    const result = breakdown(
      [cost('a', 100, '2026-01-01', 'food', 'groceries'), cost('b', 200, '2026-01-02', 'food', 'dining')],
      { selectedGroupId: 'food' },
    );
    expect(result.selectedGroupState).toBe('existing');
    expect(result.entries.map(({ sourceId, amount, kind }) => ({ sourceId, amount, kind }))).toEqual([
      { sourceId: 'dining', amount: 200, kind: 'category' },
      { sourceId: 'groceries', amount: 100, kind: 'category' },
    ]);
  });

  it('選択グループ外・空・欠落・存在しないカテゴリを選択グループ内の未分類へ集計する', () => {
    const result = breakdown([
      cost('outside', 100, '2026-01-01', 'food', 'daily'),
      cost('empty', 200, '2026-01-02', 'food', ''),
      cost('missing', 300, '2026-01-03', 'food'),
      cost('deleted', 400, '2026-01-04', 'food', 'missing'),
    ], { selectedGroupId: 'food' });
    expect(result.entries).toHaveLength(1);
    expect(result.entries[0]).toMatchObject({ sourceId: '', amount: 1000, kind: 'uncategorized' });
  });

  it('金額降順で、同額時は対象実績の初出順を維持する', () => {
    const result = breakdown([
      cost('life-first', 100, '2026-01-01', 'life'),
      cost('food-second', 100, '2026-01-02', 'food'),
      cost('deleted-largest', 300, '2026-01-03', 'deleted'),
    ]);
    expect(result.entries.map((entry) => entry.sourceId)).toEqual(['deleted', 'life', 'food']);
    expect(result.entries.map((entry) => entry.order)).toEqual([2, 0, 1]);
  });

  it('割合を小数第1位相当に丸める', () => {
    const result = breakdown([cost('a', 1, '2026-01-01', 'food'), cost('b', 2, '2026-01-02', 'life')]);
    expect(result.entries.map((entry) => entry.rate)).toEqual([66.7, 33.3]);
  });

  it('入力配列と入力オブジェクトを変更しない', () => {
    const variableCosts = [cost('a', 100, '2026-01-01', 'food', 'groceries')];
    const inputs = { variableCosts, categoryGroups: groups, categories };
    const snapshot = structuredClone(inputs);
    breakdown(variableCosts);
    expect(inputs).toEqual(snapshot);
  });
});

describe('calculateCategoryComparisons', () => {
  const categories: Category[] = [
    { id: 'food', groupId: 'living', name: 'Food', createdAt: epoch, updatedAt: epoch },
    { id: 'travel', groupId: 'leisure', name: 'Travel', createdAt: epoch, updatedAt: epoch },
  ];
  const cost = (id: string, amount: number, month: string, categoryId?: string, categoryGroupId?: string): VariableCost =>
    ({ id, name: id, amount, month, categoryId, categoryGroupId, createdAt: epoch, updatedAt: epoch });
  const budget = (id: string, categoryId: string, budgetAmount: number): VariableCategoryBudget =>
    ({ id, categoryId, budgetAmount, createdAt: epoch, updatedAt: epoch });
  const compare = (
    variableCategoryBudgets: VariableCategoryBudget[],
    variableCosts: VariableCost[],
  ) => calculateCategoryComparisons({ targetMonth: '2026-01', categories, variableCategoryBudgets, variableCosts });

  it('対象月の有効カテゴリ実績と予算を比較し対象月外を除外する', () => {
    const result = compare([budget('b', 'food', 500)], [cost('jan', 200, '2026-01-31', 'food'), cost('feb', 900, '2026-02-01', 'food')]);
    expect(result[0]).toMatchObject({ categoryId: 'food', name: 'Food', budgetAmount: 500, actualAmount: 200 });
  });

  it('残額と整数へ丸めた使用率を算出する', () => {
    const result = compare([budget('b', 'food', 300)], [cost('a', 100, '2026-01-01', 'food')]);
    expect(result[0]).toMatchObject({ remainingAmount: 200, usageRate: 33 });
  });

  it('予算0円時は使用率0にする', () => {
    expect(compare([budget('b', 'food', 0)], [cost('a', 100, '2026-01-01', 'food')])[0]?.usageRate).toBe(0);
  });

  it('予算超過時は負の残額と100%超の使用率を返す', () => {
    const result = compare([budget('b', 'food', 100)], [cost('a', 150, '2026-01-01', 'food')]);
    expect(result[0]).toMatchObject({ remainingAmount: -50, usageRate: 150 });
  });

  it('空・欠落・存在しないカテゴリIDを未分類へ集約し、正数なら末尾へ未分類行を追加する', () => {
    const result = compare([], [
      cost('empty', 100, '2026-01-01', ''),
      cost('missing', 200, '2026-01-02'),
      cost('deleted', 300, '2026-01-03', 'deleted'),
    ]);
    expect(result).toEqual([{ id: '', categoryId: '', name: '未分類', budgetAmount: 0, actualAmount: 600, remainingAmount: -600, usageRate: 0 }]);
  });

  it('未分類実績合計が0以下なら未分類行を追加しない', () => {
    expect(compare([], [cost('zero', 0, '2026-01-01'), cost('negative', -1, '2026-01-02')])).toEqual([]);
  });

  it('予算比較の入力順を維持する', () => {
    const result = compare([budget('travel-budget', 'travel', 200), budget('food-budget', 'food', 100)], []);
    expect(result.map((item) => item.id)).toEqual(['travel-budget', 'food-budget']);
  });

  it('categoryGroupIdに関係なく有効なcategoryIdへ実績を集計する', () => {
    const result = compare([budget('b', 'food', 500)], [cost('a', 200, '2026-01-01', 'food', 'different-group')]);
    expect(result[0]?.actualAmount).toBe(200);
  });

  it('入力配列と入力オブジェクトを変更しない', () => {
    const variableCategoryBudgets = [budget('b', 'food', 500)];
    const variableCosts = [cost('a', 200, '2026-01-01', 'food')];
    const inputs = { categories, variableCategoryBudgets, variableCosts };
    const snapshot = structuredClone(inputs);
    compare(variableCategoryBudgets, variableCosts);
    expect(inputs).toEqual(snapshot);
  });
});
