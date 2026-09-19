"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { selectOrderById } from "@/lib/redux/slices/ordersSlice";
import { addToCart } from "@/lib/redux/slices/cartSlice";
import { addToast } from "@/lib/redux/slices/uiSlice";
import OrderTimeline from "@/components/order-timeline";
import { formatPrice } from "@/lib/utils";
import {
  ArrowLeft,
  ShoppingBag,
  Printer,
  ShieldCheck,
  CreditCard,
  MapPin,
  CheckCircle,
  Package,
} from "lucide-react";

export default function OrderTrackingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const orderId = params?.id as string;

  const order = useAppSelector(selectOrderById(orderId));
  const allProducts = useAppSelector((state) => state.products.items);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Order Record Not Found</h2>
        <p className="text-sm text-zinc-400">
          No order with ID "{orderId}" was found in your order log.
        </p>
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00f59b] text-black font-bold text-xs uppercase"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Orders
        </Link>
      </div>
    );
  }

  const handleReorder = () => {
    order.items.forEach((item) => {
      const matchedProduct = allProducts.find((p) => p.id === item.productId);
      if (matchedProduct) {
        dispatch(
          addToCart({
            product: matchedProduct,
            quantity: item.quantity,
            selectedColor: item.color,
          })
        );
      }
    });

    dispatch(
      addToast({
        message: `Added items from ${order.id} back to cart!`,
        type: "success",
      })
    );
    router.push("/cart");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-white tracking-tight font-mono">
              {order.id}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#00f59b]/15 text-[#00f59b] border border-[#00f59b]/30">
              {order.status}
            </span>
          </div>
          <p className="text-xs font-mono text-zinc-500 mt-0.5">
            Placed on {new Date(order.date).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] hover:border-white/[0.2] text-xs font-mono text-zinc-300 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print Invoice
          </button>

          <button
            onClick={handleReorder}
            className="px-5 py-2.5 rounded-xl bg-[#00f59b] hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,245,155,0.3)] cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" /> Re-Order Hardware
          </button>
        </div>
      </div>

      {/* Live Stepper Tracker Component */}
      <OrderTimeline order={order} interactive={true} />

      {/* Grid: Order Items & Delivery Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ordered Hardware Items (Left Col) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-[#090a10] border border-white/[0.08] space-y-4">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-[#00f59b]" /> Hardware Items in Package
            </h2>

            <div className="divide-y divide-white/[0.06]">
              {order.items.map((item, i) => (
                <div key={i} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black/50 border border-white/[0.06] shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs font-mono text-zinc-400 mt-0.5">
                        Quantity: {item.quantity}
                        {item.color && (
                          <span className="ml-2 inline-flex items-center gap-1">
                            • Finish:
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block border border-white/20"
                              style={{ backgroundColor: item.color }}
                            />
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-sm font-bold text-white">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shipping & Financial Breakdown (Right Col) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Shipping Address */}
          <div className="p-6 rounded-3xl bg-[#090a10] border border-white/[0.08] space-y-3">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#00f59b]" /> Delivery Destination
            </h2>
            <div className="text-xs font-mono text-zinc-300 space-y-1">
              <p className="font-bold text-white text-sm">
                {order.shippingAddress.fullName}
              </p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="text-zinc-500 pt-1">
                Contact: {order.shippingAddress.phone}
              </p>
            </div>
          </div>

          {/* Payment & Financial Breakdown */}
          <div className="p-6 rounded-3xl bg-[#090a10] border border-white/[0.08] space-y-4">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#00f59b]" /> Payment & Charges
            </h2>

            <div className="text-xs font-mono text-zinc-400 space-y-2 border-b border-white/[0.06] pb-3">
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="text-white uppercase font-bold">
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Voucher Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Courier Shipping</span>
                <span className="text-white">
                  {order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax (8%)</span>
                <span className="text-white">{formatPrice(order.tax)}</span>
              </div>
            </div>

            <div className="flex justify-between text-base font-mono font-extrabold text-white">
              <span>Total Paid</span>
              <span className="text-[#00f59b]">{formatPrice(order.total)}</span>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-zinc-500 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>FakeStoreAPI Transaction ID: #{order.fakeStoreOrderId ?? "2941"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
