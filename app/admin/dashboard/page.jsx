'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BarChart3, Users, FileText, Clock, TrendingUp, Bell, Search, Calendar } from 'lucide-react';
import AdminSidebar from '@/app/admin/dashboard/AdminSidebar';
import { db } from '@/app/firebase/firebaseConfig';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';

export default function AdminDashboard() {
  const [totalQuotations, setTotalQuotations] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [recentQuotations, setRecentQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);

      try {
        // 1. Total Quotations count
        const quotationsSnapshot = await getDocs(collection(db, 'quotations'));
        setTotalQuotations(quotationsSnapshot.size);

        // 2. Pending Approvals count (assuming field 'status' === 'pending')
        const pendingQuery = query(
          collection(db, 'quotations'),
          where('status', '==', 'pending')
        );
        const pendingSnapshot = await getDocs(pendingQuery);
        setPendingApprovals(pendingSnapshot.size);

        // 3. Users count (assuming you have a 'users' collection)
        const usersSnapshot = await getDocs(collection(db, 'users'));
        setUserCount(usersSnapshot.size);

        // 4. Recent Quotations - latest 5 by 'date' field descending
        const recentQuery = query(
          collection(db, 'quotations'),
          orderBy('date', 'desc'),
          limit(5)
        );
        const recentSnapshot = await getDocs(recentQuery);
        const recentList = recentSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecentQuotations(recentList);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // StatCard component unchanged, just moved inside to keep your structure
  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {trend && (
            <div className="flex items-center mt-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div
          className={`p-3 rounded-xl ${
            color === 'text-indigo-600'
              ? 'bg-indigo-100'
              : color === 'text-amber-600'
              ? 'bg-amber-100'
              : 'bg-emerald-100'
          }`}
        >
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-600 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Quotations"
              value={totalQuotations.toLocaleString()}
              icon={FileText}
              color="text-indigo-600"
              trend="+12% from last month"
            />
            <StatCard
              title="Pending Approvals"
              value={pendingApprovals}
              icon={Clock}
              color="text-amber-600"
              trend="3 urgent"
            />
            <StatCard
              title="Active Users"
              value={userCount}
              icon={Users}
              color="text-emerald-600"
              trend="+8 this week"
            />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Quotations */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Recent Quotations</h2>
                <Link href="/component/quotation-list" passHref>
                <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">View All</button>
                </Link>
              </div>
              <div className="space-y-4">
                {recentQuotations.map((quotation) => (
                  <div
                    key={quotation.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="text-sm font-mono text-slate-600 bg-white px-2 py-1 rounded">
                          {quotation.refNo || 'N/A'}
                        </span>
                        <span className="text-sm text-slate-500">{quotation.date || 'N/A'}</span>
                      </div>
                      <p className="font-medium text-slate-900">{quotation.name || 'Unknown Customer'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                         ₱:{quotation.grandTotal ? quotation.grandTotal.toLocaleString() : '0'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/component/QuotationForm" passHref>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Create New Quotation</span>
                </button>
                </Link>
                <Link href= "/component/manage-users" passHref>
                <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Manage Users</span>
                </button>
                </Link>
                <Link href="/component/quotation-list" passHref>
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Quotation List</span>
                </button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
