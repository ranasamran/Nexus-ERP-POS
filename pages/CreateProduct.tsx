
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, DollarSign, Box, Link as LinkIcon, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { MOCK_CATEGORIES } from '../services/mockData';
import { useData } from '../contexts/DataContext';
import { Product } from '../types';

export const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { products, addProduct, updateProduct } = useData();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    category: '',
    price: 0,
    cost: 0,
    stock: 0,
    warehouse: 'Main Warehouse A',
    status: 'Active',
    description: '',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=300&fit=crop',
    selected: false
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      const product = products.find(p => p.id === id);
      if (product) {
        setFormData(product);
      } else {
        // If product not found in current list (maybe unloaded), navigating back might be safer or show loading
        if (products.length > 0) { // Only redirect if we are sure products are loaded and it's missing
            navigate('/inventory'); 
        }
      }
    }
  }, [id, products, isEditMode, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
       ...prev, 
       [name]: (name === 'price' || name === 'cost' || name === 'stock') ? parseFloat(value) || 0 : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const productData = {
            ...formData,
            // Calculate status based on stock if not manually set (simple logic)
            status: (formData.stock || 0) === 0 ? 'Out of Stock' : (formData.stock || 0) < 10 ? 'Low Stock' : 'Active',
        } as Product;

        if (isEditMode && id) {
            await updateProduct({ ...productData, id });
        } else {
            await addProduct({ ...productData, id: crypto.randomUUID() });
        }
        navigate('/inventory');
    } catch (error) {
        console.error("Failed to save product", error);
        alert("Failed to save product. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/inventory')} className="p-2 hover:bg-gray-100 rounded-full text-slate-500">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">{isEditMode ? 'Edit Product' : 'Create New Product'}</h1>
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
                  value={formData.description || ''}
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
                        <label className="block text-sm font-medium text-slate-700 mb-1">Current Stock</label>
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
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-1/3 aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 w-full space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LinkIcon className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className="w-full pl-9 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://..."
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Paste a URL for the product image.</p>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-gray-50 transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 mb-2 text-slate-400" />
                        <p className="font-medium text-sm">Upload Image</p>
                        <p className="text-xs mt-1">(Upload functionality simulated)</p>
                    </div>
                </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 pb-10">
            <button type="button" onClick={() => navigate('/inventory')} className="px-6 py-2.5 border border-gray-300 rounded-lg text-slate-700 font-medium hover:bg-gray-50 transition-colors">
                Cancel
            </button>
            <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
