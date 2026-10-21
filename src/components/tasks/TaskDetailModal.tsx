import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { ResponseTask } from '../../types';
import { Calendar, User, ShieldAlert, Edit, Trash2, Copy, Check } from 'lucide-react';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: ResponseTask | null;
  onEdit: (task: ResponseTask) => void;
  onDelete: (task: ResponseTask) => void;
  onViewRelatedIncident?: (incidentId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
  onViewRelatedIncident
}) => {
  const [copied, setCopied] = useState(false);

  if (!task) return null;

  const copyId = () => {
    if (task.id) {
      navigator.clipboard.writeText(task.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Response Task Inspection"
      subtitle="Mitigation Action Item Details"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge label={task.priority} variant="priority" />
            <Badge label={task.status} variant="taskStatus" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white">{task.taskTitle}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-[#0F172A] border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5 text-[11px]">Document ID</span>
            <div className="flex items-center gap-1.5 font-mono text-slate-200">
              <span className="truncate max-w-[140px]">{task.id}</span>
              {task.id && (
                <button onClick={copyId} className="text-slate-400 hover:text-white" title="Copy ID">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5 text-[11px]">Assigned Analyst</span>
            <div className="flex items-center gap-1 text-slate-200">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>{task.assignedAnalyst || 'Unassigned'}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5 text-[11px]">Due Date</span>
            <div className="flex items-center gap-1 text-slate-200 font-mono tabular-nums">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{task.dueDate || 'No Deadline'}</span>
            </div>
          </div>

          {task.createdAt && (
            <div>
              <span className="text-slate-400 block mb-0.5 text-[11px]">Created Date</span>
              <span className="text-slate-300 font-mono text-[11px] tabular-nums">
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
          )}

          {task.relatedIncidentTitle && (
            <div className="col-span-full pt-2 border-t border-slate-800">
              <span className="text-slate-400 block mb-1 text-[11px]">Related Incident</span>
              <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#111C30] border border-slate-700/60 text-slate-200">
                <div className="flex items-center gap-2 truncate">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="truncate">{task.relatedIncidentTitle}</span>
                </div>
                {task.relatedIncidentId && onViewRelatedIncident && (
                  <button
                    onClick={() => {
                      onClose();
                      onViewRelatedIncident(task.relatedIncidentId!);
                    }}
                    className="text-xs text-blue-400 hover:underline shrink-0 font-medium"
                  >
                    View
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              onEdit(task);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Task</span>
          </button>
          <button
            onClick={() => {
              onClose();
              onDelete(task);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Task</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
