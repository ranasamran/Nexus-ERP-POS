import React from 'react';
import { User, Building2, CreditCard, Bell, Lock } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings</h1>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-slate-900">General Settings</h2>
                <p className="text-sm text-slate-500">Manage your company profile and preferences.</p>
            </div>
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                        <input type="text" className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" defaultValue="Nexus ERP Inc." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
                        <input type="email" className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" defaultValue="support@nexus.com" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                        <select className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                            <option>USD ($)</option>
                            <option>EUR (€)</option>
                            <option>GBP (£)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
                        <select className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                            <option>UTC (GMT+0)</option>
                            <option>EST (GMT-5)</option>
                            <option>PST (GMT-8)</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Save Changes</button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                    <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900">Tax Rules</h3>
                <p className="text-sm text-slate-500 mt-1">Configure tax rates and zones for different regions.</p>
            </div>
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                    <User className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900">User Roles</h3>
                <p className="text-sm text-slate-500 mt-1">Manage team members and permission levels.</p>
            </div>
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                    <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900">Billing</h3>
                <p className="text-sm text-slate-500 mt-1">View invoices and manage subscription plan.</p>
            </div>
        </div>
    </div>
  );
};
