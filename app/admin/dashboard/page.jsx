'use client';
import AdminSidebar from '@/app/admin/dashboard/AdminSidebar';
import Link from 'next/link';
import { useState } from 'react';
import {
  Home,
  FileText,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
        <AdminSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <button
            className="md:hidden text-indigo-900"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
          <div>
            {/* You can put profile avatar, notifications etc. here */}
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 p-6 overflow-auto">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded shadow p-6">
              <h2 className="text-lg font-semibold mb-2">Total Quotations</h2>
              <p className="text-3xl font-bold">125</p>
            </div>
            <div className="bg-white rounded shadow p-6">
              <h2 className="text-lg font-semibold mb-2">Pending Approvals</h2>
              <p className="text-3xl font-bold text-yellow-600">8</p>
            </div>
            <div className="bg-white rounded shadow p-6">
              <h2 className="text-lg font-semibold mb-2">Users</h2>
              <p className="text-3xl font-bold text-indigo-700">23</p>
            </div>
          </section>

          <section className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Quotations</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-2 px-4">Ref No.</th>
                  <th className="py-2 px-4">Customer</th>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-4">QR-202508-001</td>
                  <td className="py-2 px-4">Acme Corp.</td>
                  <td className="py-2 px-4">2025-08-10</td>
                  <td className="py-2 px-4 text-green-600 font-semibold">Approved</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-4">QR-202508-002</td>
                  <td className="py-2 px-4">Beta LLC</td>
                  <td className="py-2 px-4">2025-08-08</td>
                  <td className="py-2 px-4 text-yellow-600 font-semibold">Pending</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">QR-202508-003</td>
                  <td className="py-2 px-4">Gamma Inc.</td>
                  <td className="py-2 px-4">2025-08-07</td>
                  <td className="py-2 px-4 text-red-600 font-semibold">Rejected</td>
                </tr>
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
}
