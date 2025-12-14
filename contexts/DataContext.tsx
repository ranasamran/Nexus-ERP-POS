
import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../services/localDB';
import { supabase } from '../services/supabaseClient';
import { Product, Customer, Supplier, Expense, Category, PurchaseOrder, ExpenseCategory } from '../types';

interface DataContextType {
  products: Product[];
  customers: Customer[];
  suppliers: Supplier[];
  expenses: Expense[];
  categories: Category[];
  expenseCategories: ExpenseCategory[];
  purchaseOrders: PurchaseOrder[];
  loading: boolean;
  isOnline: boolean;
  isSyncing: boolean;
  
  // Product CRUD
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Customer CRUD
  addCustomer: (customer: Customer) => Promise<void>;
  updateCustomer: (customer: Customer) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;

  // Supplier CRUD
  addSupplier: (supplier: Supplier) => Promise<void>;
  updateSupplier: (supplier: Supplier) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;

  // Category CRUD
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Expense CRUD
  addExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  // Expense Category CRUD
  addExpenseCategory: (category: ExpenseCategory) => Promise<void>;
  deleteExpenseCategory: (id: string) => Promise<void>;

  // Purchase Order CRUD
  addPurchaseOrder: (po: PurchaseOrder) => Promise<void>;
  updatePurchaseOrder: (po: PurchaseOrder) => Promise<void>;
  receivePurchaseOrder: (id: string) => Promise<void>;

  refresh: () => void;
}

