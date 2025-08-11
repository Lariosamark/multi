// app/firebase/firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app"; 
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCy77gzoYNN-NXV7SILDi7DHU6Ftqd2pGQ",
  authDomain: "msqms-cb53c.firebaseapp.com",
  projectId: "msqms-cb53c",
  storageBucket: "msqms-cb53c.firebasestorage.app",
  messagingSenderId: "961339131280",
  appId: "1:961339131280:web:3596757b8faae4bc81df15",
  measurementId: "G-DJ0QKS6W5B"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);


export { app, auth , db};