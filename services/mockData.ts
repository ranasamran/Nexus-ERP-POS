
import { Product, Customer, Order, Supplier, Expense, Category, PurchaseOrder, StockHistoryEntry } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wireless Ergonomic Mouse',
    sku: 'WEM-001',
    category: 'Electronics',
    price: 45.99,
    cost: 25.00,
    stock: 120,
    warehouse: 'Main Warehouse A',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
    selected: false
  },
  {
    id: '2',
    name: 'Mechanical Keyboard RGB',
    sku: 'MK-RGB-02',
    category: 'Electronics',
    price: 129.99,
    cost: 80.00,
    stock: 45,
    warehouse: 'Main Warehouse A',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=300&h=300&fit=crop',
    selected: false
  },
  {
    id: '3',
    name: 'Premium Cotton T-Shirt',
    sku: 'PCT-BLK-L',
    category: 'Apparel',
    price: 24.99,
    cost: 8.00,
    stock: 500,
    warehouse: 'Warehouse B',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    selected: false
  },
  {
    id: '4',
    name: 'Organic Coffee Beans',
    sku: 'GRO-COF-01',
    category: 'Groceries',
    price: 18.50,
    cost: 10.00,
    stock: 12,
    warehouse: 'Main Warehouse A',
    status: 'Low Stock',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop',
    selected: false
  },
  {
    id: '5',
    name: 'Leather Wallet',
    sku: 'ACC-WAL-01',
    category: 'Accessories',
    price: 55.00,
    cost: 20.00,
    stock: 0,
    warehouse: 'Warehouse C',
    status: 'Out of Stock',
    image: 'https://images.unsplash.com/photo-1627123424574-181ce90b594f?w=300&h=300&fit=crop',
    selected: false
  },
  {
    id: '6',
    name: '4K Monitor 27"',
    sku: 'MON-4K-27',
    category: 'Electronics',
    price: 349.99,
    cost: 250.00,
    stock: 8,
    warehouse: 'Main Warehouse A',
    status: 'Low Stock',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=300&fit=crop',
    selected: false
  },
  {
    id: '7',
    name: 'Running Shoes',
    sku: 'SHOE-RUN-01',
    category: 'Footwear',
    price: 89.99,
    cost: 40.00,
    stock: 60,
    warehouse: 'Warehouse B',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    selected: false
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Jane Cooper', email: 'jane@example.com', phone: '(555) 123-4567', points: 1250 },
  { id: '2', name: 'Wade Warren', email: 'wade@example.com', phone: '(555) 987-6543', points: 450 },
  { id: '3', name: 'Esther Howard', email: 'esther@example.com', phone: '(555) 456-7890', points: 890 },
];

export const MOCK_ORDERS: Order[] = [
  { 
    id: '#ORD-7782', 
    customerName: 'Jane Cooper', 
    date: '2023-10-24', 
    total: 125.99, 
    status: 'Completed', 
    itemsCount: 3, 
    paymentMethod: 'Credit Card',
    items: [
      { productId: '1', name: 'Wireless Ergonomic Mouse', quantity: 1, price: 45.99 },
      { productId: '3', name: 'Premium Cotton T-Shirt', quantity: 2, price: 24.99 },
      { productId: '4', name: 'Organic Coffee Beans', quantity: 1, price: 18.50 },
    ]
  },
  { 
    id: '#ORD-7781', 
    customerName: 'Guy Hawkins', 
    date: '2023-10-24', 
    total: 450.00, 
    status: 'Pending', 
    itemsCount: 1, 
    paymentMethod: 'Bank Transfer',
    items: [
      { productId: '6', name: '4K Monitor 27"', quantity: 1, price: 349.99 },
      { productId: '2', name: 'Mechanical Keyboard RGB', quantity: 1, price: 100.01 },
    ]
  },
  { 
    id: '#ORD-7780', 
    customerName: 'Robert Fox', 
    date: '2023-10-23', 
    total: 89.50, 
    status: 'Completed', 
    itemsCount: 5, 
    paymentMethod: 'Cash',
    items: [
      { productId: '4', name: 'Organic Coffee Beans', quantity: 5, price: 17.90 },
    ]
  },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'Global Tech Imports', contact: 'Sarah Johnson', email: 's.johnson@gti.com', status: 'Active' },
  { id: '2', name: 'Fabric & Co.', contact: 'Mike Smith', email: 'orders@fabric.co', status: 'Active' },
];

