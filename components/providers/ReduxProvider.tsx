"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store, useAppDispatch } from "@/lib/redux/store";
import { loadCartFromDb } from "@/lib/redux/slices/cartSlice";
import { loadOrdersFromSupabase } from "@/lib/redux/slices/ordersSlice";
import { getProducts } from "@/lib/redux/slices/productsSlice";

function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Load cart and orders from Supabase (with localStorage fallback)
    dispatch(loadCartFromDb());
    dispatch(loadOrdersFromSupabase());
    dispatch(getProducts());
  }, [dispatch]);

  return <>{children}</>;
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AppInitializer>{children}</AppInitializer>
    </Provider>
  );
}
