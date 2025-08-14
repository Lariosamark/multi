'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';

export default function Sidebar() {
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
        className="lg:hidden p-3 text-white bg-gradient-to-r from-violet-600 to-purple-600 fixed top-6 left-6 z-50 rounded-2xl shadow-2xl border border-white/20 hover:scale-105 transition-all duration-300 backdrop-blur-xl"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
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
        className={`fixed top-0 left-0 h-screen w-80 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col z-40 transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        transition-all duration-500 ease-out lg:translate-x-0 lg:static shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] border-r border-white/5`}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-violet-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Header */}
        <div className="relative p-8 border-b border-white/10">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                Multifactors
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                <p className="text-sm text-slate-400 font-medium">Admin Pannel</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="relative flex flex-col p-6 gap-4 flex-1 overflow-y-auto scrollbar-none">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3">
              Main Menu
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
          </div>


           <Link
    href="/project"
    className="group flex items-center gap-6 px-6 py-6 rounded-2xl hover:bg-slate-800/50 transition-all duration-200 hover:translate-x-1 border border-transparent hover:border-slate-700/30"
    onClick={() => setIsOpen(false)}
  >
    <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-indigo-600/20 transition-colors shadow-lg">
      <svg
        className="w-7 h-7 text-slate-400 group-hover:text-indigo-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7l9-4 9 4-9 4-9-4zm0 6l9-4 9 4M3 13v6l9 4 9-4v-6"
        />
      </svg>
    </div>
    <div className="flex-1">
      <span className="font-semibold text-lg text-slate-300 group-hover:text-white block mb-1">
        New Project
      </span>
      <p className="text-sm text-slate-500 group-hover:text-slate-400">
        Create and manage projects
      </p>
    </div>
  </Link>


          <Link
  href="/save-projects"
  className="group flex items-center gap-6 px-6 py-6 rounded-2xl hover:bg-slate-800/50 transition-all duration-200 hover:translate-x-1 border border-transparent hover:border-slate-700/30"
  onClick={() => setIsOpen(false)}
>
  <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-purple-600/20 transition-colors shadow-lg">
    <svg
      className="w-7 h-7 text-slate-400 group-hover:text-purple-400"
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
      Save Project
    </span>
    <p className="text-sm text-slate-500 group-hover:text-slate-400">
      View saved projects & linked forms
    </p>
  </div>
  </Link>


          <Link
            href="/component/QuotationForm"
            className="group relative flex items-center gap-4 px-6 py-5 rounded-2xl hover:bg-white/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 border border-transparent hover:border-white/10"
            onClick={() => setIsOpen(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-2xl transition-all duration-300"></div>
            <div className="relative w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl flex items-center justify-center group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-all duration-300 shadow-lg">
              <svg
                className="w-7 h-7 text-slate-400 group-hover:text-blue-400 transition-colors duration-300"
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
            <div className="relative flex-1">
              <span className="font-bold text-lg text-slate-200 group-hover:text-white block mb-1 transition-colors duration-300">
                Quotation Form
              </span>
              <p className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors duration-300">
                Create and manage new quotations for your clients
              </p>
            </div>
            <div className="relative flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg shadow-blue-400/50 mr-3"></div>
              <svg
                className="w-5 h-5 text-slate-500 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          <Link
            href="/component/quotation-list"
            className="group relative flex items-center gap-4 px-6 py-5 rounded-2xl hover:bg-white/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10 border border-transparent hover:border-white/10"
            onClick={() => setIsOpen(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 rounded-2xl transition-all duration-300"></div>
            <div className="relative w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl flex items-center justify-center group-hover:from-emerald-600/30 group-hover:to-teal-600/30 transition-all duration-300 shadow-lg">
              <svg
                className="w-7 h-7 text-slate-400 group-hover:text-emerald-400 transition-colors duration-300"
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
            <div className="relative flex-1">
              <span className="font-bold text-lg text-slate-200 group-hover:text-white block mb-1 transition-colors duration-300">
                Quotation List
              </span>
              <p className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors duration-300">
                View and track all your existing quotations
              </p>
            </div>
            <div className="relative flex items-center">
              <div className="w-2 h-2 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg shadow-emerald-400/50 mr-3"></div>
              <svg
                className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          <Link
            href="/component/manage-users"
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

          {/* Quick Stats Card */}
          <div className="mt-6 p-5 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
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
              <h3 className="font-bold text-white text-sm">Quick Stats</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Active Quotes</span>
                <span className="text-sm font-bold text-blue-400">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">This Month</span>
                <span className="text-sm font-bold text-emerald-400">8</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="relative p-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-4 text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <span className="font-medium">System Online</span>
            </div>
            <div className="text-xs text-slate-500">v2.4.1</div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="group relative w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold shadow-2xl shadow-red-500/25 transition-all duration-300 hover:scale-105 hover:shadow-red-500/40 border border-red-400/20"
            aria-label="Logout"
          >
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
              />
            </svg>
            <span className="relative">Logout</span>
          </button>
        </div>
      </aside>

      {/* Enhanced background overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md lg:hidden z-30 transition-all duration-500"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}