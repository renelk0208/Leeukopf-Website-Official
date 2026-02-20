import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { BottlePackaging, CartItem, CartTotals } from "../types";

type B2BCartState = {
  items: CartItem[];
  bottlePackaging: BottlePackaging | null;
};

type AddOrUpdatePayload = CartItem;

type B2BCartAction =
  | { type: "ADD_OR_UPDATE"; payload: AddOrUpdatePayload }
  | { type: "REMOVE"; payload: { category: CartItem["category"]; code: string } }
  | { type: "SET_QUANTITY"; payload: { category: CartItem["category"]; code: string; quantity: number } }
  | { type: "SET_BOTTLE_PACKAGING"; payload: BottlePackaging }
  | { type: "CLEAR_BOTTLE_PACKAGING" }
  | { type: "CLEAR" };

type B2BCartContextValue = {
  items: CartItem[];
  bottlePackaging: BottlePackaging | null;
  addOrUpdateItem: (item: CartItem) => void;
  removeItem: (category: CartItem["category"], code: string) => void;
  setQuantity: (category: CartItem["category"], code: string, quantity: number) => void;
  setBottlePackaging: (packaging: BottlePackaging) => void;
  clearBottlePackaging: () => void;
  clearCart: () => void;
  getTotals: () => CartTotals;
  getFilledUnitsTotal: () => number;
  getBottleUnitsRequired: () => number;
  isPrePrintedMinOk: () => boolean;
};

const B2B_CART_STORAGE_KEY = "leeukopf_b2b_cart_v1";

const initialState: B2BCartState = {
  items: [],
  bottlePackaging: null,
};

const GEL_POLISH_CATEGORIES = new Set<CartItem["category"]>(["SOLID_GEL_POLISH"]);

function normalizeQuantity(quantity: number): number {
  const safeQuantity = Number.isFinite(quantity) ? Math.floor(quantity) : 0;
  return Math.max(0, safeQuantity);
}

function findItemIndex(items: CartItem[], category: CartItem["category"], code: string): number {
  return items.findIndex((item) => item.category === category && item.code === code);
}

function reducer(state: B2BCartState, action: B2BCartAction): B2BCartState {
  switch (action.type) {
    case "ADD_OR_UPDATE": {
      const normalizedQty = normalizeQuantity(action.payload.quantity);
      const nextItem = {
        ...action.payload,
        quantity: normalizedQty,
      };
      const existingIndex = findItemIndex(state.items, nextItem.category, nextItem.code);

      if (normalizedQty <= 0) {
        if (existingIndex === -1) return state;
        return {
          items: state.items.filter((_, index) => index !== existingIndex),
          bottlePackaging: state.bottlePackaging,
        };
      }

      if (existingIndex === -1) {
        return {
          items: [...state.items, nextItem],
          bottlePackaging: state.bottlePackaging,
        };
      }

      const updatedItems = [...state.items];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        ...nextItem,
      };

      return { items: updatedItems, bottlePackaging: state.bottlePackaging };
    }

    case "REMOVE": {
      return {
        items: state.items.filter(
          (item) => !(item.category === action.payload.category && item.code === action.payload.code)
        ),
        bottlePackaging: state.bottlePackaging,
      };
    }

    case "SET_QUANTITY": {
      const quantity = normalizeQuantity(action.payload.quantity);
      const existingIndex = findItemIndex(state.items, action.payload.category, action.payload.code);
      if (existingIndex === -1) return state;

      if (quantity <= 0) {
        return {
          items: state.items.filter((_, index) => index !== existingIndex),
          bottlePackaging: state.bottlePackaging,
        };
      }

      const updatedItems = [...state.items];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity,
      };

      return { items: updatedItems, bottlePackaging: state.bottlePackaging };
    }

    case "CLEAR":
      return initialState;

    case "SET_BOTTLE_PACKAGING":
      return {
        ...state,
        bottlePackaging: action.payload,
      };

    case "CLEAR_BOTTLE_PACKAGING":
      return {
        ...state,
        bottlePackaging: null,
      };

    default:
      return state;
  }
}

