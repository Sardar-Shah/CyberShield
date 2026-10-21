/**
 * Asset Service - Firestore CRUD Operations for IT Assets
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
import { ITAsset } from '../types';

const COLLECTION_NAME = 'assets';

/**
 * Fetch all IT assets from Firestore
 */
export async function getAssets(): Promise<ITAsset[]> {
  try {
    const assetsRef = collection(db, COLLECTION_NAME);
    const q = query(assetsRef, orderBy('dateRegistered', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    } as ITAsset));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
}

/**
 * Subscribe to real-time IT asset updates
 */
export function subscribeToAssets(
  callback: (assets: ITAsset[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const assetsRef = collection(db, COLLECTION_NAME);
  const q = query(assetsRef, orderBy('dateRegistered', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const assets = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      } as ITAsset));
      callback(assets);
    },
    (error) => {
      console.error('Asset snapshot error:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    }
  );
}

/**
 * Fetch a single asset by ID
 */
export async function getAssetById(id: string): Promise<ITAsset | null> {
  const path = `${COLLECTION_NAME}/${id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as ITAsset;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * CREATE a new IT asset record in Firestore
 */
export async function createAsset(asset: Omit<ITAsset, 'id'>): Promise<string> {
  try {
    const docData: Record<string, any> = {
      assetName: asset.assetName.trim(),
      assetType: asset.assetType,
      criticality: asset.criticality,
      dateRegistered: asset.dateRegistered,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (asset.ipAddress && asset.ipAddress.trim() !== '') {
      docData.ipAddress = asset.ipAddress.trim();
    }
    if (asset.ownerDepartment && asset.ownerDepartment.trim() !== '') {
      docData.ownerDepartment = asset.ownerDepartment.trim();
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
  }
}

/**
 * UPDATE an existing IT asset in Firestore
 */
export async function updateAsset(id: string, asset: Partial<ITAsset>): Promise<void> {
  const path = `${COLLECTION_NAME}/${id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData: Record<string, any> = {
      ...asset,
      updatedAt: new Date().toISOString()
    };
    delete updateData.id;

    // Clean up empty strings if necessary
    if (updateData.ipAddress !== undefined && updateData.ipAddress.trim() === '') {
      delete updateData.ipAddress;
    }
    if (updateData.ownerDepartment !== undefined && updateData.ownerDepartment.trim() === '') {
      delete updateData.ownerDepartment;
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * DELETE an IT asset from Firestore
 */
export async function deleteAsset(id: string): Promise<void> {
  const path = `${COLLECTION_NAME}/${id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
