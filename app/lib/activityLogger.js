// lib/activityLogger.js
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/app/firebase/firebaseConfig';

export async function logActivity(action, quotationRefNo, userId, details) {
  try {
    await addDoc(collection(db, 'activityLogs'), {
      action,            // e.g. 'created', 'updated', 'approved'
      quotationRefNo,    // e.g. 'QT-2025-001'
      userId,            // user who performed action
      details: details || null, // extra info if any
      timestamp: Timestamp.now(),
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}
