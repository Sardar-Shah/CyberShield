import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  subtext: string;
  accentColor: 'blue' | 'rose' | 'amber' | 'emerald' | 'indigo';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  subtext,
  accentColor,
  onClick
}) => {
  const colorMap = {
    blue: {
      bgIcon: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      badge: 'text-blue-400'
    },
    rose: {
      bgIcon: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      badge: 'text-rose-400'
    },
    amber: {
      bgIcon: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      badge: 'text-amber-400'
    },
    emerald: {
      bgIcon: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      badge: 'text-emerald-400'
    },
    indigo: {
      bgIcon: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      badge: 'text-indigo-400'
    }
  }[accentColor];

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl bg-[#111C30] border border-slate-800 transition-colors ${
        onClick ? 'cursor-pointer hover:border-slate-700 hover:bg-[#132038]' : ''
      } flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 tracking-wide">
            {label}
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-white mt-1 font-mono tabular-nums tracking-tight">
            {value}
          </div>
        </div>
        <div className={`p-2 rounded-lg border ${colorMap.bgIcon} shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="truncate">{subtext}</span>
        {onClick && (
          <span className={`${colorMap.badge} font-medium shrink-0 ml-1 hover:underline`}>
            Inspect &rarr;
          </span>
        )}
      </div>
    </div>
  );
};
