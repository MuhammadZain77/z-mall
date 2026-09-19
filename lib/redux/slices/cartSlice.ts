import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { CartItem, Product } from "@/types/product";
import { syncCartWithFakeStore } from "@/lib/api/fakestore";
import {
  saveCartToSupabase,
  loadCartFromSupabase,
  clearCartInSupabase,
  getSessionId,
} from "@/lib/supabase/cart";

export interface CartState {
  items: CartItem[];
  discountCode: string | null;
  discountPercent: number;
  isSyncing: boolean;
  syncError: string | null;
  sessionId: string;
}

const CART_STORAGE_KEY = "z_mall_cart_v1";

const loadLocalCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save cart to localStorage", e);
  }
};

// Fire-and-forget Supabase sync helper
const syncCartBackground = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  const sessionId = getSessionId();
  saveCartToSupabase(sessionId, items).catch((err) => {
    console.error("[Cart] Supabase sync failed:", err);
  });
};

const initialState: CartState = {
  items: [],
  discountCode: null,
  discountPercent: 0,
  isSyncing: false,
  syncError: null,
  sessionId: "",
};

// ─── Async: Load cart from Supabase (fallback to localStorage) ────
export const loadCartFromDb = createAsyncThunk(
  "cart/loadFromDb",
  async (_, { rejectWithValue }) => {
    try {
      const sessionId = getSessionId();
      const supabaseCart = await loadCartFromSupabase(sessionId);
      if (supabaseCart.length > 0) {
        return { items: supabaseCart, sessionId };
      }
      // Supabase empty — fall back to localStorage, then seed Supabase
      const localCart = loadLocalCart();
      if (localCart.length > 0) {
        saveCartToSupabase(sessionId, localCart).catch(() => {});
      }
      return { items: localCart, sessionId };
    } catch (err) {
      console.warn("[Cart] Supabase unavailable, falling back to localStorage");
      const sessionId = getSessionId();
      return { items: loadLocalCart(), sessionId };
    }
  }
);

// Async thunk to sync cart with FakeStoreAPI
export const syncCartRemote = createAsyncThunk(
  "cart/syncRemote",
  async (items: CartItem[], { rejectWithValue }) => {
    try {
      const payload = items.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
      }));
      const res = await syncCartWithFakeStore(1, payload);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to sync cart");
    }
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Keep legacy initializer as a no-op fallback
    initializeCart: (state) => {
      if (state.items.length === 0) {
        state.items = loadLocalCart();
        state.sessionId = typeof window !== "undefined" ? getSessionId() : "";
      }
    },
    addToCart: (
      state,
      action: PayloadAction<{
        product: Product;
        quantity?: number;
        selectedColor?: string;
      }>
    ) => {
      const { product, quantity = 1, selectedColor } = action.payload;
      const existing = state.items.find(
        (i) =>
          i.product.id === product.id &&
          (!selectedColor || i.selectedColor === selectedColor)
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          product,
          quantity,
          selectedColor: selectedColor || (product.colors?.[0] ?? undefined),
        });
      }
      saveCartToStorage(state.items);
      syncCartBackground(state.items);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((i) => i.product.id !== action.payload);
      saveCartToStorage(state.items);
      syncCartBackground(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.product.id === productId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.product.id !== productId);
        } else {
          item.quantity = quantity;
        }
      }
      saveCartToStorage(state.items);
      syncCartBackground(state.items);
    },
    applyCoupon: (state, action: PayloadAction<string>) => {
      const code = action.payload.trim().toUpperCase();
      if (code === "CYBER20") {
        state.discountCode = "CYBER20 (20% OFF)";
        state.discountPercent = 20;
      } else if (code === "TECH10") {
        state.discountCode = "TECH10 (10% OFF)";
        state.discountPercent = 10;
      } else if (code === "SUPER50") {
        state.discountCode = "SUPER50 ($50 OFF)";
        state.discountPercent = 15;
      } else {
        state.syncError = "Invalid promo code. Try CYBER20 or TECH10";
      }
    },
    removeCoupon: (state) => {
      state.discountCode = null;
      state.discountPercent = 0;
      state.syncError = null;
    },
    clearCart: (state) => {
      state.items = [];
      state.discountCode = null;
      state.discountPercent = 0;
      saveCartToStorage([]);
      // Clear in Supabase too
      if (typeof window !== "undefined") {
        const sessionId = getSessionId();
        clearCartInSupabase(sessionId).catch(() => {});
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ─── Load from Supabase ────
      .addCase(loadCartFromDb.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.sessionId = action.payload.sessionId;
        saveCartToStorage(action.payload.items);
      })
      // ─── FakeStore sync ────
      .addCase(syncCartRemote.pending, (state) => {
        state.isSyncing = true;
      })
      .addCase(syncCartRemote.fulfilled, (state) => {
        state.isSyncing = false;
        state.syncError = null;
      })
      .addCase(syncCartRemote.rejected, (state, action) => {
        state.isSyncing = false;
        state.syncError = action.payload as string;
      });
  },
});

export const {
  initializeCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  removeCoupon,
  clearCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartTotals = (state: { cart: CartState }) => {
  const subtotal = state.cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountAmount = (subtotal * state.cart.discountPercent) / 100;
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const shipping = subtotalAfterDiscount > 150 || subtotal === 0 ? 0 : 15;
  const tax = subtotalAfterDiscount * 0.08;
  const total = subtotalAfterDiscount + shipping + tax;

  return {
    subtotal,
    discountPercent: state.cart.discountPercent,
    discountAmount,
    shipping,
    tax,
    total,
    freeShippingQualified: subtotalAfterDiscount > 150,
  };
};

export default cartSlice.reducer;
