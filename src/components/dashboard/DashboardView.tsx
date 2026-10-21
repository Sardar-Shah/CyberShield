import React from 'react';
import { SecurityIncident, ITAsset, ResponseTask, ActivePage, IncidentType } from '../../types';
import { StatCard } from './StatCard';
import { SeverityChart } from './SeverityChart';
import { RecentIncidents } from './RecentIncidents';
import {
  ShieldAlert,
  AlertCircle,
  AlertOctagon,
  Server,
  ListTodo,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Layers
} from 'lucide-react';

interface DashboardViewProps {
  incidents: SecurityIncident[];
  assets: ITAsset[];
  tasks: ResponseTask[];
  onNavigate: (page: ActivePage) => void;
  openIncidentModal: () => void;
  openAssetModal: () => void;
  openTaskModal: () => void;
  onViewIncident: (incident: SecurityIncident) => void;
  onSeedDemoData: () => void;
  isSeeding: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  incidents,
  assets,
  tasks,
  onNavigate,
  openIncidentModal,
  openAssetModal,
  openTaskModal,
  onViewIncident,
  onSeedDemoData,
  isSeeding
}) => {
  const totalIncidents = incidents.length;
  const openIncidents = incidents.filter((i) => i.status === 'Open').length;
  const criticalIncidents = incidents.filter((i) => i.severity === 'Critical').length;
  const totalAssets = assets.length;
  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const resolvedIncidents = incidents.filter((i) => i.status === 'Resolved').length;

  // Threat category distribution
  const typeCategories: IncidentType[] = [
    'Phishing',
    'Malware',
    'Unauthorized Access',
    'Suspicious Login',
    'Data Breach',
    'Other'
  ];

  const typeCounts = typeCategories.map((type) => ({
    type,
    count: incidents.filter((i) => i.incidentType === type).length
  }));

  return (
    <div className="space-y-5">
      {/* Action Strip & Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#111C30] border border-slate-800">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Security Operations Overview
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time incident management, asset inventory, and mitigation workflows
          </p>
        </div>

        {/* Quick action triggers */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={openIncidentModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-300" />
            <span>+ Incident</span>
          </button>
          <button
            onClick={openAssetModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-[#0F172A] hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
          >
            <Server className="w-3.5 h-3.5 text-blue-400" />
            <span>+ Asset</span>
          </button>
          <button
            onClick={openTaskModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-[#0F172A] hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
          >
            <ListTodo className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Task</span>
          </button>

          <button
            onClick={onSeedDemoData}
            disabled={isSeeding}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors disabled:opacity-50"
            title="Load sample records into empty Firestore database"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isSeeding ? 'Seeding...' : 'Load Demo Data'}</span>
          </button>
        </div>
      </div>

      {/* Top 5 Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <StatCard
          label="Total Incidents"
          value={totalIncidents}
          icon={ShieldAlert}
          subtext="Recorded events"
          accentColor="blue"
          onClick={() => onNavigate('incidents')}
        />
        <StatCard
          label="Open Incidents"
          value={openIncidents}
          icon={AlertCircle}
          subtext="Under active triage"
          accentColor="amber"
          onClick={() => onNavigate('incidents')}
        />
        <StatCard
          label="Critical Severity"
          value={criticalIncidents}
          icon={AlertOctagon}
          subtext="Priority containment"
          accentColor="rose"
          onClick={() => onNavigate('incidents')}
        />
        <StatCard
          label="Registered Assets"
          value={totalAssets}
          icon={Server}
          subtext="Monitored hardware"
          accentColor="indigo"
          onClick={() => onNavigate('assets')}
        />
        <StatCard
          label="Pending Tasks"
          value={pendingTasks}
          icon={ListTodo}
          subtext={`${inProgressTasks} in progress`}
          accentColor="emerald"
          onClick={() => onNavigate('tasks')}
        />
      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Severity Chart */}
        <SeverityChart incidents={incidents} />

        {/* Recent Incidents Table */}
        <RecentIncidents
          incidents={incidents}
          onView={onViewIncident}
          onNavigateToIncidents={() => onNavigate('incidents')}
        />
      </div>

      {/* Threat Vector Distribution Grid */}
      <div className="p-4 rounded-xl bg-[#111C30] border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Threat Category Distribution
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            {totalIncidents} incident{totalIncidents === 1 ? '' : 's'} categorized
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {typeCounts.map(({ type, count }) => (
            <div
              key={type}
              className="p-2.5 rounded-lg bg-[#0F172A] border border-slate-800/80 flex flex-col justify-between"
            >
              <div className="text-[11px] text-slate-400 truncate" title={type}>
                {type}
              </div>
              <div className="text-lg font-bold font-mono tabular-nums text-white mt-1">
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Status & Response Workflow Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-3.5 rounded-xl bg-[#111C30] border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Open Backlog</div>
              <div className="text-lg font-bold text-white font-mono tabular-nums">{openIncidents}</div>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Triage</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#111C30] border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Active Response Tasks</div>
              <div className="text-lg font-bold text-white font-mono tabular-nums">{pendingTasks + inProgressTasks}</div>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Remediate</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#111C30] border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Resolved Incidents</div>
              <div className="text-lg font-bold text-white font-mono tabular-nums">{resolvedIncidents}</div>
            </div>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">Closed</span>
        </div>
      </div>
    </div>
  );
};
