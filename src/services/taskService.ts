/**
 * Task Service - Firestore CRUD Operations for Incident Response Tasks
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
import { ResponseTask } from '../types';

const COLLECTION_NAME = 'responseTasks';

/**
 * Fetch all response tasks from Firestore
 */
export async function getResponseTasks(): Promise<ResponseTask[]> {
  try {
    const tasksRef = collection(db, COLLECTION_NAME);
    const q = query(tasksRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    } as ResponseTask));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
}

/**
 * Subscribe to real-time response tasks
 */
export function subscribeToResponseTasks(
  callback: (tasks: ResponseTask[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const tasksRef = collection(db, COLLECTION_NAME);
  const q = query(tasksRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const tasks = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      } as ResponseTask));
      callback(tasks);
    },
    (error) => {
      console.error('Task snapshot error:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    }
  );
}

/**
 * Fetch a single response task by ID
 */
export async function getTaskById(id: string): Promise<ResponseTask | null> {
  const path = `${COLLECTION_NAME}/${id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as ResponseTask;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * CREATE a response task in Firestore
 */
export async function createResponseTask(task: Omit<ResponseTask, 'id'>): Promise<string> {
  try {
    const docData: Record<string, any> = {
      taskTitle: task.taskTitle.trim(),
      priority: task.priority,
      status: task.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (task.relatedIncidentId && task.relatedIncidentId.trim() !== '') {
      docData.relatedIncidentId = task.relatedIncidentId.trim();
    }
    if (task.relatedIncidentTitle && task.relatedIncidentTitle.trim() !== '') {
      docData.relatedIncidentTitle = task.relatedIncidentTitle.trim();
    }
    if (task.assignedAnalyst && task.assignedAnalyst.trim() !== '') {
      docData.assignedAnalyst = task.assignedAnalyst.trim();
    }
    if (task.dueDate && task.dueDate.trim() !== '') {
      docData.dueDate = task.dueDate.trim();
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
  }
}

/**
 * UPDATE an existing response task in Firestore
 */
export async function updateResponseTask(id: string, task: Partial<ResponseTask>): Promise<void> {
  const path = `${COLLECTION_NAME}/${id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData: Record<string, any> = {
      ...task,
      updatedAt: new Date().toISOString()
    };
    delete updateData.id;

    // Clean empty fields
    if (updateData.relatedIncidentId !== undefined && updateData.relatedIncidentId.trim() === '') {
      delete updateData.relatedIncidentId;
    }
    if (updateData.relatedIncidentTitle !== undefined && updateData.relatedIncidentTitle.trim() === '') {
      delete updateData.relatedIncidentTitle;
    }
    if (updateData.assignedAnalyst !== undefined && updateData.assignedAnalyst.trim() === '') {
      delete updateData.assignedAnalyst;
    }
    if (updateData.dueDate !== undefined && updateData.dueDate.trim() === '') {
      delete updateData.dueDate;
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * DELETE a response task from Firestore
 */
export async function deleteResponseTask(id: string): Promise<void> {
  const path = `${COLLECTION_NAME}/${id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
