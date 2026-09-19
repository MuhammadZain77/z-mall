import { supabase } from "./client";
import { CartItem } from "@/types/product";

const SESSION_KEY = "z_mall_session_id";

// =============================================================
// Get or create a stable browser session ID
// =============================================================
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

// =============================================================
// SAVE CART TO SUPABASE (full replace strategy)
// =============================================================
export async function saveCartToSupabase(
  sessionId: string,
  items: CartItem[]
): Promise<void> {
  try {
    // 1. Delete existing cart for this session
    await supabase.from("cart_items").delete().eq("session_id", sessionId);

    // 2. Insert new items (if any)
    if (items.length > 0) {
      const rows = items.map((item) => ({
        session_id: sessionId,
        product_data: item.product,
        quantity: item.quantity,
        selected_color: item.selectedColor ?? null,
      }));

      const { error } = await supabase.from("cart_items").insert(rows);
      if (error) {
        console.error("[Supabase] Failed to save cart:", error);
      }
    }
  } catch (err) {
    console.error("[Supabase] Cart sync error:", err);
  }
}

// =============================================================
// LOAD CART FROM SUPABASE
// =============================================================
export async function loadCartFromSupabase(
  sessionId: string
): Promise<CartItem[]> {
  try {
    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("session_id", sessionId)
      .order("updated_at", { ascending: true });

    if (error || !data || data.length === 0) return [];

    return data.map((row) => ({
      product: row.product_data as CartItem["product"],
      quantity: row.quantity as number,
      selectedColor: (row.selected_color as string) ?? undefined,
    }));
  } catch (err) {
    console.error("[Supabase] Failed to load cart:", err);
    return [];
  }
}

// =============================================================
// CLEAR CART IN SUPABASE
// =============================================================
export async function clearCartInSupabase(
  sessionId: string
): Promise<void> {
  try {
    await supabase.from("cart_items").delete().eq("session_id", sessionId);
  } catch (err) {
    console.error("[Supabase] Failed to clear cart:", err);
  }
}
