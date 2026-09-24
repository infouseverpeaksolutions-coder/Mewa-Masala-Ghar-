import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  IndianRupee,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  FileText,
} from 'lucide-react';
import api from '../services/api';
import { DashboardMetrics, Order } from '../types';

export const DashboardPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await api.get('/admin/dashboard');
      return res.data?.data;
    },
  });

  const metrics: DashboardMetrics = data?.metrics || {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  };

  const recentOrders: Order[] = data?.recentOrders || [];
  const lowStockVariants: any[] = data?.lowStockVariants || [];
  const stores: any[] = data?.stores || [];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
          Operations Overview
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Real-time metrics across Mewa, Spices, Baby Nutrition, and Personal Care stores.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-gray-400 block mb-1">Total Revenue</span>
            <span className="text-2xl font-bold text-gray-900">
              ₹{metrics.totalRevenue.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>GST Included</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#2F5D3A] flex items-center justify-center">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-gray-400 block mb-1">Total Orders</span>
            <span className="text-2xl font-bold text-gray-900">{metrics.totalOrders}</span>
            <span className="text-[11px] text-gray-500 block mt-1">Cash on Delivery & Prepaid</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Active Customers */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-gray-400 block mb-1">Customers</span>
            <span className="text-2xl font-bold text-gray-900">{metrics.totalCustomers}</span>
            <span className="text-[11px] text-gray-500 block mt-1">Verified Accounts</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-gray-400 block mb-1">Catalog SKUs</span>
            <span className="text-2xl font-bold text-gray-900">{metrics.totalProducts}</span>
            <span className="text-[11px] text-gray-500 block mt-1">3 Department Stores</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Middle Split: Store breakdown and Low Stock alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stores Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="font-serif font-bold text-base text-gray-900 mb-4">Department Stores</h2>
          <div className="space-y-3">
            {stores.map((s) => (
              <div key={s.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <strong className="text-xs font-bold text-gray-800 block">{s.name}</strong>
                  <span className="text-[11px] text-gray-500">Theme: {s.themeKey}</span>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-white rounded-lg border border-gray-200 text-gray-700">
                  {s._count?.products || 0} items
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="font-serif font-bold text-base text-gray-900">Inventory Stock Reorder Triggers</h2>
            </div>
            <Link to="/inventory" className="text-xs font-bold text-[#2F5D3A] hover:underline">
              Manage Inventory →
            </Link>
          </div>

          {lowStockVariants.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">All inventory stock levels are healthy above safety threshold.</p>
          ) : (
            <div className="space-y-2">
              {lowStockVariants.slice(0, 4).map((v) => (
                <div key={v.id} className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-gray-900 block">{v.product?.name} ({v.name})</strong>
                    <span className="text-[11px] text-gray-500">SKU: {v.sku} • Department: {v.product?.store?.name}</span>
                  </div>
                  <span className="font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
                    {v.stock} units remaining
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif font-bold text-base text-gray-900">Recent Customer Orders</h2>
          <Link to="/orders" className="text-xs font-bold text-[#2F5D3A] hover:underline">
            View All Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Tax Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/60">
                  <td className="p-3 font-mono font-bold text-gray-900">{o.orderNumber}</td>
                  <td className="p-3">
                    <span className="font-semibold text-gray-900 block">{o.customerName}</span>
                    <span className="text-gray-400 text-[11px]">{o.customerPhone}</span>
                  </td>
                  <td className="p-3 text-gray-500">
                    {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </td>
                  <td className="p-3 font-bold text-gray-900">₹{o.totalAmount.toFixed(2)}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <a
                      href={`http://localhost:5000/api/orders/${o.id}/invoice`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2F5D3A] hover:underline"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
