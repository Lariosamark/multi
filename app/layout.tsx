import './globals.css';
import Sidebar from '@/app/component/Sidebar';
import Script from 'next/script'; // ✅ import Script

export const metadata = {
  title: 'QMS | Multifactors Sales',
  description: 'Quotation Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Include html2pdf.js via CDN */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="flex">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
