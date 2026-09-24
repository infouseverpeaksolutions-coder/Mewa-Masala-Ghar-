import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Mail, Phone, Calendar } from 'lucide-react';
import api from '../services/api';
import { Customer } from '../types';

export const CustomersPage: React.FC = () => {
  const { data: customers, isLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      const res = await api.get('/admin/customers');
      return res.data?.data as Customer[];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900">Registered Customers</h1>
        <p className="text-xs text-gray-500 mt-1">Directory of registered shoppers and order histories.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-gray-500">Loading customers...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Phone</th>
                  <th className="p-3.5">Joined Date</th>
                  <th className="p-3.5 text-right">Orders Placed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers?.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/60">
                    <td className="p-3.5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <strong className="text-gray-900">{c.name}</strong>
                    </td>
                    <td className="p-3.5 text-gray-600">{c.email}</td>
                    <td className="p-3.5 text-gray-600">{c.phone || 'N/A'}</td>
                    <td className="p-3.5 text-gray-500">
                      {new Date(c.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-3.5 text-right">
                      <span className="font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-800">
                        {c._count?.orders || 0} orders
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
