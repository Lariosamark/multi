// components/AdminHeaderNavbar.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export default function AdminHeaderNavbar() {
  const router = useRouter();
  const [dateTime, setDateTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDateTime(now.toLocaleString());
    };

    updateTime(); // Initial load
    const interval = setInterval(updateTime, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between bg-gray-900 text-white px-4 py-2 shadow-md">
      {/* Left section: Back button + logo + name */}
      <div className="flex items-center gap-4">

        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Company Logo"
            width={100}
            height={100}
          />
          <h1 className="text-lg font-bold">Multifactors Sales</h1>
        </div>
      </div>

      {/* Right section: Date & Time */}
      <div className="text-sm">{dateTime}</div>
    </header>
  );
}
