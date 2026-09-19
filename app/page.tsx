"use client";

import React from "react";
import Link from "next/link";
import Hero from "@/components/hero";
import ProductFilter from "@/components/product-filter";
import ProductCard from "@/components/product-card";
import { useAppSelector } from "@/lib/redux/store";
import { selectFilteredProducts } from "@/lib/redux/slices/productsSlice";
import {
  Flame,
  ArrowRight,
  Cpu,
  Zap,
  PackageCheck,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  const filteredProducts = useAppSelector(selectFilteredProducts);
  const { isLoading, error } = useAppSelector((state) => state.products);

  return (
    <div className="space-y-16 pb-24">
      {/* 3D Tech Hero Section with Kinetic Text Animation */}
      <Hero />

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="catalog">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00f59b] uppercase tracking-widest mb-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>LIVE HARDWARE INVENTORY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Flagship Mobiles & Compute
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono max-w-md">
            Directly fetched via FakeStoreAPI with real-time stock allocation and fast courier delivery.
          </p>
        </div>

        {/* Filters Toolbar */}
        <ProductFilter />

        {/* Product Grid */}
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
          <div className="p-12 text-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 space-y-3">
            <p className="font-bold">Error loading catalog: {error}</p>
            <p className="text-xs text-zinc-400">
              Please check internet connection or retry loading.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 space-y-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/[0.04] flex items-center justify-center text-zinc-500">
              <Cpu className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">
              No hardware matched your criteria
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Try adjusting your price range or clearing your search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Cyber Flash Deals Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-white/[0.1] bg-gradient-to-r from-[#090b14] via-[#0d1322] to-[#0a151b] shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f59b]/10 blur-[120px] pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f59b]/15 text-[#00f59b] border border-[#00f59b]/30 text-xs font-mono font-bold">
                <Flame className="w-3.5 h-3.5" /> FLASH DISCOUNT // LIMITED DROP
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Unlock 20% Off All Mobile Hardware
              </h3>
              <p className="text-sm text-zinc-400 max-w-xl">
                Apply promo voucher code <span className="text-[#00f59b] font-mono font-bold">CYBER20</span> at checkout to claim instant 20% savings on titanium smartphones and laptops.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="px-5 py-3 rounded-2xl bg-black/60 border border-white/10 font-mono text-center">
                <p className="text-[10px] text-zinc-500 uppercase">PROMO VOUCHER</p>
                <p className="text-xl font-bold text-[#00f59b]">CYBER20</p>
              </div>
              <Link
                href="/products"
                className="px-6 py-3.5 rounded-xl bg-[#00f59b] hover:bg-emerald-400 text-black font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,245,155,0.3)]"
              >
                <span>Shop Deals</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Order Tracking Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0a0b12] border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#00f59b] font-mono text-xs font-bold uppercase tracking-wider">
              <PackageCheck className="w-4 h-4" />
              <span>LIVE DISPATCH PIPELINE</span>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Real-Time Order Tracking & Status Monitoring
            </h3>
            <p className="text-sm text-zinc-400 max-w-xl">
              Track the exact progress of every placed order—from payment verification and custom packaging to regional courier transit and direct signature delivery.
            </p>
          </div>

          <Link
            href="/orders"
            className="px-6 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.12] hover:border-[#00f59b] font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shrink-0"
          >
            <span>View Active Orders Dashboard</span>
            <ArrowRight className="w-4 h-4 text-[#00f59b]" />
          </Link>
        </div>
      </section>
    </div>
  );
}
