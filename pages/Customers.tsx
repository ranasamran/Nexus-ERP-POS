import React from 'react';
import { MOCK_CUSTOMERS } from '../services/mockData';
import { Mail, Phone, MoreHorizontal } from 'lucide-react';

export const Customers: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Customers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CUSTOMERS.map((customer) => (
            <div key={customer.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                            {customer.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">{customer.name}</h3>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">Loyalty Member</span>
                        </div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-5 h-5" /></button>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Mail className="w-4 h-4" />
                        {customer.email}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Phone className="w-4 h-4" />
                        {customer.phone}
                    </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-sm">
                        <p className="text-slate-500">Loyalty Points</p>
                        <p className="font-bold text-slate-900">{customer.points}</p>
                    </div>
                    <button className="text-sm text-blue-600 font-medium hover:underline">View History</button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
