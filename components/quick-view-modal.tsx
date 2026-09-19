"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { closeQuickView, addToast } from "@/lib/redux/slices/uiSlice";
import { addToCart } from "@/lib/redux/slices/cartSlice";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types/product";
import {
  X,
  Star,
  ShoppingBag,
  Zap,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";

function QuickViewDialogBody({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors?.[0]
  );
  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

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
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative w-full max-w-4xl bg-[#090a10] border border-white/[0.12] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col md:flex-row max-h-[90vh]"
    >
      {/* Close button */}
      <button
        onClick={() => dispatch(closeQuickView())}
        className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-black/60 hover:bg-white/[0.1] text-zinc-400 hover:text-white border border-white/10 transition-all cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Left: Gallery */}
      <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between bg-[#06070a] border-b md:border-b-0 md:border-r border-white/[0.08]">
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/40 border border-white/[0.06]">
          <Image
            src={activeImage || product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          {product.badge && (
            <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#00f59b] text-black shadow-md">
              {product.badge}
            </span>
          )}
        </div>

        {/* Thumbnails */}
        {product.gallery && product.gallery.length > 1 && (
          <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
            {product.gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                  activeImage === img
                    ? "border-[#00f59b] shadow-[0_0_10px_rgba(0,245,155,0.4)]"
                    : "border-white/[0.08] opacity-60 hover:opacity-100"
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
              {`${product.brand} // ${product.techCategory}`}
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
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <Zap className="w-3 h-3" /> In Stock ({product.stock})
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
          {product.description}
        </p>

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              Finish:
            </label>
            <div className="flex items-center gap-2">
              {product.colors.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    selectedColor === c
                      ? "border-[#00f59b] scale-110 shadow-[0_0_10px_rgba(0,245,155,0.4)]"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Highlights / Specs */}
        {product.features && product.features.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              Key Engineering Features:
            </span>
            <ul className="space-y-1 text-xs text-zinc-300">
              {product.features.slice(0, 3).map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00f59b] shrink-0" />
                  <span className="line-clamp-1">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quantity & CTA */}
        <div className="space-y-3 pt-3 border-t border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-white/[0.1] rounded-xl bg-black/40 px-2 py-1 gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-zinc-400 hover:text-white text-base font-mono px-2"
              >
                -
              </button>
              <span className="font-mono text-white text-xs font-bold w-4 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="text-zinc-400 hover:text-white text-base font-mono px-2"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                added
                  ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  : "bg-[#00f59b] hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(0,245,155,0.3)]"
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
            className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all text-center block"
          >
            <span>View Complete Specifications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function QuickViewModal() {
  const dispatch = useAppDispatch();
  const product = useAppSelector((state) => state.ui.quickViewProduct);

  // Handle ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch(closeQuickView());
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  if (!product) return null;

  return (
    <div
      onClick={() => dispatch(closeQuickView())}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <QuickViewDialogBody key={product.id} product={product} />
    </div>
  );
}
