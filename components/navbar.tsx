"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { toggleCartDrawer } from "@/lib/redux/slices/uiSlice";
import { setCategory, setSearchQuery } from "@/lib/redux/slices/productsSlice";
import { selectCartCount } from "@/lib/redux/slices/cartSlice";
import {
  ShoppingBag,
  Search,
  Smartphone,
  Laptop,
  Headphones,
  PackageCheck,
  Menu,
  X,
  Cpu,
  Layers,
} from "lucide-react";
import { TechCategory } from "@/types/product";

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartCount = useAppSelector(selectCartCount);
  const searchQuery = useAppSelector((state) => state.products.searchQuery);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearch));
    router.push("/products");
  };

  const handleCategoryClick = (cat: TechCategory) => {
    dispatch(setCategory(cat));
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#050507]/80 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00f59b] via-[#38bdf8] to-[#a855f7] p-[2px] shadow-[0_0_24px_rgba(0,245,155,0.4)] transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(56,189,248,0.55)] group-hover:scale-105 shrink-0">
              <div className="w-full h-full bg-[#07080d] rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#00f59b]/25 via-transparent to-[#38bdf8]/15" />
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-6 h-6 relative z-10 transition-transform duration-300 group-hover:scale-110"
                >
                  <path
                    d="M4 5.5H19.5L7.5 18.5H20"
                    stroke="url(#navbar-z-gradient)"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="19.5" cy="5.5" r="1.5" fill="#00f59b" />
                  <circle cx="4.5" cy="18.5" r="1.5" fill="#38bdf8" />
                  <defs>
                    <linearGradient id="navbar-z-gradient" x1="4" y1="5.5" x2="20" y2="18.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#00f59b" />
                      <stop offset="0.5" stopColor="#38bdf8" />
                      <stop offset="1" stopColor="#c084fc" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-tight text-white font-sans">
                  Z <span className="bg-gradient-to-r from-[#00f59b] via-[#38bdf8] to-white bg-clip-text text-transparent">Mall</span>
                </span>
                <span className="px-2 py-0.5 text-[9px] font-mono font-extrabold tracking-wider uppercase bg-gradient-to-r from-[#00f59b] to-[#38bdf8] text-black rounded-md shadow-[0_0_12px_rgba(0,245,155,0.4)]">
                  TECH
                </span>
              </div>
              <p className="text-[10px] font-mono text-zinc-400 tracking-wider">
                FLAGSHIP MOBILES & COMPUTING
              </p>
            </div>
          </Link>

          {/* Desktop Category Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/products"
              onClick={() => handleCategoryClick("all")}
              className="px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              All Catalog
            </Link>
            <Link
              href="/products"
              onClick={() => handleCategoryClick("smartphones")}
              className="px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white rounded-lg hover:bg-white/[0.04] flex items-center gap-1.5 transition-colors"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              Smartphones
            </Link>
            <Link
              href="/products"
              onClick={() => handleCategoryClick("laptops")}
              className="px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white rounded-lg hover:bg-white/[0.04] flex items-center gap-1.5 transition-colors"
            >
              <Laptop className="w-4 h-4 text-cyan-400" />
              Laptops
            </Link>
            <Link
              href="/products"
              onClick={() => handleCategoryClick("audio")}
              className="px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white rounded-lg hover:bg-white/[0.04] flex items-center gap-1.5 transition-colors"
            >
              <Headphones className="w-4 h-4 text-purple-400" />
              Audio
            </Link>
            <Link
              href="/products"
              onClick={() => handleCategoryClick("accessories")}
              className="px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white rounded-lg hover:bg-white/[0.04] flex items-center gap-1.5 transition-colors"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              Accessories
            </Link>
          </nav>

          {/* Search bar & Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Search */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden sm:flex relative items-center"
            >
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search phones, M3, RTX..."
                className="w-48 xl:w-64 pl-9 pr-4 py-2 text-xs rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-zinc-500 focus:outline-none focus:border-[#00f59b] focus:ring-1 focus:ring-[#00f59b] transition-all font-sans"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none" />
            </form>

            {/* Orders Tracking Link */}
            <Link
              href="/orders"
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-[#00f59b] rounded-xl border border-white/[0.08] hover:border-[#00f59b]/40 bg-white/[0.02] transition-all"
            >
              <PackageCheck className="w-4 h-4 text-[#00f59b]" />
              <span>Track Orders</span>
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => dispatch(toggleCartDrawer())}
              className="relative p-2.5 rounded-xl border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.08] text-white hover:border-[#00f59b]/50 transition-all focus:outline-none cursor-pointer"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-[#00f59b] text-black font-extrabold text-[11px] rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(0,245,155,0.7)] animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl border border-white/[0.1] bg-white/[0.03] text-zinc-300 hover:text-white"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/[0.08] bg-[#050507]/95 backdrop-blur-2xl px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search phones, laptops..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:border-[#00f59b]"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
          </form>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Link
              href="/products"
              onClick={() => handleCategoryClick("all")}
              className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-sm font-medium text-white flex items-center gap-2"
            >
              <Cpu className="w-4 h-4 text-emerald-400" /> All Products
            </Link>
            <Link
              href="/products"
              onClick={() => handleCategoryClick("smartphones")}
              className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-sm font-medium text-white flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" /> Smartphones
            </Link>
            <Link
              href="/products"
              onClick={() => handleCategoryClick("laptops")}
              className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-sm font-medium text-white flex items-center gap-2"
            >
              <Laptop className="w-4 h-4 text-cyan-400" /> Laptops
            </Link>
            <Link
              href="/products"
              onClick={() => handleCategoryClick("audio")}
              className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-sm font-medium text-white flex items-center gap-2"
            >
              <Headphones className="w-4 h-4 text-purple-400" /> Audio
            </Link>
          </div>

          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
            <Link
              href="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm font-medium text-[#00f59b]"
            >
              <PackageCheck className="w-4 h-4" /> Track Existing Orders
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm font-medium text-zinc-300"
            >
              <ShoppingBag className="w-4 h-4" /> View Full Cart ({cartCount})
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
