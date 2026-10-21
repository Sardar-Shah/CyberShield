import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { ITAsset, AssetType, AssetCriticality } from '../../types';
import { createAsset, updateAsset } from '../../services/assetService';
import { useToast } from '../../context/ToastContext';
import { Loader2 } from 'lucide-react';

interface AssetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetToEdit?: ITAsset | null;
  onSuccess: () => void;
}

const IP_V4_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

export const AssetFormModal: React.FC<AssetFormModalProps> = ({
  isOpen,
  onClose,
  assetToEdit,
  onSuccess
}) => {
  const { showToast } = useToast();

  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState<AssetType>('Server');
  const [ipAddress, setIpAddress] = useState('');
  const [ownerDepartment, setOwnerDepartment] = useState('');
  const [criticality, setCriticality] = useState<AssetCriticality>('Medium');
  const [dateRegistered, setDateRegistered] = useState(new Date().toISOString().split('T')[0]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (assetToEdit) {
      setAssetName(assetToEdit.assetName);
      setAssetType(assetToEdit.assetType);
      setIpAddress(assetToEdit.ipAddress || '');
      setOwnerDepartment(assetToEdit.ownerDepartment || '');
      setCriticality(assetToEdit.criticality);
      setDateRegistered(assetToEdit.dateRegistered);
    } else {
      setAssetName('');
      setAssetType('Server');
      setIpAddress('');
      setOwnerDepartment('');
      setCriticality('Medium');
      setDateRegistered(new Date().toISOString().split('T')[0]);
    }
    setErrors({});
  }, [assetToEdit, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!assetName.trim()) {
      newErrors.assetName = 'Asset name or hostname is required.';
    } else if (assetName.trim().length > 200) {
      newErrors.assetName = 'Asset name must be 200 characters or fewer.';
    }

    if (ipAddress.trim() !== '') {
      if (!IP_V4_REGEX.test(ipAddress.trim())) {
        newErrors.ipAddress = 'Must be a valid IPv4 address (e.g. 192.168.1.10).';
      }
    }

    if (!dateRegistered) {
      newErrors.dateRegistered = 'Registration date is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (assetToEdit && assetToEdit.id) {
        // UPDATE operation
        await updateAsset(assetToEdit.id, {
          assetName,
          assetType,
          ipAddress: ipAddress.trim() || undefined,
          ownerDepartment: ownerDepartment.trim() || undefined,
          criticality,
          dateRegistered
        });
        showToast('success', 'Asset Updated', `Successfully updated "${assetName}"`);
      } else {
        // CREATE operation
        const newId = await createAsset({
          assetName,
          assetType,
          ipAddress: ipAddress.trim() || undefined,
          ownerDepartment: ownerDepartment.trim() || undefined,
          criticality,
          dateRegistered
        });
        showToast('success', 'Asset Registered', `Added asset ID: ${newId.substring(0, 8)}...`);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      showToast('error', 'Operation Failed', err.message || 'Could not save asset to Firestore.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={assetToEdit ? 'Edit IT Asset' : 'Register New IT Asset'}
      subtitle={assetToEdit ? `Updating ID: ${assetToEdit.id}` : 'Enroll a workstation, server, or appliance into Firestore inventory'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Asset Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Asset Name / Hostname <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={assetName}
            onChange={(e) => {
              setAssetName(e.target.value);
              if (errors.assetName) setErrors(prev => ({ ...prev, assetName: '' }));
            }}
            placeholder="e.g. PROD-API-GATEWAY-01"
            maxLength={200}
            className={`w-full bg-[#0F172A] border ${
              errors.assetName ? 'border-rose-500' : 'border-slate-700'
            } rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500`}
          />
          {errors.assetName && (
            <p className="text-xs text-rose-400 mt-1">{errors.assetName}</p>
          )}
        </div>

        {/* Row: Asset Type and Criticality */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Asset Type <span className="text-rose-400">*</span>
            </label>
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value as AssetType)}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Computer">Computer (Workstation/Laptop)</option>
              <option value="Server">Server (Cloud / On-Prem)</option>
              <option value="Network Device">Network Device (Router/Switch/FW)</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Criticality Level <span className="text-rose-400">*</span>
            </label>
            <select
              value={criticality}
              onChange={(e) => setCriticality(e.target.value as AssetCriticality)}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        {/* Row: IP Address and Owner / Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              IP Address <span className="text-slate-400 font-normal">(IPv4 Optional)</span>
            </label>
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => {
                setIpAddress(e.target.value);
                if (errors.ipAddress) setErrors(prev => ({ ...prev, ipAddress: '' }));
              }}
              placeholder="e.g. 192.168.1.10"
              className={`w-full bg-[#0F172A] border ${
                errors.ipAddress ? 'border-rose-500' : 'border-slate-700'
              } rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono tabular-nums`}
            />
            {errors.ipAddress && (
              <p className="text-xs text-rose-400 mt-1">{errors.ipAddress}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Owner / Department
            </label>
            <input
              type="text"
              value={ownerDepartment}
              onChange={(e) => setOwnerDepartment(e.target.value)}
              placeholder="e.g. DevOps Infrastructure"
              maxLength={100}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Date Registered */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Registration Date <span className="text-rose-400">*</span>
          </label>
          <input
            type="date"
            value={dateRegistered}
            onChange={(e) => {
              setDateRegistered(e.target.value);
              if (errors.dateRegistered) setErrors(prev => ({ ...prev, dateRegistered: '' }));
            }}
            className={`w-full bg-[#0F172A] border ${
              errors.dateRegistered ? 'border-rose-500' : 'border-slate-700'
            } rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono`}
          />
          {errors.dateRegistered && (
            <p className="text-xs text-rose-400 mt-1">{errors.dateRegistered}</p>
          )}
        </div>

        {/* Form Actions */}
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
              <span>{assetToEdit ? 'Update Asset' : 'Register Asset'}</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
