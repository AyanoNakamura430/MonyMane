import { useState } from 'react';

type ViewMode = 'monthly' | 'yearly';
type ListTab = 'income' | 'fixed' | 'variable';

interface ExpenseListViewProps {
  viewMode: ViewMode;
}

interface ExpenseRow {
  id: string;
  date: string;
  category: string;
  estimated: number;
  actual: number;
  remark: string;
}

const VARIABLE_CATEGORIES = ['推し課金', '食費', '日用品', '交通費', '趣味', 'その他'];
const FIXED_CATEGORIES = ['家賃', '電気代', 'ガス代', '水道代', '通信費', 'サブスク', '保険', 'その他'];
const INCOME_CATEGORIES = ['給与', 'ボーナス', '副業', 'その他'];

const formatAmount = (n: number) => `¥${n.toLocaleString()}`;

export default function ExpenseListView({ viewMode }: ExpenseListViewProps) {
  const [activeTab, setActiveTab] = useState<ListTab>('fixed');
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<{ rowId: string; field: string } | null>(null);
  const [rows, setRows] = useState<ExpenseRow[]>([
    { id: '1', date: '2026/05/17', category: '推し課金', estimated: 100000, actual: 100000, remark: 'グッズ代' },
    { id: '2', date: '2026/05/17', category: '推し課金', estimated: 100000, actual: 100000, remark: 'グッズ代' },
    { id: '3', date: '2026/05/17', category: '推し課金', estimated: 100000, actual: 100000, remark: 'グッズ代' },
    { id: '4', date: '2026/05/17', category: '推し課金', estimated: 100000, actual: 100000, remark: 'グッズ代' },
    { id: '5', date: '2026/05/18', category: '推し課金', estimated: 10000, actual: 10000, remark: 'その他' },
    { id: '6', date: '2026/05/18', category: '推し課金', estimated: 10000, actual: 10000, remark: 'その他' },
  ]);

  const handleCardClick = (rowId: string) => {
    setEditingCard(rowId === editingCard ? null : rowId);
  };

  const handleRowChange = (rowId: string, field: keyof ExpenseRow, value: string) => {
    setRows(rows.map(row => {
      if (row.id !== rowId) return row;
      return {
        ...row,
        [field]: field === 'estimated' || field === 'actual' ? Number(value) || 0 : value,
      };
    }));
  };

  const handleCellClick = (rowId: string, field: string) => {
    setEditingCell({ rowId, field });
  };

  const handleCellChange = (rowId: string, field: string, value: string) => {
    handleRowChange(rowId, field as keyof ExpenseRow, value);
  };

  const handleCellBlur = () => {
    setEditingCell(null);
  };

  const getCategoriesForTab = () => {
    switch (activeTab) {
      case 'income': return INCOME_CATEGORIES;
      case 'fixed': return FIXED_CATEGORIES;
      case 'variable': return VARIABLE_CATEGORIES;
      default: return [];
    }
  };

  const tabLabel = (tab: ListTab) => ({ income: '収入', fixed: '固定費', variable: '変動費' }[tab]);

  return (
    <div className="flex flex-col gap-0">
      {/* Tabs */}
      <div className="flex border-b border-gray-300">
        {(['income', 'fixed', 'variable'] as ListTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 text-center transition-colors font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-base ${
              activeTab === tab
                ? 'border-b-2 border-[#2c2c2c] text-[#0a0a0a]'
                : 'text-[#717182]'
            }`}
            style={{ fontVariationSettings: "'wght' 300" }}
          >
            {tabLabel(tab)}
          </button>
        ))}
      </div>

      {/* Mobile card layout */}
      <div className="flex flex-col gap-[15px] pt-[15px] md:hidden">
        {rows.map((row) => {
          const isEditing = editingCard === row.id;
          return (
            <div
              key={row.id}
              onClick={() => !isEditing && handleCardClick(row.id)}
              className={`bg-white flex flex-col gap-[5px] px-[25px] py-[20px] rounded-[5px] cursor-pointer relative ${
                isEditing ? 'cursor-default' : ''
              }`}
              style={{
                borderRight: '1.253px solid rgba(44,44,44,0.3)',
                borderBottom: '1.253px solid rgba(44,44,44,0.3)',
              }}
            >
              {/* Top row: date + category */}
              <div className="flex gap-[20px] items-center w-full">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={row.date}
                      onChange={(e) => handleRowChange(row.id, 'date', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-[90px] font-['Khand:Regular',sans-serif] text-[#0a0a0a] text-[14px] leading-[28px] border-b border-gray-300 outline-none bg-transparent"
                    />
                    <select
                      value={row.category}
                      onChange={(e) => handleRowChange(row.id, 'category', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#0a0a0a] text-[14px] leading-[28px] border-b border-gray-300 outline-none bg-transparent cursor-pointer"
                      style={{ fontVariationSettings: "'wght' 300" }}
                    >
                      {getCategoriesForTab().map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <span className="font-['Khand:Regular',sans-serif] text-[#0a0a0a] text-[14px] leading-[28px] w-[80px] shrink-0">
                      {row.date}
                    </span>
                    <span
                      className="font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#0a0a0a] text-[14px] leading-[28px]"
                      style={{ fontVariationSettings: "'wght' 300" }}
                    >
                      {row.category}
                    </span>
                  </>
                )}
              </div>

              {/* Amount group */}
              <div className="flex flex-col gap-[5px] w-full text-[#0a0a0a]">
                {/* 見積 row */}
                <div className="flex gap-[10px] items-center w-full">
                  <span
                    className="flex-1 font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[14px] leading-[28px]"
                    style={{ fontVariationSettings: "'wght' 300" }}
                  >
                    見積
                  </span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={row.estimated}
                      onChange={(e) => handleRowChange(row.id, 'estimated', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="font-['Khand:Regular',sans-serif] text-[24px] leading-[40px] text-right border-b border-gray-300 outline-none bg-transparent w-[130px]"
                    />
                  ) : (
                    <span className="font-['Khand:Regular',sans-serif] text-[24px] leading-[40px] text-right shrink-0 whitespace-nowrap">
                      {formatAmount(row.estimated)}
                    </span>
                  )}
                </div>

                {/* 実績 row */}
                <div className="flex gap-[10px] items-center w-full">
                  <span
                    className="flex-1 font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[14px] leading-[28px]"
                    style={{ fontVariationSettings: "'wght' 300" }}
                  >
                    実績
                  </span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={row.actual}
                      onChange={(e) => handleRowChange(row.id, 'actual', e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="font-['Khand:Regular',sans-serif] text-[24px] leading-[40px] text-right border-b border-gray-300 outline-none bg-transparent w-[130px]"
                    />
                  ) : (
                    <span className="font-['Khand:Regular',sans-serif] text-[24px] leading-[40px] text-right shrink-0 whitespace-nowrap">
                      {formatAmount(row.actual)}
                    </span>
                  )}
                </div>
              </div>

              {/* Remark row with top separator */}
              <div className="flex items-center py-[8px] w-full relative">
                <div className="absolute inset-0 border-t-[0.5px] border-[#e5e7eb] pointer-events-none" />
                {isEditing ? (
                  <input
                    type="text"
                    value={row.remark}
                    onChange={(e) => handleRowChange(row.id, 'remark', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#0a0a0a] text-[14px] leading-[28px] border-b border-gray-300 outline-none bg-transparent relative z-10"
                    style={{ fontVariationSettings: "'wght' 300" }}
                    placeholder="備考"
                  />
                ) : (
                  <span
                    className="flex-1 font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#0a0a0a] text-[14px] leading-[28px] relative z-10"
                    style={{ fontVariationSettings: "'wght' 300" }}
                  >
                    {row.remark}
                  </span>
                )}
                {isEditing && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingCard(null); }}
                    className="ml-2 px-3 py-1 text-xs bg-[#2c2c2c] text-white rounded relative z-10"
                    style={{ fontVariationSettings: "'wght' 300" }}
                  >
                    完了
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table layout */}
      <div className="hidden md:block overflow-x-auto pt-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="px-4 py-3 text-center font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#717182] text-sm font-light">
                {activeTab === 'income' ? '日付' : '支払日'}
              </th>
              <th className="px-4 py-3 text-center font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#717182] text-sm font-light">
                カテゴリー
              </th>
              <th className="px-4 py-3 text-center font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#717182] text-sm font-light">
                見積
              </th>
              <th className="px-4 py-3 text-center font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#717182] text-sm font-light">
                実績
              </th>
              <th className="px-4 py-3 text-center font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#717182] text-sm font-light">
                備考
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td
                  className="px-4 py-3 font-['Khand:Regular',sans-serif] text-[#717182] text-sm cursor-pointer"
                  onClick={() => handleCellClick(row.id, 'date')}
                >
                  {editingCell?.rowId === row.id && editingCell?.field === 'date' ? (
                    <input
                      type="text"
                      value={row.date}
                      onChange={(e) => handleCellChange(row.id, 'date', e.target.value)}
                      onBlur={handleCellBlur}
                      autoFocus
                      className="w-full border-none outline-none bg-transparent font-['Khand:Regular',sans-serif] text-[#717182] text-sm"
                    />
                  ) : row.date}
                </td>
                <td
                  className="px-4 py-3 font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#717182] text-sm cursor-pointer"
                  onClick={() => handleCellClick(row.id, 'category')}
                >
                  {editingCell?.rowId === row.id && editingCell?.field === 'category' ? (
                    <select
                      value={row.category}
                      onChange={(e) => handleCellChange(row.id, 'category', e.target.value)}
                      onBlur={handleCellBlur}
                      autoFocus
                      className="w-full border-none outline-none bg-transparent font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#717182] text-sm cursor-pointer"
                    >
                      {getCategoriesForTab().map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  ) : row.category}
                </td>
                <td
                  className="px-4 py-3 font-['Khand:Regular',sans-serif] text-[#717182] text-sm text-right cursor-pointer"
                  onClick={() => handleCellClick(row.id, 'estimated')}
                >
                  {editingCell?.rowId === row.id && editingCell?.field === 'estimated' ? (
                    <input
                      type="number"
                      value={row.estimated}
                      onChange={(e) => handleCellChange(row.id, 'estimated', e.target.value)}
                      onBlur={handleCellBlur}
                      autoFocus
                      className="w-full border-none outline-none bg-transparent font-['Khand:Regular',sans-serif] text-[#717182] text-sm text-right"
                    />
                  ) : row.estimated.toLocaleString()}
                </td>
                <td
                  className="px-4 py-3 font-['Khand:Regular',sans-serif] text-[#717182] text-sm text-right cursor-pointer"
                  onClick={() => handleCellClick(row.id, 'actual')}
                >
                  {editingCell?.rowId === row.id && editingCell?.field === 'actual' ? (
                    <input
                      type="number"
                      value={row.actual}
                      onChange={(e) => handleCellChange(row.id, 'actual', e.target.value)}
                      onBlur={handleCellBlur}
                      autoFocus
                      className="w-full border-none outline-none bg-transparent font-['Khand:Regular',sans-serif] text-[#717182] text-sm text-right"
                    />
                  ) : row.actual.toLocaleString()}
                </td>
                <td
                  className="px-4 py-3 font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#717182] text-sm cursor-pointer"
                  onClick={() => handleCellClick(row.id, 'remark')}
                >
                  {editingCell?.rowId === row.id && editingCell?.field === 'remark' ? (
                    <input
                      type="text"
                      value={row.remark}
                      onChange={(e) => handleCellChange(row.id, 'remark', e.target.value)}
                      onBlur={handleCellBlur}
                      autoFocus
                      className="w-full border-none outline-none bg-transparent font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#717182] text-sm"
                    />
                  ) : row.remark}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
