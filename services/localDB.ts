
import { MOCK_PRODUCTS, MOCK_CUSTOMERS, MOCK_SUPPLIERS, MOCK_EXPENSES, MOCK_CATEGORIES, MOCK_PURCHASE_ORDERS, MOCK_EXPENSE_CATEGORIES } from './mockData';

const DB_NAME = 'NexusERP_DB';
const DB_VERSION = 3; // Incremented version to trigger upgrade for new store
const STORES = {
  PRODUCTS: 'products',
  CUSTOMERS: 'customers',
  SUPPLIERS: 'suppliers',
  EXPENSES: 'expenses',
  CATEGORIES: 'categories',
  EXPENSE_CATEGORIES: 'expense_categories',
  PURCHASE_ORDERS: 'purchase_orders',
  SYNC_QUEUE: 'sync_queue'
};

export interface SyncTask {
  id?: number;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  collection: string;
  payload: any;
  timestamp: number;
}

// Helper to open DB
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      const createStore = (name: string, keyPath: string = 'id') => {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath });
        }
      };

      createStore(STORES.PRODUCTS);
      createStore(STORES.CUSTOMERS);
      createStore(STORES.SUPPLIERS);
      createStore(STORES.EXPENSES);
      createStore(STORES.CATEGORIES);
      createStore(STORES.EXPENSE_CATEGORIES);
      createStore(STORES.PURCHASE_ORDERS);
      
      if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const dbService = {
  async init() {
    const db = await openDB();
    
    const seedStore = async (storeName: string, mockData: any[]) => {
       const tx = db.transaction(storeName, 'readonly');
       const countRequest = tx.objectStore(storeName).count();
       
       return new Promise<void>((resolve) => {
         countRequest.onsuccess = async () => {
           if (countRequest.result === 0 && mockData.length > 0) {
             const writeTx = db.transaction(storeName, 'readwrite');
             const store = writeTx.objectStore(storeName);
             mockData.forEach(item => store.put(item));
             await new Promise(r => writeTx.oncomplete = r);
             console.log(`Database seeded with ${storeName}`);
           }
           resolve();
         };
       });
    };

    await Promise.all([
        seedStore(STORES.PRODUCTS, MOCK_PRODUCTS),
        seedStore(STORES.CUSTOMERS, MOCK_CUSTOMERS),
        seedStore(STORES.SUPPLIERS, MOCK_SUPPLIERS),
        seedStore(STORES.EXPENSES, MOCK_EXPENSES),
        seedStore(STORES.CATEGORIES, MOCK_CATEGORIES),
        seedStore(STORES.EXPENSE_CATEGORIES, MOCK_EXPENSE_CATEGORIES),
        seedStore(STORES.PURCHASE_ORDERS, MOCK_PURCHASE_ORDERS),
    ]);
  },

  async getAll<T>(storeName: string): Promise<T[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const request = tx.objectStore(storeName).getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async get<T>(storeName: string, id: string): Promise<T | undefined> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const request = tx.objectStore(storeName).get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
  },

  async put(storeName: string, data: any) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      tx.objectStore(storeName).put(data);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  },
  
  async delete(storeName: string, id: string) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      tx.objectStore(storeName).delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  },

  // Queue Operations
  async addToSyncQueue(task: Omit<SyncTask, 'id' | 'timestamp'>) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SYNC_QUEUE, 'readwrite');
      tx.objectStore(STORES.SYNC_QUEUE).add({
        ...task,
        timestamp: Date.now()
      });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  },

  async getSyncQueue(): Promise<SyncTask[]> {
    return this.getAll(STORES.SYNC_QUEUE) as Promise<SyncTask[]>;
  },

  async clearSyncTask(id: number) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.SYNC_QUEUE, 'readwrite');
        tx.objectStore(STORES.SYNC_QUEUE).delete(id);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
    });
  }
};
