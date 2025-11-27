
import React, { useState } from 'react';
import { ArrowLeft, Upload, DollarSign, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_CATEGORIES } from '../services/mockData';

export const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    cost: '',
    stock: '',
    warehouse: 'Main Warehouse A',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Product Created Successfully!');
    navigate('/inventory');
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/inventory')} className="p-2 hover:bg-gray-100 rounded-full text-slate-500">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Create New Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Wireless Mouse"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                <input
                  type="text"
                  name="sku"
                  required
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., WM-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  {MOCK_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Product description..."
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Pricing</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Sales Price</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <DollarSign className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="number"
                                name="price"
                                step="0.01"
                                required
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full pl-9 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Cost Price</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <DollarSign className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="number"
                                name="cost"
                                step="0.01"
                                required
                                value={formData.cost}
                                onChange={handleChange}
                                className="w-full pl-9 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                </div>
            </div>

             <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Inventory</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Initial Stock</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Box className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="number"
                                name="stock"
                                required
                                value={formData.stock}
                                onChange={handleChange}
                                className="w-full pl-9 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Warehouse</label>
                         <select
                            name="warehouse"
                            value={formData.warehouse}
                            onChange={handleChange}
                            className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="Main Warehouse A">Main Warehouse A</option>
                            <option value="Warehouse B">Warehouse B</option>
                            <option value="Warehouse C">Warehouse C</option>
                        </select>
                    </div>
                </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Images</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-slate-500 hover:bg-gray-50 transition-colors cursor-pointer">
                <Upload className="w-10 h-10 mb-2 text-slate-400" />
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-xs mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => navigate('/inventory')} className="px-6 py-2 border border-gray-300 rounded-lg text-slate-700 font-medium hover:bg-gray-50">
                Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-sm">
                Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
