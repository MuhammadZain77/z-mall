import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

export interface ToastNotification {
  id: string;
  message: string;
  type: "success" | "info" | "error";
  duration?: number;
}

export interface UIState {
  isCartDrawerOpen: boolean;
  quickViewProduct: Product | null;
  toasts: ToastNotification[];
  isMobileMenuOpen: boolean;
}

const initialState: UIState = {
  isCartDrawerOpen: false,
  quickViewProduct: null,
  toasts: [],
  isMobileMenuOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleCartDrawer: (state) => {
      state.isCartDrawerOpen = !state.isCartDrawerOpen;
    },
    setCartDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isCartDrawerOpen = action.payload;
    },
    openQuickView: (state, action: PayloadAction<Product>) => {
      state.quickViewProduct = action.payload;
    },
    closeQuickView: (state) => {
      state.quickViewProduct = null;
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload;
    },
    addToast: (state, action: PayloadAction<Omit<ToastNotification, "id">>) => {
      const id = `${Date.now()}-${Math.random()}`;
      state.toasts.push({ ...action.payload, id });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  toggleCartDrawer,
  setCartDrawerOpen,
  openQuickView,
  closeQuickView,
  toggleMobileMenu,
  setMobileMenuOpen,
  addToast,
  removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;
