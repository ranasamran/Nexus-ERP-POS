
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Search, Filter, Plus, TrendingDown, TrendingUp, MoreHorizontal, FileText, X, Trash2, Tag } from 'lucide-react';
import clsx from 'clsx';
import { Expense } from '../types';

export const Expenses: React.FC = () => {
  const { expenses, addExpense, deleteExpense, expenseCategories, addExpenseCategory, deleteExpenseCategory } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Expense>>({
      description: '', category: '', amount: 0, date: new Date().toISOString().split('T')[0], status: 'Pending', warehouse: 'Main Warehouse A'
  });

  const [newCategoryName, setNewCategoryName] = useState('');

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const pendingAmount = expenses.filter(e => e.status === 'Pending' || e.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0);

  const filteredExpenses = expenses.filter(e => e.description.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category && expenseCategories.length > 0) {
        // Fallback to first category if not selected but categories exist
        formData.category = expenseCategories[0].name;
    }
    await addExpense({
        ...formData,
        id: crypto.randomUUID(),
        amount: Number(formData.amount)
    } as Expense);
    setIsModalOpen(false);
    setFormData({ description: '', category: '', amount: 0, date: new Date().toISOString().split('T')[0], status: 'Pending', warehouse: 'Main Warehouse A' });
  };

  const handleAddCategory = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newCategoryName.trim()) return;
      await addExpenseCategory({
          id: crypto.randomUUID(),
          name: newCategoryName.trim()
      });
      setNewCategoryName('');
  };

  const handleDeleteCategory = async (id: string) => {
      if (window.confirm("Delete this category?")) {
          await deleteExpenseCategory(id);
      }
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400";

  return (
    <div className="p-6 h-full flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 shrink-0">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Expense Management</h1>
                <p className="text-slate-500">Track operational costs and outgoing payments.</p>
            </div>
             <div className="flex gap-3">
                <button onClick={() => setIsManageCategoriesOpen(true)} className="px-4 py-2 bg-white border border-gray-200 text-slate-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2 shadow-sm transition-colors">
                    <Tag className="w-4 h-4" /> Manage Categories
                </button>
                <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-sm transition-colors">
                    <Plus className="w-4 h-4" /> Record Expense
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 shrink-0">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Expenses</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">${totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
                    </div>
                    <div className="p-2 bg-red-100 rounded-lg">
                        <TrendingDown className="w-5 h-5 text-red-600" />
                    </div>
                </div>
            </div>
             <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Pending Payments</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">${pendingAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
                    </div>
                    <div className="p-2 bg-amber-100 rounded-lg">
                        <FileText className="w-5 h-5 text-amber-600" />
                    </div>
                </div>
            </div>
             <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Budget Usage</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">78%</h3>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                </div>
            </div>
        </div>

         <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden">
             <div className="p-4 border-b border-gray-200 shrink-0 flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search expenses..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                </div>
                 <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-slate-600 hover:bg-gray-50 font-medium flex items-center gap-2 shadow-sm transition-colors">
                    <Filter className="w-4 h-4" /> Filters
                </button>
            </div>
            <div className="overflow-auto flex-1">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-slate-600 font-medium border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Warehouse</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Amount</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredExpenses.map((expense) => (
                            <tr key={expense.id} className="hover:bg-gray-50 group transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{expense.description}</td>
                                <td className="px-6 py-4 text-slate-600">
                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{expense.category}</span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{expense.date}</td>
                                <td className="px-6 py-4 text-slate-500">{expense.warehouse}</td>
                                <td className="px-6 py-4">
                                    <span className={clsx(
                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                        expense.status === 'Paid' ? "bg-green-100 text-green-800" :
                                        expense.status === 'Pending' ? "bg-amber-100 text-amber-800" :
                                        "bg-red-100 text-red-800"
                                    )}>
                                        {expense.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-slate-900">
                                    ${expense.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => { if(window.confirm('Delete this expense?')) deleteExpense(expense.id) }} 
                                        className="text-slate-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
         </div>

         {/* Create Modal */}
         {isModalOpen && (
             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-lg text-slate-900">Record New Expense</h3>
                        <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-gray-200 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                                <input type="text" required className={inputClass} 
                                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount</label>
                                <input type="number" required step="0.01" className={inputClass} 
                                    value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
                                <input type="date" required className={inputClass} 
                                    value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                                <select 
                                    className={inputClass} 
                                    required 
                                    value={formData.category} 
                                    onChange={e => setFormData({...formData, category: e.target.value})}
                                >
                                    <option value="">Select Category</option>
                                    {expenseCategories.map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                                <select className={inputClass} value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                                    <option value="Paid">Paid</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Overdue">Overdue</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Warehouse</label>
                                <select className={inputClass} value={formData.warehouse} onChange={e => setFormData({...formData, warehouse: e.target.value})}>
                                    <option>Main Warehouse A</option>
                                    <option>Warehouse B</option>
                                    <option>Warehouse C</option>
                                    <option>Head Office</option>
                                </select>
                            </div>
                        </div>
                        <div className="pt-2 flex gap-3">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 text-slate-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Record Expense</button>
                        </div>
                    </form>
                </div>
            </div>
         )}

         {/* Manage Categories Modal */}
         {isManageCategoriesOpen && (
             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-lg text-slate-900">Manage Categories</h3>
                        <button onClick={() => setIsManageCategoriesOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-gray-200 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="mb-4 max-h-60 overflow-y-auto space-y-2 pr-1">
                            {expenseCategories.length === 0 ? (
                                <p className="text-center text-slate-500 py-4">No categories found.</p>
                            ) : (
                                expenseCategories.map(cat => (
                                    <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all">
                                        <span className="font-medium text-slate-700">{cat.name}</span>
                                        <button 
                                            onClick={() => handleDeleteCategory(cat.id)}
                                            className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50"
                                            title="Delete Category"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                        <form onSubmit={handleAddCategory} className="flex gap-2 pt-2 border-t border-gray-100">
                             <input 
                                type="text" 
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="New Category Name..."
                             />
                             <button 
                                type="submit" 
                                disabled={!newCategoryName.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                             >
                                Add
                             </button>
                        </form>
                    </div>
                </div>
             </div>
         )}
    </div>
  );
};
