import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/providers/ReduxProvider";
import Navbar from "@/components/navbar";
import CartDrawer from "@/components/cart-drawer";
import QuickViewModal from "@/components/quick-view-modal";
import { ToastContainer } from "@/components/ui/toast";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Z Mall - Flagship Mobiles, Laptops & Cyber Tech Store",
  description:
    "Next-generation tech e-commerce store for smartphones, laptops, audio, and high-performance cyber accessories. Powered by Fake Store API and Redux Toolkit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark antialiased scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-[#050507] text-[#f8fafc] overflow-x-hidden selection:bg-[#00f59b] selection:text-black">
        <ReduxProvider>
          <Navbar />
          <CartDrawer />
          <QuickViewModal />
          <ToastContainer />
          <main className="flex-1">{children}</main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
