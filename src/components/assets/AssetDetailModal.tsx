import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { ITAsset } from '../../types';
import { Server, Calendar, Globe, User, Edit, Trash2, Copy, Check } from 'lucide-react';

interface AssetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: ITAsset | null;
  onEdit: (asset: ITAsset) => void;
  onDelete: (asset: ITAsset) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  isOpen,
  onClose,
  asset,
  onEdit,
  onDelete
}) => {
  const [copied, setCopied] = useState(false);

  if (!asset) return null;

  const copyId = () => {
    if (asset.id) {
      navigator.clipboard.writeText(asset.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Asset Specifications"
      subtitle="IT Hardware & Infrastructure Record"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge label={asset.criticality} variant="criticality" />
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
              <Server className="w-3 h-3 text-blue-400" />
              {asset.assetType}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white">{asset.assetName}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-[#0F172A] border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5 text-[11px]">Document ID</span>
            <div className="flex items-center gap-1.5 font-mono text-slate-200">
              <span className="truncate max-w-[140px]">{asset.id}</span>
              {asset.id && (
                <button onClick={copyId} className="text-slate-400 hover:text-white" title="Copy ID">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5 text-[11px]">IP Address</span>
            <div className="flex items-center gap-1 text-slate-200 font-mono tabular-nums">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{asset.ipAddress || 'Not Assigned'}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5 text-[11px]">Owner / Department</span>
            <div className="flex items-center gap-1 text-slate-200">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{asset.ownerDepartment || 'Unassigned'}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5 text-[11px]">Date Registered</span>
            <div className="flex items-center gap-1 text-slate-200 font-mono tabular-nums">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{asset.dateRegistered}</span>
            </div>
          </div>

          {asset.createdAt && (
            <div className="col-span-full">
              <span className="text-slate-400 block mb-0.5 text-[11px]">Record Timestamp</span>
              <span className="text-slate-300 font-mono text-[11px] tabular-nums">
                {new Date(asset.createdAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              onEdit(asset);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Asset</span>
          </button>
          <button
            onClick={() => {
              onClose();
              onDelete(asset);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Asset</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
