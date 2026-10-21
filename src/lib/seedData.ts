/**
 * Seed data utility for demonstration and university grading
 * Only inserted on user request or if database is empty upon explicit user action
 */

import { createIncident, getIncidents } from '../services/incidentService';
import { createAsset, getAssets } from '../services/assetService';
import { createResponseTask, getResponseTasks } from '../services/taskService';

export async function seedDemoDataIfEmpty(): Promise<{ inserted: boolean; message: string }> {
  try {
    const [existingIncidents, existingAssets, existingTasks] = await Promise.all([
      getIncidents(),
      getAssets(),
      getResponseTasks()
    ]);

    if (existingIncidents.length > 0 || existingAssets.length > 0 || existingTasks.length > 0) {
      return {
        inserted: false,
        message: 'Database already contains records. Seeding skipped to prevent duplicates.'
      };
    }

    // 1. Seed Incidents
    const inc1Id = await createIncident({
      title: 'Suspicious Administrative Account Privilege Escalation',
      incidentType: 'Unauthorized Access',
      severity: 'Critical',
      status: 'Investigating',
      description: 'Multiple unauthorized sudo escalations detected on core database server DB-PROD-01 originating from unauthorized internal IP.',
      dateReported: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0]
    });

    const inc2Id = await createIncident({
      title: 'Credential Harvesting Phishing Campaign Target: Finance Dept',
      incidentType: 'Phishing',
      severity: 'High',
      status: 'Open',
      description: 'Targeted emails received mimicking corporate Microsoft 365 sign-in page with spoofed domains and external tracking links.',
      dateReported: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0]
    });

    const inc3Id = await createIncident({
      title: 'Malware Detected on HR Department Workstation',
      incidentType: 'Malware',
      severity: 'Medium',
      status: 'Resolved',
      description: 'Endpoint protection isolated an executable named payroll_update_v2.exe containing an obfuscated Trojan downloader.',
      dateReported: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0]
    });

    // 2. Seed Assets
    await createAsset({
      assetName: 'DB-PROD-01 (Primary PostgreSQL Cluster)',
      assetType: 'Server',
      ipAddress: '192.168.10.45',
      ownerDepartment: 'Database Infrastructure',
      criticality: 'High',
      dateRegistered: '2026-01-15'
    });

    await createAsset({
      assetName: 'CORE-SW-01 (Core Distribution Switch)',
      assetType: 'Network Device',
      ipAddress: '192.168.1.1',
      ownerDepartment: 'Network Operations',
      criticality: 'High',
      dateRegistered: '2026-02-01'
    });

    await createAsset({
      assetName: 'WS-FIN-08 (Financial Controller Workstation)',
      assetType: 'Computer',
      ipAddress: '10.0.4.112',
      ownerDepartment: 'Finance & Accounting',
      criticality: 'Medium',
      dateRegistered: '2026-03-10'
    });

    await createAsset({
      assetName: 'EXT-FW-02 (Perimeter Edge Firewall)',
      assetType: 'Network Device',
      ipAddress: '203.0.113.1',
      ownerDepartment: 'SecOps',
      criticality: 'High',
      dateRegistered: '2026-01-20'
    });

    // 3. Seed Tasks
    await createResponseTask({
      taskTitle: 'Revoke compromised DB-PROD-01 SSH keys and rotate root credentials',
      relatedIncidentId: inc1Id,
      relatedIncidentTitle: 'Suspicious Administrative Account Privilege Escalation',
      assignedAnalyst: 'Alex Morgan (Senior SecOps)',
      priority: 'High',
      status: 'In Progress',
      dueDate: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0]
    });

    await createResponseTask({
      taskTitle: 'Block fraudulent phishing sender domain across email gateways',
      relatedIncidentId: inc2Id,
      relatedIncidentTitle: 'Credential Harvesting Phishing Campaign Target: Finance Dept',
      assignedAnalyst: 'Sarah Chen (Threat Intel)',
      priority: 'High',
      status: 'Pending',
      dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]
    });

    await createResponseTask({
      taskTitle: 'Forensic image capture of HR workstation endpoint',
      relatedIncidentId: inc3Id,
      relatedIncidentTitle: 'Malware Detected on HR Department Workstation',
      assignedAnalyst: 'David Kim (IR Lead)',
      priority: 'Medium',
      status: 'Completed',
      dueDate: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0]
    });

    return {
      inserted: true,
      message: 'Demo dataset successfully loaded into Firestore!'
    };
  } catch (err: any) {
    console.error('Failed to seed demo data:', err);
    throw err;
  }
}
