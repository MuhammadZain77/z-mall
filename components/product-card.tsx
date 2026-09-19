"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { useAppDispatch } from "@/lib/redux/store";
import { addToCart } from "@/lib/redux/slices/cartSlice";
import { openQuickView, addToast } from "@/lib/redux/slices/uiSlice";
import TiltCard from "./ui/tilt-card";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  Eye,
  Star,
  Zap,
  Check,
} from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [added, setAdded] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      addToCart({
        product,
        quantity: 1,
      })
    );

    dispatch(
      addToast({
        message: `Added "${product.title}" to cart!`,
        type: "success",
      })
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(openQuickView(product));
  };

  const badgeColors: Record<string, string> = {
    Flagship: "bg-[#00f59b]/15 text-[#00f59b] border-[#00f59b]/40",
    New: "bg-cyan-500/15 text-cyan-400 border-cyan-500/40",
    Hot: "bg-amber-500/15 text-amber-400 border-amber-500/40",
    "Best Seller": "bg-purple-500/15 text-purple-400 border-purple-500/40",
    Limited: "bg-rose-500/15 text-rose-400 border-rose-500/40",
  };

  return (
    <TiltCard
      maxTilt={8}
      className="group rounded-2xl border border-white/[0.08] bg-[#0c0d14] hover:border-white/[0.2] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
    >
      <div>
        {/* Image Container with Hover Quick View Action */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#06070a] rounded-t-2xl">
          <Link href={`/product/${product.id}`} className="block w-full h-full">
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
            {product.badge && (
              <span
                className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md border backdrop-blur-md ${
                  badgeColors[product.badge] || badgeColors.Flagship
                }`}
              >
                {product.badge}
              </span>
            )}
            <span className="px-2 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-wider rounded bg-black/70 text-zinc-300 border border-white/10 backdrop-blur-md">
              {product.techCategory}
            </span>
          </div>

          {/* Quick View Button */}
          <button
            onClick={handleQuickView}
            className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/80 hover:bg-[#00f59b] text-white hover:text-black border border-white/10 transition-all duration-200 opacity-0 group-hover:opacity-100 z-20 shadow-lg cursor-pointer"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          {/* Brand & Ratings */}
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span className="font-semibold text-zinc-300 uppercase tracking-wider">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold text-white">
                {product.rating?.rate ?? 4.8}
              </span>
              <span className="text-zinc-500 text-[10px]">
                ({product.rating?.count ?? 85})
              </span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/product/${product.id}`} className="block group-hover:text-[#00f59b] transition-colors">
            <h3 className="font-bold text-base text-white line-clamp-1 leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Tech Spec Highlight Pills */}
          {product.specs && product.specs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {product.specs.slice(0, 2).map((spec, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-[10px] rounded bg-white/[0.03] border border-white/[0.06] text-zinc-300 font-mono"
                >
                  {spec.value.split("(")[0].slice(0, 26)}
                </span>
              ))}
            </div>
          )}

          {/* Color swatches if available */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] text-zinc-500 font-mono">Finishes:</span>
              <div className="flex items-center gap-1">
                {product.colors.map((c, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full border border-white/20"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Price & Add to Cart */}
      <div className="p-5 pt-0 mt-2 border-t border-white/[0.04]">
        <div className="flex items-center justify-between pt-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-mono font-extrabold text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs font-mono text-zinc-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" /> In Stock ({product.stock})
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3.5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
              added
                ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                : "bg-white/[0.05] hover:bg-[#00f59b] text-white hover:text-black border border-white/[0.1] hover:border-[#00f59b] hover:shadow-[0_0_15px_rgba(0,245,155,0.3)]"
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </TiltCard>
  );
}
