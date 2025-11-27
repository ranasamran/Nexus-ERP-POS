
import React from 'react';
import { LayoutDashboard, ShoppingCart, Package, Users, Settings, LogOut, Truck, BarChart3, Receipt, Tags, ClipboardList, Building2 } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos', label: 'Point of Sale', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'orders', label: 'Sales Orders', icon: Truck },
    { id: 'purchase-orders', label: 'Purchase Orders', icon: ClipboardList },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'suppliers', label: 'Suppliers', icon: Building2 },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200 h-screen sticky top-0 overflow-hidden">
      <div className="p-6 flex items-center gap-3 border-b border-gray-100 shrink-0">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">N</span>
        </div>
        <div>
            <h1 className="font-bold text-slate-800 leading-tight">Nexus ERP</h1>
            <p className="text-xs text-slate-500">Enterprise Edition</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={clsx(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-gray-50 hover:text-slate-900"
              )}
            >
              <Icon className={clsx("w-5 h-5", isActive ? "text-blue-600" : "text-slate-400")} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 shrink-0">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces" 
                alt="Admin" 
                className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">Admin User</p>
                <p className="text-xs text-slate-500 truncate">admin@nexus.com</p>
            </div>
        </div>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
