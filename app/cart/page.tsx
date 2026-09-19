"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import {
  removeFromCart,
  updateQuantity,
  applyCoupon,
  removeCoupon,
  clearCart,
  selectCartItems,
  selectCartTotals,
  syncCartRemote,
} from "@/lib/redux/slices/cartSlice";
import { addToast } from "@/lib/redux/slices/uiSlice";
import { formatPrice } from "@/lib/utils";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Ticket,
  ShieldCheck,
  Zap,
  ArrowLeft,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totals = useAppSelector(selectCartTotals);
  const { discountCode, syncError, isSyncing } = useAppSelector(
    (state) => state.cart
  );

  const [couponInput, setCouponInput] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    dispatch(applyCoupon(couponInput));
    if (couponInput.trim().toUpperCase() === "CYBER20" || couponInput.trim().toUpperCase() === "TECH10") {
      dispatch(
        addToast({
          message: `Coupon code applied successfully!`,
          type: "success",
        })
      );
    } else {
      dispatch(
        addToast({
          message: "Invalid coupon code. Try CYBER20 or TECH10",
          type: "error",
        })
      );
    }
  };

  const handleSyncRemote = () => {
    dispatch(syncCartRemote(items));
    dispatch(
      addToast({
        message: "Synchronized cart with FakeStoreAPI endpoint!",
        type: "info",
      })
    );
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-zinc-500">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white">Your Cart is Empty</h1>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            You haven&apos;t added any flagship smartphones, laptops, or accessories yet.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#00f59b] hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,245,155,0.3)]"
        >
          <ArrowLeft className="w-4 h-4" /> Discover Hardware
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1">
            Review your items and proceed to secure checkout.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncRemote}
            disabled={isSyncing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] hover:border-[#00f59b] text-xs font-mono text-zinc-300 transition-colors"
            title="Sync with FakeStoreAPI /carts endpoint"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>Sync FakeStoreAPI</span>
          </button>

          <button
            onClick={() => {
              dispatch(clearCart());
              dispatch(addToast({ message: "Cart emptied", type: "info" }));
            }}
            className="px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-mono transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cart Items Table (Left Col) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Progress */}
          <div className="p-4 rounded-2xl bg-[#090a10] border border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-2 text-zinc-300">
                <Zap className="w-4 h-4 text-[#00f59b]" />
                {totals.freeShippingQualified ? (
                  <span className="text-emerald-400 font-bold">
                    Free Express Courier Unlocked!
                  </span>
                ) : (
                  <span>
                    Add{" "}
                    <strong className="text-white">
                      {formatPrice(150 - totals.subtotal)}
                    </strong>{" "}
                    more for Free Express Shipping ($150 minimum)
                  </span>
                )}
              </span>
              <span className="text-[#00f59b] font-bold">
                {Math.min(100, Math.round((totals.subtotal / 150) * 100))}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-[#00f59b] transition-all duration-500 shadow-[0_0_10px_rgba(0,245,155,0.7)]"
                style={{
                  width: `${Math.min(100, (totals.subtotal / 150) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            {items.map(({ product, quantity, selectedColor }) => (
              <div
                key={`${product.id}-${selectedColor}`}
                className="p-5 rounded-2xl border border-white/[0.08] bg-[#0a0b12] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-white/[0.15]"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-black/60 border border-white/[0.06] shrink-0">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-[#00f59b] uppercase tracking-wider font-semibold">
                      {`${product.brand} // ${product.techCategory}`}
                    </span>
                    <Link
                      href={`/product/${product.id}`}
                      className="block font-bold text-white hover:text-[#00f59b] truncate text-base transition-colors"
                    >
                      {product.title}
                    </Link>
                    {selectedColor && (
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-400">
                        <span>Chassis:</span>
                        <span
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: selectedColor }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-white/[0.1] rounded-xl bg-black/40 p-1">
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: product.id,
                            quantity: quantity - 1,
                          })
                        )
                      }
                      className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-mono font-bold text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: product.id,
                            quantity: quantity + 1,
                          })
                        )
                      }
                      className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right min-w-[90px]">
                    <p className="font-mono font-extrabold text-white text-base">
                      {formatPrice(product.price * quantity)}
                    </p>
                    <p className="text-[10px] font-mono text-zinc-500">
                      {formatPrice(product.price)} each
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => {
                      dispatch(removeFromCart(product.id));
                      dispatch(
                        addToast({
                          message: `Removed ${product.title.slice(0, 20)}...`,
                          type: "info",
                        })
                      );
                    }}
                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary (Right Col) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-[#090a10] border border-white/[0.08] space-y-6">
            <h2 className="text-lg font-mono font-bold uppercase tracking-wider text-white">
              Order Summary
            </h2>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-[#00f59b]" /> Promo Voucher
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="e.g. CYBER20"
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-xl bg-white/[0.04] border border-white/[0.1] text-white uppercase focus:outline-none focus:border-[#00f59b]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-[#00f59b] hover:text-black text-white font-mono font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Apply
                </button>
              </div>

              {syncError && !discountCode && (
                <p className="text-[11px] text-rose-400 font-mono">{syncError}</p>
              )}

              {discountCode && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> {discountCode}
                  </span>
                  <button
                    type="button"
                    onClick={() => dispatch(removeCoupon())}
                    className="text-zinc-400 hover:text-red-400 text-[10px]"
                  >
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs text-zinc-400 border-t border-white/[0.06] pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-mono">
                  {formatPrice(totals.subtotal)}
                </span>
              </div>
              {totals.discountPercent > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({totals.discountPercent}%)</span>
                  <span className="font-mono">
                    -{formatPrice(totals.discountAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-white font-mono">
                  {totals.shipping === 0 ? "FREE" : formatPrice(totals.shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="text-white font-mono">
                  {formatPrice(totals.tax)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-white/[0.08] text-lg font-bold text-white">
                <span>Total Due</span>
                <span className="text-[#00f59b] font-mono">
                  {formatPrice(totals.total)}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout */}
            <Link
              href="/checkout"
              className="w-full py-4 px-6 rounded-2xl bg-[#00f59b] hover:bg-emerald-400 text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(0,245,155,0.4)]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Encrypted FakeStoreAPI Checkout Sync</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
