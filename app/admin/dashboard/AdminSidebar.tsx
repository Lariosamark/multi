'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden p-3 text-slate-600 bg-white/90 backdrop-blur-sm fixed top-4 left-4 z-50 rounded-xl shadow-lg border border-slate-200/50 hover:bg-slate-50 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              isOpen
                ? 'M6 18L18 6M6 6l12 12'
                : 'M4 6h16M4 12h16M4 18h16'
            }
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col z-40 transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-72 shadow-2xl`}
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-700/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Multifactors
              </h1>
              <p className="text-sm text-slate-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col p-8 gap-6 flex-1">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">
            Main Menu
          </p>

          <Link
            href="/QuotationForm"
            className="group flex items-center gap-6 px-6 py-6 rounded-2xl hover:bg-slate-800/50 transition-all duration-200 hover:translate-x-1 border border-transparent hover:border-slate-700/30"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-blue-600/20 transition-colors shadow-lg">
              <svg
                className="w-7 h-7 text-slate-400 group-hover:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <span className="font-semibold text-lg text-slate-300 group-hover:text-white block mb-1">
                Quotation Form
              </span>
              <p className="text-sm text-slate-500 group-hover:text-slate-400">
                Create and manage new quotations
              </p>
            </div>
          </Link>

          <Link
            href="/quotation-list"
            className="group flex items-center gap-6 px-6 py-6 rounded-2xl hover:bg-slate-800/50 transition-all duration-200 hover:translate-x-1 border border-transparent hover:border-slate-700/30"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-green-600/20 transition-colors shadow-lg">
              <svg
                className="w-7 h-7 text-slate-400 group-hover:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <div className="flex-1">
              <span className="font-semibold text-lg text-slate-300 group-hover:text-white block mb-1">
                Quotation List
              </span>
              <p className="text-sm text-slate-500 group-hover:text-slate-400">
                View and track quotations
              </p>
            </div>
          </Link>

          <Link
            href="/manage-users"
            className="group flex items-center gap-6 px-6 py-6 rounded-2xl hover:bg-slate-800/50 transition-all duration-200 hover:translate-x-1 border border-transparent hover:border-slate-700/30"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-yellow-600/20 transition-colors shadow-lg">
              <svg
                className="w-7 h-7 text-slate-400 group-hover:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-6.13a4 4 0 11-8 0 4 4 0 018 0zm6 4a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <span className="font-semibold text-lg text-slate-300 group-hover:text-white block mb-1">
                Manage Users
              </span>
              <p className="text-sm text-slate-500 group-hover:text-slate-400">
                Approve or Decline user requests
              </p>
            </div>
          </Link>

          <Link
            href="/activity-log"
            className="group flex items-center gap-6 px-6 py-6 rounded-2xl hover:bg-slate-800/50 transition-all duration-200 hover:translate-x-1 border border-transparent hover:border-slate-700/30"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-red-600/20 transition-colors shadow-lg">
              <svg
                className="w-7 h-7 text-slate-400 group-hover:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </div>
            <div className="flex-1">
              <span className="font-semibold text-lg text-slate-300 group-hover:text-white block mb-1">
                Activity Log
              </span>
              <p className="text-sm text-slate-500 group-hover:text-slate-400">
                Track admin and user actions
              </p>
            </div>
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700/50 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>System Online</span>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium shadow-md transition-colors"
            aria-label="Logout"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Background overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
