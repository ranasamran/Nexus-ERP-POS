
import React, { useState } from 'react';
import { MOCK_ORDERS } from '../services/mockData';
import { Search, Filter, ChevronDown, ChevronUp, Package, Calendar, CreditCard } from 'lucide-react';
import clsx from 'clsx';

export const Orders: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleOrder = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 shrink-0">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Sales Orders</h1>
                <p className="text-slate-500">Track and manage customer orders.</p>
            </div>
             <div className="flex gap-3">
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-slate-600 hover:bg-gray-50 font-medium flex items-center gap-2 shadow-sm">
                    <Filter className="w-4 h-4" /> Filter Status
                </button>
            </div>
        </div>

         <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden">
             <div className="p-4 border-b border-gray-200 shrink-0">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search orders by ID or customer..." 
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>
            <div className="overflow-auto flex-1">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-slate-600 font-medium border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 w-10"></th>
                            <th className="px-6 py-3">Order ID</th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3 text-center">Items</th>
                            <th className="px-6 py-3 text-right">Total</th>
                            <th className="px-6 py-3">Payment</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {MOCK_ORDERS.map((order) => (
                            <React.Fragment key={order.id}>
                                <tr 
                                    onClick={() => toggleOrder(order.id)}
                                    className={clsx(
                                        "cursor-pointer transition-colors",
                                        expandedId === order.id ? "bg-blue-50/50" : "hover:bg-gray-50"
                                    )}
                                >
                                    <td className="px-6 py-4 text-slate-400">
                                        {expandedId === order.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-blue-600">{order.id}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{order.customerName}</td>
                                    <td className="px-6 py-4 text-slate-500 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        {order.date}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-slate-600">
                                            <Package className="w-3 h-3" /> {order.itemsCount}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium">${order.total.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-slate-500 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-slate-400" />
                                        {order.paymentMethod}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={clsx(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                            order.status === 'Completed' ? "bg-green-100 text-green-800" :
                                            order.status === 'Pending' ? "bg-blue-100 text-blue-800" :
                                            "bg-gray-100 text-gray-800"
                                        )}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                                {expandedId === order.id && (
                                    <tr className="bg-gray-50/50">
                                        <td colSpan={8} className="p-0">
                                            <div className="p-6 border-b border-gray-200">
                                                <h4 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Order Items</h4>
                                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                                    <table className="w-full text-sm">
                                                        <thead className="bg-gray-50 text-slate-500 border-b border-gray-200">
                                                            <tr>
                                                                <th className="px-4 py-2 text-left font-medium">Product Name</th>
                                                                <th className="px-4 py-2 text-center font-medium">Quantity</th>
                                                                <th className="px-4 py-2 text-right font-medium">Unit Price</th>
                                                                <th className="px-4 py-2 text-right font-medium">Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            {order.items.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td className="px-4 py-2 text-slate-700">{item.name}</td>
                                                                    <td className="px-4 py-2 text-center text-slate-600">{item.quantity}</td>
                                                                    <td className="px-4 py-2 text-right text-slate-600">${item.price.toFixed(2)}</td>
                                                                    <td className="px-4 py-2 text-right font-medium text-slate-900">${(item.price * item.quantity).toFixed(2)}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                        <tfoot className="bg-gray-50 border-t border-gray-200">
                                                            <tr>
                                                                <td colSpan={3} className="px-4 py-2 text-right font-bold text-slate-700">Total</td>
                                                                <td className="px-4 py-2 text-right font-bold text-blue-600">${order.total.toFixed(2)}</td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                                <div className="mt-4 flex justify-end gap-2">
                                                    <button className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-gray-300 rounded hover:bg-gray-50">Print Invoice</button>
                                                    <button className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700">Email Customer</button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
         </div>
    </div>
  );
};
