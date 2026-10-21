import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { SecurityIncident } from '../../types';
import { Calendar, Tag, AlertCircle, Edit, Trash2, ListTodo, Copy, Check } from 'lucide-react';

interface IncidentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: SecurityIncident | null;
  onEdit: (incident: SecurityIncident) => void;
  onDelete: (incident: SecurityIncident) => void;
  onCreateTask: (incident: SecurityIncident) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  isOpen,
  onClose,
  incident,
  onEdit,
  onDelete,
  onCreateTask
}) => {
  const [copied, setCopied] = useState(false);

  if (!incident) return null;

  const copyId = () => {
    if (incident.id) {
      navigator.clipboard.writeText(incident.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Incident Inspection"
      subtitle="Security Event Technical Details"
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Title and Badges */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge label={incident.severity} variant="severity" />
            <Badge label={incident.status} variant="incidentStatus" />
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
              <Tag className="w-3 h-3 text-blue-400" />
              {incident.incidentType}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
            {incident.title}
          </h2>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-[#0F172A] border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5 text-[11px]">Document ID</span>
            <div className="flex items-center gap-1.5 font-mono text-slate-200">
              <span className="truncate max-w-[180px]">{incident.id || 'N/A'}</span>
              {incident.id && (
                <button
                  onClick={copyId}
                  className="text-slate-400 hover:text-white p-0.5"
                  title="Copy ID"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5 text-[11px]">Date Reported</span>
            <div className="flex items-center gap-1.5 text-slate-200 font-mono tabular-nums">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{incident.dateReported}</span>
            </div>
          </div>

          {incident.createdAt && (
            <div>
              <span className="text-slate-400 block mb-0.5 text-[11px]">Recorded Timestamp</span>
              <span className="text-slate-300 font-mono text-[11px] tabular-nums">
                {new Date(incident.createdAt).toLocaleString()}
              </span>
            </div>
          )}

          {incident.updatedAt && (
            <div>
              <span className="text-slate-400 block mb-0.5 text-[11px]">Last Updated</span>
              <span className="text-slate-300 font-mono text-[11px] tabular-nums">
                {new Date(incident.updatedAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Description Section */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
            Incident Description & Evidence
          </h4>
          <div className="p-3 rounded-lg bg-[#0F172A] border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
            {incident.description}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              onCreateTask(incident);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg transition-colors"
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>Create Response Task</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(incident);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete(incident);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
