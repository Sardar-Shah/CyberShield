import React, { useState, useMemo } from 'react';
import { SecurityIncident } from '../../types';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import {
  ShieldAlert,
  Search,
  Eye,
  Edit,
  Trash2,
  Calendar,
  RotateCcw
} from 'lucide-react';

interface IncidentTableProps {
  incidents: SecurityIncident[];
  isLoading: boolean;
  onView: (incident: SecurityIncident) => void;
  onEdit: (incident: SecurityIncident) => void;
  onDelete: (incident: SecurityIncident) => void;
  onAddNew: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const IncidentTable: React.FC<IncidentTableProps> = ({
  incidents,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onAddNew,
  searchQuery,
  onSearchChange
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filteredIncidents = useMemo(() => {
    return incidents.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        q === '' ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.incidentType.toLowerCase().includes(q);

      const matchesSeverity = severityFilter === 'ALL' || item.severity === severityFilter;
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const matchesType = typeFilter === 'ALL' || item.incidentType === typeFilter;

      return matchesSearch && matchesSeverity && matchesStatus && matchesType;
    });
  }, [incidents, searchQuery, severityFilter, statusFilter, typeFilter]);

  const hasActiveFilters = severityFilter !== 'ALL' || statusFilter !== 'ALL' || typeFilter !== 'ALL' || searchQuery !== '';

  const resetFilters = () => {
    setSeverityFilter('ALL');
    setStatusFilter('ALL');
    setTypeFilter('ALL');
    onSearchChange('');
  };

  return (
    <div className="space-y-3.5">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#111C30] border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative flex-1 sm:w-56 min-w-[170px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter incidents..."
              className="w-full bg-[#0F172A] border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Severity filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#0F172A] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0F172A] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Investigating">Investigating</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#0F172A] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 hidden md:inline-block"
          >
            <option value="ALL">All Types</option>
            <option value="Phishing">Phishing</option>
            <option value="Malware">Malware</option>
            <option value="Unauthorized Access">Unauthorized Access</option>
            <option value="Suspicious Login">Suspicious Login</option>
            <option value="Data Breach">Data Breach</option>
            <option value="Other">Other</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1.5 rounded-md hover:bg-slate-800 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="text-xs text-slate-400 self-center sm:self-auto font-mono tabular-nums">
          <span className="text-white font-semibold">{filteredIncidents.length}</span> / {incidents.length} incidents
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Synchronizing with Firestore database...</span>
          </div>
        ) : filteredIncidents.length === 0 ? (
          <EmptyState
            icon={ShieldAlert}
            title={incidents.length === 0 ? 'No Incidents Logged Yet' : 'No Incidents Match Filter'}
            description={
              incidents.length === 0
                ? 'Get started by creating your first security incident report in the database.'
                : 'Try adjusting your search criteria or resetting the severity and status filters.'
            }
            actionLabel={incidents.length === 0 ? 'Report New Incident' : 'Clear Filters'}
            onAction={incidents.length === 0 ? onAddNew : resetFilters}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0F172A] text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 px-4 font-semibold">Incident Details</th>
                  <th className="py-2.5 px-4 font-semibold">Type</th>
                  <th className="py-2.5 px-4 font-semibold">Severity</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                  <th className="py-2.5 px-4 font-semibold">Reported</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredIncidents.map((incident) => (
                  <tr
                    key={incident.id}
                    className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                    onClick={() => onView(incident)}
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1">
                        {incident.title}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 max-w-md">
                        {incident.description}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                      {incident.incidentType}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge label={incident.severity} variant="severity" />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge label={incident.status} variant="incidentStatus" />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-400 font-mono tabular-nums">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{incident.dateReported}</span>
                      </div>
                    </td>
                    <td
                      className="py-3 px-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onView(incident)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEdit(incident)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                          title="Edit Incident"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(incident)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete Incident"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
