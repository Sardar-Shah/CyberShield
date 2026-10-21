/**
 * CyberShield - Data Types and Interfaces
 * University Web Development Assignment
 */

export type IncidentType =
  | 'Phishing'
  | 'Malware'
  | 'Unauthorized Access'
  | 'Suspicious Login'
  | 'Data Breach'
  | 'Other';

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type IncidentStatus = 'Open' | 'Investigating' | 'Resolved';

export interface SecurityIncident {
  id?: string;
  title: string;
  incidentType: IncidentType;
  severity: SeverityLevel;
  status: IncidentStatus;
  description: string;
  dateReported: string; // YYYY-MM-DD
  createdAt?: string;
  updatedAt?: string;
}

export type AssetType = 'Computer' | 'Server' | 'Network Device' | 'Other';
export type AssetCriticality = 'Low' | 'Medium' | 'High';

export interface ITAsset {
  id?: string;
  assetName: string;
  assetType: AssetType;
  ipAddress?: string;
  ownerDepartment?: string;
  criticality: AssetCriticality;
  dateRegistered: string; // YYYY-MM-DD
  createdAt?: string;
  updatedAt?: string;
}

export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface ResponseTask {
  id?: string;
  taskTitle: string;
  relatedIncidentId?: string;
  relatedIncidentTitle?: string;
  assignedAnalyst?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string; // YYYY-MM-DD
  createdAt?: string;
  updatedAt?: string;
}

export type ActivePage = 'dashboard' | 'incidents' | 'assets' | 'tasks';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}
