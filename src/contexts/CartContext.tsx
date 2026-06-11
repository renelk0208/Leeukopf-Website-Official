import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CartItem, CartState } from '../types/cart';

const CART_STORAGE_KEY = 'leeukopf_cart';

interface CartContextType {
  state: CartState;
  addItem: (input: Omit<CartItem, 'key'>) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clearCart: () => void;
  getTotalQty: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  items: [],
};

function readStoredCart(): CartState {
  if (typeof window === 'undefined') {
    return initialState;
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return initialState;
    }

    const parsed = JSON.parse(raw) as CartState;
    if (!parsed || !Array.isArray(parsed.items)) {
      return initialState;
    }

    return parsed;
  } catch {
    return initialState;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>(() => readStoredCart());

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addItem = (input: Omit<CartItem, 'key'>) => {
    const key = `${input.groupCode}-${input.shadeCode}-${input.packSize}`;

    setState((prev) => {
      const existingIndex = prev.items.findIndex((item) => item.key === key);

      if (existingIndex === -1) {
        return {
          items: [...prev.items, { ...input, key, qty: Math.max(input.qty, input.moq) }],
        };
      }

      const nextItems = [...prev.items];
      const existingItem = nextItems[existingIndex];
      const nextQty = Math.max(existingItem.qty + input.qty, existingItem.moq);

      nextItems[existingIndex] = {
        ...existingItem,
        qty: nextQty,
        moq: input.moq,
        productName: input.productName ?? existingItem.productName,
      };

      return { items: nextItems };
    });
  };

  const removeItem = (key: string) => {
    setState((prev) => ({
      items: prev.items.filter((item) => item.key !== key),
    }));
  };

  const updateQty = (key: string, qty: number) => {
    setState((prev) => ({
      items: prev.items.map((item) =>
        item.key === key
          ? {
              ...item,
              qty: Math.max(qty, item.moq),
            }
          : item
      ),
    }));
  };

  const clearCart = () => {
    setState(initialState);
  };

  const getTotalQty = useCallback(() => state.items.reduce((total, item) => total + item.qty, 0), [state.items]);

  const value = useMemo<CartContextType>(
    () => ({
      state,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      getTotalQty,
    }),
    [state, getTotalQty]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}