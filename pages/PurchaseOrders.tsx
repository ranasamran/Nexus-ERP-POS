
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Search, Filter, Plus, MoreHorizontal, Calendar, ChevronDown, ChevronUp, Truck, Mail, CheckCircle, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

export const PurchaseOrders: React.FC = () => {
  const { purchaseOrders, suppliers, receivePurchaseOrder } = useData();
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const togglePO = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getSupplierDetails = (name: string) => {
      return suppliers.find(s => s.name === name);
  };

  const handleReceive = async (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (window.confirm("Mark this order as Received? This will update your inventory stock levels.")) {
          await receivePurchaseOrder(id);
      }
  };

  const filteredPOs = purchaseOrders.filter(po => 
    po.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    po.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 h-full flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 shrink-0">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Purchase Orders</h1>
                <p className="text-slate-500">Manage procurement from suppliers.</p>
            </div>
             <div className="flex gap-3">
                <button onClick={() => navigate('/purchase-orders/create')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-sm">
                    <Plus className="w-4 h-4" /> Create PO
                </button>
            </div>
        </div>

         <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden">
             <div className="p-4 border-b border-gray-200 shrink-0 flex justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search purchase orders..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-slate-600 hover:bg-gray-50 font-medium flex items-center gap-2 shadow-sm">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                </div>
            </div>
            <div className="overflow-auto flex-1">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-slate-600 font-medium border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 w-10"></th>
                            <th className="px-6 py-3">PO Number</th>
                            <th className="px-6 py-3">Supplier</th>
                            <th className="px-6 py-3">Order Date</th>
                            <th className="px-6 py-3">Expected Delivery</th>
                            <th className="px-6 py-3">Warehouse</th>
                            <th className="px-6 py-3 text-right">Total</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredPOs.map((po) => {
                            const supplier = getSupplierDetails(po.supplierName);
                            const isExpanded = expandedId === po.id;

                            return (
                            <React.Fragment key={po.id}>
                                <tr 
                                    onClick={() => togglePO(po.id)}
                                    className={clsx("cursor-pointer transition-colors", isExpanded ? "bg-blue-50/50" : "hover:bg-gray-50")}
                                >
                                    <td className="px-6 py-4 text-slate-400">
                                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-blue-600">{po.id}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{po.supplierName}</td>
                                    <td className="px-6 py-4 text-slate-500">{po.date}</td>
                                    <td className="px-6 py-4 text-slate-500 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        {po.expectedDate}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{po.warehouse}</td>
                                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                                        ${po.total.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={clsx(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                            po.status === 'Received' ? "bg-green-100 text-green-800" :
                                            po.status === 'Ordered' ? "bg-blue-100 text-blue-800" :
                                            "bg-gray-100 text-gray-800"
                                        )}>
                                            {po.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {po.status !== 'Received' && (
                                            <button 
                                                onClick={(e) => handleReceive(e, po.id)}
                                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded flex items-center gap-1 shadow-sm transition-colors"
                                            >
                                                <CheckCircle className="w-3 h-3" /> Receive
                                            </button>
                                        )}
                                    </td>
                                </tr>
                                {isExpanded && (
                                    <tr className="bg-gray-50/50 border-b border-gray-200">
                                        <td colSpan={9} className="p-0">
                                            <div className="p-6">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                                    {/* Supplier Details */}
                                                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                                        <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                                            <Truck className="w-4 h-4 text-blue-500" />
                                                            Supplier Details
                                                        </h4>
                                                        <div className="space-y-2 text-sm">
                                                            <p><span className="text-slate-500">Name:</span> <span className="font-medium text-slate-900">{supplier?.name || po.supplierName}</span></p>
                                                            <p><span className="text-slate-500">Contact:</span> <span className="text-slate-700">{supplier?.contact || 'N/A'}</span></p>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-slate-500">Email:</span> 
                                                                <a href={`mailto:${supplier?.email}`} className="text-blue-600 hover:underline flex items-center gap-1">
                                                                    {supplier?.email || 'N/A'} <Mail className="w-3 h-3" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Delivery Status */}
                                                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                                        <h4 className="text-sm font-semibold text-slate-900 mb-3">Delivery Status</h4>
                                                        <div className="flex flex-col gap-2">
                                                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                                                <div className={clsx(
                                                                    "h-2.5 rounded-full",
                                                                    po.status === 'Received' ? "bg-green-600 w-full" : 
                                                                    po.status === 'Ordered' ? "bg-blue-600 w-1/2" : "bg-gray-400 w-5"
                                                                )}></div>
                                                            </div>
                                                            <p className="text-sm text-slate-600">
                                                                {po.status === 'Received' ? 'All items received and verified.' : 
                                                                 po.status === 'Ordered' ? 'Order placed, awaiting shipment.' : 
                                                                 'Draft order, not yet sent.'}
                                                            </p>
                                                            <p className="text-xs text-slate-500 mt-1">Expected by: {po.expectedDate}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Order Summary */}
                                                     <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
                                                        <p className="text-slate-500 text-sm">Total Order Value</p>
                                                        <p className="text-3xl font-bold text-slate-900 mt-1">${po.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                                                        <button className="mt-3 text-sm text-blue-600 font-medium hover:underline">Download Invoice</button>
                                                    </div>
                                                </div>

                                                {/* Ordered Items Table */}
                                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                                                        <h4 className="text-sm font-semibold text-slate-700">Ordered Items</h4>
                                                    </div>
                                                    <table className="w-full text-sm">
                                                        <thead className="bg-gray-50/50 text-slate-500 border-b border-gray-100">
                                                            <tr>
                                                                <th className="px-4 py-2 text-left font-medium">Product Name</th>
                                                                <th className="px-4 py-2 text-left font-medium">Product ID</th>
                                                                <th className="px-4 py-2 text-center font-medium">Quantity</th>
                                                                <th className="px-4 py-2 text-right font-medium">Unit Cost</th>
                                                                <th className="px-4 py-2 text-right font-medium">Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            {po.items && po.items.length > 0 ? po.items.map((item, idx) => (
                                                                <tr key={idx}>
                                                                    <td className="px-4 py-3 text-slate-700 font-medium">{item.name}</td>
                                                                    <td className="px-4 py-3 text-slate-500">{item.productId}</td>
                                                                    <td className="px-4 py-3 text-center text-slate-600 bg-gray-50/30">{item.quantity}</td>
                                                                    <td className="px-4 py-3 text-right text-slate-600">${item.price.toFixed(2)}</td>
                                                                    <td className="px-4 py-3 text-right font-medium text-slate-900">${(item.price * item.quantity).toFixed(2)}</td>
                                                                </tr>
                                                            )) : (
                                                                <tr>
                                                                    <td colSpan={5} className="px-4 py-3 text-center text-slate-500 italic">No items details available</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        )})}
                        {filteredPOs.length === 0 && (
                            <tr>
                                <td colSpan={9} className="px-6 py-12 text-center text-slate-500">
                                    No purchase orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
         </div>
    </div>
  );
};
