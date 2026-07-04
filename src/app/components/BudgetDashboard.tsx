import { useState } from 'react';
import { Edit2 } from 'lucide-react';
import BudgetSummaryCard from './BudgetSummaryCard';
import ExpenseBreakdownChart from './ExpenseBreakdownChart';
import CategoryBreakdownChart from './CategoryBreakdownChart';

type ViewMode = 'monthly' | 'yearly';

interface BudgetDashboardProps {
  viewMode: ViewMode;
}

export default function BudgetDashboard({ viewMode }: BudgetDashboardProps) {
  const [savingsGoal, setSavingsGoal] = useState(50000);
  const [editingSavingsGoal, setEditingSavingsGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(savingsGoal.toString());

  // Mock data - これは後で実際のデータ管理に置き換えます
  const monthlyData = {
    income: 300000,
    fixedCosts: 120000,
    variableCosts: 80000,
    savingsGoal: savingsGoal,
    availableFreeFunds: 100000,
    availableWithGoal: 50000,
    fixedCostBreakdown: [
      { name: '家賃', amount: 70000, percentage: 58.3, color: '#A8A8A8' },
      { name: '電気代', amount: 8000, percentage: 6.7, color: '#D4D4D4' },
      { name: 'ガス代', amount: 5000, percentage: 4.2, color: '#6B6B6B' },
      { name: 'サブスク', amount: 37000, percentage: 30.8, color: '#1E1E1E' },
    ],
    variableCostBreakdown: [
      { name: '日用品全般', amount: 30000, percentage: 37.5, color: '#A8A8A8' },
      { name: '飲食、ファッション、交通費など', amount: 25000, percentage: 31.3, color: '#D4D4D4' },
      { name: '推し課金', amount: 20000, percentage: 25.0, color: '#6B6B6B' },
      { name: '行事、突発イベント', amount: 5000, percentage: 6.3, color: '#1E1E1E' },
    ],
  };

  const yearlyData = {
    income: 3600000,
    fixedCosts: 1440000,
    variableCosts: 960000,
    savingsGoal: savingsGoal * 12,
    availableFreeFunds: 1200000,
    availableWithGoal: 600000,
  };

  const data = viewMode === 'monthly' ? monthlyData : yearlyData;

  const possibleSavings = data.income - data.fixedCosts - data.variableCosts;

  const handleSavingsGoalUpdate = () => {
    const newGoal = parseInt(tempGoal);
    if (!isNaN(newGoal) && newGoal >= 0) {
      setSavingsGoal(newGoal);
      setEditingSavingsGoal(false);
    }
  };

  return (
    <div className="flex flex-col gap-12">
      {/* Free Funds Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        {/* Available Free Funds */}
        <div className="bg-white rounded-md border-r border-b border-[#2c2c2c]/30 p-6 md:p-8">
          <h3 className="font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#0a0a0a] text-lg md:text-xl mb-4">
            {viewMode === 'monthly' ? '今月' : '今年'}使える自由費　のこり
          </h3>
          <p className="font-['Khand:Regular',sans-serif] text-[#0a0a0a] text-4xl md:text-6xl text-right">
            ¥{data.availableFreeFunds.toLocaleString()}
          </p>
        </div>

        {/* Available with Goal */}
        <div className="bg-[#2c2c2c] rounded-md p-6 md:p-8">
          <h3 className="font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-white text-lg md:text-xl mb-4">
            目標貯金額でみた場合の使える自由費　のこり
          </h3>
          <p className="font-['Khand:Regular',sans-serif] text-white text-4xl md:text-6xl text-right">
            ¥{data.availableWithGoal.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-12">
        <BudgetSummaryCard
          label={viewMode === 'monthly' ? '収入' : '年間収入'}
          amount={data.income}
        />
        <BudgetSummaryCard
          label={viewMode === 'monthly' ? '固定費合計' : '年間固定費'}
          amount={data.fixedCosts}
        />
        <BudgetSummaryCard
          label={viewMode === 'monthly' ? '変動費合計' : '年間変動費'}
          amount={data.variableCosts}
        />
        <div className="bg-white rounded-md border-r border-b border-[#2c2c2c]/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#717182] text-lg">
              {viewMode === 'monthly' ? '目標貯金額' : '年間貯金目標'}
            </h3>
            {!editingSavingsGoal && (
              <button
                onClick={() => {
                  setEditingSavingsGoal(true);
                  setTempGoal(savingsGoal.toString());
                }}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                aria-label="目標貯金額を編集"
              >
                <Edit2 className="w-5 h-5 text-[#1e1e1e]" />
              </button>
            )}
          </div>
          {editingSavingsGoal ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={tempGoal}
                onChange={(e) => setTempGoal(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-2xl font-['Khand:Regular',sans-serif]"
                autoFocus
              />
              <button
                onClick={handleSavingsGoalUpdate}
                className="px-4 py-2 bg-[#2c2c2c] text-white rounded hover:bg-[#1e1e1e] transition-colors"
              >
                保存
              </button>
            </div>
          ) : (
            <p className="font-['Khand:Regular',sans-serif] text-[#0a0a0a] text-3xl text-right">
              ¥{(viewMode === 'monthly' ? savingsGoal : savingsGoal * 12).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Monthly View - Detailed Breakdowns */}
      {viewMode === 'monthly' && (
        <div className="flex flex-col gap-6">
          {/* Expense Breakdown */}
          <ExpenseBreakdownChart
            data={[
              { name: '固定費', amount: data.fixedCosts, percentage: 40.0, color: '#A8A8A8' },
              { name: '変動費', amount: data.variableCosts, percentage: 26.7, color: '#D4D4D4' },
              { name: '貯金可能額', amount: possibleSavings, percentage: 33.3, color: '#6B6B6B' },
            ]}
          />

          {/* Fixed Costs Breakdown */}
          <CategoryBreakdownChart
            title="固定費"
            data={monthlyData.fixedCostBreakdown}
          />

          {/* Variable Costs Breakdown */}
          <CategoryBreakdownChart
            title="変動費"
            data={monthlyData.variableCostBreakdown}
          />
        </div>
      )}
    </div>
  );
}
