interface BreakdownItem {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

interface CategoryBreakdownChartProps {
  title: string;
  data: BreakdownItem[];
}

export default function CategoryBreakdownChart({ title, data }: CategoryBreakdownChartProps) {
  return (
    <div className="bg-white rounded-md border-r border-b border-[#2c2c2c]/30 p-6 md:p-8">
      <h2 className="font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#0a0a0a] text-xl mb-6">
        {title}
      </h2>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Pie Chart Placeholder */}
        <div className="w-64 h-64 shrink-0 relative">
          <svg viewBox="0 0 256 256" className="w-full h-full">
            {data.map((item, index) => {
              const total = data.reduce((sum, d) => sum + d.amount, 0);
              const startAngle = data.slice(0, index).reduce((sum, d) => sum + (d.amount / total) * 360, 0);
              const sweepAngle = (item.amount / total) * 360;

              const radius = 90;
              const centerX = 128;
              const centerY = 128;

              const startRad = (startAngle - 90) * Math.PI / 180;
              const endRad = (startAngle + sweepAngle - 90) * Math.PI / 180;

              const x1 = centerX + radius * Math.cos(startRad);
              const y1 = centerY + radius * Math.sin(startRad);
              const x2 = centerX + radius * Math.cos(endRad);
              const y2 = centerY + radius * Math.sin(endRad);

              const largeArc = sweepAngle > 180 ? 1 : 0;

              return (
                <path
                  key={index}
                  d={`M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={item.color}
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-4 h-4 rounded-sm shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] text-[#0a0a0a] text-base truncate">
                  {item.name}
                </span>
              </div>
              <div className="text-right shrink-0">
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
