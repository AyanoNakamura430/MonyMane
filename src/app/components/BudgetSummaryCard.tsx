interface BudgetSummaryCardProps {
  label: string;
  amount: number;
}

export default function BudgetSummaryCard({ label, amount }: BudgetSummaryCardProps) {
  return (
    <div className="bg-white rounded-md border-r border-b border-[#2c2c2c]/30 p-6">
      <h3 className="font-['Post_No_Bills_Jaffna_Light:Regular','Noto_Sans_JP:Light',sans-serif] text-[#717182] text-lg mb-4">
        {label}
      </h3>
      <p className="font-['Khand:Regular',sans-serif] text-[#0a0a0a] text-3xl text-right">
        ¥{amount.toLocaleString()}
      </p>
    </div>
  );
}
