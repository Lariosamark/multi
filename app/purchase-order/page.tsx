'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { db } from '@/app/firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from 'firebase/firestore';
import A4Layout from '@/app/component/A4Layout';

export default function PurchaseOrderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const projectId = searchParams.get('projectId');
  const refNo = searchParams.get('refNo');

  const [poData, setPoData] = useState({
    refNo: refNo || '',
    poNumber: '',
    supplier: '',
    total: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPoNumber, setIsLoadingPoNumber] = useState(true);

  // Generate default PO number
  useEffect(() => {
    const generatePoNumber = async () => {
      try {
        const today = new Date();
        const datePrefix = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
        
        // Query existing POs with today's date prefix
        const q = query(
          collection(db, 'purchaseOrders'),
          where('poNumber', '>=', `${datePrefix}-001`),
          where('poNumber', '<', `${datePrefix}-999`),
          orderBy('poNumber', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        let nextNumber = 1;
        
        if (!querySnapshot.empty) {
          // Get the highest number for today
          const latestPo = querySnapshot.docs[0].data();
          const lastNumber = parseInt(latestPo.poNumber.split('-')[1]) || 0;
          nextNumber = lastNumber + 1;
        }
        
        const newPoNumber = `${datePrefix}-${nextNumber.toString().padStart(3, '0')}`;
        
        setPoData(prev => ({
          ...prev,
          poNumber: newPoNumber
        }));
      } catch (error) {
        console.error('Error generating PO number:', error);
        // Fallback to simple timestamp-based number
        const timestamp = Date.now().toString().slice(-6);
        setPoData(prev => ({
          ...prev,
          poNumber: `PO-${timestamp}`
        }));
      } finally {
        setIsLoadingPoNumber(false);
      }
    };

    generatePoNumber();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPoData({ ...poData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'purchaseOrders'), {
        ...poData,
        projectId,
        createdAt: serverTimestamp()
      });
      alert('Purchase Order saved successfully!');
      
      // Redirect to preview page
      router.push(`/preview?projectId=${projectId}&refNo=${refNo}`);
    } catch (error) {
      console.error('Error saving Purchase Order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <A4Layout title="Purchase Order Form">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Document Information</h3>
              <p className="text-gray-600 flex items-center mt-1">
                <span className="font-medium text-blue-600">Reference Number:</span>
                <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-mono">{refNo}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Purchase Order Details
            </h2>
            
            <div className="grid gap-6">
              {/* PO Number Field */}
              <div className="group">
                <label htmlFor="poNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Order Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    id="poNumber"
                    name="poNumber" 
                    placeholder={isLoadingPoNumber ? "Generating PO Number..." : "Enter PO Number"} 
                    value={poData.poNumber} 
                    onChange={handleChange} 
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400" 
                    disabled={isLoadingPoNumber}
                    required 
                  />
                  {isLoadingPoNumber && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">Auto-generated format: YYYYMMDD-001, 002, etc.</p>
              </div>

              {/* Supplier Field */}
              <div className="group">
                <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    id="supplier"
                    name="supplier" 
                    placeholder="Enter supplier company name" 
                    value={poData.supplier} 
                    onChange={handleChange} 
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400" 
                    required 
                  />
                </div>
              </div>

              {/* Total Amount Field */}
              <div className="group">
                <label htmlFor="total" className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <span className="absolute inset-y-0 left-8 flex items-center text-gray-500 pointer-events-none">₱</span>
                  <input 
                    type="number" 
                    id="total"
                    name="total" 
                    placeholder="0.00" 
                    value={poData.total} 
                    onChange={handleChange} 
                    className="block w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400" 
                    step="0.01"
                    min="0"
                    required 
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">Enter the total purchase order amount</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Save Purchase Order & Return to Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </A4Layout>
  );
}