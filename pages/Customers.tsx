
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Mail, Phone, MoreHorizontal, Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { Customer } from '../types';

export const Customers: React.FC = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({ name: '', email: '', phone: '', points: 0 });

  const openModal = (customer?: Customer) => {
    if (customer) {
        setEditingCustomer(customer);
        setFormData(customer);
    } else {
        setEditingCustomer(null);
        setFormData({ name: '', email: '', phone: '', points: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
        await updateCustomer({ ...editingCustomer, ...formData } as Customer);
    } else {
        await addCustomer({ ...formData, id: crypto.randomUUID(), points: 0 } as Customer);
    }
    setIsModalOpen(false);
  };

  const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()));

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400";

  return (
    <div className="p-6 h-full flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shrink-0">
             <div>
                <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
                <p className="text-slate-500">Manage customer profiles and loyalty points.</p>
             </div>
             <div className="flex gap-3">
                 <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                     <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                 </div>
                <button onClick={() => openModal()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-sm transition-colors">
                    <Plus className="w-4 h-4" /> Add Customer
                </button>
            </div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
        {filteredCustomers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all group relative">
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal(customer)} className="p-1 text-slate-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => { if(window.confirm('Delete customer?')) deleteCustomer(customer.id) }} className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>

                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                            {customer.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">{customer.name}</h3>
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">Loyalty Member</span>
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Mail className="w-4 h-4" />
                        {customer.email}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Phone className="w-4 h-4" />
                        {customer.phone}
                    </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-sm">
                        <p className="text-slate-500">Loyalty Points</p>
                        <p className="font-bold text-slate-900">{customer.points}</p>
                    </div>
                    <button className="text-sm text-blue-600 font-medium hover:underline">View History</button>
                </div>
            </div>
        ))}
      </div>

       {/* Modal */}
       {isModalOpen && (
             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-lg text-slate-900">{editingCustomer ? 'Edit Customer' : 'New Customer'}</h3>
                        <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-gray-200 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                            <input type="text" required className={inputClass} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                            <input type="email" required className={inputClass} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                            <input type="text" required className={inputClass} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        </div>
                        <div className="pt-2 flex gap-3">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 text-slate-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Save</button>
                        </div>
                    </form>
                </div>
            </div>
       )}
    </div>
  );
};
