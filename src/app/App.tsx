import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from 'react';
import {
  AlertTriangle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit3,
  Home,
  Landmark,
  Plus,
  RefreshCw,
  Save,
  Settings,
  Table2,
  Trash2,
  Upload,
  WalletCards,
  X,
} from 'lucide-react';
import type {
  AnnualCost,
  AnnualIncome,
  BudgetSection,
  Category,
  FixedCost,
  Income,
  SavingGoal,
  VariableCategoryBudget,
  VariableCost,
} from './types';
import { createId, STORAGE_KEYS, type BudgetData, useBudgetData } from './useBudgetData';

type Screen = 'dashboard' | 'manage' | 'settings';
type DashboardMode = 'monthly' | 'yearly';
type BackupData = {
  incomes: Income[];
  fixedCosts: FixedCost[];
  variableCosts: VariableCost[];
  categories: Category[];
  variableCategoryBudgets: VariableCategoryBudget[];
  annualIncomes: AnnualIncome[];
  annualCosts: AnnualCost[];
  savingGoal: SavingGoal;
};
type BackupFile = {
  app: 'budget-app';
  version: 1;
  exportedAt: string;
  data: BackupData;
};
type Message = {
  type: 'success' | 'error';
  text: string;
};
type CategoryProgressItem = {
  id: string;
  name: string;
  budgetAmount: number;
  actualAmount: number;
  remainingAmount: number;
  usageRate: number;
};
type EditableItem =
  | Income
  | FixedCost
  | VariableCost
  | Category
  | VariableCategoryBudget
  | AnnualIncome
  | AnnualCost;

const SECTION_LABELS: Record<BudgetSection, string> = {
  income: '収入',
  fixed: '固定費',
  variableCost: '変動費実績',
  category: 'カテゴリ',
  variable: '変動費カテゴリ予算',
  annualIncome: '年間収入',
  annual: '年間固定費',
  saving: '貯金目標',
};

const currencyFormatter = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY',
  maximumFractionDigits: 0,
});

const inputClass =
  'w-full rounded-[5px] border border-[#717182]/45 bg-white px-4 py-3 text-base font-normal text-[#0a0a0a] outline-none transition-shadow placeholder:text-[#a8a8a8] focus:border-[#2c2c2c] focus:ring-2 focus:ring-[#2c2c2c]/10';

const BACKUP_APP_ID = 'budget-app';
const BACKUP_VERSION = 1;
const BACKUP_DATA_KEYS: (keyof BackupData)[] = [
  'incomes',
  'fixedCosts',
  'variableCosts',
  'categories',
  'variableCategoryBudgets',
  'annualIncomes',
  'annualCosts',
  'savingGoal',
];
const STORAGE_KEY_NAMES = Object.keys(STORAGE_KEYS) as (keyof typeof STORAGE_KEYS)[];
const EMPTY_BACKUP_DATA: BackupData = {
  incomes: [],
  fixedCosts: [],
  variableCosts: [],
  categories: [],
  variableCategoryBudgets: [],
  annualIncomes: [],
  annualCosts: [],
  savingGoal: { amount: 0, updatedAt: new Date(0).toISOString() },
};

function formatCurrency(amount: number) {
  return currencyFormatter.format(amount);
}

