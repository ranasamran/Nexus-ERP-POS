
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, MoreHorizontal, X, Search, Edit2, Trash2 } from 'lucide-react';
import { Supplier } from '../types';

export const Suppliers: React.FC = () => {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: '',
    contact: '',
    email: '',
    status: 'Active'
  });

  const [searchQuery, setSearchQuery] = useState('');

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = (supplier?: Supplier) => {
    if (supplier) {
        setEditingSupplier(supplier);
        setFormData(supplier);
    } else {
        setEditingSupplier(null);
        setFormData({ name: '', contact: '', email: '', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingSupplier) {
        await updateSupplier({ ...editingSupplier, ...formData } as Supplier);
    } else {
        await addSupplier({ ...formData, id: crypto.randomUUID() } as Supplier);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
      if (window.confirm("Are you sure you want to delete this supplier?")) {
          await deleteSupplier(id);
      }
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400";

  return (
    <div className="p-6 h-full flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 shrink-0">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Supplier Management</h1>
                <p className="text-slate-500">Manage your vendor relationships.</p>
            </div>
             <div className="flex gap-3">
                <button onClick={() => openModal()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-sm transition-colors">
                    <Plus className="w-4 h-4" /> Add Supplier
                </button>
            </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden">
             <div className="p-4 border-b border-gray-200 shrink-0">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search suppliers..." 
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className="overflow-auto flex-1">
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
                        {filteredSuppliers.map((supplier) => (
                            <tr key={supplier.id} className="hover:bg-gray-50 group transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{supplier.name}</td>
                                <td className="px-6 py-4 text-slate-600">{supplier.contact}</td>
                                <td className="px-6 py-4 text-blue-600 hover:underline">{supplier.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${supplier.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {supplier.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => openModal(supplier)} className="p-1.5 text-slate-500 hover:bg-gray-100 rounded hover:text-blue-600 transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(supplier.id)} className="p-1.5 text-slate-500 hover:bg-red-50 rounded hover:text-red-600 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                         {filteredSuppliers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                    No suppliers found. Add one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Create/Edit Modal */}
        {isModalOpen && (
             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-lg text-slate-900">{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</h3>
                        <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-gray-200 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name</label>
                            <input 
                                type="text" 
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Contact Person</label>
                            <input 
                                type="text" 
                                required
                                value={formData.contact}
                                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                            <input 
                                type="email" 
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                            <select 
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                                className={inputClass}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="pt-2 flex gap-3">
                            <button 
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-slate-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
                            >
                                {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
                            </button>
                        </div>
                    </form>
                </div>
             </div>
        )}
    </div>
  );
};
