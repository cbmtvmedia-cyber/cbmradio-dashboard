interface MetricCardProps {
  title: string;
  value: number;
  icon: string;
  description: string;
}

export default function MetricCard({ title, value, icon, description }: MetricCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{title}</span>
        <span className="text-base p-1.5 rounded-md bg-slate-800 border border-slate-700">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
      <p className="text-[10px] text-slate-500 font-medium">{description}</p>
    </div>
  );
}