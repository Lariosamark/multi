'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = getAuth();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Only allow Gmail logins
      if (!user.email?.endsWith('@gmail.com')) {
        alert('Only Gmail accounts are allowed.');
        await auth.signOut();
        setLoading(false);
        return;
      }

      // Check if user exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // New user - create record with 'pending' status
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          role: 'Employee',
          status: 'pending', // pending approval
          createdAt: new Date(),
        });
        alert('Your account is pending admin approval.');
        setLoading(false);
        return;
      }

      // Existing user - check approval & role
      const userData = userSnap.data();
      if (userData.status !== 'approved') {
        alert('Your account is not approved yet.');
        setLoading(false);
        return;
      }

      // Redirect based on role
      if (userData.role === 'Admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/employee/dashboard');
      }

    } catch (error) {
      console.error(error);
      alert('Login failed.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-6">Quotation Management System</h1>
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition"
        >
          {loading ? 'Signing in...' : 'Login with Gmail'}
        </button>
      </div>
    </div>
  );
}
