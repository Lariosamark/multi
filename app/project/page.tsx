'use client';

import { useState, useEffect } from 'react';
import { db } from '@/app/firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import A4Layout from '@/app/component/A4Layout';

export default function ProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    projectName: '',
    clientName: '',
    description: '',
    startDate: '',
    endDate: '',
  });
  const [refNo, setRefNo] = useState('');

  useEffect(() => {
    const generateRefNo = async () => {
      const now = new Date();
      const yyyymm = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;

      const q = query(
        collection(db, 'projects'),
        where('refNo', '>=', `P-${yyyymm}`),
        where('refNo', '<=', `P-${yyyymm}-999`),
        orderBy('refNo', 'desc'),
        limit(1)
      );

      const querySnap = await getDocs(q);
      let nextNumber = 1;
      if (!querySnap.empty) {
        const lastRef = querySnap.docs[0].data().refNo;
        const lastNum = parseInt(lastRef.split('-')[2], 10);
        nextNumber = lastNum + 1;
      }

      setRefNo(`P-${yyyymm}-${String(nextNumber).padStart(3, '0')}`);
    };

    generateRefNo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        ...formData,
        refNo,
        createdAt: serverTimestamp(),
        status: 'New'
      });
      router.push(`/quotation?projectId=${docRef.id}&refNo=${refNo}`);
    } catch (error) {
      console.error('Error adding project: ', error);
    }
  };

  return (
    <A4Layout title="Project Form">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-sm mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">New Project</h2>
              <p className="text-gray-600 text-sm">Create a new project and generate quotation</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-md border shadow-sm">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reference No.</span>
              <div className="text-lg font-mono font-bold text-blue-600">{refNo}</div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Project Timeline */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Project Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input 
                  type="date" 
                  name="startDate" 
                  value={formData.startDate} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input 
                  type="date" 
                  name="endDate" 
                  value={formData.endDate} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                  required 
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Project Details
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                <input 
                  type="text" 
                  name="projectName" 
                  placeholder="Enter project name" 
                  value={formData.projectName} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Client Name</label>
                <input 
                  type="text" 
                  name="clientName" 
                  placeholder="Enter client name" 
                  value={formData.clientName} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" 
                  required 
                />
              </div>
              <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Project Description
  </label>
  <textarea
    name="description"
    placeholder="Describe the project requirements and objectives"
    value={formData.description}
    onChange={handleChange}
    rows={4}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
    style={{ textAlign: 'justify' }} // Justify text here
    required
  />
</div>

            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Save & Go to Quotation</span>
            </button>
          </div>
        </form>
      </div>
    </A4Layout>
  );
}