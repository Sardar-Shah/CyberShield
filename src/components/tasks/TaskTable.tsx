import React, { useState, useMemo } from 'react';
import { ResponseTask } from '../../types';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import {
  ListTodo,
  Search,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';

interface TaskTableProps {
  tasks: ResponseTask[];
  isLoading: boolean;
  onView: (task: ResponseTask) => void;
  onEdit: (task: ResponseTask) => void;
  onDelete: (task: ResponseTask) => void;
  onAddNew: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onAddNew,
  searchQuery,
  onSearchChange
}) => {
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        q === '' ||
        task.taskTitle.toLowerCase().includes(q) ||
        (task.assignedAnalyst && task.assignedAnalyst.toLowerCase().includes(q)) ||
        (task.relatedIncidentTitle && task.relatedIncidentTitle.toLowerCase().includes(q));

      const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
      const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tasks, searchQuery, priorityFilter, statusFilter]);

  const hasActiveFilters = priorityFilter !== 'ALL' || statusFilter !== 'ALL' || searchQuery !== '';

  const resetFilters = () => {
    setPriorityFilter('ALL');
    setStatusFilter('ALL');
    onSearchChange('');
  };

  return (
    <div className="space-y-3.5">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#111C30] border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search by title / analyst */}
          <div className="relative flex-1 sm:w-56 min-w-[170px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter tasks or analyst..."
              className="w-full bg-[#0F172A] border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#0F172A] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Priorities</option>
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
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
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
          <span className="text-white font-semibold">{filteredTasks.length}</span> / {tasks.length} tasks
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Synchronizing tasks with Firestore...</span>
          </div>
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            icon={ListTodo}
            title={tasks.length === 0 ? 'No Response Tasks Yet' : 'No Tasks Match Filter'}
            description={
              tasks.length === 0
                ? 'Create containment, remediation, or forensic investigation tasks to track incident resolution.'
                : 'Adjust your search keywords or reset priority and status filters.'
            }
            actionLabel={tasks.length === 0 ? 'Create Response Task' : 'Clear Filters'}
            onAction={tasks.length === 0 ? onAddNew : resetFilters}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0F172A] text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 px-4 font-semibold">Task Title</th>
                  <th className="py-2.5 px-4 font-semibold">Related Incident</th>
                  <th className="py-2.5 px-4 font-semibold">Priority</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                  <th className="py-2.5 px-4 font-semibold">Assignee</th>
                  <th className="py-2.5 px-4 font-semibold">Due Date</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                    onClick={() => onView(task)}
                  >
                    <td className="py-3 px-4 font-semibold text-slate-100 group-hover:text-blue-400 transition-colors max-w-xs">
                      <div className="line-clamp-1">{task.taskTitle}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-[200px]">
                      {task.relatedIncidentTitle ? (
                        <div className="flex items-center gap-1.5 truncate text-[11px] text-slate-300">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span className="truncate">{task.relatedIncidentTitle}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">General / Proactive</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge label={task.priority} variant="priority" />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge label={task.status} variant="taskStatus" />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{task.assignedAnalyst || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-400 font-mono tabular-nums">
                      {task.dueDate ? (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{task.dueDate}</span>
                        </div>
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                    <td
                      className="py-3 px-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onView(task)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEdit(task)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                          title="Edit Task"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(task)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete Task"
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
