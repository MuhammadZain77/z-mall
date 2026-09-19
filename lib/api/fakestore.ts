import { FakeStoreProduct, Product, TechCategory } from "@/types/product";

const BASE_URL = "https://fakestoreapi.com";

// Tech enrichment database for smartphones, laptops, audio, and accessories
const TECH_METADATA: Record<
  number,
  {
    title: string;
    techCategory: TechCategory;
    brand: string;
    badge: "Flagship" | "New" | "Hot" | "Best Seller" | "Limited";
    image: string;
    originalPrice: number;
    colors: string[];
    features: string[];
    specs: { label: string; value: string }[];
    gallery: string[];
  }
> = {
  1: {
    title: "Zenith Pro X 5G (Titanium Gray - 512GB)",
    techCategory: "smartphones",
    brand: "Zenith",
    badge: "Flagship",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1200&auto=format&fit=crop",
    originalPrice: 1199.99,
    colors: ["#1e2029", "#cbd5e1", "#059669"],
    features: [
      "Snapdragon 8 Gen 3 (4nm)",
      "6.8\" 2K LTPO Dynamic AMOLED 144Hz",
      "200MP Periscope Telephoto Lens",
      "5500mAh Battery with 100W HyperCharge",
    ],
    specs: [
      { label: "Processor", value: "Qualcomm Snapdragon 8 Gen 3" },
      { label: "Display", value: "6.8\" Dynamic AMOLED 2X 144Hz HDR10+" },
      { label: "RAM & Storage", value: "16GB LPDDR5X + 512GB UFS 4.0" },
      { label: "Main Camera", value: "200MP OIS + 50MP Ultra-Wide + 50MP Periscope" },
      { label: "Battery", value: "5,500 mAh / 100W Wired + 50W Wireless" },
      { label: "OS", value: "Android 15 with 7 Years Updates" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02560?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  2: {
    title: "AeroBook Ultra 16 M-Edition (Space Black)",
    techCategory: "laptops",
    brand: "AeroTech",
    badge: "Flagship",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
    originalPrice: 2299.99,
    colors: ["#0f172a", "#64748b"],
    features: [
      "16.2\" Liquid Retina XDR Mini-LED 120Hz",
      "16-Core Ultra CPU / 40-Core Neural GPU",
      "36GB Unified Memory / 1TB SSD",
      "Up to 22 Hours Battery Life",
    ],
    specs: [
      { label: "Display", value: "16.2\" Mini-LED XDR Display (1600 nits peak)" },
      { label: "Chipset", value: "Next-Gen 16-Core Silicon SoC" },
      { label: "Memory", value: "36GB Unified Ultra-Bandwidth RAM" },
      { label: "Storage", value: "1TB PCIe Gen4 NVMe SSD (7,400 MB/s)" },
      { label: "Ports", value: "3x Thunderbolt 4, HDMI 2.1, SDXC Slot, MagSafe" },
      { label: "Weight", value: "2.14 kg (CNC Aerospace Aluminum)" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  3: {
    title: "CyberFold V3 Dual-Screen Smartphone",
    techCategory: "smartphones",
    brand: "Cyberion",
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=1200&auto=format&fit=crop",
    originalPrice: 1799.0,
    colors: ["#09090b", "#3b82f6"],
    features: [
      "8.0\" Inner Folding AMOLED + 6.5\" Outer Cover",
      "Zero-Gap Titanium Hinge Mechanism",
      "Dual S-Pen Support & Stylus Dock",
      "IPX8 Water Resistance Rating",
    ],
    specs: [
      { label: "Inner Screen", value: "8.0\" Foldable LTPO OLED, 120Hz, HDR10+" },
      { label: "Cover Screen", value: "6.5\" FHD+ AMOLED 120Hz Gorilla Armor" },
      { label: "Processor", value: "Octa-core 3.4GHz Snapdragon 8 Gen 3" },
      { label: "RAM & ROM", value: "16GB RAM + 1TB UFS 4.0" },
      { label: "Cameras", value: "108MP Main + 50MP Tele + 12MP Ultra-wide" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  4: {
    title: "NovaBlade 14 Stealth Gaming Laptop",
    techCategory: "laptops",
    brand: "Nova",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1200&auto=format&fit=crop",
    originalPrice: 1899.99,
    colors: ["#000000", "#1e293b"],
    features: [
      "NVIDIA GeForce RTX 4080 12GB GDDR6",
      "AMD Ryzen 9 8945HS AI Processor",
      "14\" OLED QHD+ 240Hz 0.2ms Response",
      "Vapor Chamber Cooling with Liquid Metal",
    ],
    specs: [
      { label: "GPU", value: "NVIDIA GeForce RTX 4080 Mobile (140W TGP)" },
      { label: "CPU", value: "AMD Ryzen 9 8945HS (8 Cores / 16 Threads)" },
      { label: "Display", value: "14.0\" 2880x1800 OLED 240Hz 100% DCI-P3" },
      { label: "RAM", value: "32GB LPDDR5X 7500MHz" },
      { label: "Storage", value: "2TB NVMe M.2 Gen4 SSD" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  5: {
    title: "PulseAudio Horizon Pro Wireless Headphones",
    techCategory: "audio",
    brand: "PulseAudio",
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
    originalPrice: 399.0,
    colors: ["#000000", "#ffffff", "#475569"],
    features: [
      "Hybrid ANC with 8 Microphones & Wind Suppression",
      "Hi-Res Wireless Audio with LDAC & Spatial 3D",
      "60-Hour Playtime & Fast Fuel (5m = 5 hours)",
      "Ultra-soft Memory Foam earcups & Magnesium frame",
    ],
    specs: [
      { label: "Drivers", value: "40mm Beryllium Custom Acoustic Transducers" },
      { label: "Noise Cancellation", value: "Up to -48dB Adaptive Hybrid ANC" },
      { label: "Codecs", value: "LDAC, aptX Lossless, AAC, SBC" },
      { label: "Battery", value: "60 Hours (ANC On) / USB-C Fast Charge" },
      { label: "Connectivity", value: "Bluetooth 5.4 + Multipoint 3 Devices" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  6: {
    title: "AeroPods ANC Studio Buds (Carbon Case)",
    techCategory: "audio",
    brand: "AeroTech",
    badge: "New",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1200&auto=format&fit=crop",
    originalPrice: 249.99,
    colors: ["#111827", "#f8fafc"],
    features: [
      "Personalized Spatial Audio with Head Tracking",
      "Next-gen Transparency Mode with Voice Clarity",
      "IP54 Sweat and Dust Resistant",
      "Wireless MagSafe & Qi Charging Case",
    ],
    specs: [
      { label: "Acoustics", value: "Dual Dynamic 11mm Graphene Driver" },
      { label: "Microphones", value: "Triple Mic array with AI Beamforming" },
      { label: "Battery", value: "8 Hours per charge / 36 Hours with Case" },
      { label: "Water Resistance", value: "IP54 Certified" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  7: {
    title: "HyperGaN 140W 4-Port Fast Desktop Charger",
    techCategory: "accessories",
    brand: "HyperVolt",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=1200&auto=format&fit=crop",
    originalPrice: 99.99,
    colors: ["#18181b", "#3f3f46"],
    features: [
      "GaNFast III Semiconductor Technology",
      "Simultaneous 140W High-Speed PD 3.1",
      "Charges MacBook Pro 16\" to 50% in 28 mins",
      "Comprehensive Overheating & Surge Protection",
    ],
    specs: [
      { label: "Total Output", value: "140W Max Power Delivery 3.1" },
      { label: "Ports", value: "3x USB-C + 1x USB-A QC 4.0" },
      { label: "Safety", value: "ActiveProtect 2.0 temperature monitoring" },
      { label: "Dimensions", value: "75 x 75 x 30 mm / 280g" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  8: {
    title: "ApexWatch Ultra Titanium Cellular",
    techCategory: "accessories",
    brand: "Zenith",
    badge: "Flagship",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
    originalPrice: 799.0,
    colors: ["#334155", "#e2e8f0", "#ea580c"],
    features: [
      "49mm Grade 5 Aerospace Titanium Case",
      "Sapphire Crystal 3000 nits Always-On Display",
      "Dual-Frequency GPS & Offline Topo Maps",
      "Up to 72 Hours Low-Power Battery Mode",
    ],
    specs: [
      { label: "Case Size", value: "49mm Titanium with Raised Bezel" },
      { label: "Sensors", value: "ECG, SpO2, Skin Temp, Depth Gauge to 40m" },
      { label: "Water Resistance", value: "100m Water Resistant / MIL-STD 810H" },
      { label: "Connectivity", value: "4G LTE Cellular + Wi-Fi 6 + Bluetooth 5.3" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  9: {
    title: "CyberDeck 68 Magnetic Switch Keyboard",
    techCategory: "accessories",
    brand: "Cyberion",
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1200&auto=format&fit=crop",
    originalPrice: 189.99,
    colors: ["#09090b", "#4338ca"],
    features: [
      "Rapid Trigger 0.1mm - 4.0mm Dynamic Actuation",
      "CNC Anodized Aluminum Top-Frame",
      "Per-Key RGB with 1000Hz Polling Rate",
      "Hot-Swappable Hall Effect Magnetic Switches",
    ],
    specs: [
      { label: "Switches", value: "Magnetic Hall-Effect Gateron Jade" },
      { label: "Keycaps", value: "PBT Double-Shot OEM Profile" },
      { label: "Polling Rate", value: "8,000Hz Hyper-Polling USB-C" },
      { label: "Weight", value: "1.2kg Solid Aluminum Chassis" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  10: {
    title: "MagCharge 25,000mAh Cyber Power Bank",
    techCategory: "accessories",
    brand: "HyperVolt",
    badge: "New",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=1200&auto=format&fit=crop",
    originalPrice: 129.99,
    colors: ["#18181b", "#0284c7"],
    features: [
      "Transparent Cyberpunk Acrylic Shell",
      "Color IPS Smart Display for Real-time Watts",
      "Airline Safe 99.6Wh Lithium Polymer",
      "Dual 100W USB-C PD Input & Output",
    ],
    specs: [
      { label: "Capacity", value: "25,600mAh (99.6Wh FAA Approved)" },
      { label: "Max Output", value: "Total 145W Concurrent" },
      { label: "Display", value: "1.54\" Real-time TFT Power Monitor" },
      { label: "Ports", value: "2x USB-C (100W/45W) + 1x USB-A (18W)" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  11: {
    title: "OmniView 16\" 4K Portable OLED Touch Monitor",
    techCategory: "accessories",
    brand: "AeroTech",
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1200&auto=format&fit=crop",
    originalPrice: 449.0,
    colors: ["#0f172a"],
    features: [
      "15.6\" 4K UHD (3840x2160) Samsung OLED",
      "10-Point Capacitive Touch Screen",
      "Single-Cable USB-C Display & Power",
      "Integrated Magnetic Origami Kickstand Cover",
    ],
    specs: [
      { label: "Resolution", value: "3840 x 2160 pixels (4K UHD) OLED" },
      { label: "Brightness", value: "500 nits (100% DCI-P3 / HDR 500)" },
      { label: "Thickness", value: "4.8mm Ultra-Slim Profile" },
      { label: "Connectivity", value: "2x USB Type-C, 1x Mini-HDMI, 3.5mm Jack" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  12: {
    title: "PixelMaster Phone Gimbal Stabilizer 3-Axis",
    techCategory: "accessories",
    brand: "Cyberion",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?q=80&w=1200&auto=format&fit=crop",
    originalPrice: 159.0,
    colors: ["#18181b", "#ffffff"],
    features: [
      "AI Magnetic Tracker with Built-in Fill Light",
      "Quick-Release Magnetic Clamp for Any Smartphone",
      "Native Apple Log / HDR Support Integration",
      "18-Hour Battery with Reverse Phone Charging",
    ],
    specs: [
      { label: "Stabilization", value: "3-Axis Motorized Active Gimbal" },
      { label: "Payload", value: "Up to 300g (Compatible with Pro Max phones)" },
      { label: "Tracking", value: "Optical AI Object & Face Tracking" },
      { label: "Weight", value: "340g Foldable Design" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  13: {
    title: "Vanguard Max 5G (Carbon Weave Edition)",
    techCategory: "smartphones",
    brand: "Zenith",
    badge: "Flagship",
    image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?q=80&w=1200&auto=format&fit=crop",
    originalPrice: 1099.0,
    colors: ["#171717", "#064e3b"],
    features: [
      "Under-Display Selfie Camera (True Full Screen)",
      "Satellite SOS 2-Way Messaging",
      "6000mAh Silicon-Carbon High Density Cell",
      "Dedicated Hardware Security Chip",
    ],
    specs: [
      { label: "Screen", value: "6.78\" BOE Q9+ OLED, 144Hz, 2160Hz PWM" },
      { label: "Processor", value: "Dimensity 9300+ Extreme Edition" },
      { label: "RAM & Storage", value: "16GB RAM / 512GB UFS 4.0" },
      { label: "Cooling", value: "IceLoop 3D Liquid Vapor Chamber" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1567581935884-3349723552ca?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  14: {
    title: "ZenithBook Air 14 Featherlight",
    techCategory: "laptops",
    brand: "Zenith",
    badge: "New",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop",
    originalPrice: 1399.0,
    colors: ["#334155", "#0f172a"],
    features: [
      "Under 1.0kg Magnesium-Lithium Alloy Chassis",
      "Intel Core Ultra 7 155H with Intel AI Boost",
      "14.0\" 3K 120Hz IPS Anti-Glare Display",
      "All-Day 18-Hour Real-world Battery Life",
    ],
    specs: [
      { label: "Processor", value: "Intel Core Ultra 7 155H (16 Cores)" },
      { label: "Graphics", value: "Intel Arc Graphics" },
      { label: "Weight", value: "980 grams" },
      { label: "Battery", value: "75Wh with 65W GaN USB-C Adapter" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  15: {
    title: "SonicPro Wireless Studio Monitor Speakers",
    techCategory: "audio",
    brand: "PulseAudio",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1200&auto=format&fit=crop",
    originalPrice: 299.99,
    colors: ["#18181b", "#ffffff"],
    features: [
      "Dual 5\" Kevlar Woofers with 1\" Silk Dome Tweeter",
      "Lossless Bluetooth 5.3 + Optical + Balanced TRS",
      "DSP Room Acoustic Calibration Switch",
      "Handcrafted Acoustic MDF Wood Enclosure",
    ],
    specs: [
      { label: "Power Output", value: "120W RMS (60W + 60W Continuous)" },
      { label: "Frequency Range", value: "45Hz - 22,000Hz" },
      { label: "Inputs", value: "Bluetooth, Optical, RCA, USB-Audio, 1/4\" TRS" },
      { label: "Amplifier", value: "Class-D High Efficiency Bi-Amp" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  16: {
    title: "QuantumStrike Wireless Gaming Mouse 8K",
    techCategory: "accessories",
    brand: "Nova",
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1200&auto=format&fit=crop",
    originalPrice: 119.0,
    colors: ["#000000", "#ffffff"],
    features: [
      "Ultra-Lightweight 49g Carbon Fiber Composite",
      "PAW3950 30,000 DPI Optical Sensor",
      "True 8,000Hz Wireless & Wired Polling Rate",
      "Optical Micro-switches with 100M Click Life",
    ],
    specs: [
      { label: "Sensor", value: "PixArt PAW3950 (30K DPI, 750 IPS, 50G)" },
      { label: "Polling Rate", value: "8,000Hz True Wireless" },
      { label: "Weight", value: "49 grams" },
      { label: "Battery", value: "80 Hours at 1,000Hz / USB-C Fast Charge" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  17: {
    title: "AuraGlow Smart Magnetic MagSafe Wallet & Stand",
    techCategory: "accessories",
    brand: "HyperVolt",
    badge: "New",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop",
    originalPrice: 49.99,
    colors: ["#1c1917", "#0369a1"],
    features: [
      "N52 Neodymium Ultra-Strong 3500 Gauss Magnets",
      "Adjustable 15° to 160° Multi-Angle Kickstand",
      "Built-in Find My Apple Network Tracking",
      "RFID Shielded 4-Card Capacity",
    ],
    specs: [
      { label: "Compatibility", value: "iPhone 12 through 16 Pro Max / Qi2 Devices" },
      { label: "Material", value: "Aerospace Vegan Leather & Zinc Alloy" },
      { label: "Features", value: "Apple Find My Chip with 6-month battery" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  18: {
    title: "PrismHub 10-in-1 Thunderbolt 4 Docking Station",
    techCategory: "accessories",
    brand: "AeroTech",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop",
    originalPrice: 229.0,
    colors: ["#18181b"],
    features: [
      "Dual 4K @ 144Hz or Single 8K @ 60Hz Display",
      "100W Pass-Through Power Delivery for Laptops",
      "2.5Gbps High-Speed Ethernet & UHS-II SD 4.0",
      "M.2 NVMe SSD Enclosure built into base",
    ],
    specs: [
      { label: "Bandwidth", value: "40Gbps Thunderbolt 4 / USB4" },
      { label: "Ports", value: "2x TB4, 2x HDMI 2.1, 3x USB 3.2, 2.5G LAN, SD/TF" },
      { label: "Power", value: "Included 150W DC Power Brick" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  19: {
    title: "NovaFlex 13 2-in-1 Touch Convertible Laptop",
    techCategory: "laptops",
    brand: "Nova",
    badge: "Limited",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1200&auto=format&fit=crop",
    originalPrice: 1299.0,
    colors: ["#09090b", "#334155"],
    features: [
      "360° Geared Hinge (Laptop, Tent, Tablet modes)",
      "13.4\" 3K OLED 100% DCI-P3 Stylus-ready Screen",
      "Qualcomm Snapdragon X Elite 12-Core ARM CPU",
      "Instant Wake & 20+ Hour Battery Endurance",
    ],
    specs: [
      { label: "Processor", value: "Snapdragon X Elite (45 TOPS NPU)" },
      { label: "RAM & Storage", value: "16GB LPDDR5X + 1TB SSD" },
      { label: "Stylus", value: "Magnetic 4096-pressure Active Stylus Included" },
      { label: "Weight", value: "1.18 kg" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  20: {
    title: "Zenith CyberTab Pro 13 (2.8K OLED)",
    techCategory: "smartphones",
    brand: "Zenith",
    badge: "Flagship",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1200&auto=format&fit=crop",
    originalPrice: 899.99,
    colors: ["#1e293b", "#0f172a"],
    features: [
      "13.0\" Tandem OLED with 1600 nits Peak Brightness",
      "M-Series Octa-Core High Performance Processor",
      "Quad-Speaker Dolby Atmos Soundstage",
      "Ultra-thin 5.1mm Aerospace Metal Unibody",
    ],
    specs: [
      { label: "Screen", value: "13.0\" 2880x1920 Tandem OLED 120Hz ProMotion" },
      { label: "Audio", value: "4x Studio-Grade Acoustic Drivers" },
      { label: "Battery", value: "10,200mAh with 67W Turbo Charge" },
      { label: "Weight", value: "579 grams" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1200&auto=format&fit=crop",
    ],
  },
};

/**
 * Transforms a raw FakeStoreProduct into a rich tech gadget item
 */
export function enrichTechProduct(fakeProduct: FakeStoreProduct): Product {
  const meta = TECH_METADATA[fakeProduct.id];

  if (meta) {
    return {
      ...fakeProduct,
      title: meta.title,
      techCategory: meta.techCategory,
      brand: meta.brand,
      badge: meta.badge,
      image: meta.image,
      originalPrice: meta.originalPrice,
      colors: meta.colors,
      features: meta.features,
      specs: meta.specs,
      gallery: meta.gallery,
      stock: 12 + ((fakeProduct.id * 7) % 35),
      price: fakeProduct.price > 150 ? fakeProduct.price : Number((fakeProduct.price * 3.5).toFixed(2)),
    };
  }

  // Fallback if fake store returns items outside 1-20
  return {
    ...fakeProduct,
    techCategory: "accessories",
    brand: "CyberTech",
    badge: "Hot",
    specs: [
      { label: "Category", value: fakeProduct.category },
      { label: "Rating", value: `${fakeProduct.rating?.rate ?? 4.5} / 5` },
    ],
    stock: 20,
    originalPrice: Number((fakeProduct.price * 1.25).toFixed(2)),
    colors: ["#000000", "#1e293b"],
  };
}

/**
 * Fetch all products from FakeStoreAPI
 */
export async function fetchAllProducts(): Promise<Product[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${BASE_URL}/products`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`FakeStoreAPI HTTP ${res.status}: ${res.statusText}`);
    const raw: unknown = await res.json();
    if (!Array.isArray(raw) || raw.length === 0) {
      throw new Error("FakeStoreAPI returned empty or invalid products array");
    }
    return (raw as FakeStoreProduct[]).map(enrichTechProduct);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("FakeStoreAPI fetch failed, utilizing enriched tech cache:", message);
    // Return all enriched tech products as resilient backup
    return Object.entries(TECH_METADATA).map(([idStr, meta]) => {
      const id = Number(idStr);
      return {
        id,
        title: meta.title,
        price: Number((meta.originalPrice * 0.85).toFixed(2)),
        description: `Premium high-performance ${meta.techCategory} featuring state of the art engineering, durable materials, and maximum battery efficiency.`,
        category: "electronics",
        image: meta.image,
        rating: { rate: 4.8, count: 120 + id * 12 },
        techCategory: meta.techCategory,
        brand: meta.brand,
        badge: meta.badge,
        specs: meta.specs,
        stock: 15 + id,
        originalPrice: meta.originalPrice,
        colors: meta.colors,
        features: meta.features,
        gallery: meta.gallery,
      };
    });
  }
}

/**
 * Fetch a single product by ID
 */
export async function fetchProductById(id: number): Promise<Product | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${BASE_URL}/products/${id}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Failed to fetch product ${id}`);
    const raw: FakeStoreProduct = await res.json();
    return enrichTechProduct(raw);
  } catch (err: unknown) {
    console.warn(`FakeStoreAPI fetch for ${id} failed:`, err);
    const meta = TECH_METADATA[id];
    if (meta) {
      return {
        id,
        title: meta.title,
        price: Number((meta.originalPrice * 0.85).toFixed(2)),
        description: `Cutting-edge ${meta.techCategory} device engineered for enthusiasts.`,
        category: "electronics",
        image: meta.image,
        rating: { rate: 4.8, count: 140 },
        techCategory: meta.techCategory,
        brand: meta.brand,
        badge: meta.badge,
        specs: meta.specs,
        stock: 24,
        originalPrice: meta.originalPrice,
        colors: meta.colors,
        features: meta.features,
        gallery: meta.gallery,
      };
    }
    return null;
  }
}

/**
 * Synchronize cart with FakeStoreAPI /carts endpoint
 */
export async function syncCartWithFakeStore(
  userId: number = 1,
  items: { productId: number; quantity: number }[]
) {
  try {
    const res = await fetch(`${BASE_URL}/carts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        date: new Date().toISOString().split("T")[0],
        products: items,
      }),
    });
    if (!res.ok) throw new Error("FakeStoreAPI cart sync failed");
    return await res.json();
  } catch (err) {
    console.warn("FakeStoreAPI cart sync fallback (offline/cached):", err);
    return { id: 1, userId, date: new Date().toISOString(), products: items };
  }
}

/**
 * Submit order to FakeStoreAPI (simulates order persistence with remote endpoint)
 */
export async function submitOrderToFakeStore(orderPayload: {
  items: Array<{ productId: number; quantity: number }>;
}) {
  try {
    const res = await fetch(`${BASE_URL}/carts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: 1,
        date: new Date().toISOString().split("T")[0],
        products: orderPayload.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      }),
    });
    const data = await res.json();
    return { success: true, fakeStoreId: data.id };
  } catch (err) {
    console.warn("FakeStoreAPI order sync fallback:", err);
    return { success: true, fakeStoreId: Math.floor(Math.random() * 9000) + 1000 };
  }
}

