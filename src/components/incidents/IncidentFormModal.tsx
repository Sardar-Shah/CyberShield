import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { SecurityIncident, IncidentType, SeverityLevel, IncidentStatus } from '../../types';
import { createIncident, updateIncident } from '../../services/incidentService';
import { useToast } from '../../context/ToastContext';
import { Loader2 } from 'lucide-react';

interface IncidentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidentToEdit?: SecurityIncident | null;
  onSuccess: () => void;
}

export const IncidentFormModal: React.FC<IncidentFormModalProps> = ({
  isOpen,
  onClose,
  incidentToEdit,
  onSuccess
}) => {
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [incidentType, setIncidentType] = useState<IncidentType>('Phishing');
  const [severity, setSeverity] = useState<SeverityLevel>('Medium');
  const [status, setStatus] = useState<IncidentStatus>('Open');
  const [description, setDescription] = useState('');
  const [dateReported, setDateReported] = useState(new Date().toISOString().split('T')[0]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (incidentToEdit) {
      setTitle(incidentToEdit.title);
      setIncidentType(incidentToEdit.incidentType);
      setSeverity(incidentToEdit.severity);
      setStatus(incidentToEdit.status);
      setDescription(incidentToEdit.description);
      setDateReported(incidentToEdit.dateReported);
    } else {
      setTitle('');
      setIncidentType('Phishing');
      setSeverity('Medium');
      setStatus('Open');
      setDescription('');
      setDateReported(new Date().toISOString().split('T')[0]);
    }
    setErrors({});
  }, [incidentToEdit, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Incident title is required.';
    } else if (title.trim().length > 200) {
      newErrors.title = 'Title must be 200 characters or fewer.';
    }

    if (!description.trim()) {
      newErrors.description = 'Incident description is required.';
    } else if (description.trim().length > 2000) {
      newErrors.description = 'Description must be 2000 characters or fewer.';
    }

    if (!dateReported) {
      newErrors.dateReported = 'Date reported is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (incidentToEdit && incidentToEdit.id) {
        // UPDATE operation
        await updateIncident(incidentToEdit.id, {
          title,
          incidentType,
          severity,
          status,
          description,
          dateReported
        });
        showToast('success', 'Incident Updated', `Successfully updated "${title}"`);
      } else {
        // CREATE operation
        const newId = await createIncident({
          title,
          incidentType,
          severity,
          status,
          description,
          dateReported
        });
        showToast('success', 'Incident Created', `Recorded new incident ID: ${newId.substring(0, 8)}...`);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      showToast('error', 'Operation Failed', err.message || 'Could not save incident to Firestore.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={incidentToEdit ? 'Edit Security Incident' : 'Report Security Incident'}
      subtitle={incidentToEdit ? `Updating ID: ${incidentToEdit.id}` : 'Record a new cybersecurity anomaly or breach event in Firestore'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Incident Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Incident Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
            }}
            placeholder="e.g., Executive Spear-Phishing Campaign Detected"
            maxLength={200}
            className={`w-full bg-[#0F172A] border ${
              errors.title ? 'border-rose-500' : 'border-slate-700'
            } rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
          />
          {errors.title && (
            <p className="text-xs text-rose-400 mt-1">{errors.title}</p>
          )}
        </div>

        {/* Row: Type and Severity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Incident Type <span className="text-rose-400">*</span>
            </label>
            <select
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value as IncidentType)}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Phishing">Phishing</option>
              <option value="Malware">Malware</option>
              <option value="Unauthorized Access">Unauthorized Access</option>
              <option value="Suspicious Login">Suspicious Login</option>
              <option value="Data Breach">Data Breach</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Severity Level <span className="text-rose-400">*</span>
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Row: Status and Date Reported */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Incident Status <span className="text-rose-400">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as IncidentStatus)}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Open">Open</option>
              <option value="Investigating">Investigating</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Date Reported <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              value={dateReported}
              onChange={(e) => {
                setDateReported(e.target.value);
                if (errors.dateReported) setErrors(prev => ({ ...prev, dateReported: '' }));
              }}
              className={`w-full bg-[#0F172A] border ${
                errors.dateReported ? 'border-rose-500' : 'border-slate-700'
              } rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono`}
            />
            {errors.dateReported && (
              <p className="text-xs text-rose-400 mt-1">{errors.dateReported}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Detailed Description <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
            }}
            placeholder="Describe the incident symptoms, impacted accounts/systems, timeline, and preliminary evidence..."
            maxLength={2000}
            className={`w-full bg-[#0F172A] border ${
              errors.description ? 'border-rose-500' : 'border-slate-700'
            } rounded-lg p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none`}
          />
          <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
            {errors.description ? (
              <span className="text-rose-400">{errors.description}</span>
            ) : (
              <span>Provide clear technical details</span>
            )}
            <span className="font-mono tabular-nums">{description.length}/2000</span>
          </div>
        </div>

        {/* Buttons */}
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
              <span>{incidentToEdit ? 'Update Incident' : 'Create Incident'}</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
