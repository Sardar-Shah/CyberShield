import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { ResponseTask, TaskPriority, TaskStatus, SecurityIncident } from '../../types';
import { createResponseTask, updateResponseTask } from '../../services/taskService';
import { useToast } from '../../context/ToastContext';
import { Loader2 } from 'lucide-react';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: ResponseTask | null;
  incidents: SecurityIncident[];
  initialIncident?: SecurityIncident | null;
  onSuccess: () => void;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
  incidents,
  initialIncident,
  onSuccess
}) => {
  const { showToast } = useToast();

  const [taskTitle, setTaskTitle] = useState('');
  const [relatedIncidentId, setRelatedIncidentId] = useState('');
  const [assignedAnalyst, setAssignedAnalyst] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [status, setStatus] = useState<TaskStatus>('Pending');
  const [dueDate, setDueDate] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTaskTitle(taskToEdit.taskTitle);
      setRelatedIncidentId(taskToEdit.relatedIncidentId || '');
      setAssignedAnalyst(taskToEdit.assignedAnalyst || '');
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
      setDueDate(taskToEdit.dueDate || '');
    } else {
      setTaskTitle('');
      setRelatedIncidentId(initialIncident?.id || '');
      setAssignedAnalyst('');
      setPriority('Medium');
      setStatus('Pending');
      setDueDate('');
    }
    setErrors({});
  }, [taskToEdit, initialIncident, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!taskTitle.trim()) {
      newErrors.taskTitle = 'Task title is required.';
    } else if (taskTitle.trim().length > 200) {
      newErrors.taskTitle = 'Task title must be 200 characters or fewer.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const selectedIncident = incidents.find(inc => inc.id === relatedIncidentId);
      const relatedTitle = selectedIncident ? selectedIncident.title : undefined;

      if (taskToEdit && taskToEdit.id) {
        // UPDATE
        await updateResponseTask(taskToEdit.id, {
          taskTitle,
          relatedIncidentId: relatedIncidentId || undefined,
          relatedIncidentTitle: relatedTitle,
          assignedAnalyst: assignedAnalyst.trim() || undefined,
          priority,
          status,
          dueDate: dueDate || undefined
        });
        showToast('success', 'Task Updated', `Updated "${taskTitle}"`);
      } else {
        // CREATE
        const newId = await createResponseTask({
          taskTitle,
          relatedIncidentId: relatedIncidentId || undefined,
          relatedIncidentTitle: relatedTitle,
          assignedAnalyst: assignedAnalyst.trim() || undefined,
          priority,
          status,
          dueDate: dueDate || undefined
        });
        showToast('success', 'Task Created', `Added task ID: ${newId.substring(0, 8)}...`);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      showToast('error', 'Operation Failed', err.message || 'Could not save task to Firestore.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Edit Response Task' : 'Create Response Task'}
      subtitle={taskToEdit ? `Updating ID: ${taskToEdit.id}` : 'Assign a mitigation or containment task in Firestore'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Task Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => {
              setTaskTitle(e.target.value);
              if (errors.taskTitle) setErrors(prev => ({ ...prev, taskTitle: '' }));
            }}
            placeholder="e.g. Isolate endpoint WS-FIN-08 from internal VLAN"
            maxLength={200}
            className={`w-full bg-[#0F172A] border ${
              errors.taskTitle ? 'border-rose-500' : 'border-slate-700'
            } rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500`}
          />
          {errors.taskTitle && (
            <p className="text-xs text-rose-400 mt-1">{errors.taskTitle}</p>
          )}
        </div>

        {/* Related Incident Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Related Incident
          </label>
          <select
            value={relatedIncidentId}
            onChange={(e) => setRelatedIncidentId(e.target.value)}
            className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">(None - Standalone / Proactive Task)</option>
            {incidents.map((inc) => (
              <option key={inc.id} value={inc.id}>
                [{inc.severity}] {inc.title}
              </option>
            ))}
          </select>
          {incidents.length === 0 && (
            <p className="text-[11px] text-slate-400 mt-1">
              No incidents logged yet. You can create a standalone task now and link an incident later.
            </p>
          )}
        </div>

        {/* Row: Priority and Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Priority <span className="text-rose-400">*</span>
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Execution Status <span className="text-rose-400">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Row: Assigned Analyst and Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Assigned Analyst
            </label>
            <input
              type="text"
              value={assignedAnalyst}
              onChange={(e) => setAssignedAnalyst(e.target.value)}
              placeholder="e.g. Alex Morgan (SecOps)"
              maxLength={100}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono tabular-nums"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{taskToEdit ? 'Update Task' : 'Create Task'}</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
