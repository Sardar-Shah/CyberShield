import React from 'react';
import { SeverityLevel, IncidentStatus, TaskPriority, TaskStatus, AssetCriticality } from '../../types';

interface BadgeProps {
  label: string;
  variant?: 'severity' | 'incidentStatus' | 'priority' | 'taskStatus' | 'criticality' | 'default';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default', className = '' }) => {
  let styleClasses = 'bg-slate-800/80 text-slate-300 border-slate-700/60';
  let indicatorColor = 'bg-slate-400';

  if (variant === 'severity' || variant === 'criticality' || variant === 'priority') {
    switch (label as SeverityLevel | TaskPriority | AssetCriticality) {
      case 'Critical':
        styleClasses = 'bg-rose-950/40 text-rose-300 border-rose-800/50';
        indicatorColor = 'bg-rose-500';
        break;
      case 'High':
        styleClasses = 'bg-orange-950/40 text-orange-300 border-orange-800/50';
        indicatorColor = 'bg-orange-500';
        break;
      case 'Medium':
        styleClasses = 'bg-amber-950/40 text-amber-300 border-amber-800/50';
        indicatorColor = 'bg-amber-500';
        break;
      case 'Low':
        styleClasses = 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50';
        indicatorColor = 'bg-emerald-500';
        break;
    }
  } else if (variant === 'incidentStatus') {
    switch (label as IncidentStatus) {
      case 'Open':
        styleClasses = 'bg-rose-950/40 text-rose-300 border-rose-800/50';
        indicatorColor = 'bg-rose-500';
        break;
      case 'Investigating':
        styleClasses = 'bg-blue-950/40 text-blue-300 border-blue-800/50';
        indicatorColor = 'bg-blue-500';
        break;
      case 'Resolved':
        styleClasses = 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50';
        indicatorColor = 'bg-emerald-500';
        break;
    }
  } else if (variant === 'taskStatus') {
    switch (label as TaskStatus) {
      case 'Pending':
        styleClasses = 'bg-amber-950/40 text-amber-300 border-amber-800/50';
        indicatorColor = 'bg-amber-500';
        break;
      case 'In Progress':
        styleClasses = 'bg-blue-950/40 text-blue-300 border-blue-800/50';
        indicatorColor = 'bg-blue-500';
        break;
      case 'Completed':
        styleClasses = 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50';
        indicatorColor = 'bg-emerald-500';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${styleClasses} tracking-tight ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${indicatorColor} shrink-0`} />
      <span>{label}</span>
    </span>
  );
};