function readStoredState(): B2BCartState {
  if (typeof window === "undefined") return initialState;

  try {
    const raw = window.localStorage.getItem(B2B_CART_STORAGE_KEY);
    if (!raw) return initialState;

    const parsed = JSON.parse(raw) as B2BCartState;
    if (!parsed || !Array.isArray(parsed.items)) return initialState;

    const hasValidBottlePackaging =
      parsed.bottlePackaging &&
      typeof parsed.bottlePackaging === "object" &&
      typeof parsed.bottlePackaging.size === "string" &&
      typeof parsed.bottlePackaging.color === "string" &&
      typeof parsed.bottlePackaging.brush === "string" &&
      typeof parsed.bottlePackaging.branding === "string";

    return {
      items: parsed.items
        .filter((item) => typeof item?.category === "string" && typeof item?.code === "string")
        .map((item) => ({
          ...item,
          quantity: normalizeQuantity(item.quantity),
        }))
        .filter((item) => item.quantity > 0),
      bottlePackaging: hasValidBottlePackaging ? parsed.bottlePackaging : null,
    };
  } catch {
    return initialState;
  }
}

const B2BCartContext = createContext<B2BCartContextValue | null>(null);

export function B2BCartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, readStoredState);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(B2B_CART_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addOrUpdateItem = useCallback((item: CartItem) => {
    dispatch({ type: "ADD_OR_UPDATE", payload: item });
  }, []);

  const removeItem = useCallback((category: CartItem["category"], code: string) => {
    dispatch({ type: "REMOVE", payload: { category, code } });
  }, []);

  const setQuantity = useCallback((category: CartItem["category"], code: string, quantity: number) => {
    dispatch({ type: "SET_QUANTITY", payload: { category, code, quantity } });
  }, []);

  const setBottlePackaging = useCallback((packaging: BottlePackaging) => {
    dispatch({ type: "SET_BOTTLE_PACKAGING", payload: packaging });
  }, []);

  const clearBottlePackaging = useCallback(() => {
    dispatch({ type: "CLEAR_BOTTLE_PACKAGING" });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const getTotals = useCallback((): CartTotals => {
    return {
      totalLines: state.items.length,
      totalQty: state.items.reduce((sum, item) => sum + normalizeQuantity(item.quantity), 0),
    };
  }, [state.items]);

  const getFilledUnitsTotal = useCallback((): number => {
    return state.items.reduce((sum, item) => {
      if (!GEL_POLISH_CATEGORIES.has(item.category)) return sum;
      return sum + normalizeQuantity(item.quantity);
    }, 0);
  }, [state.items]);

  const getBottleUnitsRequired = useCallback((): number => {
    return getFilledUnitsTotal();
  }, [getFilledUnitsTotal]);

  const isPrePrintedMinOk = useCallback((): boolean => {
    if (state.bottlePackaging?.branding !== "PRE_PRINTED") return true;
    return getBottleUnitsRequired() >= 5000;
  }, [getBottleUnitsRequired, state.bottlePackaging?.branding]);

  const value = useMemo<B2BCartContextValue>(
    () => ({
      items: state.items,
      bottlePackaging: state.bottlePackaging,
      addOrUpdateItem,
      removeItem,
      setQuantity,
      setBottlePackaging,
      clearBottlePackaging,
      clearCart,
      getTotals,
      getFilledUnitsTotal,
      getBottleUnitsRequired,
      isPrePrintedMinOk,
    }),
    [
      state.items,
      state.bottlePackaging,
      addOrUpdateItem,
      removeItem,
      setQuantity,
      setBottlePackaging,
      clearBottlePackaging,
      clearCart,
      getTotals,
      getFilledUnitsTotal,
      getBottleUnitsRequired,
      isPrePrintedMinOk,
    ]
  );

  return <B2BCartContext.Provider value={value}>{children}</B2BCartContext.Provider>;
}

export function useB2BCart() {
  const context = useContext(B2BCartContext);
  if (!context) {
    throw new Error("useB2BCart must be used within a B2BCartProvider");
  }
  return context;
}
