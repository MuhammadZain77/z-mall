"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { addToCart } from "@/lib/redux/slices/cartSlice";
import { addToast } from "@/lib/redux/slices/uiSlice";
import { fetchProductById } from "@/lib/api/fakestore";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/product-card";
import TiltCard from "@/components/ui/tilt-card";
import {
  Star,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowLeft,
  Cpu,
  Check,
  Share2,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const allProducts = useAppSelector((state) => state.products.items);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [activeImage, setActiveImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const id = Number(params?.id);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      const data = await fetchProductById(id);
      setProduct(data);
      if (data) {
        setSelectedColor(data.colors?.[0]);
        setActiveImage(data.image);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-2 border-[#00f59b] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-zinc-400">
          Loading hardware specifications...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Hardware Not Found</h2>
        <p className="text-sm text-zinc-400">
          The requested gadget does not exist in inventory.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00f59b] text-black font-bold text-xs uppercase"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Catalog
        </Link>
      </div>
    );
  }

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
        message: `Added ${quantity}x "${product.title}" to cart!`,
        type: "success",
      })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    dispatch(
      addToCart({
        product,
        quantity,
        selectedColor,
      })
    );
    router.push("/checkout");
  };

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.techCategory === product.techCategory)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Back Navigation */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
        </Link>
      </div>

      {/* Main Grid: Gallery & Hardware Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Gallery (Left Col) */}
        <div className="lg:col-span-6 space-y-4">
          <TiltCard
            maxTilt={8}
            className="relative aspect-square w-full rounded-3xl overflow-hidden bg-[#090a10] border border-white/[0.08] shadow-2xl"
          >
            <Image
              src={activeImage || product.image}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-md bg-[#00f59b] text-black font-mono font-bold text-xs uppercase tracking-wider shadow-lg">
                {product.badge}
              </span>
            )}
          </TiltCard>

          {/* Thumbnails */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.gallery.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImage === img
                      ? "border-[#00f59b] shadow-[0_0_12px_rgba(0,245,155,0.4)]"
                      : "border-white/[0.08] opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt="Gallery thumbnail"
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Specs & Ordering (Right Col) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#00f59b] font-bold uppercase tracking-widest">
                {product.brand} // {product.techCategory}
              </span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold text-white">
                  {product.rating?.rate ?? 4.8}
                </span>
                <span className="text-zinc-500">
                  ({product.rating?.count ?? 95} verified reviews)
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-4xl font-mono font-extrabold text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base font-mono text-zinc-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                SAVE {formatPrice((product.originalPrice ?? product.price) - product.price)}
              </span>
            </div>
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed">
            {product.description}
          </p>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                Chassis Color:
              </label>
              <div className="flex items-center gap-3">
                {product.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all p-0.5 ${
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

          {/* Quantity & CTAs */}
          <div className="space-y-3 pt-4 border-t border-white/[0.08]">
            <div className="flex gap-4">
              <div className="flex items-center border border-white/[0.1] rounded-xl bg-black/40 px-3 py-2 gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-zinc-400 hover:text-white text-lg font-mono px-1"
                >
                  -
                </button>
                <span className="font-mono text-white font-bold text-sm w-6 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-zinc-400 hover:text-white text-lg font-mono px-1"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  added
                    ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                    : "bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/[0.12] hover:border-[#00f59b]"
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

              <button
                onClick={handleBuyNow}
                className="flex-1 py-3.5 px-6 rounded-xl bg-[#00f59b] hover:bg-emerald-400 text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(0,245,155,0.35)] cursor-pointer"
              >
                <Zap className="w-4 h-4" /> Buy Now
              </button>
            </div>
          </div>

          {/* Trust Value Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.08] text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>2-Year Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>Express Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-purple-400" />
              <span>30-Day Returns</span>
            </div>
          </div>

          {/* Full Specifications Table */}
          {product.specs && product.specs.length > 0 && (
            <div className="pt-4 border-t border-white/[0.08] space-y-3">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#00f59b]" /> Full Technical Specifications
              </h3>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] divide-y divide-white/[0.06] overflow-hidden text-xs">
                {product.specs.map((spec, i) => (
                  <div key={i} className="flex justify-between p-3">
                    <span className="text-zinc-500 font-mono w-1/3">{spec.label}</span>
                    <span className="text-zinc-200 font-mono font-medium text-right w-2/3">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-white/[0.08]">
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Related {product.techCategory} Hardware
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
