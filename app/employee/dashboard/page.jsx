'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/app/firebase/firebaseConfig'; // adjust path accordingly
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/component/Sidebar';

export default function EmployeeDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || user.email || 'Employee');
    } else {
      router.push('/login'); // redirect if no user
    }
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome, {userName}!</h1>
        <p className="mb-8 text-lg">
          Your account is approved. You can now access your dashboard.
        </p>

        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-lg shadow-lg transition"
        >
          Logout
        </button>
      </main>
    </div>
  );
}
