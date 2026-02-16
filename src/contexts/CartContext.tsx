import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface CartItem {
  groupCode: string;
  shadeCode: string;
  size: string;
  qty: number;
  productName?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (groupCode: string, shadeCode: string, size: string) => void;
  updateQty: (groupCode: string, shadeCode: string, size: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'leeukopf_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage on initialization
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      return [];
    }
  });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems(prevItems => {
      // Check if item already exists (same groupCode + shadeCode + size)
      const existingIndex = prevItems.findIndex(
        i => i.groupCode === item.groupCode && 
             i.shadeCode === item.shadeCode && 
             i.size === item.size
      );

      if (existingIndex >= 0) {
        // Update existing item quantity
        const newItems = [...prevItems];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          qty: newItems[existingIndex].qty + item.qty
        };
        return newItems;
      } else {
        // Add new item
        return [...prevItems, item];
      }
    });
  };

  const removeItem = (groupCode: string, shadeCode: string, size: string) => {
    setItems(prevItems => 
      prevItems.filter(
        item => !(item.groupCode === groupCode && 
                  item.shadeCode === shadeCode && 
                  item.size === size)
      )
    );
  };

  const updateQty = (groupCode: string, shadeCode: string, size: string, qty: number) => {
    if (qty <= 0) {
      removeItem(groupCode, shadeCode, size);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.groupCode === groupCode && 
        item.shadeCode === shadeCode && 
        item.size === size
          ? { ...item, qty }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
