
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { POS } from './pages/POS';
import { Inventory } from './pages/Inventory';
import { CreateProduct } from './pages/CreateProduct';
import { Orders } from './pages/Orders';
import { Settings } from './pages/Settings';
import { Customers } from './pages/Customers';
import { Suppliers } from './pages/Suppliers';
import { Expenses } from './pages/Expenses';
import { Categories } from './pages/Categories';
import { PurchaseOrders } from './pages/PurchaseOrders';
import { CreatePurchaseOrder } from './pages/CreatePurchaseOrder';
import { DataProvider } from './contexts/DataContext';

// Layout wrapper component
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // Simple way to determine current page ID from path
  const currentPage = location.pathname.split('/')[1] || 'dashboard';

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-900">
      <Sidebar currentPage={currentPage} onNavigate={(page) => navigate(`/${page === 'dashboard' ? '' : page}`)} />
      <main className="flex-1 overflow-hidden h-full">
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/create" element={<CreateProduct />} />
            <Route path="/inventory/edit/:id" element={<CreateProduct />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/purchase-orders" element={<PurchaseOrders />} />
            <Route path="/purchase-orders/create" element={<CreatePurchaseOrder />} />
            <Route path="/reports" element={
               <div className="p-8 text-center text-slate-500">Reports Module Placeholder</div>
            } />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AppLayout>
      </Router>
    </DataProvider>
  );
};

export default App;
