"use client";

import React from "react";
import ProductCard from "@/components/product-card";
import ProductFilter from "@/components/product-filter";
import { useAppSelector } from "@/lib/redux/store";
import { selectFilteredProducts } from "@/lib/redux/slices/productsSlice";
import { Cpu, SlidersHorizontal, Sparkles } from "lucide-react";

export default function ProductsPage() {
  const filteredProducts = useAppSelector(selectFilteredProducts);
  const { isLoading, error, selectedCategory } = useAppSelector(
    (state) => state.products
  );

  const categoryTitles: Record<string, string> = {
    all: "Complete Hardware Catalog",
    smartphones: "Flagship 5G Smartphones & Mobiles",
    laptops: "High-Performance Laptops & Ultrabooks",
    audio: "Studio Audio & Noise-Cancelling Gear",
    accessories: "Power Delivery, Docks & Keyboards",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00f59b] uppercase tracking-widest mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>OFFICIAL INVENTORY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {categoryTitles[selectedCategory] || "Hardware Catalog"}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1">
          Showing {filteredProducts.length} verified devices with instant courier fulfillment.
        </p>
      </div>

      {/* Toolbar */}
      <ProductFilter />

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/[0.06] bg-[#0c0d15] p-4 space-y-4 animate-pulse"
            >
              <div className="aspect-[4/3] rounded-xl bg-zinc-800/50" />
              <div className="h-4 bg-zinc-800 rounded w-3/4" />
              <div className="h-3 bg-zinc-800/60 rounded w-1/2" />
              <div className="flex justify-between items-center pt-4">
                <div className="h-6 bg-zinc-800 rounded w-1/3" />
                <div className="h-8 bg-zinc-800 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-12 text-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300">
          <p className="font-bold">Error loading catalog: {error}</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 space-y-4 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/[0.04] flex items-center justify-center text-zinc-500">
            <Cpu className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No hardware found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
