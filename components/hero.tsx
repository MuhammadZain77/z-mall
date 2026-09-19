"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/lib/redux/store";
import { setCategory } from "@/lib/redux/slices/productsSlice";
import { TextAnimation } from "./ui/text-animation";
import TiltCard from "./ui/tilt-card";
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Cpu,
  Flame,
  BatteryCharging,
  Sparkles,
} from "lucide-react";

export default function Hero() {
  const dispatch = useAppDispatch();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-24 border-b border-white/[0.08] bg-gradient-to-b from-[#050507] via-[#090a10] to-[#050507]">
      {/* Background Cyber Ambient Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-[#00f59b]/10 via-cyan-500/10 to-purple-600/10 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-[#00f59b]/5 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/5 blur-[110px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Kinetic Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.1] text-xs font-mono text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-[#00f59b] animate-ping" />
              <span className="text-[#00f59b] font-bold">NEXT-GEN COMPUTING</span>
              <span className="text-zinc-600">|</span>
              <span>2026 FLAGSHIP RELEASE</span>
            </div>

            {/* Kinetic Text Reveal Headline */}
            <div className="space-y-1">
              <TextAnimation
                size="huge"
                as="h1"
                delay={0.1}
                blockColor="#00f59b"
                duration={0.7}
                className="font-extrabold text-white tracking-tight leading-[1.05]"
                text="Engineered For Power."
              />
              <TextAnimation
                size="display"
                as="h2"
                delay={0.25}
                blockColor="#a855f7"
                duration={0.75}
                className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 tracking-tight leading-[1.1]"
                text="Flagship Mobiles & Laptops"
              />
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Step into the pinnacle of mobile hardware and silicon architecture.
              Powered by real-time Fake Store API catalog, live order status tracking, and 
              instant express courier delivery.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/products"
                onClick={() => dispatch(setCategory("all"))}
                className="px-7 py-3.5 rounded-xl bg-[#00f59b] hover:bg-emerald-400 text-black font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(0,245,155,0.4)] transition-all hover:scale-105"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/products"
                onClick={() => dispatch(setCategory("smartphones"))}
                className="px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-sm border border-white/[0.12] hover:border-[#00f59b]/50 transition-all flex items-center gap-2"
              >
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Smartphones 5G</span>
              </Link>

              <Link
                href="/products"
                onClick={() => dispatch(setCategory("laptops"))}
                className="px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-sm border border-white/[0.12] hover:border-cyan-400/50 transition-all flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-cyan-400" />
                <span>Ultrabooks & RTX</span>
              </Link>
            </div>

            {/* Key Value Props */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/[0.08] max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[#00f59b]">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Same-Day</h4>
                  <p className="text-[10px] text-zinc-400">Fremont Depot</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">2-Yr Warranty</h4>
                  <p className="text-[10px] text-zinc-400">Full Coverage</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <BatteryCharging className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Free Express</h4>
                  <p className="text-[10px] text-zinc-400">Orders $150+</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Tilt Featured Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <TiltCard
              maxTilt={14}
              className="relative w-full max-w-md rounded-3xl p-1 bg-gradient-to-b from-white/[0.15] via-white/[0.05] to-transparent shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            >
              <div className="relative rounded-[22px] bg-[#0c0d15] border border-white/[0.08] p-6 overflow-hidden">
                {/* Corner Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-md bg-[#00f59b]/15 text-[#00f59b] border border-[#00f59b]/30 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> FEATURED HERO GADGET
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    TITANIUM GRAY
                  </span>
                </div>

                {/* Hero Showcase Image */}
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#161722] to-[#090a0f] border border-white/[0.06] flex items-center justify-center group">
                  <Image
                    src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1200&auto=format&fit=crop"
                    alt="Zenith Pro X 5G"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d15] via-transparent to-transparent opacity-80" />
                  
                  {/* Floating 3D Spec Tag */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-[#00f59b] font-mono uppercase tracking-widest font-bold">
                        Snapdragon 8 Gen 3
                      </p>
                      <h4 className="text-sm font-bold text-white">
                        Zenith Pro X 5G (512GB)
                      </h4>
                    </div>
                    <span className="text-base font-extrabold font-mono text-white">
                      $999.99
                    </span>
                  </div>
                </div>

                {/* Spec List Grid */}
                <div className="grid grid-cols-2 gap-2.5 mt-5">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">
                      Display
                    </p>
                    <p className="text-xs font-semibold text-white font-mono mt-0.5">
                      6.8&quot; 2K 144Hz AMOLED
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">
                      Optics
                    </p>
                    <p className="text-xs font-semibold text-white font-mono mt-0.5">
                      200MP Periscope OIS
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">
                      Chassis
                    </p>
                    <p className="text-xs font-semibold text-white font-mono mt-0.5">
                      Grade 5 Titanium
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">
                      HyperCharge
                    </p>
                    <p className="text-xs font-semibold text-white font-mono mt-0.5">
                      100W Wired + 50W Qi
                    </p>
                  </div>
                </div>

                {/* Direct Action Link */}
                <Link
                  href="/product/1"
                  className="mt-5 w-full py-3 rounded-xl bg-white/[0.06] hover:bg-[#00f59b] text-white hover:text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/[0.1] hover:border-[#00f59b] transition-all"
                >
                  <span>Inspect Hardware Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
}
