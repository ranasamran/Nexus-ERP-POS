
import React from 'react';
import { MOCK_CATEGORIES } from '../services/mockData';
import { Search, Plus, Folder, Edit2, Trash } from 'lucide-react';

export const Categories: React.FC = () => {
  return (
    <div className="p-6 h-full flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 shrink-0">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Product Categories</h1>
                <p className="text-slate-500">Organize your inventory with categories.</p>
            </div>
             <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-sm">
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
                        {MOCK_CATEGORIES.map((category) => (
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
                                        <button className="p-1.5 hover:bg-gray-100 rounded text-slate-600">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-1.5 hover:bg-red-50 rounded text-red-600">
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
         </div>
    </div>
  );
};
