/**
 * Incident Service - Firestore CRUD Operations for Security Incidents
 * University Web Development Assignment
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { SecurityIncident } from '../types';

const COLLECTION_NAME = 'incidents';

/**
 * Fetch all incidents from Firestore (one-time fetch)
 */
export async function getIncidents(): Promise<SecurityIncident[]> {
  try {
    const incidentsRef = collection(db, COLLECTION_NAME);
    const q = query(incidentsRef, orderBy('dateReported', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    } as SecurityIncident));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
}

/**
 * Subscribe to real-time incident updates
 */
export function subscribeToIncidents(
  callback: (incidents: SecurityIncident[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const incidentsRef = collection(db, COLLECTION_NAME);
  const q = query(incidentsRef, orderBy('dateReported', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const incidents = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      } as SecurityIncident));
      callback(incidents);
    },
    (error) => {
      console.error('Incident snapshot error:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    }
  );
}

/**
 * Fetch a single incident by ID
 */
export async function getIncidentById(id: string): Promise<SecurityIncident | null> {
  const path = `${COLLECTION_NAME}/${id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as SecurityIncident;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * CREATE a new incident record in Firestore
 */
export async function createIncident(incident: Omit<SecurityIncident, 'id'>): Promise<string> {
  try {
    const docData = {
      title: incident.title.trim(),
      incidentType: incident.incidentType,
      severity: incident.severity,
      status: incident.status,
      description: incident.description.trim(),
      dateReported: incident.dateReported,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
  }
}

/**
 * UPDATE an existing incident in Firestore
 */
export async function updateIncident(id: string, incident: Partial<SecurityIncident>): Promise<void> {
  const path = `${COLLECTION_NAME}/${id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData: Record<string, any> = {
      ...incident,
      updatedAt: new Date().toISOString()
    };
    // Ensure we do not save the id property into document fields
    delete updateData.id;

    await updateDoc(docRef, updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * DELETE an incident from Firestore
 */
export async function deleteIncident(id: string): Promise<void> {
  const path = `${COLLECTION_NAME}/${id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
