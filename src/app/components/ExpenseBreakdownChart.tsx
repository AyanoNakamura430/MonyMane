interface BreakdownItem {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

interface ExpenseBreakdownChartProps {
  data: BreakdownItem[];
}

export default function ExpenseBreakdownChart({ data }: ExpenseBreakdownChartProps) {
  return (
    <div className="bg-white rounded-md border-r border-b border-[#2c2c2c]/30 p-6 md:p-8">
      <h2 className="font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#0a0a0a] text-xl mb-6">
        収支の内訳
      </h2>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Pie Chart Placeholder */}
        <div className="w-64 h-64 shrink-0 relative">
          <svg viewBox="0 0 256 256" className="w-full h-full">
            <circle cx="128" cy="128" r="90" fill="none" stroke="#A8A8A8" strokeWidth="40" strokeDasharray="226 565" transform="rotate(-90 128 128)" />
            <circle cx="128" cy="128" r="90" fill="none" stroke="#D4D4D4" strokeWidth="40" strokeDasharray="150 565" strokeDashoffset="-226" transform="rotate(-90 128 128)" />
            <circle cx="128" cy="128" r="90" fill="none" stroke="#6B6B6B" strokeWidth="40" strokeDasharray="188 565" strokeDashoffset="-376" transform="rotate(-90 128 128)" />
          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-sm shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[#0a0a0a] text-base">
                  {item.name}
                </span>
              </div>
              <div className="text-right">
                <p className="font-['Khand:Regular',sans-serif] text-[#0a0a0a] text-base">
                  ¥{item.amount.toLocaleString()}
                </p>
                <p className="font-['Khand:Regular',sans-serif] text-[#717182] text-sm">
                  {item.percentage.toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
