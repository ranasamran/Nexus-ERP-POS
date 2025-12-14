
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Search, Plus, Folder, Edit2, Trash2, X } from 'lucide-react';
import { Category } from '../types';

export const Categories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({ name: '', description: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const openModal = (category?: Category) => {
    if (category) {
        setEditingCategory(category);
        setFormData(category);
    } else {
        setEditingCategory(null);
        setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
        await updateCategory({ ...editingCategory, ...formData } as Category);
    } else {
        await addCategory({ 
            id: crypto.randomUUID(), 
            name: formData.name!, 
            description: formData.description!, 
            productCount: 0 
        } as Category);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
      if (window.confirm("Are you sure you want to delete this category?")) {
          await deleteCategory(id);
      }
  };

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-6 h-full flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 shrink-0">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Product Categories</h1>
                <p className="text-slate-500">Organize your inventory with categories.</p>
            </div>
             <div className="flex gap-3">
                <button onClick={() => openModal()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-sm">
                    <Plus className="w-4 h-4" /> Add Category
                </button>
            </div>
        </div>

         <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden">
             <div className="p-4 border-b border-gray-200 shrink-0">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search categories..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>
            <div className="overflow-auto flex-1">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-slate-600 font-medium border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 w-12"></th>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3 text-center">Products</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredCategories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50 group">
                                <td className="px-6 py-4">
                                    <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <Folder className="w-4 h-4" />
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900">{category.name}</td>
                                <td className="px-6 py-4 text-slate-500">{category.description}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="bg-gray-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                        {category.productCount} items
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openModal(category)} className="p-1.5 hover:bg-gray-100 rounded text-slate-600">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(category.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                         {filteredCategories.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                    No categories found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
         </div>

         {/* Modal */}
         {isModalOpen && (
             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-lg text-slate-900">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
                        <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-gray-200 rounded-full">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category Name</label>
                            <input 
                                type="text" 
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea 
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="pt-2 flex gap-3">
                            <button 
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-slate-700 font-medium rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                            >
                                {editingCategory ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
             </div>
        )}
    </div>
  );
};
