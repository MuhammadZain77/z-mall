"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import {
  setCartDrawerOpen,
  addToast,
} from "@/lib/redux/slices/uiSlice";
import {
  removeFromCart,
  updateQuantity,
  selectCartItems,
  selectCartTotals,
  clearCart,
} from "@/lib/redux/slices/cartSlice";
import { formatPrice } from "@/lib/utils";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function CartDrawer() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isCartDrawerOpen);
  const items = useAppSelector(selectCartItems);
  const totals = useAppSelector(selectCartTotals);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        dispatch(setCartDrawerOpen(false));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => dispatch(setCartDrawerOpen(false))}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#090a0f] border-l border-white/[0.08] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#00f59b]/10 border border-[#00f59b]/30">
                <ShoppingBag className="w-5 h-5 text-[#00f59b]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Your Cart
                </h2>
                <p className="text-xs text-zinc-400">
                  {items.length} unique gadget{items.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>
            <button
              onClick={() => dispatch(setCartDrawerOpen(false))}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-zinc-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Cart is currently empty
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-xs mt-1">
                    Discover high-performance smartphones, laptops, and cyber accessories.
                  </p>
                </div>
                <button
                  onClick={() => dispatch(setCartDrawerOpen(false))}
                  className="px-5 py-2.5 rounded-xl bg-[#00f59b] text-black font-semibold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(0,245,155,0.3)]"
                >
                  Explore Tech
                </button>
              </div>
            ) : (
              items.map(({ product, quantity, selectedColor }) => (
                <div
                  key={`${product.id}-${selectedColor}`}
                  className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] flex gap-4 items-center transition-all hover:border-white/[0.15]"
                >
                  {/* Thumbnail */}
                  <div className="relative w-18 h-18 rounded-lg overflow-hidden bg-zinc-900 border border-white/[0.05] shrink-0">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-white truncate">
                        {product.title}
                      </h4>
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
                        className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-zinc-400 mt-0.5">
                      {product.brand}
                      {selectedColor && (
                        <span className="inline-flex items-center gap-1 ml-2">
                          <span
                            className="w-2 h-2 rounded-full inline-block border border-white/20"
                            style={{ backgroundColor: selectedColor }}
                          />
                        </span>
                      )}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-bold font-mono text-[#00f59b]">
                        {formatPrice(product.price * quantity)}
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 bg-black/40 border border-white/[0.1] rounded-lg p-1">
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: product.id,
                                quantity: quantity - 1,
                              })
                            )
                          }
                          className="p-1 hover:text-white text-zinc-400 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-mono font-bold text-white">
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
                          className="p-1 hover:text-white text-zinc-400 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-white/[0.08] bg-[#06070a] space-y-4">
              {/* Shipping incentive */}
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#00f59b]/5 border border-[#00f59b]/20 text-[11px] text-zinc-300">
                <Zap className="w-4 h-4 text-[#00f59b] shrink-0" />
                {totals.freeShippingQualified ? (
                  <span className="text-emerald-400 font-semibold">
                    ✓ You unlocked Free Express Tech Courier!
                  </span>
                ) : (
                  <span>
                    Add{" "}
                    <strong className="text-white">
                      {formatPrice(150 - totals.subtotal)}
                    </strong>{" "}
                    more for Free Express Shipping.
                  </span>
                )}
              </div>

              {/* Subtotals */}
              <div className="space-y-1.5 text-xs text-zinc-400">
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
                <div className="flex justify-between pt-2 border-t border-white/[0.08] text-base font-bold text-white">
                  <span>Estimated Total</span>
                  <span className="text-[#00f59b] font-mono">
                    {formatPrice(totals.total)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={() => dispatch(setCartDrawerOpen(false))}
                  className="w-full py-3 px-4 rounded-xl bg-[#00f59b] hover:bg-emerald-400 text-black font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,245,155,0.3)]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex gap-2">
                  <Link
                    href="/cart"
                    onClick={() => dispatch(setCartDrawerOpen(false))}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-white/[0.1] hover:bg-white/[0.04] text-xs font-semibold text-center text-zinc-300 transition-colors"
                  >
                    View Full Cart
                  </Link>
                  <button
                    onClick={() => {
                      dispatch(clearCart());
                      dispatch(
                        addToast({
                          message: "Cart cleared",
                          type: "info",
                        })
                      );
                    }}
                    className="py-2.5 px-3 rounded-xl border border-white/[0.1] hover:bg-red-500/10 hover:border-red-500/30 text-xs font-semibold text-zinc-400 hover:text-red-400 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-Bit Encrypted FakeStoreAPI Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
