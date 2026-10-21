import React, { useState, useMemo } from 'react';
import { ITAsset } from '../../types';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import {
  Server,
  Search,
  Eye,
  Edit,
  Trash2,
  Calendar,
  RotateCcw
} from 'lucide-react';

interface AssetTableProps {
  assets: ITAsset[];
  isLoading: boolean;
  onView: (asset: ITAsset) => void;
  onEdit: (asset: ITAsset) => void;
  onDelete: (asset: ITAsset) => void;
  onAddNew: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onAddNew,
  searchQuery,
  onSearchChange
}) => {
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [criticalityFilter, setCriticalityFilter] = useState<string>('ALL');

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        q === '' ||
        asset.assetName.toLowerCase().includes(q) ||
        (asset.ipAddress && asset.ipAddress.toLowerCase().includes(q)) ||
        (asset.ownerDepartment && asset.ownerDepartment.toLowerCase().includes(q));

      const matchesType = typeFilter === 'ALL' || asset.assetType === typeFilter;
      const matchesCrit = criticalityFilter === 'ALL' || asset.criticality === criticalityFilter;

      return matchesSearch && matchesType && matchesCrit;
    });
  }, [assets, searchQuery, typeFilter, criticalityFilter]);

  const hasActiveFilters = typeFilter !== 'ALL' || criticalityFilter !== 'ALL' || searchQuery !== '';

  const resetFilters = () => {
    setTypeFilter('ALL');
    setCriticalityFilter('ALL');
    onSearchChange('');
  };

  return (
    <div className="space-y-3.5">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#111C30] border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search by name or IP */}
          <div className="relative flex-1 sm:w-56 min-w-[170px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search hostname or IP..."
              className="w-full bg-[#0F172A] border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#0F172A] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Asset Types</option>
            <option value="Computer">Computer</option>
            <option value="Server">Server</option>
            <option value="Network Device">Network Device</option>
            <option value="Other">Other</option>
          </select>

          {/* Criticality filter */}
          <select
            value={criticalityFilter}
            onChange={(e) => setCriticalityFilter(e.target.value)}
            className="bg-[#0F172A] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Criticalities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
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
          <span className="text-white font-semibold">{filteredAssets.length}</span> / {assets.length} assets
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-[#111C30] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Synchronizing assets with Firestore...</span>
          </div>
        ) : filteredAssets.length === 0 ? (
          <EmptyState
            icon={Server}
            title={assets.length === 0 ? 'No Assets Registered Yet' : 'No Assets Match Search'}
            description={
              assets.length === 0
                ? 'Register your company servers, employee workstations, and network appliances.'
                : 'Try clearing your search query or changing the type/criticality filters.'
            }
            actionLabel={assets.length === 0 ? 'Register New Asset' : 'Clear Filters'}
            onAction={assets.length === 0 ? onAddNew : resetFilters}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0F172A] text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 px-4 font-semibold">Asset Name</th>
                  <th className="py-2.5 px-4 font-semibold">Type</th>
                  <th className="py-2.5 px-4 font-semibold">IP Address</th>
                  <th className="py-2.5 px-4 font-semibold">Criticality</th>
                  <th className="py-2.5 px-4 font-semibold">Department / Owner</th>
                  <th className="py-2.5 px-4 font-semibold">Registered</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                    onClick={() => onView(asset)}
                  >
                    <td className="py-3 px-4 font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
                      {asset.assetName}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                      {asset.assetType}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {asset.ipAddress ? (
                        <span className="font-mono tabular-nums text-[11px] text-slate-300 bg-[#0F172A] px-2 py-0.5 rounded border border-slate-800">
                          {asset.ipAddress}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge label={asset.criticality} variant="criticality" />
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {asset.ownerDepartment || '—'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-400 font-mono tabular-nums">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{asset.dateRegistered}</span>
                      </div>
                    </td>
                    <td
                      className="py-3 px-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onView(asset)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="View Asset Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEdit(asset)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                          title="Edit Asset"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(asset)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete Asset"
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
