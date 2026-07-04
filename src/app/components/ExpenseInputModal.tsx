import { useState, useRef, useEffect } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ExpenseInputScreenProps {
  onBack: () => void;
}

type InputTab = 'income' | 'fixed' | 'variable';
type PeriodType = 'monthly' | 'yearly';
type DataType = 'estimated' | 'actual';

interface ExpenseEntry {
  id: string;
  label?: string;
  category?: string;
  amount: string;
  remark: string;
}

export default function ExpenseInputScreen({ onBack: _onBack }: ExpenseInputScreenProps) {
  const [activeTab, setActiveTab] = useState<InputTab>('fixed');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const [periodType, setPeriodType] = useState<PeriodType>('monthly');
  const [dataType, setDataType] = useState<DataType>('estimated');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };
    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  const tabLabel = (tab: InputTab) => ({ income: '収入', fixed: '固定費', variable: '変動費' }[tab]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        {(['income', 'fixed', 'variable'] as InputTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 text-center transition-colors font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-base ${
              activeTab === tab
                ? 'border-b-2 border-[#2c2c2c] text-[#0a0a0a]'
                : 'text-[#717182] hover:bg-gray-50'
            }`}
          >
            {tabLabel(tab)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'income' && (
          <IncomeInput
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
            calendarRef={calendarRef}
          />
        )}
        {activeTab === 'fixed' && (
          <FixedCostsInput
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
            calendarRef={calendarRef}
            periodType={periodType}
            setPeriodType={setPeriodType}
            dataType={dataType}
            setDataType={setDataType}
          />
        )}
        {activeTab === 'variable' && (
          <VariableCostsInput
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
            calendarRef={calendarRef}
          />
        )}
      </div>
    </div>
  );
}

function IncomeInput({ selectedDate, setSelectedDate, showCalendar, setShowCalendar, calendarRef }: any) {
  return (
    <div className="space-y-6">
      <DateSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        showCalendar={showCalendar}
        setShowCalendar={setShowCalendar}
        calendarRef={calendarRef}
      />
      <div>
        <label className="block text-sm font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#364153] mb-2">
          月の手取り収入
        </label>
        <input
          type="number"
          placeholder="300000"
          className="w-full border border-[#717182]/50 rounded-md px-4 py-2 font-['Khand:Regular',sans-serif] focus:ring-2 focus:ring-[#2c2c2c] focus:border-transparent"
        />
      </div>
      <button className="w-full bg-[#2c2c2c] text-white py-3 rounded-md hover:bg-[#1e1e1e] transition-colors font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif]">
        保存
      </button>
    </div>
  );
}

function FixedCostsInput({ selectedDate, setSelectedDate, showCalendar, setShowCalendar, calendarRef, periodType, setPeriodType, dataType, setDataType }: any) {
  const [entries] = useState<ExpenseEntry[]>([
    { id: '1', label: '家賃', amount: '', remark: '' },
    { id: '2', label: '電気代', amount: '', remark: '' },
    { id: '3', label: 'サブスク', amount: '', remark: '' },
  ]);

  return (
    <div className="space-y-6">
      {/* Period Type Toggle */}
      <div className="flex items-center gap-6">
        <label className="text-sm font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#364153] w-20">
          月額 or 年額
        </label>
        <div className="flex gap-4">
          {(['monthly', 'yearly'] as PeriodType[]).map((type) => (
            <button
              key={type}
              onClick={() => setPeriodType(type)}
              className={`px-4 py-2 rounded-md text-sm font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] transition-colors ${
                periodType === type
                  ? 'bg-[#2c2c2c] text-white'
                  : 'border border-[#d1d5dc] text-[#364153] hover:bg-gray-50'
              }`}
            >
              {type === 'monthly' ? '月額' : '年額'}
            </button>
          ))}
        </div>
      </div>

      {/* Data Type Toggle */}
      <div className="flex items-center gap-6">
        <label className="text-sm font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#364153] w-20">
          見積 or 実績
        </label>
        <div className="flex gap-4">
          {(['estimated', 'actual'] as DataType[]).map((type) => (
            <button
              key={type}
              onClick={() => setDataType(type)}
              className={`px-4 py-2 rounded-md text-sm font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] transition-colors ${
                dataType === type
                  ? 'bg-[#2c2c2c] text-white'
                  : 'border border-[#d1d5dc] text-[#364153] hover:bg-gray-50'
              }`}
            >
              {type === 'estimated' ? '見積' : '実績'}
            </button>
          ))}
        </div>
      </div>

      {/* Date Selector */}
      <DateSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        showCalendar={showCalendar}
        setShowCalendar={setShowCalendar}
        calendarRef={calendarRef}
      />

      {/* Expense Entries */}
      <div className="space-y-6">
        {entries.map((entry) => (
          <div key={entry.id} className="space-y-2">
            <label className="block text-sm font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#364153]">
              {entry.label}
            </label>
            <div className="flex items-center gap-5 border border-[#717182]/50 rounded-md px-4 py-2">
              <span className="text-sm font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[rgba(10,10,10,0.5)]">
                金額
              </span>
              <input
                type="number"
                placeholder="70000"
                className="flex-1 text-right border-none outline-none font-['Khand:Regular',sans-serif] text-[rgba(10,10,10,0.5)]"
              />
            </div>
            <div className="flex items-center gap-5 border border-[#717182]/50 rounded-md px-4 py-2">
              <span className="text-sm font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[rgba(10,10,10,0.5)]">
                備考
              </span>
              <input
                type="text"
                placeholder={entry.label === '家賃' ? '家賃5月分' : ''}
                className="flex-1 border-none outline-none font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[rgba(10,10,10,0.5)]"
              />
            </div>
          </div>
        ))}
      </div>

      <button className="w-full bg-[#2c2c2c] text-white py-3 rounded-md hover:bg-[#1e1e1e] transition-colors font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif]">
        保存
      </button>
    </div>
  );
}

function VariableCostsInput({ selectedDate, setSelectedDate, showCalendar, setShowCalendar, calendarRef }: any) {
  const [entries, setEntries] = useState<ExpenseEntry[]>([
    { id: '1', category: '推し課金', amount: '', remark: '' },
    { id: '2', category: '推し課金', amount: '', remark: '' },
  ]);

  const addEntry = () => {
    setEntries([...entries, { id: Date.now().toString(), category: '推し課金', amount: '', remark: '' }]);
  };

  return (
    <div className="space-y-6">
      <DateSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        showCalendar={showCalendar}
        setShowCalendar={setShowCalendar}
        calendarRef={calendarRef}
      />

      <div className="space-y-6">
        {entries.map((entry, index) => (
          <div key={entry.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#364153]">
                カテゴリー
              </label>
              <div className="flex-1 px-4">
                <select className="w-[100px] border border-[#717182]/50 rounded-md px-2 py-1 text-sm font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#717182]">
                  <option>推し課金</option>
                  <option>食費</option>
                  <option>日用品</option>
                  <option>交通費</option>
                  <option>趣味</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-5 border border-[#717182]/50 rounded-md px-4 py-2">
              <span className="text-sm font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[rgba(10,10,10,0.5)]">
                金額
              </span>
              <input
                type="number"
                placeholder="70000"
                className="flex-1 text-right border-none outline-none font-['Khand:Regular',sans-serif] text-[rgba(10,10,10,0.5)]"
              />
            </div>
            <div className="flex items-center gap-5 border border-[#717182]/50 rounded-md px-4 py-2">
              <span className="text-sm font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[rgba(10,10,10,0.5)]">
                備考
              </span>
              <input
                type="text"
                placeholder={index === 0 ? 'グッズ代' : ''}
                className="flex-1 border-none outline-none font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[rgba(10,10,10,0.5)]"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addEntry}
        className="flex items-center gap-2 text-[#717182] hover:text-[#2c2c2c] transition-colors font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif]"
      >
        <Plus className="w-5 h-5" />
        <span>明細を追加する</span>
      </button>

      <button className="w-full bg-[#2c2c2c] text-white py-3 rounded-md hover:bg-[#1e1e1e] transition-colors font-['Inter:Medium','Noto_Sans_JP:Medium',sans-serif]">
        保存
      </button>
    </div>
  );
}

function DateSelector({ selectedDate, setSelectedDate, showCalendar, setShowCalendar, calendarRef }: any) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#364153]">
        日付
      </label>
      <div className="relative" ref={calendarRef}>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="w-full flex items-center gap-3 border border-[#717182]/50 rounded-md px-4 py-2 hover:bg-gray-50 transition-colors"
        >
          <span className="font-['Khand:Regular',sans-serif] text-[#717182] text-2xl">
            {format(selectedDate, 'yyyy/M/d')}
          </span>
          <Calendar className="w-5 h-5 text-[#717182] ml-auto" />
        </button>
        {showCalendar && (
          <div className="absolute top-full mt-2 left-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 calendar-popup">
            <style>{`
              .calendar-popup .rdp {
                --rdp-cell-size: 40px;
                --rdp-accent-color: #2c2c2c;
                --rdp-background-color: #f3f4f6;
                font-family: 'Khand', sans-serif;
                margin: 0;
              }
              .calendar-popup .rdp-months { justify-content: center; }
              .calendar-popup .rdp-month { margin: 0; }
              .calendar-popup .rdp-caption {
                display: flex; align-items: center;
                justify-content: space-between;
                padding: 0.5rem 0; margin-bottom: 0.5rem;
              }
              .calendar-popup .rdp-caption_label { font-size: 1rem; font-weight: 500; color: #0a0a0a; }
              .calendar-popup .rdp-nav { display: flex; gap: 0.25rem; }
              .calendar-popup .rdp-button {
                width: 2rem; height: 2rem; padding: 0;
                border: none; background: transparent;
                cursor: pointer; border-radius: 0.375rem;
              }
              .calendar-popup .rdp-button:hover { background-color: #f3f4f6; }
              .calendar-popup .rdp-head_cell {
                font-size: 0.875rem; color: #717182;
                font-weight: 400; text-align: center; padding: 0.5rem 0;
              }
              .calendar-popup .rdp-day {
                width: var(--rdp-cell-size); height: var(--rdp-cell-size);
                border: none; background: transparent; cursor: pointer;
                border-radius: 0.375rem; font-size: 0.875rem;
                color: #0a0a0a; transition: background-color 0.15s;
              }
              .calendar-popup .rdp-day:hover:not(.rdp-day_selected) { background-color: #f3f4f6; }
              .calendar-popup .rdp-day_selected { background-color: var(--rdp-accent-color) !important; color: white !important; font-weight: 500; }
              .calendar-popup .rdp-day_today:not(.rdp-day_selected) { font-weight: 600; color: var(--rdp-accent-color); }
              .calendar-popup .rdp-day_outside { color: #d1d5db; }
            `}</style>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setShowCalendar(false);
                }
              }}
              locale={ja}
            />
          </div>
        )}
      </div>
    </div>
  );
}
