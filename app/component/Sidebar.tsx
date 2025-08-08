'use client';

import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-6">Multifactors Sales</h1>
      <nav className="flex flex-col gap-4">
        <Link href="/" className="hover:text-blue-300">➤ Quotation Form</Link>
        <Link href="/quotation-list" className="hover:text-blue-300">➤ Quotation List</Link>
      </nav>
    </aside>
  );
}
