"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { selectOrders } from "@/lib/redux/slices/ordersSlice";
import { addToCart } from "@/lib/redux/slices/cartSlice";
import { addToast } from "@/lib/redux/slices/uiSlice";
import { formatPrice } from "@/lib/utils";
import { OrderStatus } from "@/types/product";
import {
  PackageCheck,
  Truck,
  Clock,
  CheckCircle2,
  Building2,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  Copy,
  Search,
} from "lucide-react";

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchId, setSearchId] = useState("");

  const statusBadges: Record<OrderStatus, { color: string; icon: React.ReactNode }> = {
    "Order Placed": {
      color: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    Processing: {
      color: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      icon: <Building2 className="w-3.5 h-3.5" />,
    },
    Dispatched: {
      color: "bg-purple-500/15 text-purple-400 border-purple-500/30",
      icon: <Truck className="w-3.5 h-3.5" />,
    },
    "In Transit": {
      color: "bg-[#00f59b]/15 text-[#00f59b] border-[#00f59b]/30 animate-pulse",
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    Delivered: {
      color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      icon: <PackageCheck className="w-3.5 h-3.5" />,
    },
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus !== "all" && order.status !== filterStatus) return false;
    if (searchId.trim() !== "") {
      const q = searchId.toLowerCase();
      return (
        order.id.toLowerCase().includes(q) ||
        order.trackingNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const copyTracking = (trackingNum: string) => {
    navigator.clipboard.writeText(trackingNum);
    dispatch(
      addToast({
        message: `Tracking number ${trackingNum} copied to clipboard!`,
        type: "info",
      })
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00f59b] uppercase tracking-widest mb-1">
            <PackageCheck className="w-4 h-4" />
            <span>REAL-TIME STATUS TRACKER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Order Status & History
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1">
            Monitor real-time progress from automated packaging to doorstep signature delivery.
          </p>
        </div>

        {/* Search Order Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Search Order ID or Tracking..."
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-white/[0.04] border border-white/[0.1] text-white focus:outline-none focus:border-[#00f59b] font-mono"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {["all", "In Transit", "Processing", "Order Placed", "Delivered"].map(
          (st) => {
            const isSelected = filterStatus === st;
            return (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#00f59b] text-black shadow-[0_0_15px_rgba(0,245,155,0.3)]"
                    : "bg-white/[0.03] text-zinc-400 hover:text-white border border-white/[0.08]"
                }`}
              >
                {st === "all" ? "All Orders" : st}
              </button>
            );
          }
        )}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/[0.04] flex items-center justify-center text-zinc-500">
            <PackageCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No Orders Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            You don't have any orders matching the current filter.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00f59b] text-black font-bold text-xs uppercase"
          >
            Browse Storefront
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const badge = statusBadges[order.status];

            return (
              <div
                key={order.id}
                className="p-6 sm:p-8 rounded-3xl bg-[#090a10] border border-white/[0.08] hover:border-white/[0.15] transition-all space-y-6 shadow-xl"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-mono font-extrabold text-white">
                        {order.id}
                      </span>
                      {order.fakeStoreOrderId && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.1] text-zinc-400">
                          FakeStoreAPI Cart #{order.fakeStoreOrderId}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-zinc-500 mt-0.5">
                      Placed on {new Date(order.date).toLocaleString()}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border ${badge.color}`}
                    >
                      {badge.icon}
                      <span>{order.status}</span>
                    </span>

                    <span className="text-xs font-mono text-zinc-400">
                      ETA: <strong className="text-white">{order.estimatedDelivery}</strong>
                    </span>
                  </div>
                </div>

                {/* Items & Shipping Details */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Item Thumbnails (Left Col) */}
                  <div className="lg:col-span-7 flex flex-wrap gap-4 items-center">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                      >
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-black/40 border border-white/[0.04] shrink-0">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 max-w-[200px]">
                          <p className="text-xs font-semibold text-white truncate">
                            {item.title}
                          </p>
                          <p className="text-[10px] font-mono text-zinc-400">
                            Qty: {item.quantity} • {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tracking & Total (Right Col) */}
                  <div className="lg:col-span-5 flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/[0.06]">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">
                        Courier Tracking
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-xs font-bold text-[#00f59b]">
                          {order.trackingNumber}
                        </span>
                        <button
                          onClick={() => copyTracking(order.trackingNumber)}
                          className="p-1 hover:text-white text-zinc-400"
                          title="Copy tracking"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">
                        Total Amount
                      </span>
                      <p className="font-mono text-lg font-extrabold text-white">
                        {formatPrice(order.total)}
                      </p>
                    </div>

                    <Link
                      href={`/orders/${order.id}`}
                      className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-[#00f59b] text-white hover:text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border border-white/[0.1] hover:border-[#00f59b]"
                    >
                      <span>Track Status</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
