/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  ActivePage,
  SecurityIncident,
  ITAsset,
  ResponseTask
} from './types';
import { ToastProvider, useToast } from './context/ToastContext';
import { ToastContainer } from './components/common/ToastContainer';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';

// Incident Management Components
import { IncidentTable } from './components/incidents/IncidentTable';
import { IncidentFormModal } from './components/incidents/IncidentFormModal';
import { IncidentDetailModal } from './components/incidents/IncidentDetailModal';

// Asset Management Components
import { AssetTable } from './components/assets/AssetTable';
import { AssetFormModal } from './components/assets/AssetFormModal';
import { AssetDetailModal } from './components/assets/AssetDetailModal';

// Response Task Components
import { TaskTable } from './components/tasks/TaskTable';
import { TaskFormModal } from './components/tasks/TaskFormModal';
import { TaskDetailModal } from './components/tasks/TaskDetailModal';

// Confirmation Modal
import { ConfirmDialog } from './components/common/ConfirmDialog';

// Services
import {
  subscribeToIncidents,
  deleteIncident
} from './services/incidentService';
import {
  subscribeToAssets,
  deleteAsset
} from './services/assetService';
import {
  subscribeToResponseTasks,
  deleteResponseTask
} from './services/taskService';
import { seedDemoDataIfEmpty } from './lib/seedData';

