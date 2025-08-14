'use client';

import React from 'react';

export default function A4Layout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="
        bg-gray-200 min-h-screen flex justify-center p-4 print:p-0 
        print:bg-white
      "
    >
      <div
        className="
          bg-white w-[210mm] min-h-[297mm] p-8 relative
          shadow-lg print:shadow-none print:border-none 
          print:w-full print:h-full print:p-0
        "
      >
        {children}
      </div>
    </div>
  );
}
