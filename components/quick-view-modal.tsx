"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { closeQuickView, addToast } from "@/lib/redux/slices/uiSlice";
import { addToCart } from "@/lib/redux/slices/cartSlice";
import { formatPrice } from "@/lib/utils";
import {
  X,
  Star,
  ShoppingBag,
  ArrowRight,
  Shield,
  Truck,
  Cpu,
  Check,
} from "lucide-react";

export default function QuickViewModal() {
  const dispatch = useAppDispatch();
  const product = useAppSelector((state) => state.ui.quickViewProduct);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [activeImage, setActiveImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0]);
      setActiveImage(product.image);
      setQuantity(1);
      setAdded(false);
    }
  }, [product]);

  // Handle ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch(closeQuickView());
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  if (!product) return null;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product,
        quantity,
        selectedColor,
      })
    );
    dispatch(
      addToast({
        message: `Added ${quantity}x ${product.title} to cart!`,
        type: "success",
      })
    );
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      dispatch(closeQuickView());
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div
        onClick={() => dispatch(closeQuickView())}
        className="fixed inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-[#0b0c12] border border-white/[0.1] rounded-3xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={() => dispatch(closeQuickView())}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-black/60 hover:bg-white/10 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Media Gallery */}
        <div className="md:w-1/2 p-6 bg-[#07070a] flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/[0.08]">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/50 border border-white/[0.06]">
            <Image
              src={activeImage || product.image}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-md bg-[#00f59b] text-black font-mono font-bold text-xs uppercase tracking-wider">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImage === img
                      ? "border-[#00f59b] shadow-[0_0_10px_rgba(0,245,155,0.4)]"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto space-y-5">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-1">
              <span className="text-[#00f59b] font-bold uppercase tracking-widest">
                {product.brand} // {product.techCategory}
              </span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold text-white">{product.rating?.rate}</span>
                <span className="text-zinc-500">({product.rating?.count})</span>
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-white leading-tight">
              {product.title}
            </h2>

            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-3xl font-mono font-extrabold text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm font-mono text-zinc-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed">
            {product.description}
          </p>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                Chassis Color:
              </label>
              <div className="flex items-center gap-3">
                {product.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(color)}
                    className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 ${
                      selectedColor === color
                        ? "border-[#00f59b] scale-110 shadow-[0_0_12px_rgba(0,245,155,0.4)]"
                        : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                  >
                    <span
                      className="w-full h-full rounded-full block"
                      style={{ backgroundColor: color }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Specs Table Snippet */}
          {product.specs && product.specs.length > 0 && (
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#00f59b]" /> Key Tech Specifications
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {product.specs.slice(0, 4).map((spec, i) => (
                  <div key={i} className="space-y-0.5">
                    <p className="text-zinc-500 text-[10px]">{spec.label}</p>
                    <p className="text-zinc-200 font-mono font-medium truncate">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <div className="flex items-center border border-white/[0.1] rounded-xl bg-black/40 px-3 py-2 gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-zinc-400 hover:text-white text-base font-mono"
                >
                  -
                </button>
                <span className="font-mono text-white font-bold text-sm w-4 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-zinc-400 hover:text-white text-base font-mono"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  added
                    ? "bg-emerald-500 text-black"
                    : "bg-[#00f59b] hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(0,245,155,0.3)]"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </>
                )}
              </button>
            </div>

            <Link
              href={`/product/${product.id}`}
              onClick={() => dispatch(closeQuickView())}
              className="w-full py-2.5 rounded-xl border border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.03] text-xs font-semibold text-zinc-300 flex items-center justify-center gap-2 transition-colors"
            >
              <span>View Full Specs & Customer Reviews</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-3 border-t border-white/[0.06]">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> 2-Yr Official Warranty
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-cyan-400" /> Express Air Courier
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
