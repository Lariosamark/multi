// app/admin/layout.tsx
import React from 'react';
import AdminHeader from '@/app/component/AdminHeader';
import AdminSidebar from '@/app/admin/dashboard/AdminSidebar'; // adjust path if needed

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <AdminHeader />

        {/* Page content */}
        <main className="flex-1 bg-gray-100 p-4">{children}</main>
      </div>
    </div>
  );
}
