"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { clearCart, selectCartItems, selectCartTotals } from "@/lib/redux/slices/cartSlice";
import { placeOrder } from "@/lib/redux/slices/ordersSlice";
import { addToast } from "@/lib/redux/slices/uiSlice";
import { formatPrice } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  CreditCard,
  ShieldCheck,
  Truck,
  ArrowRight,
  ArrowLeft,
  Lock,
  Smartphone,
  Wallet,
  Coins,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totals = useAppSelector(selectCartTotals);
  const isSubmitting = useAppSelector((state) => state.orders.isSubmitting);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "Alex Rivera",
    email: "alex.rivera@techpulse.io",
    phone: "+1 (555) 382-9104",
    address: "742 Silicon Boulevard, Suite 500",
    city: "San Francisco",
    postalCode: "94107",
    country: "United States",
  });

  const [paymentMethod, setPaymentMethod] = useState<
    "credit-card" | "apple-pay" | "crypto" | "cod"
  >("credit-card");

  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8821");
  const [cardExpiry, setCardExpiry] = useState("09/28");
  const [cardCvc, setCardCvc] = useState("892");

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">No Items in Cart</h2>
        <p className="text-sm text-zinc-400">
          Your cart is empty. Add hardware items before checking out.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00f59b] text-black font-bold text-xs uppercase"
        >
          <ArrowLeft className="w-4 h-4" /> Go to Catalog
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderId = `ZM-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNumber = `EXPR-${Math.floor(100000000 + Math.random() * 900000000)}-ZM`;

    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      items: items.map((item) => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        color: item.selectedColor,
      })),
      subtotal: totals.subtotal,
      discount: totals.discountAmount,
      shipping: totals.shipping,
      tax: totals.tax,
      total: totals.total,
      status: "Order Placed" as const,
      shippingAddress: formData,
      paymentMethod,
      trackingNumber,
      estimatedDelivery: new Date(Date.now() + 1000 * 60 * 60 * 48).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric", year: "numeric" }
      ),
      timeline: [
        {
          status: "Order Placed" as const,
          timestamp: "Just now",
          completed: true,
          description: `Order successfully confirmed with ${paymentMethod.toUpperCase()}. FakeStoreAPI dispatch assigned.`,
        },
        {
          status: "Processing" as const,
          timestamp: "Pending",
          completed: false,
          description: "Hardware diagnostics and custom packaging.",
        },
        {
          status: "Dispatched" as const,
          timestamp: "Pending",
          completed: false,
          description: "Departure from Fremont Robotic Logistics Depot.",
        },
        {
          status: "In Transit" as const,
          timestamp: "Pending",
          completed: false,
          description: "Priority express air flight to regional hub.",
        },
        {
          status: "Delivered" as const,
          timestamp: "Pending",
          completed: false,
          description: "Direct signature delivery.",
        },
      ],
    };

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#00f59b", "#38bdf8", "#a855f7", "#ffffff"],
      });
    } catch {
      // ignore
    }

    await dispatch(placeOrder(newOrder));
    dispatch(clearCart());
    dispatch(
      addToast({
        message: `Order #${orderId} Placed! Tracking Assigned: ${trackingNumber}`,
        type: "success",
        duration: 6000,
      })
    );

    router.push(`/orders/${orderId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6 flex items-center justify-between">
        <div>
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Checkout & Fulfillment
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <Lock className="w-4 h-4" />
          <span>SSL 256-Bit Encrypted</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Shipping & Payment Form */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Shipping Address Section */}
            <div className="p-6 rounded-3xl bg-[#090a10] border border-white/[0.08] space-y-5">
              <h2 className="text-base font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#00f59b]" /> 1. Shipping Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#00f59b]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">
                    Email for Status Notifications
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#00f59b]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">
                    Phone Number (SMS Courier Alerts)
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#00f59b]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">
                    Street Address & Suite / Unit
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#00f59b]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#00f59b]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">
                    Postal / Zip Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#00f59b]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method Section */}
            <div className="p-6 rounded-3xl bg-[#090a10] border border-white/[0.08] space-y-5">
              <h2 className="text-base font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#00f59b]" /> 2. Payment Method
              </h2>

              {/* Payment Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("credit-card")}
                  className={`p-3 rounded-2xl border text-xs font-mono flex flex-col items-center justify-center gap-2 transition-all ${
                    paymentMethod === "credit-card"
                      ? "border-[#00f59b] bg-[#00f59b]/10 text-white font-bold"
                      : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("apple-pay")}
                  className={`p-3 rounded-2xl border text-xs font-mono flex flex-col items-center justify-center gap-2 transition-all ${
                    paymentMethod === "apple-pay"
                      ? "border-[#00f59b] bg-[#00f59b]/10 text-white font-bold"
                      : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white"
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-cyan-400" />
                  <span>Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("crypto")}
                  className={`p-3 rounded-2xl border text-xs font-mono flex flex-col items-center justify-center gap-2 transition-all ${
                    paymentMethod === "crypto"
                      ? "border-[#00f59b] bg-[#00f59b]/10 text-white font-bold"
                      : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white"
                  }`}
                >
                  <Coins className="w-5 h-5 text-purple-400" />
                  <span>USDC / ETH</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-3 rounded-2xl border text-xs font-mono flex flex-col items-center justify-center gap-2 transition-all ${
                    paymentMethod === "cod"
                      ? "border-[#00f59b] bg-[#00f59b]/10 text-white font-bold"
                      : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:text-white"
                  }`}
                >
                  <Wallet className="w-5 h-5 text-amber-400" />
                  <span>Cash (COD)</span>
                </button>
              </div>

              {/* Card Inputs if Credit Card chosen */}
              {paymentMethod === "credit-card" && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-zinc-400">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-sm font-mono focus:outline-none focus:border-[#00f59b]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-400">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-sm font-mono focus:outline-none focus:border-[#00f59b]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-zinc-400">
                        Security CVC
                      </label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-sm font-mono focus:outline-none focus:border-[#00f59b]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "apple-pay" && (
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 font-mono">
                  Apple Pay biometric authentication will prompt once you click &quot;Authorize Order&quot;.
                </div>
              )}

              {paymentMethod === "crypto" && (
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 font-mono">
                  Web3 QR invoice for {formatPrice(totals.total)} will generate instantly for MetaMask, Coinbase, or Phantom.
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-mono">
                  Pay with cash or portable POS card terminal upon delivery by courier.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Review & Confirmation */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#090a10] border border-white/[0.08] space-y-6">
              <h2 className="text-base font-mono font-bold uppercase tracking-wider text-white">
                Order Review ({items.length} Items)
              </h2>

              {/* Items List snippet */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map(({ product, quantity, selectedColor }) => (
                  <div
                    key={`${product.id}-${selectedColor}`}
                    className="flex items-center gap-3 py-2 border-b border-white/[0.04]"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black/50 border border-white/[0.05] shrink-0">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">
                        {product.title}
                      </h4>
                      <p className="text-[10px] font-mono text-zinc-400">
                        Qty: {quantity} {selectedColor && `• Color`}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-white">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-zinc-400 pt-2 border-t border-white/[0.06]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-mono">
                    {formatPrice(totals.subtotal)}
                  </span>
                </div>
                {totals.discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Voucher Discount</span>
                    <span className="font-mono">
                      -{formatPrice(totals.discountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Courier Shipping</span>
                  <span className="text-white font-mono">
                    {totals.shipping === 0 ? "FREE" : formatPrice(totals.shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax</span>
                  <span className="text-white font-mono">
                    {formatPrice(totals.tax)}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-white/[0.08] text-lg font-bold text-white">
                  <span>Total Amount</span>
                  <span className="text-[#00f59b] font-mono">
                    {formatPrice(totals.total)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-[#00f59b] hover:bg-emerald-400 disabled:opacity-50 text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(0,245,155,0.4)] cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Transmitting to FakeStoreAPI...</span>
                ) : (
                  <>
                    <span>Place Order & Track Live</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Synchronized with FakeStoreAPI /carts endpoint</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