export const MOCK_EXPENSES: Expense[] = [
  { id: '1', description: 'Shipping Fees - Port to Warehouse', category: 'Logistics', amount: 1250.00, date: '2023-10-26', status: 'Paid', warehouse: 'Main Warehouse A' },
  { id: '2', description: 'Office Supplies - Printer Ink', category: 'Office Supplies', amount: 89.99, date: '2023-10-25', status: 'Paid', warehouse: 'Head Office' },
  { id: '3', description: 'Monthly Software Subscription', category: 'Software', amount: 499.00, date: '2023-10-24', status: 'Pending', warehouse: 'Corporate' },
  { id: '4', description: 'Warehouse Maintenance', category: 'Maintenance', amount: 2300.50, date: '2023-10-22', status: 'Overdue', warehouse: 'Warehouse B' },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Electronics', description: 'Gadgets, devices and accessories', productCount: 125 },
  { id: '2', name: 'Apparel', description: 'Clothing, footwear and fashion items', productCount: 210 },
  { id: '3', name: 'Groceries', description: 'Daily consumables and food items', productCount: 85 },
  { id: '4', name: 'Furniture', description: 'Office and home furniture', productCount: 42 },
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  { 
    id: 'PO-2023-001', 
    supplierName: 'Global Tech Imports', 
    date: '2023-10-20', 
    expectedDate: '2023-11-01', 
    total: 5400.00, 
    status: 'Ordered', 
    warehouse: 'Main Warehouse A',
    items: [
      { productId: '6', name: '4K Monitor 27"', quantity: 10, price: 250.00 },
      { productId: '2', name: 'Mechanical Keyboard RGB', quantity: 20, price: 80.00 },
      { productId: '1', name: 'Wireless Ergonomic Mouse', quantity: 50, price: 26.00 },
    ]
  },
  { 
    id: 'PO-2023-002', 
    supplierName: 'Fabric & Co.', 
    date: '2023-10-22', 
    expectedDate: '2023-10-29', 
    total: 1250.00, 
    status: 'Received', 
    warehouse: 'Warehouse B',
    items: [
       { productId: '3', name: 'Premium Cotton T-Shirt', quantity: 150, price: 8.00 },
       { productId: '7', name: 'Running Shoes', quantity: 10, price: 5.00 }, 
    ]
  },
  { 
    id: 'PO-2023-003', 
    supplierName: 'Industrial Hardware Co.', 
    date: '2023-10-25', 
    expectedDate: '2023-11-05', 
    total: 3200.00, 
    status: 'Draft', 
    warehouse: 'Warehouse C',
    items: [
       { productId: '5', name: 'Leather Wallet', quantity: 160, price: 20.00 },
    ]
  },
];

export const MOCK_STOCK_HISTORY: StockHistoryEntry[] = [
  { id: '1', productId: '1', productName: 'Wireless Ergonomic Mouse', change: 10, balance: 120, type: 'Purchase', reason: 'PO-2023-001 Received', date: '2023-10-27 14:30', user: 'Admin' },
  { id: '2', productId: '1', productName: 'Wireless Ergonomic Mouse', change: -2, balance: 118, type: 'Sale', reason: 'Order #ORD-7782', date: '2023-10-27 10:15', user: 'System' },
  { id: '3', productId: '4', productName: 'Organic Coffee Beans', change: -5, balance: 12, type: 'Adjustment', reason: 'Damaged Goods', date: '2023-10-26 09:00', user: 'Admin' },
  { id: '4', productId: '3', productName: 'Premium Cotton T-Shirt', change: 150, balance: 500, type: 'Purchase', reason: 'PO-2023-002 Received', date: '2023-10-25 16:45', user: 'Admin' },
  { id: '5', productId: '5', productName: 'Leather Wallet', change: -1, balance: 0, type: 'Sale', reason: 'Order #ORD-7765', date: '2023-10-24 11:20', user: 'System' },
];