const MainAppContent: React.FC = () => {
  const { showToast } = useToast();

  // Navigation & UI State
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  // Firestore Data Collections
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [assets, setAssets] = useState<ITAsset[]>([]);
  const [tasks, setTasks] = useState<ResponseTask[]>([]);

  // Loading States
  const [loadingIncidents, setLoadingIncidents] = useState<boolean>(true);
  const [loadingAssets, setLoadingAssets] = useState<boolean>(true);
  const [loadingTasks, setLoadingTasks] = useState<boolean>(true);

  // Modal States: Incidents
  const [isIncidentFormOpen, setIsIncidentFormOpen] = useState(false);
  const [incidentToEdit, setIncidentToEdit] = useState<SecurityIncident | null>(null);
  const [selectedIncidentForView, setSelectedIncidentForView] = useState<SecurityIncident | null>(null);
  const [incidentToDelete, setIncidentToDelete] = useState<SecurityIncident | null>(null);
  const [isDeletingIncident, setIsDeletingIncident] = useState(false);

  // Modal States: Assets
  const [isAssetFormOpen, setIsAssetFormOpen] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState<ITAsset | null>(null);
  const [selectedAssetForView, setSelectedAssetForView] = useState<ITAsset | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<ITAsset | null>(null);
  const [isDeletingAsset, setIsDeletingAsset] = useState(false);

  // Modal States: Tasks
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<ResponseTask | null>(null);
  const [selectedTaskForView, setSelectedTaskForView] = useState<ResponseTask | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<ResponseTask | null>(null);
  const [initialTaskIncident, setInitialTaskIncident] = useState<SecurityIncident | null>(null);
  const [isDeletingTask, setIsDeletingTask] = useState(false);

  // Real-time Firestore Subscriptions
  useEffect(() => {
    const unsubIncidents = subscribeToIncidents(
      (data) => {
        setIncidents(data);
        setLoadingIncidents(false);
      },
      (err) => {
        setLoadingIncidents(false);
        showToast('error', 'Incident Sync Error', err.message);
      }
    );

    const unsubAssets = subscribeToAssets(
      (data) => {
        setAssets(data);
        setLoadingAssets(false);
      },
      (err) => {
        setLoadingAssets(false);
        showToast('error', 'Asset Sync Error', err.message);
      }
    );

    const unsubTasks = subscribeToResponseTasks(
      (data) => {
        setTasks(data);
        setLoadingTasks(false);
      },
      (err) => {
        setLoadingTasks(false);
        showToast('error', 'Task Sync Error', err.message);
      }
    );

    return () => {
      unsubIncidents();
      unsubAssets();
      unsubTasks();
    };
  }, [showToast]);

  // Seeding Handler
  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      const result = await seedDemoDataIfEmpty();
      if (result.inserted) {
        showToast('success', 'Demo Data Ready', result.message);
      } else {
        showToast('info', 'Demo Data Exists', result.message);
      }
    } catch (err: any) {
      showToast('error', 'Seeding Failed', err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  // Incident CRUD Handlers
  const handleOpenAddIncident = () => {
    setIncidentToEdit(null);
    setIsIncidentFormOpen(true);
  };

  const handleOpenEditIncident = (incident: SecurityIncident) => {
    setIncidentToEdit(incident);
    setIsIncidentFormOpen(true);
  };

  const handleDeleteIncidentConfirm = async () => {
    if (!incidentToDelete || !incidentToDelete.id) return;
    setIsDeletingIncident(true);
    try {
      await deleteIncident(incidentToDelete.id);
      showToast('success', 'Incident Deleted', `Removed "${incidentToDelete.title}"`);
      setIncidentToDelete(null);
    } catch (err: any) {
      showToast('error', 'Delete Failed', err.message);
    } finally {
      setIsDeletingIncident(false);
    }
  };

  // Asset CRUD Handlers
  const handleOpenAddAsset = () => {
    setAssetToEdit(null);
    setIsAssetFormOpen(true);
  };

  const handleOpenEditAsset = (asset: ITAsset) => {
    setAssetToEdit(asset);
    setIsAssetFormOpen(true);
  };

  const handleDeleteAssetConfirm = async () => {
    if (!assetToDelete || !assetToDelete.id) return;
    setIsDeletingAsset(true);
    try {
      await deleteAsset(assetToDelete.id);
      showToast('success', 'Asset Deleted', `Removed "${assetToDelete.assetName}"`);
      setAssetToDelete(null);
    } catch (err: any) {
      showToast('error', 'Delete Failed', err.message);
    } finally {
      setIsDeletingAsset(false);
    }
  };

  // Task CRUD Handlers
  const handleOpenAddTask = (incidentForTask?: SecurityIncident | null) => {
    setTaskToEdit(null);
    setInitialTaskIncident(incidentForTask || null);
    setIsTaskFormOpen(true);
  };

  const handleOpenEditTask = (task: ResponseTask) => {
    setTaskToEdit(task);
    setInitialTaskIncident(null);
    setIsTaskFormOpen(true);
  };

  const handleDeleteTaskConfirm = async () => {
    if (!taskToDelete || !taskToDelete.id) return;
    setIsDeletingTask(true);
    try {
      await deleteResponseTask(taskToDelete.id);
      showToast('success', 'Task Deleted', `Removed "${taskToDelete.taskTitle}"`);
      setTaskToDelete(null);
    } catch (err: any) {
      showToast('error', 'Delete Failed', err.message);
    } finally {
      setIsDeletingTask(false);
    }
  };

  const handleNavigateToIncidentFromTask = (incidentId: string) => {
    const inc = incidents.find((i) => i.id === incidentId);
    if (inc) {
      setSelectedIncidentForView(inc);
    } else {
      setActivePage('incidents');
    }
  };

  const criticalIncidentCount = incidents.filter((i) => i.severity === 'Critical').length;

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* Toast Notification Mount */}
      <ToastContainer />

      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          setSearchQuery('');
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        incidentCount={incidents.length}
        assetCount={assets.length}
        taskCount={tasks.length}
      />

      {/* Main Content Area (offset by sidebar on desktop) */}
      <div className="flex-1 flex flex-col lg:pl-64 transition-all">
        {/* Top Navbar */}
        <Navbar
          activePage={activePage}
          onNavigate={(page) => {
            setActivePage(page);
            setSearchQuery('');
          }}
          onToggleSidebar={() => setSidebarOpen(true)}
          openIncidentModal={handleOpenAddIncident}
          openAssetModal={handleOpenAddAsset}
          openTaskModal={() => handleOpenAddTask(null)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          criticalIncidentCount={criticalIncidentCount}
          pendingTaskCount={tasks.filter((t) => t.status === 'Pending').length}
          criticalIncidents={incidents.filter((i) => i.severity === 'Critical')}
          onViewIncident={(inc) => setSelectedIncidentForView(inc)}
        />

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-7xl w-full mx-auto">
          {activePage === 'dashboard' && (
            <DashboardView
              incidents={incidents}
              assets={assets}
              tasks={tasks}
              onNavigate={(page) => {
                setActivePage(page);
                setSearchQuery('');
              }}
              openIncidentModal={handleOpenAddIncident}
              openAssetModal={handleOpenAddAsset}
              openTaskModal={() => handleOpenAddTask(null)}
              onViewIncident={(inc) => setSelectedIncidentForView(inc)}
              onSeedDemoData={handleSeedData}
              isSeeding={isSeeding}
            />
          )}

          {activePage === 'incidents' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Security Incident Management</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Log and investigate threats, categorize severity, and track containment workflows in Firestore.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddIncident}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm"
                >
                  + Report Incident
                </button>
              </div>

              <IncidentTable
                incidents={incidents}
                isLoading={loadingIncidents}
                onView={(inc) => setSelectedIncidentForView(inc)}
                onEdit={handleOpenEditIncident}
                onDelete={(inc) => setIncidentToDelete(inc)}
                onAddNew={handleOpenAddIncident}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
          )}

          {activePage === 'assets' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">IT Asset Inventory</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Maintain organizational hardware, servers, routers, and host IP address assignments.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddAsset}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm"
                >
                  + Register Asset
                </button>
              </div>

              <AssetTable
                assets={assets}
                isLoading={loadingAssets}
                onView={(asset) => setSelectedAssetForView(asset)}
                onEdit={handleOpenEditAsset}
                onDelete={(asset) => setAssetToDelete(asset)}
                onAddNew={handleOpenAddAsset}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
          )}

          {activePage === 'tasks' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Incident Response Tasks</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Coordinate tactical containment, evidence analysis, and remediation tasks.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenAddTask(null)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm"
                >
                  + Create Task
                </button>
              </div>

              <TaskTable
                tasks={tasks}
                isLoading={loadingTasks}
                onView={(task) => setSelectedTaskForView(task)}
                onEdit={handleOpenEditTask}
                onDelete={(task) => setTaskToDelete(task)}
                onAddNew={() => handleOpenAddTask(null)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
          )}
        </main>
      </div>

      {/* --- MODAL DIALOGS --- */}

      {/* Incident Form Modal (Create / Update) */}
      <IncidentFormModal
        isOpen={isIncidentFormOpen}
        onClose={() => setIsIncidentFormOpen(false)}
        incidentToEdit={incidentToEdit}
        onSuccess={() => {}}
      />

      {/* Incident Detail Modal */}
      <IncidentDetailModal
        isOpen={selectedIncidentForView !== null}
        onClose={() => setSelectedIncidentForView(null)}
        incident={selectedIncidentForView}
        onEdit={(inc) => {
          setSelectedIncidentForView(null);
          handleOpenEditIncident(inc);
        }}
        onDelete={(inc) => {
          setSelectedIncidentForView(null);
          setIncidentToDelete(inc);
        }}
        onCreateTask={(inc) => {
          setSelectedIncidentForView(null);
          handleOpenAddTask(inc);
        }}
      />

      {/* Incident Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={incidentToDelete !== null}
        onClose={() => setIncidentToDelete(null)}
        onConfirm={handleDeleteIncidentConfirm}
        title="Delete Security Incident"
        message="Are you sure you want to permanently delete this security incident report?"
        itemName={incidentToDelete?.title}
        confirmLabel="Delete Incident"
        isDeleting={isDeletingIncident}
      />

      {/* Asset Form Modal (Create / Update) */}
      <AssetFormModal
        isOpen={isAssetFormOpen}
        onClose={() => setIsAssetFormOpen(false)}
        assetToEdit={assetToEdit}
        onSuccess={() => {}}
      />

      {/* Asset Detail Modal */}
      <AssetDetailModal
        isOpen={selectedAssetForView !== null}
        onClose={() => setSelectedAssetForView(null)}
        asset={selectedAssetForView}
        onEdit={(asset) => {
          setSelectedAssetForView(null);
          handleOpenEditAsset(asset);
        }}
        onDelete={(asset) => {
          setSelectedAssetForView(null);
          setAssetToDelete(asset);
        }}
      />

      {/* Asset Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={assetToDelete !== null}
        onClose={() => setAssetToDelete(null)}
        onConfirm={handleDeleteAssetConfirm}
        title="Delete IT Asset"
        message="Are you sure you want to remove this IT asset from the registered inventory?"
        itemName={assetToDelete?.assetName}
        confirmLabel="Delete Asset"
        isDeleting={isDeletingAsset}
      />

      {/* Task Form Modal (Create / Update) */}
      <TaskFormModal
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        taskToEdit={taskToEdit}
        incidents={incidents}
        initialIncident={initialTaskIncident}
        onSuccess={() => {}}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={selectedTaskForView !== null}
        onClose={() => setSelectedTaskForView(null)}
        task={selectedTaskForView}
        onEdit={(task) => {
          setSelectedTaskForView(null);
          handleOpenEditTask(task);
        }}
        onDelete={(task) => {
          setSelectedTaskForView(null);
          setTaskToDelete(task);
        }}
        onViewRelatedIncident={handleNavigateToIncidentFromTask}
      />

      {/* Task Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={taskToDelete !== null}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteTaskConfirm}
        title="Delete Response Task"
        message="Are you sure you want to delete this incident response task?"
        itemName={taskToDelete?.taskTitle}
        confirmLabel="Delete Task"
        isDeleting={isDeletingTask}
      />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <MainAppContent />
    </ToastProvider>
  );
}
