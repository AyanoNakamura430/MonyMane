import { describe, expect, it } from 'vitest';
import { parseBackupFile, parseBackupJson, type BackupFile } from './backup';

const epoch = new Date(0).toISOString();
const now = new Date('2026-07-20T12:34:56.000Z');

function version2Backup(): BackupFile {
  return {
    app: 'budget-app',
    version: 2,
    exportedAt: '2026-07-01T00:00:00.000Z',
    data: {
      incomes: [], fixedCosts: [], variableCosts: [], categoryGroups: [], categories: [],
      variableCategoryBudgets: [], monthlyBudgets: [], annualIncomes: [], annualCosts: [],
      savingGoal: { amount: 0, updatedAt: epoch },
    },
  };
}

describe('parseBackupFile', () => {
  it('backup version 2を現在の形式で復元する', () => {
    const input = version2Backup();
    const result = parseBackupFile(input, now);
    expect(result).toEqual(input);
    expect(result?.version).toBe(2);
  });

  it('backup version 1の旧カテゴリを2階層へ移行する', () => {
    const input = version2Backup();
    input.version = 1;
    const legacyData: Partial<BackupFile['data']> & { variableCategories?: unknown[] } = input.data;
    delete legacyData.categories;
    delete legacyData.variableCategoryBudgets;
    legacyData.variableCategories = [{ id: 'food', name: 'Food', budgetAmount: 500, color: '#fff', createdAt: epoch, updatedAt: epoch }];
    const result = parseBackupFile(input, now);
    expect(result?.data.categoryGroups).toHaveLength(1);
    expect(result?.data.categories[0]).toMatchObject({ id: 'food', groupId: 'legacy-category-group', name: 'Food' });
    expect(result?.data.variableCategoryBudgets[0]).toMatchObject({ id: 'food-budget-0', categoryId: 'food', budgetAmount: 500 });
  });

  it('旧カテゴリの同名データには連番を付ける', () => {
    const input = version2Backup();
    input.version = 1;
    const legacyData: Partial<BackupFile['data']> & { variableCategories?: unknown[] } = input.data;
    delete legacyData.categories;
    delete legacyData.variableCategoryBudgets;
    legacyData.variableCategories = [{ id: '1', name: 'Food', budgetAmount: 100 }, { id: '2', name: 'Food', budgetAmount: 200 }];
    const result = parseBackupFile(input, now);
    expect(result?.data.categories.map((category) => category.name)).toEqual(['Food', 'Food (2)']);
  });

  it('version 1で月間予算がない場合はカテゴリ予算合計を現在月へ復元する', () => {
    const input = version2Backup();
    input.version = 1;
    const data: Partial<BackupFile['data']> = input.data;
    delete data.monthlyBudgets;
    data.variableCategoryBudgets = [
      { id: '1', categoryId: 'a', budgetAmount: 100, createdAt: epoch, updatedAt: epoch },
      { id: '2', categoryId: 'b', budgetAmount: 250, createdAt: epoch, updatedAt: epoch },
    ];
    expect(parseBackupFile(input, now)?.data.monthlyBudgets).toEqual([{ yearMonth: '2026-07', fixedExpenseBudget: 0, variableExpenseBudget: 350, createdAt: now.toISOString(), updatedAt: now.toISOString() }]);
  });

  it('月間予算の年月・負数・欠落日時を現行形式へ正規化する', () => {
    const input = version2Backup();
    input.data.monthlyBudgets = [{ yearMonth: '2026-01-31', fixedExpenseBudget: -10, variableExpenseBudget: -20 }] as typeof input.data.monthlyBudgets;
    expect(parseBackupFile(input, now)?.data.monthlyBudgets).toEqual([{ yearMonth: '2026-01', fixedExpenseBudget: 0, variableExpenseBudget: 0, createdAt: epoch, updatedAt: epoch }]);
  });

  it.each([
    ['別アプリ', { ...version2Backup(), app: 'other-app' }],
    ['未対応version', { ...version2Backup(), version: 3 }],
    ['exportedAt欠落', (() => { const value = version2Backup() as Partial<ReturnType<typeof version2Backup>>; delete value.exportedAt; return value; })()],
  ])('%sを拒否する', (_label, input) => {
    expect(parseBackupFile(input, now)).toBeNull();
  });

  it('必須配列が欠落したバックアップを拒否する', () => {
    const input = version2Backup();
    const data: Partial<BackupFile['data']> = input.data;
    delete data.incomes;
    expect(parseBackupFile(input, now)).toBeNull();
  });

  it('不正な貯蓄目標を拒否する', () => {
    const input = version2Backup();
    input.data.savingGoal = { amount: 0 } as typeof input.data.savingGoal;
    expect(parseBackupFile(input, now)).toBeNull();
  });

});

describe('parseBackupJson', () => {
  it('不正なJSONをinvalid-jsonとして拒否する', () => {
    expect(parseBackupJson('{', now)).toEqual({ ok: false, reason: 'invalid-json' });
  });

  it('JSONとして有効でもバックアップでなければinvalid-backupとして拒否する', () => {
    expect(parseBackupJson('{}', now)).toEqual({ ok: false, reason: 'invalid-backup' });
  });

  it('有効なJSONをbackup version 2として返す', () => {
    const result = parseBackupJson(JSON.stringify(version2Backup()), now);
    expect(result.ok && result.backup.version).toBe(2);
  });
});
