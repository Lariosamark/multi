'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import QuotationPreview from '@/app/component/QuotationPreview';

export default function QuotationListPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const printRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const router = useRouter();

  useEffect(() => {
    const fetchQuotations = async () => {
      const snapshot = await getDocs(collection(db, 'quotations'));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setQuotations(data);
    };
    fetchQuotations();
  }, []);

  const filteredQuotations = quotations.filter((q) => {
    const nameMatch = q.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const refMatch = q.refNo?.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || refMatch;
  });

  const handleCloseModal = () => {
    setSelectedQuotation(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Quotation List
          </h1>
        </div>
        <p className="text-slate-600 ml-11">Manage and view all your quotations</p>
      </div>

      {/* Search Section */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by name or reference number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  Reference No.
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  Grand Total
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuotations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-slate-600 font-medium">No quotations found</p>
                        <p className="text-slate-400 text-sm">Try adjusting your search terms</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredQuotations.map((q, index) => (
                  <tr key={q.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {q.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{q.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {q.refNo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{q.date}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-slate-800 text-lg">₱ {Number(q.grandTotal).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedQuotation(q)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                        <button
                          onClick={() => router.push(`/ReviseQuotationPage/${q.id}`)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Revise
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 p-4">
          {filteredQuotations.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-slate-600 font-medium">No quotations found</p>
                  <p className="text-slate-400 text-sm">Try adjusting your search terms</p>
                </div>
              </div>
            </div>
          ) : (
            filteredQuotations.map((q) => (
              <div key={q.id} className="bg-white rounded-xl shadow-md border border-slate-200 p-4 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {q.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{q.name}</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {q.refNo}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Date</span>
                    <span className="font-medium text-slate-700">{q.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Grand Total</span>
                    <span className="font-bold text-slate-800 text-lg">₱ {Number(q.grandTotal).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setSelectedQuotation(q)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedQuotation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-5xl max-h-[95vh] overflow-auto rounded-2xl shadow-2xl border border-white/50 relative">
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 p-4 flex justify-between items-center rounded-t-2xl">
              <h2 className="font-semibold text-slate-800">Quotation Preview</h2>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-800 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <QuotationPreview quotation={selectedQuotation} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}