const DataContext = createContext<DataContextType>({} as DataContextType);

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);

  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Initialize DB and Load Data
  useEffect(() => {
    const init = async () => {
      await dbService.init();
      loadLocalData();
    };
    init();
  }, [refreshTrigger]);

  // Network Listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      processSyncQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadLocalData = async () => {
    setLoading(true);
    const [p, c, s, e, cat, ec, po] = await Promise.all([
        dbService.getAll<Product>('products'),
        dbService.getAll<Customer>('customers'),
        dbService.getAll<Supplier>('suppliers'),
        dbService.getAll<Expense>('expenses'),
        dbService.getAll<Category>('categories'),
        dbService.getAll<ExpenseCategory>('expense_categories'),
        dbService.getAll<PurchaseOrder>('purchase_orders')
    ]);
    setProducts(p);
    setCustomers(c);
    setSuppliers(s);
    setExpenses(e);
    setCategories(cat);
    setExpenseCategories(ec);
    setPurchaseOrders(po);
    setLoading(false);
  };

  const processSyncQueue = async () => {
    if (!navigator.onLine) return;
    setIsSyncing(true);
    
    try {
      const queue = await dbService.getSyncQueue();
      for (const task of queue) {
        if (!task.id) continue;
        
        // In a real app, perform supabase calls here based on task.collection and task.type
        // console.log(`Syncing ${task.type} for ${task.collection}`);

        await dbService.clearSyncTask(task.id);
      }
    } catch (e) {
      console.error("Sync failed", e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Helper for generic CRUD operations to reduce boilerplate
  const performCrud = async <T extends { id: string }>(
    collection: string, 
    type: 'CREATE' | 'UPDATE' | 'DELETE', 
    item: T | { id: string }, 
    updateState: () => void
  ) => {
    if (type === 'DELETE') {
        await dbService.delete(collection, item.id);
    } else {
        await dbService.put(collection, item);
    }
    
    // Update local state by reloading (simplest) or modifying state directly (optimized)
    updateState();

    await dbService.addToSyncQueue({
      type,
      collection,
      payload: item
    });

    if (isOnline) processSyncQueue();
  };

  // --- Product CRUD ---
  const addProduct = async (product: Product) => {
    await performCrud('products', 'CREATE', product, () => setProducts(prev => [...prev, product]));
  };
  const updateProduct = async (product: Product) => {
    await performCrud('products', 'UPDATE', product, () => setProducts(prev => prev.map(p => p.id === product.id ? product : p)));
  };
  const deleteProduct = async (id: string) => {
    await performCrud('products', 'DELETE', { id }, () => setProducts(prev => prev.filter(p => p.id !== id)));
  };

  // --- Customer CRUD ---
  const addCustomer = async (customer: Customer) => {
    await performCrud('customers', 'CREATE', customer, () => setCustomers(prev => [...prev, customer]));
  };
  const updateCustomer = async (customer: Customer) => {
    await performCrud('customers', 'UPDATE', customer, () => setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c)));
  };
  const deleteCustomer = async (id: string) => {
    await performCrud('customers', 'DELETE', { id }, () => setCustomers(prev => prev.filter(c => c.id !== id)));
  };

  // --- Supplier CRUD ---
  const addSupplier = async (supplier: Supplier) => {
    await performCrud('suppliers', 'CREATE', supplier, () => setSuppliers(prev => [...prev, supplier]));
  };
  const updateSupplier = async (supplier: Supplier) => {
    await performCrud('suppliers', 'UPDATE', supplier, () => setSuppliers(prev => prev.map(s => s.id === supplier.id ? supplier : s)));
  };
  const deleteSupplier = async (id: string) => {
    await performCrud('suppliers', 'DELETE', { id }, () => setSuppliers(prev => prev.filter(s => s.id !== id)));
  };

  // --- Category CRUD ---
  const addCategory = async (category: Category) => {
    await performCrud('categories', 'CREATE', category, () => setCategories(prev => [...prev, category]));
  };
  const updateCategory = async (category: Category) => {
    await performCrud('categories', 'UPDATE', category, () => setCategories(prev => prev.map(c => c.id === category.id ? category : c)));
  };
  const deleteCategory = async (id: string) => {
    await performCrud('categories', 'DELETE', { id }, () => setCategories(prev => prev.filter(c => c.id !== id)));
  };

  // --- Expense CRUD ---
  const addExpense = async (expense: Expense) => {
    await performCrud('expenses', 'CREATE', expense, () => setExpenses(prev => [...prev, expense]));
  };
  const deleteExpense = async (id: string) => {
    await performCrud('expenses', 'DELETE', { id }, () => setExpenses(prev => prev.filter(e => e.id !== id)));
  };

  // --- Expense Category CRUD ---
  const addExpenseCategory = async (category: ExpenseCategory) => {
    await performCrud('expense_categories', 'CREATE', category, () => setExpenseCategories(prev => [...prev, category]));
  };
  const deleteExpenseCategory = async (id: string) => {
    await performCrud('expense_categories', 'DELETE', { id }, () => setExpenseCategories(prev => prev.filter(c => c.id !== id)));
  };

  // --- Purchase Order CRUD ---
  const addPurchaseOrder = async (po: PurchaseOrder) => {
    await performCrud('purchase_orders', 'CREATE', po, () => setPurchaseOrders(prev => [...prev, po]));
  };
  
  const updatePurchaseOrder = async (po: PurchaseOrder) => {
    await performCrud('purchase_orders', 'UPDATE', po, () => setPurchaseOrders(prev => prev.map(p => p.id === po.id ? po : p)));
  };

  const receivePurchaseOrder = async (id: string) => {
    const po = purchaseOrders.find(p => p.id === id);
    if (!po || po.status === 'Received') return;

    // 1. Update PO Status
    const updatedPO = { ...po, status: 'Received' as const };
    await updatePurchaseOrder(updatedPO);

    // 2. Update Product Stock
    for (const item of po.items) {
      const product = products.find(p => p.id === item.productId);
      if (product) {
         const newStock = product.stock + item.quantity;
         const newStatus = newStock > 10 ? 'Active' : newStock > 0 ? 'Low Stock' : 'Out of Stock';
         await updateProduct({ 
             ...product, 
             stock: newStock,
             status: newStatus as any
         });
      }
    }
  };

  return (
    <DataContext.Provider value={{ 
      products, customers, suppliers, expenses, categories, expenseCategories, purchaseOrders,
      loading, isOnline, isSyncing,
      addProduct, updateProduct, deleteProduct,
      addCustomer, updateCustomer, deleteCustomer,
      addSupplier, updateSupplier, deleteSupplier,
      addCategory, updateCategory, deleteCategory,
      addExpense, deleteExpense,
      addExpenseCategory, deleteExpenseCategory,
      addPurchaseOrder, updatePurchaseOrder, receivePurchaseOrder,
      refresh: () => setRefreshTrigger(prev => prev + 1)
    }}>
      {children}
    </DataContext.Provider>
  );
};
