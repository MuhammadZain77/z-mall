"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import {
  setCategory,
  setSearchQuery,
  setSortBy,
  setMaxPrice,
  resetFilters,
} from "@/lib/redux/slices/productsSlice";
import { TechCategory } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import {
  Smartphone,
  Laptop,
  Headphones,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Layers,
  Search,
  X,
} from "lucide-react";

export default function ProductFilter() {
  const dispatch = useAppDispatch();
  const { selectedCategory, searchQuery, sortBy, maxPrice, items } =
    useAppSelector((state) => state.products);

  const categories: { id: TechCategory; label: string; icon: React.ReactNode }[] = [
    { id: "all", label: "All Tech", icon: <Sparkles className="w-3.5 h-3.5" /> },
    {
      id: "smartphones",
      label: "Smartphones",
      icon: <Smartphone className="w-3.5 h-3.5" />,
    },
    { id: "laptops", label: "Laptops", icon: <Laptop className="w-3.5 h-3.5" /> },
    {
      id: "audio",
      label: "Audio & Wearables",
      icon: <Headphones className="w-3.5 h-3.5" />,
    },
    {
      id: "accessories",
      label: "Accessories",
      icon: <Layers className="w-3.5 h-3.5" />,
    },
  ];

  // Count items per category
  const getCategoryCount = (catId: TechCategory) => {
    if (catId === "all") return items.length;
    return items.filter((i) => i.techCategory === catId).length;
  };

  return (
    <div className="space-y-6">
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => dispatch(setCategory(cat.id))}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#00f59b] text-black shadow-[0_0_18px_rgba(0,245,155,0.35)]"
                  : "bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.07] border border-white/[0.08]"
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isSelected ? "bg-black/20 text-black" : "bg-white/[0.05] text-zinc-500"
                }`}
              >
                {getCategoryCount(cat.id)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search, Sort & Price Range Toolbar */}
      <div className="p-4 rounded-2xl bg-[#090a10] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Filter by specs, brand, or model..."
            className="w-full pl-9 pr-8 py-2.5 text-xs rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-zinc-500 focus:outline-none focus:border-[#00f59b] focus:ring-1 focus:ring-[#00f59b]"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => dispatch(setSearchQuery(""))}
              className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Controls: Sort & Price & Reset */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Price Range Slider */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono">
            <span className="text-zinc-500">Max:</span>
            <input
              type="range"
              min={100}
              max={3000}
              step={50}
              value={maxPrice}
              onChange={(e) => dispatch(setMaxPrice(Number(e.target.value)))}
              className="w-24 accent-[#00f59b] cursor-pointer"
            />
            <span className="font-bold text-[#00f59b] min-w-[65px] text-right">
              {formatPrice(maxPrice)}
            </span>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value as any))}
              className="py-2 px-3 text-xs font-mono rounded-xl bg-white/[0.04] border border-white/[0.1] text-white focus:outline-none focus:border-[#00f59b] cursor-pointer"
            >
              <option value="featured" className="bg-[#0b0c12] text-white">
                Featured Hardware
              </option>
              <option value="price-asc" className="bg-[#0b0c12] text-white">
                Price: Low to High
              </option>
              <option value="price-desc" className="bg-[#0b0c12] text-white">
                Price: High to Low
              </option>
              <option value="rating" className="bg-[#0b0c12] text-white">
                Highest Rated
              </option>
            </select>
          </div>

          {/* Reset Filters */}
          {(selectedCategory !== "all" ||
            searchQuery !== "" ||
            sortBy !== "featured" ||
            maxPrice < 3000) && (
            <button
              onClick={() => dispatch(resetFilters())}
              className="p-2 text-zinc-400 hover:text-white hover:bg-white/[0.05] rounded-xl border border-white/[0.08] transition-colors"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
