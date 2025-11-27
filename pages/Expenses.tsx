
import React from 'react';
import { MOCK_EXPENSES } from '../services/mockData';
import { Search, Filter, Plus, TrendingDown, TrendingUp, MoreHorizontal, FileText } from 'lucide-react';
import clsx from 'clsx';

export const Expenses: React.FC = () => {
  const totalExpenses = MOCK_EXPENSES.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="p-6 h-full flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 shrink-0">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Expense Management</h1>
                <p className="text-slate-500">Track operational costs and outgoing payments.</p>
            </div>
             <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-sm">
                    <Plus className="w-4 h-4" /> Record Expense
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 shrink-0">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Expenses (Oct)</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">${totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
                    </div>
                    <div className="p-2 bg-red-100 rounded-lg">
                        <TrendingDown className="w-5 h-5 text-red-600" />
                    </div>
                </div>
            </div>
             <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Pending Payments</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">$499.00</h3>
                    </div>
                    <div className="p-2 bg-amber-100 rounded-lg">
                        <FileText className="w-5 h-5 text-amber-600" />
                    </div>
                </div>
            </div>
             <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Budget Usage</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">78%</h3>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                </div>
            </div>
        </div>

         <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden">
             <div className="p-4 border-b border-gray-200 shrink-0 flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search expenses..." 
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                 <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-slate-600 hover:bg-gray-50 font-medium flex items-center gap-2 shadow-sm">
                    <Filter className="w-4 h-4" /> Filters
                </button>
            </div>
            <div className="overflow-auto flex-1">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-slate-600 font-medium border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Warehouse</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Amount</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {MOCK_EXPENSES.map((expense) => (
                            <tr key={expense.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{expense.description}</td>
                                <td className="px-6 py-4 text-slate-600">
                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{expense.category}</span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{expense.date}</td>
                                <td className="px-6 py-4 text-slate-500">{expense.warehouse}</td>
                                <td className="px-6 py-4">
                                    <span className={clsx(
                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                        expense.status === 'Paid' ? "bg-green-100 text-green-800" :
                                        expense.status === 'Pending' ? "bg-amber-100 text-amber-800" :
                                        "bg-red-100 text-red-800"
                                    )}>
                                        {expense.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-slate-900">
                                    ${expense.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-slate-600 p-1">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
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
