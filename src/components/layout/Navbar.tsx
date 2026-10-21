import React, { useState, useEffect } from 'react';
import { ActivePage, SecurityIncident, ResponseTask } from '../../types';
import {
  Menu,
  Shield,
  Search,
  Bell,
  Database,
  User,
  LogOut,
  LogIn,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Server,
  ListTodo,
  ChevronRight
} from 'lucide-react';
import { auth, loginWithGoogle, logoutUser, testConnection } from '../../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { useToast } from '../../context/ToastContext';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onToggleSidebar: () => void;
  openIncidentModal: () => void;
  openAssetModal: () => void;
  openTaskModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  criticalIncidentCount: number;
  pendingTaskCount: number;
  criticalIncidents: SecurityIncident[];
  onViewIncident: (inc: SecurityIncident) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  onToggleSidebar,
  openIncidentModal,
  openAssetModal,
  openTaskModal,
  searchQuery,
  onSearchChange,
  criticalIncidentCount,
  pendingTaskCount,
  criticalIncidents,
  onViewIncident
}) => {
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(true);
  const [showQuickMenu, setShowQuickMenu] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  useEffect(() => {
    testConnection().then((ok) => setIsDbConnected(ok));

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleAuthAction = async () => {
    if (currentUser) {
      try {
        await logoutUser();
        showToast('info', 'Logged out', 'Operating as guest SecOps analyst.');
      } catch (err: any) {
        showToast('error', 'Sign-out failed', err.message);
      }
    } else {
      try {
        const user = await loginWithGoogle();
        showToast('success', 'Authenticated', `Signed in as ${user.displayName || user.email}`);
      } catch (err: any) {
        showToast('error', 'Authentication cancelled', err.message);
      }
    }
  };

  const getBreadcrumbs = () => {
    switch (activePage) {
      case 'dashboard':
        return { section: 'Overview', page: 'Security Operations Center' };
      case 'incidents':
        return { section: 'Threat Response', page: 'Incident Management' };
      case 'assets':
        return { section: 'Inventory', page: 'IT Assets' };
      case 'tasks':
        return { section: 'Workflows', page: 'Response Tasks' };
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 bg-[#0F172A] border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Clean Breadcrumb Hierarchy */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <span className="truncate">{breadcrumbs.section}</span>
              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="text-white font-semibold truncate">{breadcrumbs.page}</span>
            </div>
          </div>
        </div>

        {/* Right: Search, DB Status, Quick Add, Notifications, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Database Connection Status Tag */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#111C30] border border-slate-700/60 text-slate-300">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isDbConnected ? 'bg-emerald-400' : 'bg-rose-400'
              }`}
            />
            <span className="font-mono text-[10px]">Firestore</span>
          </div>

          {/* Search Box */}
          <div className="relative hidden md:block w-44 lg:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter records..."
              className="w-full bg-[#111C30] border border-slate-700/80 rounded-lg pl-8 pr-6 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                title="Clear filter"
              >
                ×
              </button>
            )}
          </div>

          {/* Quick Add Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowQuickMenu(!showQuickMenu)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm"
              title="Create new record"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Record</span>
            </button>

            {showQuickMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowQuickMenu(false)} />
                <div className="absolute right-0 mt-2 w-52 bg-[#111C30] border border-slate-700 rounded-xl shadow-2xl p-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Add Database Entry
                  </div>
                  <button
                    onClick={() => {
                      setShowQuickMenu(false);
                      openIncidentModal();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:text-white hover:bg-blue-600/20 rounded-lg transition-colors text-left"
                  >
                    <Shield className="w-4 h-4 text-rose-400" />
                    <span>Security Incident</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowQuickMenu(false);
                      openAssetModal();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:text-white hover:bg-blue-600/20 rounded-lg transition-colors text-left"
                  >
                    <Server className="w-4 h-4 text-blue-400" />
                    <span>IT Asset</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowQuickMenu(false);
                      openTaskModal();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:text-white hover:bg-blue-600/20 rounded-lg transition-colors text-left"
                  >
                    <ListTodo className="w-4 h-4 text-amber-400" />
                    <span>Response Task</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="System Alerts"
            >
              <Bell className="w-4 h-4" />
              {(criticalIncidentCount > 0 || pendingTaskCount > 0) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0F172A]" />
              )}
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 mt-2 w-80 bg-[#111C30] border border-slate-700 rounded-xl shadow-2xl p-3 z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                    <span className="text-xs font-semibold text-slate-200">Alert Center</span>
                    <span className="text-[10px] text-slate-400 font-mono">Firestore Realtime</span>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {criticalIncidentCount > 0 && (
                      <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-800/40 text-xs">
                        <div className="flex items-center justify-between text-rose-300 font-semibold mb-1">
                          <span className="flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                            {criticalIncidentCount} Critical Incident{criticalIncidentCount > 1 ? 's' : ''}
                          </span>
                          <button
                            onClick={() => {
                              setShowNotifications(false);
                              onNavigate('incidents');
                            }}
                            className="text-[10px] text-rose-300 underline hover:text-white"
                          >
                            View
                          </button>
                        </div>
                        <div className="space-y-1 mt-1.5">
                          {criticalIncidents.slice(0, 3).map((inc) => (
                            <div
                              key={inc.id}
                              onClick={() => {
                                setShowNotifications(false);
                                onViewIncident(inc);
                              }}
                              className="text-[11px] text-slate-300 hover:text-white truncate cursor-pointer py-0.5"
                            >
                              • {inc.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {pendingTaskCount > 0 && (
                      <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs">
                        <div className="flex items-center justify-between text-amber-300 font-semibold">
                          <span className="flex items-center gap-1.5">
                            <ListTodo className="w-3.5 h-3.5 text-amber-400" />
                            {pendingTaskCount} Pending Response Task{pendingTaskCount > 1 ? 's' : ''}
                          </span>
                          <button
                            onClick={() => {
                              setShowNotifications(false);
                              onNavigate('tasks');
                            }}
                            className="text-[10px] text-amber-300 underline hover:text-white"
                          >
                            Manage
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Firestore Persistent Storage
                      </span>
                      <span className="text-emerald-400 font-mono text-[10px]">CONNECTED</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile / Auth Area */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <button
              onClick={handleAuthAction}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-[#111C30] hover:bg-slate-800 text-xs text-slate-300 border border-slate-700/60 transition-colors"
              title={currentUser ? `Signed in as ${currentUser.email}. Click to sign out.` : 'Sign in with Google (optional)'}
            >
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Avatar" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                  <User className="w-3 h-3" />
                </div>
              )}
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-[11px] font-semibold text-slate-200 line-clamp-1 max-w-[85px]">
                  {currentUser?.displayName || 'Analyst'}
                </div>
                <div className="text-[9px] text-slate-400">
                  {currentUser ? 'Authorized' : 'Guest'}
                </div>
              </div>
              {currentUser ? (
                <LogOut className="w-3 h-3 text-slate-400 hover:text-rose-400 ml-0.5" />
              ) : (
                <LogIn className="w-3 h-3 text-slate-400 hover:text-blue-400 ml-0.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
