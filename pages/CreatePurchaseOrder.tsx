
import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { PurchaseOrder, OrderItem } from '../types';

interface POItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  cost: number;
}

export const CreatePurchaseOrder: React.FC = () => {
  const navigate = useNavigate();
  const { suppliers, products, addPurchaseOrder } = useData();
  
  const [supplierId, setSupplierId] = useState('');
  const [warehouse, setWarehouse] = useState('Main Warehouse A');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedDate, setExpectedDate] = useState('');
  
  const [items, setItems] = useState<POItem[]>([{ id: '1', productId: '', name: '', quantity: 1, cost: 0 }]);
  
  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), productId: '', name: '', quantity: 1, cost: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
        setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof POItem, value: string | number) => {
    setItems(items.map(item => {
        if (item.id === id) {
            const updated = { ...item, [field]: value };
            // Auto fill cost and name if product selected
            if (field === 'productId') {
                const product = products.find(p => p.id === value);
                if (product) {
                    updated.cost = product.cost;
                    updated.name = product.name;
                }
            }
            return updated;
        }
        return item;
    }));
  };

  const total = items.reduce((sum, item) => sum + (item.quantity * item.cost), 0);

  const handleSubmit = async () => {
      if (!supplierId) {
          alert("Please select a supplier");
          return;
      }
      if (!expectedDate) {
          alert("Please select expected delivery date");
          return;
      }
      
      const supplier = suppliers.find(s => s.id === supplierId);
      
      const newPO: PurchaseOrder = {
          id: `PO-${Date.now().toString().slice(-6)}`,
          supplierName: supplier ? supplier.name : 'Unknown Supplier',
          date: orderDate,
          expectedDate: expectedDate,
          total: total,
          status: 'Ordered',
          warehouse: warehouse,
          items: items.filter(i => i.productId).map(i => ({
              productId: i.productId,
              name: i.name,
              quantity: i.quantity,
              price: i.cost
          }))
      };

      await addPurchaseOrder(newPO);
      navigate('/purchase-orders');
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/purchase-orders')} className="p-2 hover:bg-gray-100 rounded-full text-slate-500">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Create Purchase Order</h1>
        </div>

        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Supplier & Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Supplier</label>
                        <select 
                            value={supplierId}
                            onChange={(e) => setSupplierId(e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select Supplier</option>
                            {suppliers.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Destination Warehouse</label>
                        <select 
                            value={warehouse}
                            onChange={(e) => setWarehouse(e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option>Main Warehouse A</option>
                            <option>Warehouse B</option>
                            <option>Warehouse C</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Order Date</label>
                        <input 
                            type="date" 
                            value={orderDate}
                            onChange={(e) => setOrderDate(e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Expected Delivery</label>
                        <input 
                            type="date" 
                            value={expectedDate}
                            onChange={(e) => setExpectedDate(e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">Order Items</h2>
                </div>
                
                <div className="space-y-3">
                    {items.map((item, index) => (
                        <div key={item.id} className="flex gap-4 items-end p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-slate-500 mb-1">Product</label>
                                <select 
                                    value={item.productId}
                                    onChange={(e) => updateItem(item.id, 'productId', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select Product</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-24">
                                <label className="block text-xs font-medium text-slate-500 mb-1">Quantity</label>
                                <input 
                                    type="number" 
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                    className="w-full rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="w-32">
                                <label className="block text-xs font-medium text-slate-500 mb-1">Unit Cost</label>
                                <input 
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={item.cost}
                                    onChange={(e) => updateItem(item.id, 'cost', parseFloat(e.target.value) || 0)}
                                    className="w-full rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="w-24 text-right pb-2">
                                <span className="font-medium text-slate-900">${(item.quantity * item.cost).toFixed(2)}</span>
                            </div>
                            <button 
                                onClick={() => removeItem(item.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg mb-0.5"
                                title="Remove Item"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                <button onClick={addItem} className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                    <Plus className="w-4 h-4" /> Add Item
                </button>

                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                    <div className="text-right">
                        <span className="text-slate-500 mr-4">Total Amount:</span>
                        <span className="text-2xl font-bold text-slate-900">${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => navigate('/purchase-orders')} className="px-6 py-2 border border-gray-300 rounded-lg text-slate-700 font-medium hover:bg-gray-50">
                    Cancel
                </button>
                <button 
                    onClick={handleSubmit} 
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-sm flex items-center gap-2"
                >
                    <Save className="w-4 h-4" /> Create Order
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
