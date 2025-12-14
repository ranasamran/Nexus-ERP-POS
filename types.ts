
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  image: string;
  warehouse: string;
  status: 'Active' | 'Low Stock' | 'Out of Stock';
  selected?: boolean;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
  discount?: number; // Percentage
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
  itemsCount: number;
  paymentMethod: string;
  items: OrderItem[];
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  status: 'Active' | 'Inactive';
}

export interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  warehouse: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
}

export interface PurchaseOrder {
  id: string;
  supplierName: string;
  date: string;
  expectedDate: string;
  total: number;
  status: 'Draft' | 'Ordered' | 'Received';
  warehouse: string;
  items: OrderItem[];
}

export interface StockHistoryEntry {
  id: string;
  productId: string;
  productName: string;
  change: number;
  balance: number;
  type: 'Adjustment' | 'Sale' | 'Purchase' | 'Return';
  reason: string;
  date: string;
  user: string;
}

export type ViewMode = 'grid' | 'list' | 'compact';
