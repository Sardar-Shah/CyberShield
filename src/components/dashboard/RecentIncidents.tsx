import React from 'react';
import { SecurityIncident } from '../../types';
import { Badge } from '../common/Badge';
import { ShieldAlert, ArrowRight, Eye, Calendar } from 'lucide-react';

interface RecentIncidentsProps {
  incidents: SecurityIncident[];
  onView: (incident: SecurityIncident) => void;
  onNavigateToIncidents: () => void;
}

export const RecentIncidents: React.FC<RecentIncidentsProps> = ({
  incidents,
  onView,
  onNavigateToIncidents
}) => {
  const recent = incidents.slice(0, 5);

  return (
    <div className="p-5 rounded-xl bg-[#111C30] border border-slate-800 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Recent Incidents
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Latest alerts logged into Firestore
          </p>
        </div>
        <button
          onClick={onNavigateToIncidents}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 transition-colors"
        >
          <span>All Incidents</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-3 flex-1 overflow-x-auto">
        {recent.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No incidents recorded. Use the Quick Action buttons or demo loader to add records.
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="py-2.5 px-3">Title</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Reported</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recent.map((inc) => (
                <tr
                  key={inc.id}
                  onClick={() => onView(inc)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                >
                  <td className="py-2.5 px-3 max-w-[200px]">
                    <div className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                      {inc.title}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{inc.incidentType}</div>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <Badge label={inc.severity} variant="severity" />
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <Badge label={inc.status} variant="incidentStatus" />
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-400 text-[11px] font-mono tabular-nums">
                    {inc.dateReported}
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onView(inc)}
                      className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Inspect Record"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
