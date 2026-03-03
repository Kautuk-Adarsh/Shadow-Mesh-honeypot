import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
}

export default function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl flex items-start gap-4 shadow-lg hover:border-slate-700 transition-colors">
      <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 shadow-inner">
        {icon}
      </div>
      <div>
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-bold text-slate-100 mt-1 font-mono">{value}</p>
        {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
      </div>
    </div>
  );
}