
import React, { useState, useMemo } from 'react';
import { MOCK_PRODUCTS, MOCK_STOCK_HISTORY } from '../services/mockData';
import { Search, Filter, Plus, MoreHorizontal, ArrowUpDown, ChevronDown, CheckSquare, Square, Trash2, RefreshCw, Edit, AlertCircle, X, TrendingUp, TrendingDown, DollarSign, History } from 'lucide-react';
import clsx from 'clsx';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';

export const Inventory: React.FC = () => {
  const navigate = useNavigate();
  
  // State for products (initialized from mock data)
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  
  // View and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('All Warehouses');
  
  // Selection State
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  // UI State
  const [showBatchActions, setShowBatchActions] = useState(false);
  
  // Modals State
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedProductForHistory, setSelectedProductForHistory] = useState<Product | null>(null);

  // Stock Adjustment State
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add');
  const [adjustmentQty, setAdjustmentQty] = useState<number | ''>('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [adjustingProductIds, setAdjustingProductIds] = useState<string[]>([]);

  // Price Update State
  const [priceAdjustmentType, setPriceAdjustmentType] = useState<'percentage' | 'fixed'>('percentage');
  const [priceAdjustmentValue, setPriceAdjustmentValue] = useState<number | ''>('');

  // Derived state
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesWarehouse = selectedWarehouse === 'All Warehouses' || product.warehouse === selectedWarehouse;
      return matchesSearch && matchesWarehouse;
    });
  }, [products, searchQuery, selectedWarehouse]);

  const allSelected = filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length;
  const isIndeterminate = selectedProducts.length > 0 && selectedProducts.length < filteredProducts.length;

  // Handlers
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const openAdjustModal = (ids: string[]) => {
    setAdjustingProductIds(ids);
    setAdjustmentType('add');
    setAdjustmentQty('');
    setAdjustmentReason('');
    setIsAdjustModalOpen(true);
    setShowBatchActions(false);
  };

  const openPriceModal = () => {
    setPriceAdjustmentType('percentage');
    setPriceAdjustmentValue('');
    setIsPriceModalOpen(true);
    setShowBatchActions(false);
  };

  const openHistoryModal = (product: Product) => {
      setSelectedProductForHistory(product);
      setIsHistoryModalOpen(true);
  };

  const handleBatchAction = (action: string) => {
    if (action === 'update-stock') {
      openAdjustModal(selectedProducts);
    } else if (action === 'update-price') {
      openPriceModal();
    } else if (action === 'delete') {
      if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
        setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id)));
        setSelectedProducts([]);
        setShowBatchActions(false);
      }
    } else if (action === 'change-status') {
      alert("Status change feature coming soon for batch items.");
      setShowBatchActions(false);
    }
  };

  const submitStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustmentQty || Number(adjustmentQty) <= 0) return;
    const qty = Number(adjustmentQty);
    
    setProducts(prevProducts => prevProducts.map(product => {
      if (adjustingProductIds.includes(product.id)) {
        let newStock = product.stock;
        if (adjustmentType === 'add') {
          newStock += qty;
        } else {
          newStock = Math.max(0, newStock - qty);
        }
        
        let newStatus = product.status;
        if (newStock === 0) newStatus = 'Out of Stock';
        else if (newStock < 10) newStatus = 'Low Stock';
        else newStatus = 'Active';

        return { ...product, stock: newStock, status: newStatus };
      }
      return product;
    }));
    setIsAdjustModalOpen(false);
    setSelectedProducts([]);
  };

  const submitPriceUpdate = (e: React.FormEvent) => {
      e.preventDefault();
      if (priceAdjustmentValue === '' || isNaN(Number(priceAdjustmentValue))) return;
      const val = Number(priceAdjustmentValue);

      setProducts(prevProducts => prevProducts.map(product => {
          if (selectedProducts.includes(product.id)) {
              let newPrice = product.price;
              if (priceAdjustmentType === 'percentage') {
                  // val is percentage (e.g., 10 for +10%, -5 for -5%)
                  newPrice = newPrice * (1 + val / 100);
              } else {
                  // val is fixed amount to add (e.g., 5 for +$5, -2 for -$2)
                  newPrice = newPrice + val;
              }
              return { ...product, price: Math.max(0, newPrice) };
          }
          return product;
      }));
      setIsPriceModalOpen(false);
      setSelectedProducts([]);
  };

  return (
    <div className="p-6 relative h-full flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 shrink-0">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
                <p className="text-slate-500">Manage your products, stock levels, and prices.</p>
            </div>
            <div className="flex gap-3">
                <button onClick={() => navigate('/inventory/create')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-sm transition-colors">
                    <Plus className="w-4 h-4" /> Create Product
                </button>
            </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col flex-1 overflow-hidden">
            {/* Table Toolbar */}
            <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between bg-gray-50/50">
                <div className="relative flex-1 min-w-[240px] max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-3">
                    {selectedProducts.length > 0 && (
                        <div className="relative">
                            <button 
                                onClick={() => setShowBatchActions(!showBatchActions)}
                                className="px-3 py-2 bg-white border border-gray-300 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm hover:bg-gray-50"
                            >
                                <span>Batch Actions ({selectedProducts.length})</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            
                            {showBatchActions && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                                    <button 
                                        onClick={() => handleBatchAction('update-stock')}
                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <RefreshCw className="w-4 h-4" /> Update Stock
                                    </button>
                                    <button 
                                        onClick={() => handleBatchAction('update-price')}
                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <DollarSign className="w-4 h-4" /> Update Price
                                    </button>
                                    <button 
                                        onClick={() => handleBatchAction('change-status')}
                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" /> Change Status
                                    </button>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button 
                                        onClick={() => handleBatchAction('delete')}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" /> Delete Products
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500 hidden sm:inline">View: </span>
                        <select 
                            className="border-gray-300 rounded-lg text-sm font-medium bg-white focus:ring-blue-500 focus:border-blue-500 py-2 pl-3 pr-8 cursor-pointer"
                            value={selectedWarehouse}
                            onChange={(e) => setSelectedWarehouse(e.target.value)}
                        >
                            <option value="All Warehouses">All Warehouses</option>
                            <option value="Main Warehouse A">Main Warehouse A</option>
                            <option value="Warehouse B">Warehouse B</option>
                            <option value="Warehouse C">Warehouse C</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-auto flex-1">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-slate-600 font-medium border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 w-12">
                                <button 
                                    onClick={toggleSelectAll}
                                    className="text-slate-400 hover:text-slate-600 flex items-center justify-center"
                                >
                                    {allSelected ? (
                                        <CheckSquare className="w-5 h-5 text-blue-600" />
                                    ) : isIndeterminate ? (
                                        <div className="relative w-5 h-5 flex items-center justify-center">
                                            <Square className="w-5 h-5 text-slate-300" />
                                            <div className="absolute w-2.5 h-2.5 bg-blue-600 rounded-sm"></div>
                                        </div>
                                    ) : (
                                        <Square className="w-5 h-5" />
                                    )}
                                </button>
                            </th>
                            <th className="px-6 py-3">Product Name</th>
                            <th className="px-6 py-3">SKU</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3 text-right cursor-pointer group">
                                <div className="flex items-center justify-end gap-1">
                                    Stock <ArrowUpDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-right">Price</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredProducts.map((product) => {
                            const isSelected = selectedProducts.includes(product.id);
                            return (
                                <tr key={product.id} className={clsx("hover:bg-gray-50 transition-colors", isSelected && "bg-blue-50/30")}>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => toggleSelectProduct(product.id)}
                                            className="text-slate-400 hover:text-slate-600 flex items-center justify-center"
                                        >
                                            {isSelected ? (
                                                <CheckSquare className="w-5 h-5 text-blue-600" />
                                            ) : (
                                                <Square className="w-5 h-5" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={product.image} alt="" className="w-9 h-9 rounded-md object-cover bg-gray-100 border border-gray-200" />
                                            <span className="font-medium text-slate-900">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{product.sku}</td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-slate-800">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium">{product.stock}</td>
                                    <td className="px-6 py-4 text-right text-slate-900 font-semibold">${product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={clsx(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border",
                                            product.status === 'Active' ? "bg-green-50 text-green-700 border-green-100" :
                                            product.status === 'Low Stock' ? "bg-amber-50 text-amber-700 border-amber-100" :
                                            "bg-red-50 text-red-700 border-red-100"
                                        )}>
                                            <span className={clsx("w-1.5 h-1.5 rounded-full mr-1.5", 
                                                product.status === 'Active' ? "bg-green-500" :
                                                product.status === 'Low Stock' ? "bg-amber-500" :
                                                "bg-red-500"
                                            )}></span>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => openHistoryModal(product)}
                                                title="View Stock History"
                                                className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            >
                                                <History className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => openAdjustModal([product.id])}
                                                title="Adjust Stock"
                                                className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            >
                                                <TrendingUp className="w-4 h-4" />
                                            </button>
                                            <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-gray-100 rounded transition-colors">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <Search className="w-8 h-8 text-slate-300" />
                                        <p>No products found matching your criteria.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
             <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-slate-500 bg-gray-50/50 shrink-0">
                <span>Showing {filteredProducts.length} products</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>Previous</button>
                    <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>Next</button>
                </div>
            </div>
        </div>

        {/* Stock Adjustment Modal */}
        {isAdjustModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-lg text-slate-900">Adjust Stock Level</h3>
                        <button onClick={() => setIsAdjustModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-gray-200 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <form onSubmit={submitStockAdjustment} className="p-6 space-y-5">
                        <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg text-sm flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium">Adjusting {adjustingProductIds.length} product(s)</p>
                                <p className="opacity-80 text-xs mt-0.5">Stock changes will be logged in inventory history.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setAdjustmentType('add')}
                                className={clsx(
                                    "p-3 rounded-lg border flex flex-col items-center gap-2 transition-all",
                                    adjustmentType === 'add' 
                                        ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600" 
                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-slate-600"
                                )}
                            >
                                <TrendingUp className="w-6 h-6" />
                                <span className="font-medium text-sm">Add Stock</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setAdjustmentType('remove')}
                                className={clsx(
                                    "p-3 rounded-lg border flex flex-col items-center gap-2 transition-all",
                                    adjustmentType === 'remove' 
                                        ? "border-red-600 bg-red-50 text-red-700 ring-1 ring-red-600" 
                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-slate-600"
                                )}
                            >
                                <TrendingDown className="w-6 h-6" />
                                <span className="font-medium text-sm">Remove Stock</span>
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                            <input 
                                type="number" 
                                min="1"
                                required
                                value={adjustmentQty}
                                onChange={(e) => setAdjustmentQty(e.target.value ? parseInt(e.target.value) : '')}
                                className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter quantity to adjust"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Adjustment</label>
                            <textarea 
                                rows={3}
                                required
                                value={adjustmentReason}
                                onChange={(e) => setAdjustmentReason(e.target.value)}
                                className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Damaged goods, Stocktake correction, New shipment..."
                            />
                        </div>

                        <div className="pt-2 flex gap-3">
                            <button 
                                type="button"
                                onClick={() => setIsAdjustModalOpen(false)}
                                className="flex-1 px-4 py-2.5 border border-gray-300 text-slate-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
                            >
                                Confirm Adjustment
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Price Update Modal */}
        {isPriceModalOpen && (
             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-lg text-slate-900">Batch Price Update</h3>
                        <button onClick={() => setIsPriceModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-gray-200 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                     <form onSubmit={submitPriceUpdate} className="p-6 space-y-5">
                        <div className="bg-amber-50 text-amber-800 px-4 py-3 rounded-lg text-sm flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium">Updating prices for {selectedProducts.length} product(s)</p>
                            </div>
                        </div>
                        
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-2">Adjustment Type</label>
                             <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                                 <button type="button" onClick={() => setPriceAdjustmentType('percentage')} className={clsx("flex-1 py-2 text-sm font-medium", priceAdjustmentType === 'percentage' ? "bg-blue-50 text-blue-700" : "bg-white text-slate-600 hover:bg-gray-50")}>Percentage (%)</button>
                                 <div className="w-px bg-gray-300"></div>
                                 <button type="button" onClick={() => setPriceAdjustmentType('fixed')} className={clsx("flex-1 py-2 text-sm font-medium", priceAdjustmentType === 'fixed' ? "bg-blue-50 text-blue-700" : "bg-white text-slate-600 hover:bg-gray-50")}>Fixed Amount ($)</button>
                             </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {priceAdjustmentType === 'percentage' ? 'Percentage Change (e.g. 10 for +10%, -5 for -5%)' : 'Amount to Add/Subtract'}
                            </label>
                            <input 
                                type="number" 
                                step="0.01"
                                required
                                value={priceAdjustmentValue}
                                onChange={(e) => setPriceAdjustmentValue(e.target.value ? parseFloat(e.target.value) : '')}
                                className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={priceAdjustmentType === 'percentage' ? "0" : "0.00"}
                            />
                        </div>

                        <div className="pt-2 flex gap-3">
                            <button 
                                type="button"
                                onClick={() => setIsPriceModalOpen(false)}
                                className="flex-1 px-4 py-2.5 border border-gray-300 text-slate-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
                            >
                                Update Prices
                            </button>
                        </div>
                     </form>
                </div>
             </div>
        )}

        {/* Stock History Modal */}
        {isHistoryModalOpen && selectedProductForHistory && (
             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[80vh]">
                    <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <div>
                            <h3 className="font-bold text-lg text-slate-900">Stock History</h3>
                            <p className="text-sm text-slate-500">{selectedProductForHistory.name} ({selectedProductForHistory.sku})</p>
                        </div>
                        <button onClick={() => setIsHistoryModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-gray-200 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="overflow-y-auto p-0">
                         <table className="w-full text-left text-sm">
                             <thead className="bg-gray-50 text-slate-500 border-b border-gray-200 sticky top-0">
                                 <tr>
                                     <th className="px-6 py-3 font-medium">Date</th>
                                     <th className="px-6 py-3 font-medium">Type</th>
                                     <th className="px-6 py-3 font-medium text-right">Change</th>
                                     <th className="px-6 py-3 font-medium text-right">Balance</th>
                                     <th className="px-6 py-3 font-medium">Reason</th>
                                     <th className="px-6 py-3 font-medium">User</th>
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-100">
                                {MOCK_STOCK_HISTORY.filter(h => h.productId === selectedProductForHistory.id).length > 0 ? (
                                    MOCK_STOCK_HISTORY.filter(h => h.productId === selectedProductForHistory.id).map(history => (
                                        <tr key={history.id}>
                                            <td className="px-6 py-3 text-slate-600">{history.date}</td>
                                            <td className="px-6 py-3">
                                                <span className={clsx(
                                                    "px-2 py-0.5 rounded text-xs font-medium",
                                                    history.type === 'Purchase' || history.type === 'Return' ? "bg-green-100 text-green-700" :
                                                    "bg-slate-100 text-slate-700"
                                                )}>{history.type}</span>
                                            </td>
                                            <td className={clsx("px-6 py-3 text-right font-medium", history.change > 0 ? "text-green-600" : "text-red-600")}>
                                                {history.change > 0 ? '+' : ''}{history.change}
                                            </td>
                                            <td className="px-6 py-3 text-right text-slate-700">{history.balance}</td>
                                            <td className="px-6 py-3 text-slate-600">{history.reason}</td>
                                            <td className="px-6 py-3 text-slate-500 text-xs">{history.user}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400">No history available for this product.</td>
                                    </tr>
                                )}
                             </tbody>
                         </table>
                    </div>
                    <div className="p-4 border-t border-gray-200 bg-gray-50 text-right">
                         <button onClick={() => setIsHistoryModalOpen(false)} className="px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50">Close</button>
                    </div>
                </div>
             </div>
        )}
    </div>
  );
};
