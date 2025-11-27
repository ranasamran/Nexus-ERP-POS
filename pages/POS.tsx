import React, { useState, useMemo } from 'react';
import { Search, LayoutGrid, List, ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, X, UserPlus, Gift } from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_CUSTOMERS } from '../services/mockData';
import { Product, CartItem, ViewMode } from '../types';
import clsx from 'clsx';

export const POS: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const categories = ['All', 'Electronics', 'Apparel', 'Groceries', 'Accessories', 'Footwear'];

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <div className="flex h-[calc(100vh)] overflow-hidden bg-gray-50">
      {/* Left Panel - Product Selection */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header / Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                    type="text" 
                    placeholder="Scan barcode or search product..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                <button 
                    onClick={() => setViewMode('grid')}
                    className={clsx("p-2 rounded-md transition-colors", viewMode === 'grid' ? "bg-white shadow text-blue-600" : "text-slate-500 hover:text-slate-700")}
                >
                    <LayoutGrid className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => setViewMode('list')}
                    className={clsx("p-2 rounded-md transition-colors", viewMode === 'list' ? "bg-white shadow text-blue-600" : "text-slate-500 hover:text-slate-700")}
                >
                    <List className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-white border-b border-gray-200 px-4 py-2 overflow-x-auto flex gap-2 no-scrollbar">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={clsx(
                        "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                        selectedCategory === cat 
                            ? "bg-blue-600 text-white" 
                            : "bg-gray-100 text-slate-600 hover:bg-gray-200"
                    )}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* Products Grid/List */}
        <div className="flex-1 overflow-y-auto p-4">
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.map(product => (
                        <div 
                            key={product.id} 
                            onClick={() => addToCart(product)}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                        >
                            <div className="aspect-square relative overflow-hidden bg-gray-100">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                {product.status === 'Low Stock' && (
                                    <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">Low Stock</span>
                                )}
                                {product.status === 'Out of Stock' && (
                                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">Out of Stock</span>
                                )}
                            </div>
                            <div className="p-3">
                                <h3 className="font-medium text-slate-900 truncate">{product.name}</h3>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-slate-500 text-sm">{product.sku}</span>
                                    <span className="font-bold text-blue-600">${product.price.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 font-medium text-slate-500">Product</th>
                                <th className="px-4 py-3 font-medium text-slate-500">SKU</th>
                                <th className="px-4 py-3 font-medium text-slate-500">Category</th>
                                <th className="px-4 py-3 font-medium text-slate-500">Stock</th>
                                <th className="px-4 py-3 font-medium text-slate-500">Price</th>
                                <th className="px-4 py-3 font-medium text-slate-500">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredProducts.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img src={product.image} alt="" className="w-10 h-10 rounded bg-gray-100 object-cover" />
                                            <span className="font-medium text-slate-900">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{product.sku}</td>
                                    <td className="px-4 py-3 text-slate-600">{product.category}</td>
                                    <td className="px-4 py-3">
                                        <span className={clsx(
                                            "px-2 py-0.5 rounded-full text-xs font-medium",
                                            product.stock > 10 ? "bg-green-100 text-green-700" : 
                                            product.stock > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                                        )}>
                                            {product.stock} units
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-900">${product.price.toFixed(2)}</td>
                                    <td className="px-4 py-3">
                                        <button 
                                            onClick={() => addToCart(product)}
                                            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded"
                                            disabled={product.stock === 0}
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      </div>

      {/* Right Panel - Cart */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-xl z-10">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div>
                <h2 className="font-bold text-slate-800">Current Sale</h2>
                <p className="text-xs text-slate-500">Order #10234</p>
            </div>
            <button className="p-2 hover:bg-gray-200 rounded-lg text-slate-500">
                <UserPlus className="w-5 h-5" />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
                    <ShoppingCart className="w-16 h-16 stroke-1" />
                    <p>Cart is empty</p>
                </div>
            ) : (
                cart.map(item => (
                    <div key={item.id} className="flex gap-3 group">
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-slate-900">{item.name}</h4>
                            <p className="text-xs text-slate-500">${item.price.toFixed(2)} / unit</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                <button onClick={() => updateQuantity(item.id, -1)} className="p-0.5 hover:text-red-600"><Minus className="w-3 h-3" /></button>
                                <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="p-0.5 hover:text-green-600"><Plus className="w-3 h-3" /></button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-xl">${total.toFixed(2)}</span>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-3">
                 <button className="flex flex-col items-center justify-center p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-slate-600 text-xs gap-1">
                    <Gift className="w-4 h-4" />
                    Discount
                 </button>
                 <button className="flex flex-col items-center justify-center p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-slate-600 text-xs gap-1">
                    <UserPlus className="w-4 h-4" />
                    Customer
                 </button>
                 <button className="flex flex-col items-center justify-center p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-slate-600 text-xs gap-1">
                     <CreditCard className="w-4 h-4" />
                     Note
                 </button>
                 <button 
                    onClick={() => setCart([])}
                    className="flex flex-col items-center justify-center p-2 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 text-red-600 text-xs gap-1"
                 >
                     <Trash2 className="w-4 h-4" />
                     Clear
                 </button>
            </div>

            <button 
                onClick={() => setShowPaymentModal(true)}
                disabled={cart.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-lg shadow-sm transition-colors"
            >
                Pay ${total.toFixed(2)}
            </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Complete Payment</h3>
                    <button onClick={() => setShowPaymentModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 text-center">
                    <p className="text-slate-500 mb-6">Total Amount to Pay</p>
                    <p className="text-4xl font-bold text-slate-900 mb-8">${total.toFixed(2)}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button className="flex flex-col items-center p-4 border-2 border-blue-500 bg-blue-50 rounded-xl text-blue-700">
                            <CreditCard className="w-8 h-8 mb-2" />
                            <span className="font-medium">Card</span>
                        </button>
                        <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-slate-700">
                            <Banknote className="w-8 h-8 mb-2" />
                            <span className="font-medium">Cash</span>
                        </button>
                    </div>
                    <button className="w-full p-3 text-slate-600 hover:bg-gray-50 rounded-lg mb-2">Split Payment</button>
                </div>
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold"
                        onClick={() => {
                            alert("Payment Processed!");
                            setCart([]);
                            setShowPaymentModal(false);
                        }}
                    >
                        Confirm Payment
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
