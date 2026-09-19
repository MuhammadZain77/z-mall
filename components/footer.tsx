import React from "react";
import Link from "next/link";
import {
  Cpu,
  Shield,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#040406] text-zinc-400">
      {/* Promo Bar */}
      <div className="border-b border-white/[0.06] bg-[#07080d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-[#00f59b] animate-ping" />
            <span className="text-[#00f59b] font-bold">ACTIVE PROMO:</span>
            <span>Use code <strong className="text-white px-1.5 py-0.5 rounded bg-white/[0.08] border border-white/[0.1]">CYBER20</strong> for 20% OFF or <strong className="text-white px-1.5 py-0.5 rounded bg-white/[0.08] border border-white/[0.1]">TECH10</strong> for 10% OFF</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>FakeStoreAPI Connected & Operational</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#00f59b] via-[#38bdf8] to-[#a855f7] p-[2px] shadow-[0_0_20px_rgba(0,245,155,0.35)] shrink-0">
                <div className="w-full h-full bg-[#07080d] rounded-[10px] flex items-center justify-center relative overflow-hidden">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-5 h-5 relative z-10"
                  >
                    <path
                      d="M4 5.5H19.5L7.5 18.5H20"
                      stroke="url(#footer-z-gradient)"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="19.5" cy="5.5" r="1.5" fill="#00f59b" />
                    <circle cx="4.5" cy="18.5" r="1.5" fill="#38bdf8" />
                    <defs>
                      <linearGradient id="footer-z-gradient" x1="4" y1="5.5" x2="20" y2="18.5" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#00f59b" />
                        <stop offset="0.5" stopColor="#38bdf8" />
                        <stop offset="1" stopColor="#c084fc" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <span className="font-black text-xl tracking-tight text-white font-sans">
                Z <span className="bg-gradient-to-r from-[#00f59b] via-[#38bdf8] to-white bg-clip-text text-transparent">Mall</span>
              </span>
            </div>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              Curated flagship mobile hardware, silicon powerhouses, and high-performance accessories. Engineered for creators, developers, and tech enthusiasts.
            </p>
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-500 pt-2">
              <span>EST. 2026</span>
              <span>•</span>
              <span>SAN FRANCISCO // TOKYO</span>
            </div>
          </div>

          {/* Catalog */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
              Hardware
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Flagship Smartphones
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Ultrabooks & RTX Laptops
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Studio Audio & ANC
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  GaN Chargers & Docks
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Tracking & Order */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
              Order Status
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/orders" className="text-[#00f59b] hover:underline font-mono text-xs">
                  → Track Live Orders
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  View Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-white transition-colors">
                  Express Checkout
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Order Dispatch Log
                </Link>
              </li>
            </ul>
          </div>

          {/* Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
              Assurance
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>2-Year Global Hardware Warranty</span>
              </li>
              <li className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Express Courier Dispatches</span>
              </li>
              <li className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                <span>30-Day Zero-Fee Return Policy</span>
              </li>
              <li className="flex items-center gap-2">
                <Headphones className="w-3.5 h-3.5 text-amber-400" />
                <span>24/7 Priority Tech Support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <p>© 2026 Z Mall E-Commerce. Powered by Next.js, Redux Toolkit & FakeStoreAPI.</p>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>API Docs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
