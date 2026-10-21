import React from 'react';
import { ActivePage } from '../../types';
import {
  Shield,
  LayoutDashboard,
  AlertOctagon,
  Server,
  ListTodo,
  X,
  Database
} from 'lucide-react';

interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  isOpen: boolean;
  onClose: () => void;
  incidentCount: number;
  assetCount: number;
  taskCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  isOpen,
  onClose,
  incidentCount,
  assetCount,
  taskCount
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActivePage,
      label: 'SOC Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'incidents' as ActivePage,
      label: 'Security Incidents',
      icon: AlertOctagon,
      badge: incidentCount
    },
    {
      id: 'assets' as ActivePage,
      label: 'IT Asset Inventory',
      icon: Server,
      badge: assetCount
    },
    {
      id: 'tasks' as ActivePage,
      label: 'Response Tasks',
      icon: ListTodo,
      badge: taskCount
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight flex items-center">
                CyberShield
              </span>
              <span className="block text-[10px] font-medium text-slate-400 tracking-wide">
                Incident Response Platform
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Operational Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors group ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== null && (
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded tabular-nums ${
                      isActive
                        ? 'bg-blue-500/20 text-blue-300 font-bold'
                        : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Database & University Info Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0B1120]/50 space-y-3">
          <div className="p-2.5 rounded-lg bg-[#111C30] border border-slate-800 text-xs">
            <div className="flex items-center justify-between text-slate-300 font-medium mb-1">
              <span className="flex items-center gap-1.5 text-[11px]">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                Cloud Firestore
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">LIVE</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              Persistent collections: incidents, assets, responseTasks
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>CyberShield System</span>
            <span className="font-mono text-[10px] text-slate-400">v1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
