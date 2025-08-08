'use client';

import { useEffect, useState, useRef } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import QuotationPreview from '@/app/component/QuotationPreview';

export default function QuotationListPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const printRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quotation List</h1>

      <input
        type="text"
        placeholder="Search by name or reference number..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      <table className="w-full border text-sm mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Customer Name</th>
            <th className="border p-2">Reference No.</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Grand Total</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuotations.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-4">No quotations found.</td>
            </tr>
          ) : (
            filteredQuotations.map((q) => (
              <tr key={q.id}>
                <td className="border p-2">{q.name}</td>
                <td className="border p-2">{q.refNo}</td>
                <td className="border p-2">{q.date}</td>
                <td className="border p-2 text-right">₱ {Number(q.grandTotal).toFixed(2)}</td>
                <td className="border p-2 space-x-2 text-center">
                  <button
                    onClick={() => setSelectedQuotation(q)}
                    className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                  >
                    👁 View
                  </button>
               
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal */}
      {selectedQuotation && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white w-[90%] max-w-4xl max-h-[90vh] overflow-auto rounded shadow-lg p-6 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-lg font-bold"
            >
              ✕
            </button>
            <QuotationPreview quotation={selectedQuotation} />
          </div>
        </div>
      )}
    </div>
  );
}
