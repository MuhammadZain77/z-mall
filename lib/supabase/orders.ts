import { supabase } from "./client";
import { Order, OrderItem, OrderStatus } from "@/types/product";

// =============================================================
// Helper: Convert an Order object into a Supabase row shape
// =============================================================
function orderToRow(order: Order) {
  return {
    id: order.id,
    fake_store_order_id: order.fakeStoreOrderId ?? null,
    created_at: order.date,
    status: order.status,
    subtotal: order.subtotal,
    discount: order.discount,
    shipping: order.shipping,
    tax: order.tax,
    total: order.total,
    shipping_address: order.shippingAddress,
    payment_method: order.paymentMethod,
    tracking_number: order.trackingNumber,
    estimated_delivery: order.estimatedDelivery,
    timeline: order.timeline,
  };
}

// =============================================================
// Helper: Convert a Supabase row back to an Order object
// =============================================================
function rowToOrder(
  row: Record<string, unknown>,
  items: OrderItem[]
): Order {
  return {
    id: row.id as string,
    fakeStoreOrderId: (row.fake_store_order_id as number) ?? undefined,
    date: row.created_at as string,
    status: row.status as OrderStatus,
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    shipping: Number(row.shipping),
    tax: Number(row.tax),
    total: Number(row.total),
    shippingAddress: row.shipping_address as Order["shippingAddress"],
    paymentMethod: row.payment_method as Order["paymentMethod"],
    trackingNumber: row.tracking_number as string,
    estimatedDelivery: row.estimated_delivery as string,
    timeline: (row.timeline as Order["timeline"]) ?? [],
    items,
  };
}

// =============================================================
// INSERT ORDER (+ order_items)
// =============================================================
export async function insertOrder(order: Order): Promise<void> {
  // 1. Insert into orders table
  const { error: orderError } = await supabase
    .from("orders")
    .insert(orderToRow(order));

  if (orderError) {
    console.error("[Supabase] Failed to insert order:", orderError);
    throw orderError;
  }

  // 2. Insert order items
  if (order.items.length > 0) {
    const itemRows = order.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      color: item.color ?? null,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemRows);

    if (itemsError) {
      console.error("[Supabase] Failed to insert order items:", itemsError);
      throw itemsError;
    }
  }
}

// =============================================================
// FETCH ALL ORDERS (with items)
// =============================================================
export async function fetchAllOrders(): Promise<Order[]> {
  const { data: orderRows, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (orderError) {
    console.error("[Supabase] Failed to fetch orders:", orderError);
    throw orderError;
  }

  if (!orderRows || orderRows.length === 0) return [];

  // Fetch all order items in a single query
  const orderIds = orderRows.map((r) => r.id);
  const { data: itemRows, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .in("order_id", orderIds);

  if (itemsError) {
    console.error("[Supabase] Failed to fetch order items:", itemsError);
    throw itemsError;
  }

  // Group items by order_id
  const itemsByOrder: Record<string, OrderItem[]> = {};
  for (const row of itemRows ?? []) {
    const orderId = row.order_id as string;
    if (!itemsByOrder[orderId]) itemsByOrder[orderId] = [];
    itemsByOrder[orderId].push({
      productId: row.product_id as number,
      title: row.title as string,
      price: Number(row.price),
      quantity: row.quantity as number,
      image: row.image as string,
      color: (row.color as string) ?? undefined,
    });
  }

  return orderRows.map((row) =>
    rowToOrder(row, itemsByOrder[row.id as string] ?? [])
  );
}

// =============================================================
// FETCH SINGLE ORDER BY ID
// =============================================================
export async function fetchOrderById(
  orderId: string
): Promise<Order | null> {
  const { data: row, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !row) return null;

  const { data: itemRows } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  const items: OrderItem[] = (itemRows ?? []).map((r) => ({
    productId: r.product_id as number,
    title: r.title as string,
    price: Number(r.price),
    quantity: r.quantity as number,
    image: r.image as string,
    color: (r.color as string) ?? undefined,
  }));

  return rowToOrder(row, items);
}

// =============================================================
// UPDATE ORDER STATUS & TIMELINE
// =============================================================
export async function updateOrderStatusInDb(
  orderId: string,
  newStatus: OrderStatus,
  timeline: Order["timeline"]
): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus, timeline })
    .eq("id", orderId);

  if (error) {
    console.error("[Supabase] Failed to update order status:", error);
    throw error;
  }
}

// =============================================================
// DELETE ORDER (cascade removes items via FK)
// =============================================================
export async function deleteOrderFromDb(orderId: string): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("id", orderId);

  if (error) {
    console.error("[Supabase] Failed to delete order:", error);
    throw error;
  }
}