function formatBackupTimestamp(date: Date) {
  const parts = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
    '-',
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0'),
    String(date.getSeconds()).padStart(2, '0'),
  ];
  return parts.join('');
}

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
  categories: Category[];
  variableCategoryBudgets: VariableCategoryBudget[];
} | null {
  if (!Array.isArray(value)) return null;

  return value.reduce<{
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
      const createdAt = typeof item.createdAt === 'string' ? item.createdAt : new Date(0).toISOString();
      const updatedAt = typeof item.updatedAt === 'string' ? item.updatedAt : createdAt;

      result.categories.push({
        id: item.id,
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
}

function parseBackupFile(value: unknown): BackupFile | null {
  if (!isRecord(value) || value.app !== BACKUP_APP_ID || value.version !== BACKUP_VERSION) {
    return null;
  }
  if (typeof value.exportedAt !== 'string' || !isRecord(value.data)) {
    return null;
  }

  const backupData = value.data;
  const arraysValid = BACKUP_DATA_KEYS.every((key) =>
    key === 'savingGoal' ? true : Array.isArray(backupData[key]),
  );
  const migratedLegacyCategories = arraysValid
    ? null
    : migrateLegacyBackupCategories(backupData.variableCategories);
  if ((!arraysValid && !migratedLegacyCategories) || !isSavingGoal(backupData.savingGoal)) {
    return null;
  }

  const categories = arraysValid
    ? backupData.categories as Category[]
    : migratedLegacyCategories?.categories ?? [];
  const variableCategoryBudgets = arraysValid
    ? backupData.variableCategoryBudgets as VariableCategoryBudget[]
    : migratedLegacyCategories?.variableCategoryBudgets ?? [];

  return {
    app: BACKUP_APP_ID,
    version: BACKUP_VERSION,
    exportedAt: value.exportedAt,
    data: {
      incomes: backupData.incomes as Income[],
      fixedCosts: backupData.fixedCosts as FixedCost[],
      variableCosts: backupData.variableCosts as VariableCost[],
      categories,
      variableCategoryBudgets,
      annualIncomes: backupData.annualIncomes as AnnualIncome[],
      annualCosts: backupData.annualCosts as AnnualCost[],
      savingGoal: backupData.savingGoal,
    },
  };
}

function sanitizeAmountInput(value: string) {
  return value.replace(/[^\d]/g, '');
}

function formatAmountInput(value: string | number) {
  const digits = sanitizeAmountInput(String(value)).replace(/^0+(?=\d)/, '');
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function parseAmountInput(value: string) {
  return Number(sanitizeAmountInput(value));
}

function formatMonth(month: string) {
  return month.slice(0, 7).replace('-', '/');
}

function formatDate(date: string) {
  return date.replaceAll('-', '/');
}

function getInitialDate(targetMonth: string, currentMonth: string) {
  if (targetMonth !== currentMonth) return `${targetMonth}-01`;
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')}`;
}

function moveMonth(month: string, offset: number) {
  const [year, monthNumber] = month.split('-').map(Number);
  const next = new Date(year, monthNumber - 1 + offset, 1);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
}

function Header({
  targetMonth,
  onChangeMonth,
  dashboardMode,
  onToggleDashboardMode,
  screen,
  onNavigate,
}: {
  targetMonth: string;
  onChangeMonth: (month: string) => void;
  dashboardMode: DashboardMode;
  onToggleDashboardMode: () => void;
  screen: Screen;
  onNavigate: (screen: Screen) => void;
}) {
  const periodOffset = dashboardMode === 'yearly' ? 12 : 1;

  return (
    <header className="border-b border-[#1e1e1e]/60 pb-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden rounded-[5px] border border-[#1e1e1e]/70 px-3 py-1.5 font-['Khand',sans-serif] text-lg tracking-wide text-[#717182] sm:block">
            MODE
          </span>
          <span className="px-1 py-1.5 font-['Khand',sans-serif] text-lg tracking-wide text-[#717182]">
            {dashboardMode === 'yearly' ? 'YEARLY' : 'MONTHLY'}
          </span>
          <button
            type="button"
            onClick={onToggleDashboardMode}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-[5px] text-[#717182] transition-colors hover:bg-[#f2f2f2] hover:text-[#0a0a0a]"
            aria-label="MONTHLYとYEARLYを切り替え"
          >
            <RefreshCw className="size-6 stroke-[1.5]" />
          </button>
        </div>
        <nav className="flex items-center gap-2 sm:gap-5" aria-label="メインナビゲーション">
          <NavButton
            label="ホーム"
            active={screen === 'dashboard'}
            onClick={() => onNavigate('dashboard')}
          >
            <Home />
          </NavButton>
          <NavButton
            label="登録・編集"
            active={screen === 'manage'}
            onClick={() => onNavigate('manage')}
          >
            <Edit3 />
          </NavButton>
          <NavButton
            label="設定"
            active={screen === 'settings'}
            onClick={() => onNavigate('settings')}
          >
            <Settings />
          </NavButton>
        </nav>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChangeMonth(moveMonth(targetMonth, -periodOffset))}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-[5px] text-[#717182] hover:bg-[#f2f2f2]"
          aria-label="前月を表示"
        >
          <ChevronLeft className="size-5" />
        </button>
        <MonthPicker value={targetMonth} onChange={onChangeMonth} mode={dashboardMode} />
        <button
          type="button"
          onClick={() => onChangeMonth(moveMonth(targetMonth, periodOffset))}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-[5px] text-[#717182] hover:bg-[#f2f2f2]"
          aria-label="翌月を表示"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </header>
  );
}

function MonthPicker({
  value,
  onChange,
  mode,
}: {
  value: string;
  onChange: (value: string) => void;
  mode: DashboardMode;
}) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(Number(value.slice(0, 4)));
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedMonth = Number(value.slice(5, 7));

  useEffect(() => {
    setViewYear(Number(value.slice(0, 4)));
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, [open]);

  const selectMonth = (monthNumber: number) => {
    onChange(`${viewYear}-${String(monthNumber).padStart(2, '0')}`);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="min-w-[132px] rounded-[5px] px-2 py-1 text-center font-['Khand',sans-serif] text-[36px] font-light leading-none text-[#717182] transition-colors hover:bg-[#f2f2f2] sm:text-[48px]"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="対象年月を選択"
      >
        {mode === 'yearly' ? value.slice(0, 4) : formatMonth(value)}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="対象年月を選択"
          className="absolute left-1/2 top-full z-50 mt-2 w-[min(300px,calc(100vw-3rem))] -translate-x-1/2 rounded-[9px] border border-[#d1d5dc] bg-white px-4 pb-5 pt-4 shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
        >
          <div className="flex items-center justify-between">
            <strong className="text-sm font-medium text-[#0a0a0a]">{viewYear}年</strong>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setViewYear((current) => current - 1)}
                className="flex size-10 items-center justify-center rounded-[5px] text-[#0a0a0a] hover:bg-[#f2f2f2]"
                aria-label="前年を表示"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => setViewYear((current) => current + 1)}
                className="flex size-10 items-center justify-center rounded-[5px] text-[#0a0a0a] hover:bg-[#f2f2f2]"
                aria-label="翌年を表示"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 font-['Khand',sans-serif] text-lg">
            {Array.from({ length: 12 }, (_, index) => index + 1).map((monthNumber) => {
              const selected =
                viewYear === Number(value.slice(0, 4)) && monthNumber === selectedMonth;
              return (
                <button
                  type="button"
                  key={monthNumber}
                  onClick={() => selectMonth(monthNumber)}
                  className={`min-h-11 rounded-[6px] transition-colors ${
                    selected
                      ? 'bg-[#2c2c2c] font-medium text-white'
                      : 'text-[#0a0a0a] hover:bg-[#f2f2f2]'
                  }`}
                  aria-label={`${viewYear}年${monthNumber}月`}
                >
                  {monthNumber}月
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function NavButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-11 min-w-11 items-center justify-center rounded-[10px] transition-colors ${
        active ? 'bg-[#f2f2f2] text-[#1e1e1e]' : 'text-[#717182] hover:bg-[#f7f7f7]'
      }`}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
    >
      <span className="[&>svg]:size-6">{children}</span>
    </button>
  );
}

function Dashboard({
  data,
  mode,
  onOpenSection,
}: {
  data: BudgetData;
  mode: DashboardMode;
  onOpenSection: (section: BudgetSection) => void;
}) {
  const { totals } = data;
  const isYearly = mode === 'yearly';
  const dashboardTotals = {
    incomeTotal: isYearly ? totals.yearlyIncomeTotal : totals.incomeTotal,
    fixedCostTotal: isYearly ? totals.yearlyFixedCostTotal : totals.fixedCostTotal,
    variableCostTotal: isYearly ? totals.yearlyVariableCostTotal : totals.variableCostTotal,
    estimatedFreeBudget: isYearly
      ? totals.estimatedYearlyFreeBudget
      : totals.estimatedMonthlyFreeBudget,
    actualRemainingBudget: isYearly
      ? totals.yearlyActualRemainingBudget
      : totals.actualRemainingBudget,
    freeBudgetAfterSaving: isYearly
      ? totals.yearlyFreeBudgetAfterSaving
      : totals.freeBudgetAfterSaving,
    variableBudgetTotal: isYearly ? totals.yearlyBudgetTotal : totals.variableBudgetTotal,
    variableRemainingTotal: isYearly
      ? totals.yearlyVariableRemainingTotal
      : totals.variableRemainingTotal,
    variableUsageRate: isYearly ? totals.yearlyVariableUsageRate : totals.variableUsageRate,
  };
  const summaryCards = [
    { label: '収入合計', value: dashboardTotals.incomeTotal, section: 'income' as const },
    { label: '固定費合計', value: dashboardTotals.fixedCostTotal, section: 'fixed' as const },
    {
      label: '変動費合計',
      value: dashboardTotals.variableCostTotal,
      section: 'variableCost' as const,
    },
    {
      label: '年間収入合計（見積）',
      value: totals.estimatedAnnualIncomeTotal,
      section: 'annualIncome' as const,
    },
    {
      label: '年間固定費（見積）',
      value: totals.estimatedAnnualFixedCostTotal,
      section: 'annual' as const,
    },
    {
      label: isYearly
        ? '年単位で自由に使える金額（見積）'
        : '月単位で自由に使える金額（見積）',
      value: dashboardTotals.estimatedFreeBudget,
      section: 'annualIncome' as const,
    },
  ];
  const categoryProgressItems = useMemo(() => {
    const targetYear = data.targetMonth.slice(0, 4);
    const categoryIds = new Set(data.categories.map((category) => category.id));
    const actualByCategory = new Map<string, number>();

    data.variableCosts
      .filter((item) =>
        isYearly
          ? item.month.slice(0, 4) === targetYear
          : item.month.slice(0, 7) === data.targetMonth,
      )
      .forEach((item) => {
        const categoryId = categoryIds.has(item.categoryId) ? item.categoryId : '';
        actualByCategory.set(categoryId, (actualByCategory.get(categoryId) ?? 0) + item.amount);
      });

    const items = data.variableCategoryBudgets.map((budget) => {
      const category = data.categories.find((item) => item.id === budget.categoryId);
      const categoryId = category?.id ?? '';
      const budgetAmount = isYearly ? budget.budgetAmount * 12 : budget.budgetAmount;
      const actualAmount = actualByCategory.get(categoryId) ?? 0;
      return {
        id: budget.id,
        name: category?.name ?? '未分類',
        budgetAmount,
        actualAmount,
        remainingAmount: budgetAmount - actualAmount,
        usageRate: budgetAmount > 0 ? Math.round((actualAmount / budgetAmount) * 100) : 0,
      };
    });

    const uncategorizedActual = actualByCategory.get('') ?? 0;
    if (uncategorizedActual > 0) {
      items.push({
        id: 'uncategorized',
        name: '未分類',
        budgetAmount: 0,
        actualAmount: uncategorizedActual,
        remainingAmount: -uncategorizedActual,
        usageRate: 0,
      });
    }

    return items;
  }, [
    data.categories,
    data.targetMonth,
    data.variableCategoryBudgets,
    data.variableCosts,
    isYearly,
  ]);

  return (
    <main className="mt-8 space-y-12">
      <section className="grid gap-6 md:grid-cols-2 md:gap-10">
        <HeroCard
          label={isYearly ? '今年あといくら使えるか（実績）' : '今月あといくら使えるか（実績）'}
          value={dashboardTotals.actualRemainingBudget}
        />
        <HeroCard
          label="貯金目標差し引き後の自由予算"
          value={dashboardTotals.freeBudgetAfterSaving}
          dark
        />
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="font-['Khand',sans-serif] text-sm tracking-[0.22em] text-[#717182]">
              ACTUAL / ESTIMATE
            </p>
            <h1 className="mt-1 text-xl font-light text-[#0a0a0a]">家計の集計内訳</h1>
          </div>
          <button
            type="button"
            onClick={() => onOpenSection('income')}
            className="flex min-h-11 items-center gap-2 rounded-[5px] border border-[#2c2c2c]/30 px-4 text-sm text-[#2c2c2c] hover:bg-[#f7f7f7]"
          >
            <Plus className="size-4" />
            登録する
          </button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {summaryCards.map((card) => (
            <button
              type="button"
              key={card.label}
              onClick={() => onOpenSection(card.section)}
              className="group min-h-[142px] rounded-[5px] border-b border-r border-[#2c2c2c]/30 bg-white p-6 text-left transition-transform hover:-translate-y-0.5"
            >
              <span className="flex items-center justify-between text-sm font-light text-[#717182] sm:text-base">
                {card.label}
                <Edit3 className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </span>
              <strong className="mt-5 block text-right font-['Saira_Semi_Condensed','Khand',sans-serif] text-3xl font-medium text-[#0a0a0a] sm:text-4xl">
                {formatCurrency(card.value)}
              </strong>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="font-['Khand',sans-serif] text-sm tracking-[0.22em] text-[#717182]">
            VARIABLE BUDGET
          </p>
          <h2 className="mt-1 text-xl font-light text-[#0a0a0a]">変動費予算の進捗</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ProgressMetric label="予算合計" value={formatCurrency(dashboardTotals.variableBudgetTotal)} />
          <ProgressMetric label="実績合計" value={formatCurrency(dashboardTotals.variableCostTotal)} />
          <ProgressMetric
            label="残り合計"
            value={formatCurrency(dashboardTotals.variableRemainingTotal)}
            negative={dashboardTotals.variableRemainingTotal < 0}
          />
          <ProgressMetric label="使用率" value={`${dashboardTotals.variableUsageRate}%`} />
        </div>
        <VariableBudgetProgress
          budgetTotal={dashboardTotals.variableBudgetTotal}
          actualTotal={dashboardTotals.variableCostTotal}
          remainingTotal={dashboardTotals.variableRemainingTotal}
          usageRate={dashboardTotals.variableUsageRate}
        />
        <CategoryProgressList items={categoryProgressItems} />
      </section>

      <section className="rounded-[5px] border-b border-r border-[#2c2c2c]/30 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-[#f2f2f2] p-3 text-[#2c2c2c]">
            <WalletCards className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-normal">計算に含まれるもの</h2>
            <p className="mt-2 text-sm font-light leading-7 text-[#717182]">
              月額モードの実績は対象月、年額モードの実績は対象年で集計しています。
              年額モードの固定費は現在の月額固定費を12倍して計算しています。
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProgressMetric({
  label,
  value,
  negative = false,
}: {
  label: string;
  value: string;
  negative?: boolean;
}) {
  return (
    <article className="rounded-[5px] border-b border-r border-[#2c2c2c]/30 bg-white p-5">
      <p className="text-sm font-light text-[#717182]">{label}</p>
      <p
        className={`mt-3 break-words text-right font-['Saira_Semi_Condensed','Khand',sans-serif] text-2xl font-medium ${
          negative ? 'text-[#b42318]' : 'text-[#0a0a0a]'
        }`}
      >
        {value}
      </p>
    </article>
  );
}

function ProgressBar({
  usageRate,
  heightClass = 'h-2',
}: {
  usageRate: number;
  heightClass?: string;
}) {
  const progressWidth = Math.min(Math.max(usageRate, 0), 100);
  const overBudget = usageRate > 100;

  return (
    <div className={`${heightClass} overflow-hidden rounded-full bg-[#f2f2f2]`}>
      <div
        className={`h-full rounded-full transition-[width] ${
          overBudget ? 'bg-[#b42318]' : 'bg-[#2c2c2c]'
        }`}
        style={{ width: `${progressWidth}%` }}
      />
    </div>
  );
}

function VariableBudgetProgress({
  budgetTotal,
  actualTotal,
  remainingTotal,
  usageRate,
}: {
  budgetTotal: number;
  actualTotal: number;
  remainingTotal: number;
  usageRate: number;
}) {
  const overBudget = usageRate > 100;

  return (
    <article className="mt-5 rounded-[5px] border-b border-r border-[#2c2c2c]/30 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-['Khand',sans-serif] text-sm tracking-[0.18em] text-[#717182]">
            VARIABLE BUDGET PROGRESS
          </p>
          <h3 className="mt-1 text-lg font-light text-[#0a0a0a]">変動費予算の使用率</h3>
        </div>
        <div className="flex items-center gap-3">
          {overBudget && (
            <span className="rounded-[5px] bg-[#fef3f2] px-3 py-1 text-sm text-[#b42318]">
              予算オーバー
            </span>
          )}
          <strong className={`font-['Khand',sans-serif] text-3xl font-medium ${
            overBudget ? 'text-[#b42318]' : 'text-[#0a0a0a]'
          }`}
          >
            {usageRate}%
          </strong>
        </div>
      </div>
      <div className="mt-5 max-w-3xl">
        <ProgressBar usageRate={usageRate} heightClass="h-3" />
      </div>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <ComparisonValue label="予算" value={budgetTotal} />
        <ComparisonValue label="実績" value={actualTotal} />
        <ComparisonValue label="残り" value={remainingTotal} negative={remainingTotal < 0} />
      </div>
    </article>
  );
}

function CategoryProgressList({ items }: { items: CategoryProgressItem[] }) {
  return (
    <section className="mt-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="font-['Khand',sans-serif] text-sm tracking-[0.18em] text-[#717182]">
            CATEGORY PROGRESS
          </p>
          <h3 className="mt-1 text-lg font-light text-[#0a0a0a]">カテゴリ別の進捗</h3>
        </div>
        <span className="text-sm text-[#717182]">{items.length}件</span>
      </div>
      {items.length === 0 ? (
        <div className="rounded-[5px] border border-dashed border-[#717182]/40 px-5 py-8 text-center text-sm font-light text-[#717182]">
          表示できるカテゴリ別進捗はまだありません。
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => {
            const overBudget = item.usageRate > 100;
            return (
              <article
                key={item.id}
                className="rounded-[5px] border-b border-r border-[#2c2c2c]/25 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <h4 className="min-w-0 truncate text-base font-normal text-[#0a0a0a]">
                    {item.name}
                  </h4>
                  <div className="shrink-0 text-right">
                    {overBudget && (
                      <span className="mb-1 block text-xs text-[#b42318]">予算オーバー</span>
                    )}
                    <strong className={`font-['Khand',sans-serif] text-xl font-medium ${
                      overBudget ? 'text-[#b42318]' : 'text-[#0a0a0a]'
                    }`}
                    >
                      {item.usageRate}%
                    </strong>
                  </div>
                </div>
                <div className="mt-4">
                  <ProgressBar usageRate={item.usageRate} />
                </div>
                <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                  <ComparisonValue label="予算" value={item.budgetAmount} />
                  <ComparisonValue label="実績" value={item.actualAmount} />
                  <ComparisonValue
                    label="残り"
                    value={item.remainingAmount}
                    negative={item.remainingAmount < 0}
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function HeroCard({
  label,
  value,
  dark = false,
}: {
  label: string;
  value: number;
  dark?: boolean;
}) {
  return (
    <article
      className={`flex min-h-[190px] flex-col justify-between rounded-[5px] p-7 sm:p-9 ${
        dark
          ? 'bg-[#2c2c2c] text-white'
          : 'border-b border-r border-[#2c2c2c]/30 bg-white text-[#0a0a0a]'
      }`}
    >
      <h2 className="text-base font-light sm:text-xl">{label}</h2>
      <p
        className={`break-words text-right font-['Saira_Semi_Condensed','Khand',sans-serif] text-4xl font-normal leading-tight sm:text-6xl ${
          value < 0 ? 'text-[#b42318]' : ''
        }`}
      >
        {formatCurrency(value)}
      </p>
    </article>
  );
}

function Management({
  data,
  initialSection,
}: {
  data: BudgetData;
  initialSection: BudgetSection;
}) {
  const [section, setSection] = useState<BudgetSection>(initialSection);
  const [editingItem, setEditingItem] = useState<EditableItem | null>(null);

  useEffect(() => {
    setEditingItem(null);
  }, [data.targetMonth]);

  const changeSection = (nextSection: BudgetSection) => {
    setSection(nextSection);
    setEditingItem(null);
  };

  return (
    <main className="mt-8">
      <div className="overflow-x-auto border-b border-[#e5e7eb]">
        <div className="flex min-w-max">
          {(Object.keys(SECTION_LABELS) as BudgetSection[]).map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => changeSection(item)}
              className={`min-h-12 border-b-2 px-4 text-sm font-light transition-colors sm:px-6 sm:text-base ${
                section === item
                  ? 'border-[#2c2c2c] text-[#0a0a0a]'
                  : 'border-transparent text-[#717182] hover:text-[#0a0a0a]'
              }`}
            >
              {SECTION_LABELS[item]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {section === 'saving' ? (
          <SavingGoalEditor data={data} />
        ) : (
          <ItemManager
            key={section}
            section={section}
            data={data}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
          />
        )}
      </div>
    </main>
  );
}

function ItemManager({
  section,
  data,
  editingItem,
  setEditingItem,
}: {
  section: Exclude<BudgetSection, 'saving'>;
  data: BudgetData;
  editingItem: EditableItem | null;
  setEditingItem: (item: EditableItem | null) => void;
}) {
  const items = useMemo<EditableItem[]>(() => {
    if (section === 'income') {
      return data.incomes.filter((item) => item.month.slice(0, 7) === data.targetMonth);
    }
    if (section === 'fixed') {
      return data.fixedCosts.filter((item) => item.month.slice(0, 7) === data.targetMonth);
    }
    if (section === 'variableCost') {
      return data.variableCosts.filter(
        (item) => item.month.slice(0, 7) === data.targetMonth,
      );
    }
    if (section === 'category') return data.categories;
    if (section === 'variable') return data.variableCategoryBudgets;
    if (section === 'annualIncome') return data.annualIncomes;
    return data.annualCosts;
  }, [
    data.annualCosts,
    data.annualIncomes,
    data.categories,
    data.fixedCosts,
    data.incomes,
    data.targetMonth,
    data.variableCategoryBudgets,
    data.variableCosts,
    section,
  ]);

  const removeItem = (item: EditableItem) => {
    const itemName = 'name' in item ? item.name : data.categories.find((category) => (
      'categoryId' in item && category.id === item.categoryId
    ))?.name ?? '未分類';
    if (!window.confirm(`「${itemName}」を削除しますか？`)) return;
    if (section === 'income') {
      data.setIncomes((current) => current.filter((x) => x.id !== item.id));
    }
    if (section === 'fixed') {
      data.setFixedCosts((current) => current.filter((x) => x.id !== item.id));
    }
    if (section === 'variableCost') {
      data.setVariableCosts((current) => current.filter((x) => x.id !== item.id));
    }
    if (section === 'category') {
      const usedByCost = data.variableCosts.some((cost) => cost.categoryId === item.id);
      const usedByBudget = data.variableCategoryBudgets.some(
        (budget) => budget.categoryId === item.id,
      );
      if (usedByCost || usedByBudget) {
        window.alert('使用中または予算ありのカテゴリは削除できません。');
        return;
      }
      data.setCategories((current) => current.filter((x) => x.id !== item.id));
    }
    if (section === 'variable') {
      data.setVariableCategoryBudgets((current) => current.filter((x) => x.id !== item.id));
    }
    if (section === 'annualIncome') {
      data.setAnnualIncomes((current) => current.filter((x) => x.id !== item.id));
    }
    if (section === 'annual') {
      data.setAnnualCosts((current) => current.filter((x) => x.id !== item.id));
    }
    if (editingItem?.id === item.id) setEditingItem(null);
  };

  return (
    <div className="space-y-10">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(300px,390px)_1fr]">
        <ItemForm
          key={editingItem?.id ?? `new-${data.targetMonth}`}
          section={section}
          data={data}
          editingItem={editingItem}
          onFinish={() => setEditingItem(null)}
        />

        <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-['Khand',sans-serif] text-sm tracking-[0.2em] text-[#717182]">
              REGISTERED ITEMS
            </p>
            <h2 className="mt-1 text-lg font-light">{SECTION_LABELS[section]}の一覧</h2>
          </div>
          <span className="text-sm text-[#717182]">{items.length}件</span>
        </div>

        {items.length === 0 ? (
          <div className="rounded-[5px] border border-dashed border-[#717182]/40 px-5 py-14 text-center">
            <Table2 className="mx-auto size-7 text-[#a8a8a8]" />
            <p className="mt-4 text-sm font-light text-[#717182]">
              まだ登録されていません。
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                categoryName={
                  'categoryId' in item
                    ? data.categories.find(
                        (category) => category.id === item.categoryId,
                      )?.name
                    : undefined
                }
                onEdit={() => setEditingItem(item)}
                onDelete={() => removeItem(item)}
              />
            ))}
          </div>
        )}
        </section>
      </div>
      {section === 'variable' && <CategoryBudgetComparison data={data} />}
    </div>
  );
}

function CategoryBudgetComparison({ data }: { data: BudgetData }) {
  return (
    <section>
      <div className="mb-4">
        <p className="font-['Khand',sans-serif] text-sm tracking-[0.2em] text-[#717182]">
          BUDGET VS ACTUAL
        </p>
        <h2 className="mt-1 text-lg font-light">
          {formatMonth(data.targetMonth)} カテゴリ別の予算進捗
        </h2>
      </div>
      {data.categoryComparisons.length === 0 ? (
        <div className="rounded-[5px] border border-dashed border-[#717182]/40 px-5 py-10 text-center text-sm font-light text-[#717182]">
          比較できるカテゴリまたは実績がありません。
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.categoryComparisons.map((comparison) => (
            <article
              key={comparison.id || 'uncategorized'}
              className="rounded-[5px] border-b border-r border-[#2c2c2c]/25 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="min-w-0 truncate text-base font-normal">
                  {comparison.name}
                </h3>
                <strong className="shrink-0 font-['Khand',sans-serif] text-xl font-medium">
                  {comparison.usageRate}%
                </strong>
              </div>
              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                <ComparisonValue label="予算" value={comparison.budgetAmount} />
                <ComparisonValue label="実績" value={comparison.actualAmount} />
                <ComparisonValue
                  label="残り"
                  value={comparison.remainingAmount}
                  negative={comparison.remainingAmount < 0}
                />
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#f2f2f2]">
                <div
                  className={`h-full rounded-full ${
                    comparison.usageRate > 100 ? 'bg-[#b42318]' : 'bg-[#2c2c2c]'
                  }`}
                  style={{ width: `${Math.min(Math.max(comparison.usageRate, 0), 100)}%` }}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function ComparisonValue({
  label,
  value,
  negative = false,
}: {
  label: string;
  value: number;
  negative?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="font-light text-[#717182]">{label}</p>
      <p
        className={`mt-1 break-words font-['Khand',sans-serif] text-base ${
          negative ? 'text-[#b42318]' : 'text-[#0a0a0a]'
        }`}
      >
        {formatCurrency(value)}
      </p>
    </div>
  );
}

function ItemForm({
  section,
  data,
  editingItem,
  onFinish,
}: {
  section: Exclude<BudgetSection, 'saving'>;
  data: BudgetData;
  editingItem: EditableItem | null;
  onFinish: () => void;
}) {
  const initialAmount = editingItem && section !== 'category'
    ? 'budgetAmount' in editingItem
      ? editingItem.budgetAmount
      : editingItem.amount
    : '';
  const [name, setName] = useState(editingItem && 'name' in editingItem ? editingItem.name : '');
  const [amount, setAmount] = useState(formatAmountInput(initialAmount));
  const [memo, setMemo] = useState(editingItem?.memo ?? '');
  const [month, setMonth] = useState(
    editingItem && 'month' in editingItem
      ? editingItem.month
      : getInitialDate(data.targetMonth, data.currentMonth),
  );
  const [categoryId, setCategoryId] = useState(
    editingItem
      && 'categoryId' in editingItem
      && data.categories.some((category) => category.id === editingItem.categoryId)
      ? editingItem.categoryId
      : '',
  );
  const [error, setError] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const parsedAmount = parseAmountInput(amount);
    if (section !== 'variable' && !name.trim()) {
      setError('名称を入力してください。');
      return;
    }
    if (section === 'variable' && !categoryId) {
      setError('カテゴリを選択してください。');
      return;
    }
    if (section !== 'category' && (!Number.isFinite(parsedAmount) || parsedAmount <= 0)) {
      setError('金額は1円以上で入力してください。');
      return;
    }
    if (
      (section === 'income' || section === 'fixed' || section === 'variableCost')
      && !month
    ) {
      setError('登録日を入力してください。');
      return;
    }
    if (section === 'category') {
      const duplicate = data.categories.some(
        (category) =>
          category.id !== editingItem?.id
          && category.name.trim().toLowerCase() === name.trim().toLowerCase(),
      );
      if (duplicate) {
        setError('同じ名前のカテゴリは登録できません。');
        return;
      }
    }
    if (section === 'variable') {
      const duplicate = data.variableCategoryBudgets.some(
        (budget) => budget.id !== editingItem?.id && budget.categoryId === categoryId,
      );
      if (duplicate) {
        setError('選択したカテゴリの予算はすでに登録されています。');
        return;
      }
    }

    const now = new Date().toISOString();
    const base = {
      id: editingItem?.id ?? createId(),
      memo: memo.trim() || undefined,
      createdAt: editingItem?.createdAt ?? now,
      updatedAt: now,
    };

    if (section === 'income') {
      data.setIncomes((current) => upsert(current, { ...base, name: name.trim(), amount: parsedAmount, month }));
    } else if (section === 'fixed') {
      data.setFixedCosts((current) =>
        upsert(current, { ...base, name: name.trim(), amount: parsedAmount, month }),
      );
    } else if (section === 'variableCost') {
      data.setVariableCosts((current) =>
        upsert(current, { ...base, name: name.trim(), amount: parsedAmount, month, categoryId }),
      );
    } else if (section === 'category') {
      data.setCategories((current) =>
        upsert(current, { ...base, name: name.trim(), color: undefined, icon: undefined }),
      );
    } else if (section === 'variable') {
      data.setVariableCategoryBudgets((current) =>
        upsert(current, { ...base, categoryId, budgetAmount: parsedAmount }),
      );
    } else if (section === 'annualIncome') {
      data.setAnnualIncomes((current) => upsert(current, { ...base, name: name.trim(), amount: parsedAmount }));
    } else {
      data.setAnnualCosts((current) => upsert(current, { ...base, name: name.trim(), amount: parsedAmount }));
    }

    setName('');
    setAmount('');
    setMemo('');
    setMonth(getInitialDate(data.targetMonth, data.currentMonth));
    setCategoryId('');
    setError('');
    onFinish();
  };

  return (
    <section className="rounded-[5px] border-b border-r border-[#2c2c2c]/30 p-6 sm:p-7">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-['Khand',sans-serif] text-sm tracking-[0.2em] text-[#717182]">
            {editingItem ? 'EDIT ITEM' : 'NEW ITEM'}
          </p>
          <h2 className="mt-1 text-lg font-light">
            {SECTION_LABELS[section]}を{editingItem ? '編集' : '登録'}
          </h2>
        </div>
        {editingItem && (
          <button
            type="button"
            onClick={onFinish}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-[5px] text-[#717182] hover:bg-[#f2f2f2]"
            aria-label="編集をキャンセル"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      <form className="space-y-5" onSubmit={submit}>
        {section !== 'variable' && (
          <FormField label={nameLabel(section)}>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
              placeholder={namePlaceholder(section)}
              autoComplete="off"
            />
          </FormField>
        )}

        {section !== 'category' && (
          <FormField
            label={
              section === 'variable'
                ? '予算金額'
                : section === 'annual' || section === 'annualIncome'
                  ? '年間金額'
                  : '金額'
            }
          >
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#717182]">
                ¥
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={(event) => setAmount(sanitizeAmountInput(event.target.value))}
                onFocus={() => setAmount((current) => sanitizeAmountInput(current))}
                onBlur={() => setAmount((current) => formatAmountInput(current))}
                className={`${inputClass} pl-9 text-right font-['Khand',sans-serif] text-lg`}
                placeholder="0"
              />
            </div>
          </FormField>
        )}

        {(section === 'variableCost' || section === 'variable') && (
          <FormField label={section === 'variable' ? 'カテゴリ' : 'カテゴリ（任意）'}>
            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className={inputClass}
            >
              <option value="">{section === 'variable' ? 'カテゴリを選択' : '未分類'}</option>
              {data.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </FormField>
        )}

        {(section === 'income' || section === 'fixed' || section === 'variableCost') && (
          <FormField label="登録日">
            <DatePicker value={month} onChange={setMonth} />
          </FormField>
        )}

        <FormField label="メモ（任意）">
          <textarea
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            className={`${inputClass} min-h-24 resize-y`}
            placeholder="補足があれば入力"
          />
        </FormField>

        {error && (
          <p className="rounded-[5px] bg-[#fef3f2] px-4 py-3 text-sm text-[#b42318]" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[5px] bg-[#2c2c2c] px-4 text-white transition-colors hover:bg-[#1e1e1e]"
        >
          <Save className="size-4" />
          {editingItem ? '変更を保存' : '登録する'}
        </button>
      </form>
    </section>
  );
}

function ItemRow({
  item,
  categoryName,
  onEdit,
  onDelete,
}: {
  item: EditableItem;
  categoryName?: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const amount = 'budgetAmount' in item ? item.budgetAmount : 'amount' in item ? item.amount : null;
  const itemName = 'name' in item ? item.name : categoryName ?? '未分類';

  return (
    <article className="rounded-[5px] border-b border-r border-[#2c2c2c]/25 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-normal text-[#0a0a0a]">{itemName}</h3>
          {'month' in item && (
            <p className="mt-1 font-['Khand',sans-serif] text-sm text-[#717182]">
              {formatDate(item.month)}
            </p>
          )}
          {'categoryId' in item && (
            <p className="mt-1 text-sm font-light text-[#717182]">
              カテゴリ：{categoryName ?? '未分類'}
            </p>
          )}
        </div>
        {amount !== null && (
          <strong className="shrink-0 font-['Saira_Semi_Condensed','Khand',sans-serif] text-xl font-medium">
            {formatCurrency(amount)}
          </strong>
        )}
      </div>
      {item.memo && (
        <p className="mt-3 border-t border-[#e5e7eb] pt-3 text-sm font-light leading-6 text-[#717182]">
          {item.memo}
        </p>
      )}
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="flex min-h-11 items-center gap-2 rounded-[5px] px-3 text-sm text-[#717182] hover:bg-[#f2f2f2] hover:text-[#0a0a0a]"
        >
          <Edit3 className="size-4" />
          編集
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex min-h-11 items-center gap-2 rounded-[5px] px-3 text-sm text-[#b42318] hover:bg-[#fef3f2]"
        >
          <Trash2 className="size-4" />
          削除
        </button>
      </div>
    </article>
  );
}

function SavingGoalEditor({ data }: { data: BudgetData }) {
  const [amount, setAmount] = useState(formatAmountInput(data.savingGoal.amount || ''));
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const parsedAmount = parseAmountInput(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('貯金目標金額は1円以上で入力してください。');
      setSaved(false);
      return;
    }
    data.setSavingGoal({
      amount: parsedAmount,
      updatedAt: new Date().toISOString(),
    });
    setError('');
    setSaved(true);
  };

  return (
    <div className="mx-auto max-w-xl">
      <section className="rounded-[5px] border-b border-r border-[#2c2c2c]/30 p-6 sm:p-8">
        <div className="mb-7 flex items-start gap-4">
          <div className="rounded-full bg-[#f2f2f2] p-3">
            <Landmark className="size-5" />
          </div>
          <div>
            <p className="font-['Khand',sans-serif] text-sm tracking-[0.2em] text-[#717182]">
              SAVING GOAL
            </p>
            <h1 className="mt-1 text-xl font-light">今月の貯金目標</h1>
            <p className="mt-2 text-sm font-light leading-6 text-[#717182]">
              自由予算から差し引く目標金額を設定します。
            </p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-5">
          <FormField label="貯金目標金額">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#717182]">
                ¥
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={(event) => {
                  setAmount(sanitizeAmountInput(event.target.value));
                  setSaved(false);
                }}
                onFocus={() => setAmount((current) => sanitizeAmountInput(current))}
                onBlur={() => setAmount((current) => formatAmountInput(current))}
                className={`${inputClass} pl-9 text-right font-['Khand',sans-serif] text-xl`}
                placeholder="0"
              />
            </div>
          </FormField>
          {error && <p className="text-sm text-[#b42318]" role="alert">{error}</p>}
          {saved && <p className="text-sm text-[#067647]" role="status">保存しました。</p>}
          <button
            type="submit"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[5px] bg-[#2c2c2c] px-4 text-white hover:bg-[#1e1e1e]"
          >
            <Save className="size-4" />
            保存する
          </button>
        </form>
      </section>
    </div>
  );
}

function SettingsScreen({ data }: { data: BudgetData }) {
  const [message, setMessage] = useState<Message | null>(null);
  const [deleteInput, setDeleteInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentBackupData = (): BackupData => ({
    incomes: data.incomes,
    fixedCosts: data.fixedCosts,
    variableCosts: data.variableCosts,
    categories: data.categories,
    variableCategoryBudgets: data.variableCategoryBudgets,
    annualIncomes: data.annualIncomes,
    annualCosts: data.annualCosts,
    savingGoal: data.savingGoal,
  });

  const saveBackupDataToStorage = (backupData: BackupData) => {
    BACKUP_DATA_KEYS.forEach((key) => {
      localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(backupData[key]));
    });
  };

  const removeBudgetStorage = () => {
    STORAGE_KEY_NAMES.forEach((key) => localStorage.removeItem(STORAGE_KEYS[key]));
  };

  const applyBackupData = (backupData: BackupData) => {
    data.setIncomes(backupData.incomes);
    data.setFixedCosts(backupData.fixedCosts);
    data.setVariableCosts(backupData.variableCosts);
    data.setCategories(backupData.categories);
    data.setVariableCategoryBudgets(backupData.variableCategoryBudgets);
    data.setAnnualIncomes(backupData.annualIncomes);
    data.setAnnualCosts(backupData.annualCosts);
    data.setSavingGoal(backupData.savingGoal);
  };

  const exportData = () => {
    try {
      const now = new Date();
      const backup: BackupFile = {
        app: BACKUP_APP_ID,
        version: BACKUP_VERSION,
        exportedAt: now.toISOString(),
        data: currentBackupData(),
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `budget-app-backup-${formatBackupTimestamp(now)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: 'バックアップJSONをエクスポートしました。' });
    } catch {
      setMessage({ type: 'error', text: 'エクスポートに失敗しました。時間をおいて再度お試しください。' });
    }
  };

  const importData = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const parsed = JSON.parse(await file.text()) as unknown;
      const backup = parseBackupFile(parsed);
      if (!backup) {
        setMessage({ type: 'error', text: 'このファイルは家計簿アプリ用のバックアップデータではありません。' });
        return;
      }

      const confirmed = window.confirm(
        '現在の家計簿データはすべて上書きされます。バックアップJSONから完全復元してよろしいですか？',
      );
      if (!confirmed) {
        setMessage({ type: 'error', text: 'インポートをキャンセルしました。' });
        return;
      }

      removeBudgetStorage();
      saveBackupDataToStorage(backup.data);
      applyBackupData(backup.data);
      setMessage({ type: 'success', text: 'バックアップJSONから復元しました。画面表示も最新データに更新済みです。' });
    } catch {
      setMessage({ type: 'error', text: 'JSON形式が不正、またはファイルを読み込めませんでした。' });
    }
  };

  const deleteAllData = () => {
    if (deleteInput !== '削除') {
      setMessage({ type: 'error', text: '一括削除するには入力欄に「削除」と入力してください。' });
      return;
    }

    const confirmed = window.confirm(
      '家計簿アプリの全データを削除します。この操作は元に戻せません。本当に削除しますか？',
    );
    if (!confirmed) {
      setMessage({ type: 'error', text: '一括削除をキャンセルしました。' });
      return;
    }

    try {
      removeBudgetStorage();
      applyBackupData(EMPTY_BACKUP_DATA);
      setDeleteInput('');
      setMessage({ type: 'success', text: '家計簿アプリ関連データのみを一括削除しました。' });
    } catch {
      setMessage({ type: 'error', text: '一括削除に失敗しました。時間をおいて再度お試しください。' });
    }
  };

  return (
    <main className="mt-8 space-y-8">
      <section>
        <p className="font-['Khand',sans-serif] text-sm tracking-[0.22em] text-[#717182]">
          SETTINGS
        </p>
        <h1 className="mt-1 text-xl font-light text-[#0a0a0a]">設定</h1>
      </section>

      {message && (
        <p
          role={message.type === 'error' ? 'alert' : 'status'}
          className={`rounded-[5px] px-4 py-3 text-sm ${
            message.type === 'error'
              ? 'bg-[#fef3f2] text-[#b42318]'
              : 'bg-[#ecfdf3] text-[#067647]'
          }`}
        >
          {message.text}
        </p>
      )}

      <section className="grid gap-5 md:grid-cols-2">
        <article className="rounded-[5px] border-b border-r border-[#2c2c2c]/30 p-6">
          <div className="mb-5 flex items-start gap-4">
            <div className="rounded-full bg-[#f2f2f2] p-3 text-[#2c2c2c]">
              <Download className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-light">データのエクスポート</h2>
              <p className="mt-2 text-sm font-light leading-6 text-[#717182]">
                現在の家計簿データをJSONファイルとして保存します。
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={exportData}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[5px] bg-[#2c2c2c] px-4 text-white transition-colors hover:bg-[#1e1e1e]"
          >
            <Download className="size-4" />
            JSONをエクスポート
          </button>
        </article>

        <article className="rounded-[5px] border-b border-r border-[#2c2c2c]/30 p-6">
          <div className="mb-5 flex items-start gap-4">
            <div className="rounded-full bg-[#f2f2f2] p-3 text-[#2c2c2c]">
              <Upload className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-light">データのインポート</h2>
              <p className="mt-2 text-sm font-light leading-6 text-[#717182]">
                バックアップJSONから完全復元します。現在の家計簿データは上書きされます。
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={importData}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[5px] border border-[#2c2c2c]/30 px-4 text-[#2c2c2c] transition-colors hover:bg-[#f7f7f7]"
          >
            <Upload className="size-4" />
            JSONを選択してインポート
          </button>
        </article>
      </section>

      <section className="rounded-[5px] border border-[#fecdca] bg-[#fffbfa] p-6 sm:p-7">
        <div className="mb-5 flex items-start gap-4">
          <div className="rounded-full bg-[#fef3f2] p-3 text-[#b42318]">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-light text-[#b42318]">データの一括削除</h2>
            <p className="mt-2 text-sm font-light leading-6 text-[#7a271a]">
              家計簿アプリ関連データのみを削除します。削除後はバックアップがない限り復元できません。
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <label className="block">
            <span className="mb-2 block text-sm font-light text-[#7a271a]">
              一括削除するには「削除」と入力してください。
            </span>
            <input
              value={deleteInput}
              onChange={(event) => setDeleteInput(event.target.value)}
              className={`${inputClass} border-[#fecdca]`}
              autoComplete="off"
            />
          </label>
          <button
            type="button"
            onClick={deleteAllData}
            disabled={deleteInput !== '削除'}
            className="flex min-h-12 items-center justify-center gap-2 self-end rounded-[5px] bg-[#b42318] px-5 text-white transition-colors hover:bg-[#912018] disabled:cursor-not-allowed disabled:bg-[#fecdca]"
          >
            <Trash2 className="size-4" />
            一括削除
          </button>
        </div>
      </section>
    </main>
  );
}

function DatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(value.slice(0, 7));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setViewMonth(value.slice(0, 7));
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, [open]);

  const [year, monthNumber] = viewMonth.split('-').map(Number);
  const firstWeekday = new Date(year, monthNumber - 1, 1).getDay();
  const daysInMonth = new Date(year, monthNumber, 0).getDate();
  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const selectDay = (day: number) => {
    onChange(`${viewMonth}-${String(day).padStart(2, '0')}`);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`${inputClass} flex min-h-[50px] items-center justify-between text-left`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="font-['Khand',sans-serif] text-xl text-[#717182]">
          {formatDate(value)}
        </span>
        <CalendarDays className="size-5 text-[#717182]" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="登録日を選択"
          className="absolute left-0 top-full z-50 mt-2 w-[min(314px,calc(100vw-3rem))] rounded-[9px] border border-[#d1d5dc] bg-white px-4 pb-5 pt-4 shadow-[0_4px_12px_rgba(0,0,0,0.12)] sm:px-5"
        >
          <div className="flex items-center justify-between">
            <strong className="text-sm font-medium text-[#0a0a0a]">
              {monthNumber}月 {year}
            </strong>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setViewMonth(moveMonth(viewMonth, -1))}
                className="flex size-10 items-center justify-center rounded-[5px] text-[#0a0a0a] hover:bg-[#f2f2f2]"
                aria-label="カレンダーの前月を表示"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMonth(moveMonth(viewMonth, 1))}
                className="flex size-10 items-center justify-center rounded-[5px] text-[#0a0a0a] hover:bg-[#f2f2f2]"
                aria-label="カレンダーの翌月を表示"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-7 text-center text-sm font-light text-[#717182]">
            {['日', '月', '火', '水', '木', '金', '土'].map((weekday) => (
              <span key={weekday} className="py-2">
                {weekday}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 text-center font-['Khand',sans-serif] text-sm">
            {cells.map((day, index) =>
              day === null ? (
                <span key={`empty-${index}`} className="size-10" />
              ) : (
                <button
                  type="button"
                  key={day}
                  onClick={() => selectDay(day)}
                  className={`mx-auto flex size-10 items-center justify-center rounded-[6px] transition-colors ${
                    value === `${viewMonth}-${String(day).padStart(2, '0')}`
                      ? 'bg-[#2c2c2c] font-medium text-white'
                      : 'text-[#0a0a0a] hover:bg-[#f2f2f2]'
                  }`}
                  aria-label={`${year}年${monthNumber}月${day}日`}
                >
                  {day}
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-light text-[#364153]">{label}</span>
      {children}
    </label>
  );
}

function nameLabel(section: Exclude<BudgetSection, 'saving'>) {
  if (section === 'income') return '収入名';
  if (section === 'fixed') return '固定費名';
  if (section === 'variableCost') return '変動費名';
  if (section === 'category') return 'カテゴリ名';
  if (section === 'variable') return 'カテゴリ名';
  if (section === 'annualIncome') return '年間収入名';
  return '項目名';
}

function namePlaceholder(section: Exclude<BudgetSection, 'saving'>) {
  if (section === 'income') return '例：給与';
  if (section === 'fixed') return '例：家賃';
  if (section === 'variableCost') return '例：食費';
  if (section === 'category') return '例：食費';
  if (section === 'variable') return '例：食費';
  if (section === 'annualIncome') return '例：給与・賞与';
  return '例：税金';
}

function upsert<T extends { id: string }>(items: T[], value: T) {
  return items.some((item) => item.id === value.id)
    ? items.map((item) => (item.id === value.id ? value : item))
    : [value, ...items];
}

export default function App() {
  const data = useBudgetData();
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [dashboardMode, setDashboardMode] = useState<DashboardMode>('monthly');
  const [activeSection, setActiveSection] = useState<BudgetSection>('income');

  const openSection = (section: BudgetSection) => {
    setActiveSection(section);
    setScreen('manage');
  };

  return (
    <div className="min-h-screen bg-white text-[#0a0a0a]">
      <div className="mx-auto w-full max-w-[1222px] px-4 pb-16 pt-6 sm:px-8 sm:pt-8">
        <Header
          targetMonth={data.targetMonth}
          onChangeMonth={data.setTargetMonth}
          dashboardMode={dashboardMode}
          onToggleDashboardMode={() =>
            setDashboardMode((current) => (current === 'monthly' ? 'yearly' : 'monthly'))
          }
          screen={screen}
          onNavigate={setScreen}
        />
        {screen === 'dashboard' ? (
          <Dashboard
            data={data}
            mode={dashboardMode}
            onOpenSection={openSection}
          />
        ) : screen === 'settings' ? (
          <SettingsScreen data={data} />
        ) : (
          <Management key={activeSection} data={data} initialSection={activeSection} />
        )}
      </div>
    </div>
  );
}
