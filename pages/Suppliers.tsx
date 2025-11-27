import React from 'react';
import { MOCK_SUPPLIERS } from '../services/mockData';

export const Suppliers: React.FC = () => {
  return (
    <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Supplier Management</h1>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
             <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-slate-600 font-medium border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Contact Person</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {MOCK_SUPPLIERS.map((supplier) => (
                        <tr key={supplier.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-slate-900">{supplier.name}</td>
                            <td className="px-6 py-4 text-slate-600">{supplier.contact}</td>
                            <td className="px-6 py-4 text-blue-600 hover:underline">{supplier.email}</td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {supplier.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-slate-500 hover:text-blue-600 font-medium">Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};
