import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Order, OrderStatus } from "@/types/product";
import { submitOrderToFakeStore } from "@/lib/api/fakestore";
import {
  insertOrder,
  fetchAllOrders,
  updateOrderStatusInDb,
} from "@/lib/supabase/orders";

export interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  isSubmitting: boolean;
  isLoading: boolean;
  error: string | null;
  supabaseConnected: boolean;
}

const ORDERS_STORAGE_KEY = "z_mall_orders_v1";

const DEMO_ORDERS: Order[] = [
  {
    id: "ZM-882910",
    fakeStoreOrderId: 4,
    date: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // 28 hours ago
    items: [
      {
        productId: 1,
        title: "Zenith Pro X 5G (Titanium Gray - 512GB)",
        price: 999.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1200&auto=format&fit=crop",
        color: "#1e2029",
      },
      {
        productId: 7,
        title: "HyperGaN 140W 4-Port Fast Desktop Charger",
        price: 99.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    subtotal: 1099.98,
    discount: 219.99,
    shipping: 0,
    tax: 70.39,
    total: 950.38,
    status: "In Transit",
    shippingAddress: {
      fullName: "Alex Rivera",
      email: "alex.rivera@techpulse.io",
      phone: "+1 (555) 382-9104",
      address: "742 Silicon Boulevard, Suite 500",
      city: "San Francisco",
      postalCode: "94107",
      country: "United States",
    },
    paymentMethod: "apple-pay",
    trackingNumber: "FEDX-948172901-ZM",
    estimatedDelivery: new Date(Date.now() + 1000 * 60 * 60 * 24).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    timeline: [
      {
        status: "Order Placed",
        timestamp: "Yesterday, 10:15 AM",
        completed: true,
        description: "Payment confirmed via Apple Pay. Order received by fulfillment center.",
      },
      {
        status: "Processing",
        timestamp: "Yesterday, 02:40 PM",
        completed: true,
        description: "Custom titanium packaging verified and quality inspection passed.",
      },
      {
        status: "Dispatched",
        timestamp: "Yesterday, 08:30 PM",
        completed: true,
        description: "Package departed from Z-Mall Central Depot in Fremont, CA.",
      },
      {
        status: "In Transit",
        timestamp: "Today, 06:10 AM",
        completed: true,
        description: "In transit with courier - Out for final regional sorting.",
      },
      {
        status: "Delivered",
        timestamp: "Expected Tomorrow by 7:00 PM",
        completed: false,
        description: "Direct signature delivery required.",
      },
    ],
  },
  {
    id: "ZM-619284",
    fakeStoreOrderId: 2,
    date: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // 5 days ago
    items: [
      {
        productId: 5,
        title: "PulseAudio Horizon Pro Wireless Headphones",
        price: 349.0,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    subtotal: 349.0,
    discount: 34.9,
    shipping: 0,
    tax: 25.12,
    total: 339.22,
    status: "Delivered",
    shippingAddress: {
      fullName: "Alex Rivera",
      email: "alex.rivera@techpulse.io",
      phone: "+1 (555) 382-9104",
      address: "742 Silicon Boulevard, Suite 500",
      city: "San Francisco",
      postalCode: "94107",
      country: "United States",
    },
    paymentMethod: "credit-card",
    trackingNumber: "DHL-481940172-ZM",
    estimatedDelivery: "Delivered 3 days ago",
    timeline: [
      {
        status: "Order Placed",
        timestamp: "5 days ago",
        completed: true,
        description: "Order placed and authorized.",
      },
      {
        status: "Processing",
        timestamp: "5 days ago",
        completed: true,
        description: "Packed and sealed.",
      },
      {
        status: "Dispatched",
        timestamp: "4 days ago",
        completed: true,
        description: "Handed over to DHL Express.",
      },
      {
        status: "In Transit",
        timestamp: "4 days ago",
        completed: true,
        description: "Transit to local hub.",
      },
      {
        status: "Delivered",
        timestamp: "3 days ago",
        completed: true,
        description: "Delivered to front desk. Signed by recipient.",
      },
    ],
  },
];

const loadSavedOrders = (): Order[] => {
  if (typeof window === "undefined") return DEMO_ORDERS;
  try {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.length > 0 ? parsed : DEMO_ORDERS;
    }
    return DEMO_ORDERS;
  } catch {
    return DEMO_ORDERS;
  }
};

const saveOrdersToStorage = (orders: Order[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch {
    console.error("Failed to save orders to localStorage");
  }
};

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  isSubmitting: false,
  isLoading: false,
  error: null,
  supabaseConnected: false,
};

// ─── Async: Load orders from Supabase (fallback to localStorage) ────
export const loadOrdersFromSupabase = createAsyncThunk(
  "orders/loadFromSupabase",
  async () => {
    try {
      const supabaseOrders = await fetchAllOrders();
      if (supabaseOrders.length > 0) {
        return { orders: supabaseOrders, source: "supabase" as const };
      }
      // If Supabase is empty, seed it with demo orders and use those
      const localOrders = loadSavedOrders();
      // Fire-and-forget: seed Supabase with demo data
      for (const order of localOrders) {
        insertOrder(order).catch(() => {});
      }
      return { orders: localOrders, source: "local" as const };
    } catch (err: unknown) {
      console.warn("[Orders] Supabase unavailable, falling back to localStorage", err);
      return { orders: loadSavedOrders(), source: "local" as const };
    }
  }
);

// ─── Async: Place order → FakeStoreAPI + Supabase ────
export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (orderPayload: Omit<Order, "fakeStoreOrderId">, { rejectWithValue }) => {
    try {
      // 1. Sync with FakeStoreAPI
      const syncResult = await submitOrderToFakeStore(orderPayload);
      const fullOrder: Order = {
        ...orderPayload,
        fakeStoreOrderId: syncResult.fakeStoreId,
      };

      // 2. Persist to Supabase (fire-and-forget with error logging)
      insertOrder(fullOrder).catch((err) => {
        console.error("[Orders] Failed to persist order to Supabase:", err);
      });

      return fullOrder;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to place order";
      return rejectWithValue(message);
    }
  }
);

// ─── Async: Update order status → local + Supabase ────
export const advanceOrderStatus = createAsyncThunk(
  "orders/advanceStatus",
  async (
    { orderId, newStatus }: { orderId: string; newStatus: OrderStatus },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { orders: OrdersState };
      const order = state.orders.orders.find((o) => o.id === orderId);
      if (!order) throw new Error("Order not found");

      const statusOrder: OrderStatus[] = [
        "Order Placed",
        "Processing",
        "Dispatched",
        "In Transit",
        "Delivered",
      ];
      const newIndex = statusOrder.indexOf(newStatus);
      const updatedTimeline = order.timeline.map((step) => {
        const stepIndex = statusOrder.indexOf(step.status);
        return {
          ...step,
          completed: stepIndex <= newIndex,
          timestamp: stepIndex === newIndex ? "Just now" : step.timestamp,
        };
      });

      // Sync to Supabase
      updateOrderStatusInDb(orderId, newStatus, updatedTimeline).catch((err) => {
        console.error("[Orders] Failed to sync status to Supabase:", err);
      });

      return { orderId, newStatus, updatedTimeline };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update status";
      return rejectWithValue(message);
    }
  }
);

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // Keep legacy initializer as a no-op fallback
    initializeOrders: (state) => {
      if (state.orders.length === 0) {
        state.orders = loadSavedOrders();
      }
    },
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
    // Legacy sync reducer (kept for backward compat)
    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; newStatus: OrderStatus }>
    ) => {
      const { orderId, newStatus } = action.payload;
      const order = state.orders.find((o) => o.id === orderId);
      if (order) {
        order.status = newStatus;
        const statusOrder: OrderStatus[] = [
          "Order Placed",
          "Processing",
          "Dispatched",
          "In Transit",
          "Delivered",
        ];
        const newIndex = statusOrder.indexOf(newStatus);
        order.timeline = order.timeline.map((step) => {
          const stepIndex = statusOrder.indexOf(step.status);
          return {
            ...step,
            completed: stepIndex <= newIndex,
            timestamp: stepIndex === newIndex ? "Just now" : step.timestamp,
          };
        });
        if (state.currentOrder?.id === orderId) {
          state.currentOrder = { ...order };
        }
        saveOrdersToStorage(state.orders);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ─── Load from Supabase ────
      .addCase(loadOrdersFromSupabase.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadOrdersFromSupabase.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.supabaseConnected = action.payload.source === "supabase";
        saveOrdersToStorage(action.payload.orders);
      })
      .addCase(loadOrdersFromSupabase.rejected, (state) => {
        state.isLoading = false;
        state.orders = loadSavedOrders();
        state.supabaseConnected = false;
      })
      // ─── Place order ────
      .addCase(placeOrder.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.orders.unshift(action.payload);
        state.currentOrder = action.payload;
        saveOrdersToStorage(state.orders);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      // ─── Advance order status ────
      .addCase(advanceOrderStatus.fulfilled, (state, action) => {
        const { orderId, newStatus, updatedTimeline } = action.payload;
        const order = state.orders.find((o) => o.id === orderId);
        if (order) {
          order.status = newStatus;
          order.timeline = updatedTimeline;
          if (state.currentOrder?.id === orderId) {
            state.currentOrder = { ...order };
          }
          saveOrdersToStorage(state.orders);
        }
      });
  },
});

export const { initializeOrders, setCurrentOrder, updateOrderStatus } =
  ordersSlice.actions;

export const selectOrders = (state: { orders: OrdersState }) =>
  state.orders.orders;
export const selectOrderById =
  (id: string) => (state: { orders: OrdersState }) =>
    state.orders.orders.find((o) => o.id === id);
export const selectOrdersLoading = (state: { orders: OrdersState }) =>
  state.orders.isLoading;
export const selectSupabaseConnected = (state: { orders: OrdersState }) =>
  state.orders.supabaseConnected;

export default ordersSlice.reducer;
