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
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import type {
  AnnualCost,
  AnnualIncome,
  BudgetSection,
  Category,
  CategoryGroup,
  FixedCost,
  Income,
  MonthlyBudget,
  SavingGoal,
  VariableCategoryBudget,
  VariableCost,
} from './types';
import { parseBackupJson } from './backup';
import { calculateVariableCostBreakdown, normalizeMonthlyBudgets } from './budgetDomain';
import {
  createId,
  STORAGE_KEYS,
  type BudgetData,
  useBudgetData,
} from './useBudgetData';

type Screen = 'dashboard' | 'manage' | 'settings';
type DashboardMode = 'monthly' | 'yearly';
type BackupData = {
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
type BackupFile = {
  app: 'budget-app';
  version: 1 | 2;
  exportedAt: string;
  data: BackupData;
};
type Message = {
  type: 'success' | 'error';
  text: string;
};
type BreakdownItem = {
  id: string;
  name: string;
  amount: number;
  rate: number;
  color: string;
};
type EditableItem =
  | Income
  | FixedCost
  | VariableCost
  | CategoryGroup
  | Category
  | VariableCategoryBudget
  | MonthlyBudget
  | AnnualIncome
  | AnnualCost;

const SECTION_LABELS: Record<BudgetSection, string> = {
  income: '収入',
  fixed: '固定費',
  variableCost: '変動費実績',
  categoryGroup: 'グループカテゴリ',
  category: 'カテゴリ',
  monthlyBudget: '月間予算',
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
const BACKUP_VERSION = 2;
const BACKUP_DATA_KEYS: (keyof BackupData)[] = [
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
const STORAGE_KEY_NAMES = Object.keys(STORAGE_KEYS) as (keyof typeof STORAGE_KEYS)[];
const EMPTY_BACKUP_DATA: BackupData = {
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

function formatCurrency(amount: number) {
  return currencyFormatter.format(Number.isFinite(amount) ? amount : 0);
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
      const createdAt = typeof item.createdAt === 'string' ? item.createdAt : new Date(0).toISOString();
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
      createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date(0).toISOString(),
      updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : new Date(0).toISOString(),
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
        createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date(0).toISOString(),
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
  const now = new Date().toISOString();
  const total = rawVariableCategoryBudgets.reduce((sum, item) => {
    if (!isRecord(item) || typeof item.budgetAmount !== 'number' || !Number.isFinite(item.budgetAmount)) {
      return sum;
    }
    return sum + item.budgetAmount;
  }, 0);
  return total > 0
    ? [{
        yearMonth: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
        fixedExpenseBudget: 0,
        variableExpenseBudget: total,
        createdAt: now,
        updatedAt: now,
      }]
    : [];
}

function parseBackupFile(value: unknown): BackupFile | null {
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
  const normalizedCategories = normalizeBackupCategories(backupData.categories, backupData.categoryGroups);
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

  const categoryGroups = normalizedCategories?.categoryGroups ?? migratedLegacyCategories?.categoryGroups ?? [];
  const categories = normalizedCategories?.categories ?? migratedLegacyCategories?.categories ?? [];
  const variableCategoryBudgets = Array.isArray(backupData.variableCategoryBudgets)
    ? backupData.variableCategoryBudgets as VariableCategoryBudget[]
    : migratedLegacyCategories?.variableCategoryBudgets ?? [];
  const monthlyBudgets = migrateMonthlyBudgets(backupData.monthlyBudgets, variableCategoryBudgets);

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
  variant = 'header',
  ariaLabel = '対象年月を選択',
}: {
  value: string;
  onChange: (value: string) => void;
  mode: DashboardMode;
  variant?: 'header' | 'field';
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(Number(value.slice(0, 4)));
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedMonth = Number(value.slice(5, 7));
  const isField = variant === 'field';

  useEffect(() => {
    setViewYear(Number(value.slice(0, 4)));
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  const togglePicker = () => {
    if (!open) setViewYear(Number(value.slice(0, 4)));
    setOpen((current) => !current);
  };

  const selectMonth = (monthNumber: number) => {
    onChange(`${viewYear}-${String(monthNumber).padStart(2, '0')}`);
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={isField ? 'relative w-full min-w-0 max-w-full' : 'relative'}
    >
      <button
        type="button"
        onClick={togglePicker}
        className={isField
          ? `${inputClass} box-border flex min-w-0 max-w-full items-center justify-between gap-3 text-left`
          : "min-w-[132px] rounded-[5px] px-2 py-1 text-center font-['Khand',sans-serif] text-[36px] font-light leading-none text-[#717182] transition-colors hover:bg-[#f2f2f2] sm:text-[48px]"}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${ariaLabel}、現在${value.slice(0, 4)}年${selectedMonth}月`}
      >
        <span className="min-w-0 truncate">
          {isField
            ? `${value.slice(0, 4)}年${selectedMonth}月`
            : mode === 'yearly' ? value.slice(0, 4) : formatMonth(value)}
        </span>
        {isField && <CalendarDays className="size-5 shrink-0 text-[#717182]" />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={ariaLabel}
          className={`absolute top-full z-50 mt-2 box-border rounded-[9px] border border-[#d1d5dc] bg-white px-4 pb-5 pt-4 shadow-[0_4px_12px_rgba(0,0,0,0.12)] ${
            isField
              ? 'left-0 w-full max-w-full'
              : 'left-1/2 w-[min(300px,calc(100vw-3rem))] -translate-x-1/2'
          }`}
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
                  aria-pressed={selected}
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
  const [selectedBreakdownGroupId, setSelectedBreakdownGroupId] = useState<string | null>(null);
  useEffect(() => {
    setSelectedBreakdownGroupId(null);
  }, [data.targetMonth, mode]);
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
    fixedBudgetTotal: isYearly ? totals.yearlyFixedBudgetTotal : totals.fixedBudgetTotal,
    fixedRemainingTotal: isYearly ? totals.yearlyFixedRemainingTotal : totals.fixedRemainingTotal,
    fixedUsageRate: isYearly ? totals.yearlyFixedUsageRate : totals.fixedUsageRate,
    variableBudgetTotal: isYearly ? totals.yearlyBudgetTotal : totals.variableBudgetTotal,
    variableRemainingTotal: isYearly
      ? totals.yearlyVariableRemainingTotal
      : totals.variableRemainingTotal,
    variableUsageRate: isYearly ? totals.yearlyVariableUsageRate : totals.variableUsageRate,
  };
  const actualSummaryCards = [
    { label: '収入合計', value: dashboardTotals.incomeTotal, section: 'income' as const },
    { label: '固定費合計', value: dashboardTotals.fixedCostTotal, section: 'fixed' as const },
    {
      label: '変動費合計',
      value: dashboardTotals.variableCostTotal,
      section: 'variableCost' as const,
    },
  ];
  const planSummaryCards = [
    {
      label: isYearly ? '年間収入合計（見積）' : '月間収入合計（見積）',
      value: isYearly
        ? totals.estimatedAnnualIncomeTotal
        : totals.estimatedMonthlyIncomeTotal,
      section: 'annualIncome' as const,
    },
    {
      label: isYearly ? '年間固定費（見積）' : '月間固定費（見積）',
      value: isYearly
        ? totals.estimatedAnnualFixedCostTotal
        : totals.estimatedMonthlyFixedCostTotal,
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
              ACTUAL
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
          {actualSummaryCards.map((card) => (
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
            PLAN / ESTIMATE
          </p>
          <h2 className="mt-1 text-xl font-light text-[#0a0a0a]">収支見積</h2>
          <p className="mt-2 text-sm font-light leading-6 text-[#717182]">
            年間収入・年間固定費の見積から算出した参考値です。
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {planSummaryCards.map((card) => (
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
          <h2 className="mt-1 text-xl font-light text-[#0a0a0a]">予算の進捗</h2>
          <p className="mt-2 text-sm font-light leading-6 text-[#717182]">
            設定した予算と実際の支出を比較します。
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ProgressMetric
            label="予算合計"
            value={dashboardTotals.variableBudgetTotal > 0
              ? formatCurrency(dashboardTotals.variableBudgetTotal)
              : '未設定'}
          />
          <ProgressMetric label="実績合計" value={formatCurrency(dashboardTotals.variableCostTotal)} />
          <ProgressMetric
            label="残り合計"
            value={dashboardTotals.variableBudgetTotal > 0
              ? formatCurrency(dashboardTotals.variableRemainingTotal)
              : '算出不可'}
            negative={dashboardTotals.variableBudgetTotal > 0 && dashboardTotals.variableRemainingTotal < 0}
          />
          <ProgressMetric
            label="使用率"
            value={dashboardTotals.variableBudgetTotal > 0
              ? `${dashboardTotals.variableUsageRate}%`
              : '算出不可'}
          />
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <BudgetProgressCard
            title="固定費予算"
            englishLabel="FIXED BUDGET PROGRESS"
            budgetTotal={dashboardTotals.fixedBudgetTotal}
            actualTotal={dashboardTotals.fixedCostTotal}
            remainingTotal={dashboardTotals.fixedRemainingTotal}
            usageRate={dashboardTotals.fixedUsageRate}
          />
          <BudgetProgressCard
            title="変動費予算"
            englishLabel="VARIABLE BUDGET PROGRESS"
            budgetTotal={dashboardTotals.variableBudgetTotal}
            actualTotal={dashboardTotals.variableCostTotal}
            remainingTotal={dashboardTotals.variableRemainingTotal}
            usageRate={dashboardTotals.variableUsageRate}
          />
        </div>
      </section>

      <VariableCostBreakdownCard
        data={data}
        mode={mode}
        selectedGroupId={selectedBreakdownGroupId}
        onSelectGroup={setSelectedBreakdownGroupId}
      />

      <section className="rounded-[5px] border-b border-r border-[#2c2c2c]/30 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-[#f2f2f2] p-3 text-[#2c2c2c]">
            <WalletCards className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-normal">計算に含まれるもの</h2>
            <p className="mt-2 text-sm font-light leading-7 text-[#717182]">
              月額モードの実績は対象月、年額モードの実績は対象年で集計しています。
              年額モードの予算は対象年に登録済みの各月予算を合計し、未登録月は0円として扱います。
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

const chartColors = ['#2c2c2c', '#717182', '#b42318', '#067647', '#175cd3', '#93370d', '#7f56d9', '#c11574'];

function VariableCostBreakdownCard({
  data,
  mode,
  selectedGroupId,
  onSelectGroup,
}: {
  data: BudgetData;
  mode: DashboardMode;
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string | null) => void;
}) {
  const isYearly = mode === 'yearly';
  const categoryById = new Map(data.categories.map((category) => [category.id, category]));
  const groupById = new Map(data.categoryGroups.map((group) => [group.id, group]));
  const breakdown = calculateVariableCostBreakdown({
    mode: isYearly ? 'yearly' : 'monthly',
    targetMonth: data.targetMonth,
    selectedGroupId,
    variableCosts: data.variableCosts,
    categoryGroups: data.categoryGroups,
    categories: data.categories,
  });
  const { total, selectedGroupTotal } = breakdown;
  const items = breakdown.entries.map((entry): BreakdownItem => {
    const category = entry.kind === 'category' ? categoryById.get(entry.sourceId) : undefined;
    const group = entry.kind === 'group' ? groupById.get(entry.sourceId) : undefined;
    return {
      id: entry.sourceId || 'uncategorized',
      name: category?.name
        ?? group?.name
        ?? (entry.kind === 'deleted-group' ? '削除済みカテゴリ' : '未分類'),
      amount: entry.amount,
      rate: entry.rate,
      color: category?.color ?? group?.color ?? chartColors[entry.order % chartColors.length],
    };
  });
  const selectedGroupName = selectedGroupId ? groupById.get(selectedGroupId)?.name ?? '削除済みカテゴリ' : '';
  const title = selectedGroupId ? `${selectedGroupName}の内訳` : '変動費の内訳';

  return (
    <section className="rounded-[5px] border-b border-r border-[#2c2c2c]/30 p-6 sm:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-['Khand',sans-serif] text-sm tracking-[0.22em] text-[#717182]">
            VARIABLE BREAKDOWN
          </p>
          <h2 className="mt-1 text-xl font-light text-[#0a0a0a]">{title}</h2>
        </div>
        {selectedGroupId && (
          <button
            type="button"
            onClick={() => onSelectGroup(null)}
            className="min-h-11 rounded-[5px] border border-[#2c2c2c]/30 px-4 text-sm text-[#2c2c2c] hover:bg-[#f7f7f7]"
          >
            ＜ 変動費全体へ戻る
          </button>
        )}
      </div>

      {total <= 0 || items.length === 0 ? (
        <div className="rounded-[5px] border border-dashed border-[#717182]/40 px-5 py-10 text-center text-sm font-light text-[#717182]">
          対象期間の変動費実績がないため、内訳グラフは表示していません。
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(220px,320px)_1fr]">
          <div className="h-64 w-full" aria-label={`${title}のドーナツグラフ`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={items}
                  dataKey="amount"
                  nameKey="name"
                  innerRadius="58%"
                  outerRadius="86%"
                  paddingAngle={2}
                  onClick={(entry) => {
                    const item = entry as BreakdownItem;
                    if (!selectedGroupId && item.id !== 'uncategorized') onSelectGroup(item.id);
                  }}
                >
                  {items.map((item) => (
                    <Cell key={item.id} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="mb-4 text-sm font-light text-[#717182]">
              合計：{formatCurrency(selectedGroupId ? selectedGroupTotal : total)}
            </p>
            <div className="space-y-2">
              {items.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    if (!selectedGroupId && item.id !== 'uncategorized') onSelectGroup(item.id);
                  }}
                  disabled={selectedGroupId !== null || item.id === 'uncategorized'}
                  className="grid min-h-12 w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[5px] px-2 py-2 text-left hover:bg-[#f7f7f7] disabled:hover:bg-transparent"
                >
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 truncate text-sm text-[#0a0a0a]">{item.name}</span>
                  <span className="text-right text-sm font-light text-[#717182]">
                    {formatCurrency(item.amount)} / {item.rate.toFixed(1)}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
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
    <div
      className={`${heightClass} overflow-hidden rounded-full bg-[#f2f2f2]`}
      role="progressbar"
      aria-label="使用率"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progressWidth}
      aria-valuetext={`${usageRate}%${overBudget ? '、予算オーバー' : ''}`}
    >
      <div
        className={`h-full rounded-full transition-[width] ${
          overBudget ? 'bg-[#b42318]' : 'bg-[#2c2c2c]'
        }`}
        style={{ width: `${progressWidth}%` }}
      />
    </div>
  );
}

function BudgetProgressCard({
  title,
  englishLabel,
  budgetTotal,
  actualTotal,
  remainingTotal,
  usageRate,
}: {
  title: string;
  englishLabel: string;
  budgetTotal: number;
  actualTotal: number;
  remainingTotal: number;
  usageRate: number;
}) {
  const unsetBudget = budgetTotal <= 0;
  const overBudget = !unsetBudget && usageRate > 100;
  const overAmount = actualTotal - budgetTotal;

  return (
    <article className="rounded-[5px] border-b border-r border-[#2c2c2c]/30 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-['Khand',sans-serif] text-sm tracking-[0.18em] text-[#717182]">
            {englishLabel}
          </p>
          <h3 className="mt-1 text-lg font-light text-[#0a0a0a]">{title}の使用率</h3>
        </div>
        <div className="flex items-center gap-3">
          {unsetBudget ? (
            <span className="rounded-[5px] bg-[#f2f2f2] px-3 py-1 text-sm text-[#717182]">
              予算未設定
            </span>
          ) : overBudget && (
            <span className="rounded-[5px] bg-[#fef3f2] px-3 py-1 text-sm text-[#b42318]">
              予算オーバー
            </span>
          )}
          <strong className={`font-['Khand',sans-serif] font-medium ${
            unsetBudget ? 'text-xl' : 'text-3xl'
          } ${
            overBudget ? 'text-[#b42318]' : 'text-[#0a0a0a]'
          }`}
          >
            {unsetBudget ? '算出不可' : `${usageRate}%`}
          </strong>
        </div>
      </div>
      {!unsetBudget && (
        <div className="mt-5 max-w-3xl">
          <ProgressBar usageRate={usageRate} heightClass="h-3" />
        </div>
      )}
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <ComparisonValue label="予算" value={unsetBudget ? '未設定' : budgetTotal} />
        <ComparisonValue label="実績" value={actualTotal} />
        <ComparisonValue
          label="残り"
          value={unsetBudget ? '算出不可' : remainingTotal}
          negative={!unsetBudget && remainingTotal < 0}
        />
      </div>
      {unsetBudget && (
        <p className="mt-3 text-sm font-light leading-6 text-[#717182]">
          月間予算を登録すると残額と使用率を確認できます。
        </p>
      )}
      {overBudget && (
        <p className="mt-3 text-sm text-[#b42318]">
          超過額：{formatCurrency(overAmount)}
        </p>
      )}
    </article>
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
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    setEditingItem(null);
  }, [data.targetMonth]);

  const changeSection = (nextSection: BudgetSection) => {
    setSection(nextSection);
    setEditingItem(null);
    setMessage(null);
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
            message={message}
            setMessage={setMessage}
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
  message,
  setMessage,
}: {
  section: Exclude<BudgetSection, 'saving'>;
  data: BudgetData;
  editingItem: EditableItem | null;
  setEditingItem: (item: EditableItem | null) => void;
  message: Message | null;
  setMessage: (message: Message | null) => void;
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
    if (section === 'categoryGroup') return data.categoryGroups;
    if (section === 'category') return data.categories;
    if (section === 'monthlyBudget') return data.monthlyBudgets;
    if (section === 'annualIncome') return data.annualIncomes;
    return data.annualCosts;
  }, [
    data.annualCosts,
    data.annualIncomes,
    data.categoryGroups,
    data.categories,
    data.fixedCosts,
    data.incomes,
    data.monthlyBudgets,
    data.targetMonth,
    data.variableCosts,
    section,
  ]);

  const removeItem = (item: EditableItem) => {
    const itemName = 'name' in item ? item.name : data.categories.find((category) => (
      'categoryId' in item && category.id === item.categoryId
    ))?.name ?? ('yearMonth' in item ? `${formatMonth(item.yearMonth)}の予算` : '未分類');
    if (!window.confirm(`「${itemName}」を削除しますか？`)) return;
    if (section === 'income' && 'id' in item) {
      data.setIncomes((current) => current.filter((x) => x.id !== item.id));
    }
    if (section === 'fixed' && 'id' in item) {
      data.setFixedCosts((current) => current.filter((x) => x.id !== item.id));
    }
    if (section === 'variableCost' && 'id' in item) {
      data.setVariableCosts((current) => current.filter((x) => x.id !== item.id));
    }
    if (section === 'categoryGroup' && 'id' in item) {
      const childCategories = data.categories.some((category) => category.groupId === item.id);
      const usedByCost = data.variableCosts.some((cost) => cost.categoryGroupId === item.id);
      if (childCategories || usedByCost) {
        setMessage({
          type: 'error',
          text: childCategories
            ? '配下カテゴリがあるグループカテゴリは削除できません。'
            : '実績データから参照されているグループカテゴリは削除できません。',
        });
        return;
      }
      data.setCategoryGroups((current) => current.filter((x) => x.id !== item.id));
    }
    if (section === 'category' && 'id' in item) {
      const usedByCost = data.variableCosts.some((cost) => cost.categoryId === item.id);
      if (usedByCost) {
        setMessage({ type: 'error', text: '使用中のカテゴリは削除できません。' });
        return;
      }
      data.setCategories((current) => current.filter((x) => x.id !== item.id));
    }
    if (section === 'monthlyBudget' && 'yearMonth' in item) {
      data.setMonthlyBudgets((current) => current.filter((x) => x.yearMonth !== item.yearMonth));
    }
    if (section === 'annualIncome' && 'id' in item) {
      data.setAnnualIncomes((current) => current.filter((x) => x.id !== item.id));
    }
    if (section === 'annual' && 'id' in item) {
      data.setAnnualCosts((current) => current.filter((x) => x.id !== item.id));
    }
    if (
      editingItem
      && (('id' in editingItem && 'id' in item && editingItem.id === item.id)
        || ('yearMonth' in editingItem && 'yearMonth' in item && editingItem.yearMonth === item.yearMonth))
    ) {
      setEditingItem(null);
    }
    setMessage({ type: 'success', text: '削除しました。' });
  };

  return (
    <div className="space-y-10">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(300px,390px)_1fr]">
        <ItemForm
          key={
            editingItem && 'id' in editingItem
              ? editingItem.id
              : editingItem && 'yearMonth' in editingItem
                ? editingItem.yearMonth
                : `new-${data.targetMonth}`
          }
          section={section}
          data={data}
          editingItem={editingItem}
          onFinish={(nextMessage) => {
            setEditingItem(null);
            setMessage(nextMessage ?? null);
          }}
        />

        <section>
        {message && (
          <p
            role={message.type === 'error' ? 'alert' : 'status'}
            className={`mb-4 rounded-[5px] px-4 py-3 text-sm ${
              message.type === 'error'
                ? 'bg-[#fef3f2] text-[#b42318]'
                : 'bg-[#ecfdf3] text-[#067647]'
            }`}
          >
            {message.text}
          </p>
        )}
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
                key={'id' in item ? item.id : item.yearMonth}
                item={item}
                categoryName={
                  'categoryId' in item
                    ? data.categories.find(
                        (category) => category.id === item.categoryId,
                      )?.name
                    : undefined
                }
                groupName={
                  'groupId' in item
                    ? data.categoryGroups.find((group) => group.id === item.groupId)?.name
                    : 'categoryGroupId' in item
                      ? data.categoryGroups.find((group) => group.id === item.categoryGroupId)?.name
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
    </div>
  );
}

function ComparisonValue({
  label,
  value,
  negative = false,
}: {
  label: string;
  value: number | string;
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
        {typeof value === 'number' ? formatCurrency(value) : value}
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
  onFinish: (message?: Message) => void;
}) {
  const initialAmount = editingItem && section !== 'category' && section !== 'categoryGroup' && section !== 'monthlyBudget'
    ? 'budgetAmount' in editingItem
      ? editingItem.budgetAmount
      : 'amount' in editingItem
        ? editingItem.amount
        : ''
    : '';
  const editingId = editingItem && 'id' in editingItem ? editingItem.id : undefined;
  const [name, setName] = useState(editingItem && 'name' in editingItem ? editingItem.name : '');
  const [amount, setAmount] = useState(formatAmountInput(initialAmount));
  const [memo, setMemo] = useState(editingItem && 'memo' in editingItem ? editingItem.memo ?? '' : '');
  const [color, setColor] = useState(
    editingItem && 'color' in editingItem && editingItem.color ? editingItem.color : '#717182',
  );
  const [icon, setIcon] = useState(
    editingItem && 'icon' in editingItem && editingItem.icon ? editingItem.icon : '',
  );
  const [month, setMonth] = useState(
    editingItem && 'month' in editingItem && typeof editingItem.month === 'string'
      ? editingItem.month
      : editingItem && 'yearMonth' in editingItem
        ? `${editingItem.yearMonth}-01`
      : getInitialDate(data.targetMonth, data.currentMonth),
  );
  const [categoryGroupId, setCategoryGroupId] = useState(
    editingItem
      && 'groupId' in editingItem
      && data.categoryGroups.some((group) => group.id === editingItem.groupId)
      ? editingItem.groupId
      : editingItem
        && 'categoryGroupId' in editingItem
        && editingItem.categoryGroupId
        && data.categoryGroups.some((group) => group.id === editingItem.categoryGroupId)
        ? editingItem.categoryGroupId
        : '',
  );
  const [categoryId, setCategoryId] = useState(
    editingItem
      && 'categoryId' in editingItem
      && editingItem.categoryId
      && data.categories.some((category) => category.id === editingItem.categoryId)
      ? editingItem.categoryId
      : '',
  );
  const [fixedBudgetAmount, setFixedBudgetAmount] = useState(
    editingItem && 'fixedExpenseBudget' in editingItem
      ? formatAmountInput(editingItem.fixedExpenseBudget)
      : '',
  );
  const [variableBudgetAmount, setVariableBudgetAmount] = useState(
    editingItem && 'variableExpenseBudget' in editingItem
      ? formatAmountInput(editingItem.variableExpenseBudget)
      : '',
  );
  const [error, setError] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const parsedAmount = parseAmountInput(amount);
    const parsedFixedBudget = parseAmountInput(fixedBudgetAmount);
    const parsedVariableBudget = parseAmountInput(variableBudgetAmount);
    if (section !== 'monthlyBudget' && !name.trim()) {
      setError('名称を入力してください。');
      return;
    }
    if (section === 'category' && !categoryGroupId) {
      setError('グループカテゴリを選択してください。');
      return;
    }
    if (section === 'variableCost' && categoryGroupId && !categoryId) {
      setError('カテゴリを選択するか、グループカテゴリを未選択にしてください。');
      return;
    }
    if (
      section !== 'category'
      && section !== 'categoryGroup'
      && section !== 'monthlyBudget'
      && (!Number.isFinite(parsedAmount) || parsedAmount <= 0)
    ) {
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
          category.id !== editingId
          && category.groupId === categoryGroupId
          && category.name.trim().toLowerCase() === name.trim().toLowerCase(),
      );
      if (duplicate) {
        setError('同じグループ内に同じ名前のカテゴリは登録できません。');
        return;
      }
    }
    if (section === 'categoryGroup') {
      const duplicate = data.categoryGroups.some(
        (group) =>
          group.id !== editingId
          && group.name.trim().toLowerCase() === name.trim().toLowerCase(),
      );
      if (duplicate) {
        setError('同じ名前のグループカテゴリは登録できません。');
        return;
      }
    }
    if (section === 'monthlyBudget') {
      const yearMonth = month.slice(0, 7);
      const editingYearMonth = editingItem && 'yearMonth' in editingItem
        ? editingItem.yearMonth
        : '';
      const duplicate = data.monthlyBudgets.some(
        (budget) => budget.yearMonth !== editingYearMonth
          && budget.yearMonth === yearMonth,
      );
      if (duplicate) {
        const [year, monthNumber] = yearMonth.split('-');
        setError(`${year}年${Number(monthNumber)}月の月間予算はすでに登録されています。`);
        return;
      }
      if (
        !Number.isFinite(parsedFixedBudget)
        || !Number.isFinite(parsedVariableBudget)
        || parsedFixedBudget < 0
        || parsedVariableBudget < 0
      ) {
        setError('予算金額は0円以上で入力してください。');
        return;
      }
    }

    const now = new Date().toISOString();
    const base = {
      id: editingItem && 'id' in editingItem ? editingItem.id : createId(),
      memo: memo.trim() || undefined,
      createdAt: editingItem && 'createdAt' in editingItem ? editingItem.createdAt : now,
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
        upsert(current, {
          ...base,
          name: name.trim(),
          amount: parsedAmount,
          month,
          categoryGroupId: categoryGroupId || undefined,
          categoryId: categoryId || undefined,
        }),
      );
    } else if (section === 'categoryGroup') {
      data.setCategoryGroups((current) =>
        upsert(current, {
          ...base,
          name: name.trim(),
          color,
          icon: icon.trim() || undefined,
        }),
      );
    } else if (section === 'category') {
      data.setCategories((current) =>
        upsert(current, {
          ...base,
          groupId: categoryGroupId,
          name: name.trim(),
          color,
          icon: icon.trim() || undefined,
        }),
      );
    } else if (section === 'monthlyBudget') {
      const yearMonth = month.slice(0, 7);
      data.setMonthlyBudgets((current) => {
        const editingYearMonth = editingItem && 'yearMonth' in editingItem
          ? editingItem.yearMonth
          : '';
        const nextBudget = {
          yearMonth,
          fixedExpenseBudget: parsedFixedBudget,
          variableExpenseBudget: parsedVariableBudget,
          createdAt: editingItem && 'createdAt' in editingItem ? editingItem.createdAt : now,
          updatedAt: now,
        };
        const withoutEditedBudget = editingYearMonth
          ? current.filter((item) => item.yearMonth !== editingYearMonth)
          : current;
        return [nextBudget, ...withoutEditedBudget];
      });
    } else if (section === 'annualIncome') {
      data.setAnnualIncomes((current) => upsert(current, { ...base, name: name.trim(), amount: parsedAmount }));
    } else {
      data.setAnnualCosts((current) => upsert(current, { ...base, name: name.trim(), amount: parsedAmount }));
    }

    setName('');
    setAmount('');
    setMemo('');
    setColor('#717182');
    setIcon('');
    setMonth(getInitialDate(data.targetMonth, data.currentMonth));
    setCategoryGroupId('');
    setCategoryId('');
    setFixedBudgetAmount('');
    setVariableBudgetAmount('');
    setError('');
    onFinish({
      type: 'success',
      text: section === 'monthlyBudget'
        ? `月間予算を${editingItem ? '更新' : '登録'}しました。ホームの「予算の進捗」に反映されます。`
        : '保存しました。',
    });
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
          {section === 'monthlyBudget' && (
            <p className="mt-2 text-sm font-light leading-6 text-[#717182]">
              月ごとの固定費・変動費の支出上限を設定します。<br />
              登録した金額は、ホームの「予算の進捗」に反映されます。
            </p>
          )}
        </div>
        {editingItem && (
          <button
            type="button"
            onClick={() => onFinish()}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-[5px] text-[#717182] hover:bg-[#f2f2f2]"
            aria-label="編集をキャンセル"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      <form className="space-y-5" onSubmit={submit}>
        {section !== 'monthlyBudget' && (
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

        {section === 'monthlyBudget' && (
          <div className="min-w-0 max-w-full">
            <span className="mb-2 block text-sm font-light text-[#364153]">対象年月</span>
            <MonthPicker
              value={month.slice(0, 7)}
              onChange={(yearMonth) => setMonth(`${yearMonth}-01`)}
              mode="monthly"
              variant="field"
              ariaLabel="月間予算の対象年月を選択"
            />
          </div>
        )}

        {section === 'monthlyBudget' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="固定費予算">
              <AmountInput value={fixedBudgetAmount} onChange={setFixedBudgetAmount} />
            </FormField>
            <FormField label="変動費予算">
              <AmountInput value={variableBudgetAmount} onChange={setVariableBudgetAmount} />
            </FormField>
          </div>
        )}

        {section !== 'category' && section !== 'categoryGroup' && section !== 'monthlyBudget' && (
          <FormField
            label={
              section === 'annual' || section === 'annualIncome'
                  ? '年間金額'
                  : '金額'
            }
          >
            <AmountInput value={amount} onChange={setAmount} />
          </FormField>
        )}

        {(section === 'category' || section === 'variableCost') && (
          <FormField label={section === 'category' ? 'グループカテゴリ' : 'グループカテゴリ（任意）'}>
            <select
              value={categoryGroupId}
              onChange={(event) => {
                setCategoryGroupId(event.target.value);
                setCategoryId('');
              }}
              className={inputClass}
            >
              <option value="">{section === 'category' ? 'グループカテゴリを選択' : '未分類'}</option>
              {data.categoryGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </FormField>
        )}

        {(section === 'categoryGroup' || section === 'category') && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="色">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  className="h-12 w-14 rounded-[5px] border border-[#717182]/45 bg-white p-1"
                  aria-label="色を選択"
                />
                <input
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  className={inputClass}
                  placeholder="#717182"
                />
              </div>
            </FormField>
            <FormField label="アイコン（任意）">
              <input
                value={icon}
                onChange={(event) => setIcon(event.target.value)}
                className={inputClass}
                placeholder="例：food"
                autoComplete="off"
              />
            </FormField>
          </div>
        )}

        {section === 'variableCost' && (
          <FormField label="カテゴリ（任意）">
            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className={inputClass}
              disabled={!categoryGroupId}
            >
              <option value="">{categoryGroupId ? '未分類' : 'グループカテゴリを先に選択'}</option>
              {data.categories.filter((category) => category.groupId === categoryGroupId).map((category) => (
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

        {section !== 'categoryGroup' && section !== 'monthlyBudget' && (
          <FormField label="メモ（任意）">
            <textarea
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
              className={`${inputClass} min-h-24 resize-y`}
              placeholder="補足があれば入力"
            />
          </FormField>
        )}

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
  groupName,
  onEdit,
  onDelete,
}: {
  item: EditableItem;
  categoryName?: string;
  groupName?: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const amount = 'budgetAmount' in item ? item.budgetAmount : 'amount' in item ? item.amount : null;
  const itemName = 'name' in item
    ? item.name
    : 'yearMonth' in item
      ? `${formatMonth(item.yearMonth)}の予算`
      : categoryName ?? '未分類';

  return (
    <article className="rounded-[5px] border-b border-r border-[#2c2c2c]/25 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-normal text-[#0a0a0a]">{itemName}</h3>
          {'month' in item && typeof item.month === 'string' && (
            <p className="mt-1 font-['Khand',sans-serif] text-sm text-[#717182]">
              {formatDate(item.month)}
            </p>
          )}
          {'categoryId' in item && (
            <p className="mt-1 text-sm font-light text-[#717182]">
              カテゴリ：{groupName ? `${groupName} / ` : ''}{categoryName ?? '未分類'}
            </p>
          )}
          {'groupId' in item && (
            <p className="mt-1 text-sm font-light text-[#717182]">
              グループ：{groupName ?? '未分類'}
            </p>
          )}
          {'yearMonth' in item && (
            <p className="mt-1 text-sm font-light text-[#717182]">
              固定費予算：{formatCurrency(item.fixedExpenseBudget)} / 変動費予算：{formatCurrency(item.variableExpenseBudget)}
            </p>
          )}
        </div>
        {amount !== null && (
          <strong className="shrink-0 font-['Saira_Semi_Condensed','Khand',sans-serif] text-xl font-medium">
            {formatCurrency(amount)}
          </strong>
        )}
      </div>
      {'memo' in item && item.memo && (
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
    categoryGroups: data.categoryGroups,
    categories: data.categories,
    variableCategoryBudgets: data.variableCategoryBudgets,
    monthlyBudgets: data.monthlyBudgets,
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
    data.setCategoryGroups(backupData.categoryGroups);
    data.setCategories(backupData.categories);
    data.setVariableCategoryBudgets(backupData.variableCategoryBudgets);
    data.setMonthlyBudgets(backupData.monthlyBudgets);
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
      const parsed = parseBackupJson(await file.text());
      if (!parsed.ok) {
        if (parsed.reason === 'invalid-json') throw new Error('invalid-json');
        setMessage({ type: 'error', text: 'このファイルは家計簿アプリ用のバックアップデータではありません。' });
        return;
      }
      const backup = parsed.backup;

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

function AmountInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#717182]">
        ¥
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(sanitizeAmountInput(event.target.value))}
        onFocus={() => onChange(sanitizeAmountInput(value))}
        onBlur={() => onChange(formatAmountInput(value))}
        className={`${inputClass} pl-9 text-right font-['Khand',sans-serif] text-lg`}
        placeholder="0"
      />
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
  if (section === 'categoryGroup') return 'グループカテゴリ名';
  if (section === 'category') return 'カテゴリ名';
  if (section === 'monthlyBudget') return '対象年月';
  if (section === 'annualIncome') return '年間収入名';
  return '項目名';
}

function namePlaceholder(section: Exclude<BudgetSection, 'saving'>) {
  if (section === 'income') return '例：給与';
  if (section === 'fixed') return '例：家賃';
  if (section === 'variableCost') return '例：ランチ';
  if (section === 'categoryGroup') return '例：生活費';
  if (section === 'category') return '例：食費';
  if (section === 'monthlyBudget') return '';
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
