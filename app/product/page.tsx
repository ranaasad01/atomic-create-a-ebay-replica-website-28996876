"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Heart, Share2, ShieldCheck, Truck, RotateCcw, Star, ChevronLeft, ChevronRight, Plus, Minus, Clock, Eye, Award, ThumbsUp, Package, AlertCircle, Check } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { useTranslations } from "next-intl";

// ─── Inline mock data ────────────────────────────────────────────────────────

const product = {
  id: "1",
  title: "Apple MacBook Pro 14-inch M3 Pro Chip 512GB SSD Space Gray",
  condition: "New",
  category: "Electronics",
  currentBid: 1650.0,
  buyNowPrice: 1799.99,
  bidCount: 23,
  watchCount: 142,
  timeRemaining: { days: 2, hours: 4, minutes: 17, seconds: 42 },
  shipping: "Free",
  shippingMethod: "FedEx Ground",
  estimatedDelivery: "Dec 18 – Dec 21",
  returnsPolicy: "30-day returns accepted",
  location: "San Jose, CA",
  images: [
    "https://sm.pcmag.com/t/pcmag_me/review/a/apple-macb/apple-macbook-pro-14-inch-2023-m3-pro_w91x.1920.jpg",
    "/images/macbook-pro-keyboard-closeup.jpg",
    "/images/macbook-pro-side-profile.jpg",
    "/images/macbook-pro-open-display.jpg",
  ],
  description: `Brand new sealed Apple MacBook Pro 14-inch with the groundbreaking M3 Pro chip. This machine delivers extraordinary performance for demanding workflows including video editing, 3D rendering, and software development.

Key Specifications:
• Chip: Apple M3 Pro (11-core CPU, 14-core GPU)
• Memory: 18GB unified memory
• Storage: 512GB SSD
• Display: 14.2-inch Liquid Retina XDR, 3024×1964, ProMotion 120Hz
• Battery: Up to 18 hours
• Ports: 3x Thunderbolt 4, HDMI, SD card, MagSafe 3
• Color: Space Gray

In the box: MacBook Pro, 70W USB-C Power Adapter, USB-C to MagSafe 3 Cable.

Item is factory sealed with all original accessories. Ships same business day if ordered before 2 PM PST.`,
  seller: {
    username: "tech_deals_pro",
    feedbackScore: 4892,
    positivePercent: 99.8,
    memberSince: "2009",
    itemsSold: 3241,
    avatar: "/images/seller-avatar-tech.jpg",
    topRated: true,
    responseTime: "Usually responds within 1 hour",
  },
  feedback: [
    {
      id: "f1",
      user: "buyer_marcus_k",
      rating: 5,
      comment: "Arrived perfectly sealed, exactly as described. Super fast shipping. Highly recommend this seller!",
      date: "Dec 10, 2024",
      item: "MacBook Air M2",
    },
    {
      id: "f2",
      user: "sarah_tech_lover",
      rating: 5,
      comment: "Excellent transaction. Item was brand new, packed securely. Will buy from again without hesitation.",
      date: "Dec 5, 2024",
      item: "iPad Pro 12.9-inch",
    },
    {
      id: "f3",
      user: "gadget_guru_99",
      rating: 5,
      comment: "Fast shipping, great communication. The product was exactly as listed. Five stars all the way.",
      date: "Nov 28, 2024",
      item: "AirPods Pro 2nd Gen",
    },
    {
      id: "f4",
      user: "deal_hunter_2024",
      rating: 4,
      comment: "Good seller, item arrived in great condition. Shipping took one extra day but overall very happy.",
      date: "Nov 20, 2024",
      item: "Apple Watch Series 9",
    },
  ],
};

const relatedProducts = [
  {
    id: "r1",
    title: "Apple MacBook Air 15-inch M3 Midnight 256GB",
    price: 1099.0,
    image: "/images/macbook-air-m3-midnight.jpg",
    condition: "New",
    shipping: "Free",
    bids: null,
  },
  {
    id: "r2",
    title: "Apple MacBook Pro 16-inch M3 Max 1TB Silver",
    price: 2499.0,
    image: "/images/macbook-pro-16-silver.jpg",
    condition: "New",
    shipping: "Free",
    bids: null,
  },
  {
    id: "r3",
    title: "Apple MacBook Pro 14-inch M2 Pro 512GB Refurbished",
    price: 1249.0,
    image: "/images/macbook-pro-m2-refurbished.jpg",
    condition: "Refurbished",
    shipping: "Free",
    bids: 8,
  },
  {
    id: "r4",
    title: "Dell XPS 15 Intel Core i9 RTX 4070 1TB SSD",
    price: 1599.0,
    image: "/images/dell-xps-15-laptop.jpg",
    condition: "New",
    shipping: "Free",
    bids: null,
  },
];

// ─── Countdown hook ───────────────────────────────────────────────────────────

function useCountdown(initial: { days: number; hours: number; minutes: number; seconds: number }) {
  const [time, setTime] = useState(initial);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) return { days, hours, minutes, seconds: seconds - 1 };
        if (minutes > 0) return { days, hours, minutes: minutes - 1, seconds: 59 };
        if (hours > 0) return { days, hours: hours - 1, minutes: 59, seconds: 59 };
        if (days > 0) return { days: days - 1, hours: 23, minutes: 59, seconds: 59 };
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ImageGallery({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-black/5 cursor-zoom-in group"
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={images[activeIndex] ?? "https://sm.pcmag.com/t/pcmag_me/review/a/apple-macb/apple-macbook-pro-14-inch-2023-m3-pro_w91x.1920.jpg"}
            alt={`Product image ${activeIndex + 1}`}
            className="w-full h-full object-contain p-4"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://sm.pcmag.com/t/pcmag_me/review/a/apple-macb/apple-macbook-pro-14-inch-2023-m3-pro_w91x.1920.jpg";
            }}
          />
        </AnimatePresence>

        {/* Nav arrows */}
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          aria-label="Previous image"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          aria-label="Next image"
        >
          <ChevronRight size={16} />
        </button>

        {/* Image counter */}
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
              i === activeIndex
                ? "border-[#105CB6] shadow-[0_0_0_2px_rgba(16,92,182,0.2)]"
                : "border-black/10 hover:border-black/30"
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${i + 1}`}
              className="w-full h-full object-contain p-1 bg-gray-50"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://sm.pcmag.com/t/pcmag_me/review/a/apple-macb/apple-macbook-pro-14-inch-2023-m3-pro_w91x.1920.jpg";
              }}
            />
          </button>
        ))}
      </div>

      {/* Trust badges */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ShieldCheck size={16} className="text-[#86B817] flex-shrink-0" />
          <span>eBay Money Back Guarantee</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Truck size={16} className="text-[#105CB6] flex-shrink-0" />
          <span>Free shipping via FedEx Ground</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <RotateCcw size={16} className="text-[#E53238] flex-shrink-0" />
          <span>30-day returns accepted</span>
        </div>
      </div>
    </div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-[#105CB6] text-white font-bold text-lg w-12 h-12 rounded-xl flex items-center justify-center tabular-nums shadow-[0_2px_8px_rgba(16,92,182,0.3)]">
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-xs text-gray-500 mt-1">{label}</span>
    </div>
  );
}

function BidModal({
  isOpen,
  onClose,
  currentBid,
  onBid,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentBid: number;
  onBid: (amount: number) => void;
}) {
  const minBid = currentBid + 25;
  const [bidAmount, setBidAmount] = useState(String(minBid));
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < minBid) {
      setError(`Minimum bid is $${minBid.toFixed(2)}`);
      return;
    }
    onBid(amount);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm z-10"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-1">Place Your Bid</h2>
          <p className="text-sm text-gray-500 mb-4">
            Current bid: <span className="font-semibold text-gray-800">${currentBid.toFixed(2)}</span>
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your maximum bid (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => { setBidAmount(e.target.value); setError(""); }}
                className="w-full pl-7 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#105CB6] focus:border-transparent text-gray-900 font-semibold"
                min={minBid}
                step="0.01"
              />
            </div>
            {error && (
              <p className="text-[#E53238] text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {error}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">Minimum bid: ${minBid.toFixed(2)}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 rounded-xl bg-[#105CB6] text-white font-semibold hover:bg-[#0d4d9e] transition-colors shadow-[0_2px_8px_rgba(16,92,182,0.3)]"
            >
              Confirm Bid
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Tab content components ───────────────────────────────────────────────────

function DescriptionTab({ description }: { description: string }) {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="py-6">
      <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
        {description}
      </div>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Brand", value: "Apple" },
          { label: "Model", value: "MacBook Pro 14-inch" },
          { label: "Processor", value: "Apple M3 Pro" },
          { label: "RAM", value: "18GB Unified" },
          { label: "Storage", value: "512GB SSD" },
          { label: "Display", value: "14.2-inch Retina XDR" },
          { label: "OS", value: "macOS Sonoma" },
          { label: "Color", value: "Space Gray" },
        ].map((spec) => (
          <div key={spec.label} className="bg-gray-50 rounded-xl p-3 border border-black/5">
            <p className="text-xs text-gray-500 mb-1">{spec.label}</p>
            <p className="text-sm font-semibold text-gray-800">{spec.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ShippingTab() {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="py-6 space-y-6">
      <div className="bg-[#F7F7F7] rounded-2xl p-5 border border-black/5">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Truck size={18} className="text-[#105CB6]" /> Shipping Details
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="text-gray-500">Shipping cost</span>
            <span className="font-semibold text-[#86B817]">Free</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Carrier</span>
            <span className="font-medium">FedEx Ground</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Estimated delivery</span>
            <span className="font-medium">Dec 18 – Dec 21</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Ships from</span>
            <span className="font-medium">San Jose, CA</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Ships to</span>
            <span className="font-medium">United States</span>
          </div>
        </div>
      </div>

      <div className="bg-[#F7F7F7] rounded-2xl p-5 border border-black/5">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <RotateCcw size={18} className="text-[#E53238]" /> Returns Policy
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="text-gray-500">Return window</span>
            <span className="font-medium">30 days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Return shipping</span>
            <span className="font-medium">Buyer pays</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Refund</span>
            <span className="font-medium">Money back</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3 leading-relaxed">
          Item must be returned in original, sealed condition. Contact seller within 30 days of delivery to initiate a return.
        </p>
      </div>

      <div className="flex items-start gap-3 bg-blue-50 rounded-2xl p-4 border border-blue-100">
        <ShieldCheck size={20} className="text-[#105CB6] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-gray-900">eBay Money Back Guarantee</p>
          <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
            Get the item you ordered or your money back. Covers your purchase price and original shipping.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function FeedbackTab({ feedback }: { feedback: typeof product.feedback }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="py-6 space-y-4"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="text-center">
          <div className="text-4xl font-black text-gray-900">99.8%</div>
          <div className="text-sm text-gray-500 mt-1">Positive feedback</div>
        </div>
        <div className="flex-1 space-y-1">
          {[
            { label: "Communication", value: 5.0 },
            { label: "Shipping speed", value: 4.9 },
            { label: "Item as described", value: 5.0 },
          ].map((metric) => (
            <div key={metric.label} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-32 flex-shrink-0">{metric.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-[#86B817] h-1.5 rounded-full"
                  style={{ width: `${(metric.value / 5) * 100}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-700 w-6">{metric.value}</span>
            </div>
          ))}
        </div>
      </div>

      {(feedback ?? []).map((fb) => (
        <motion.div
          key={fb.id}
          variants={fadeInUp}
          className="bg-gray-50 rounded-2xl p-4 border border-black/5"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="text-sm font-semibold text-gray-800">{fb.user}</span>
              <div className="flex items-center gap-1 mt-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < fb.rating ? "fill-[#F5AF02] text-[#F5AF02]" : "text-gray-300"}
                  />
                ))}
              </div>
            </div>
            <span className="text-xs text-gray-400">{fb.date}</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{fb.comment}</p>
          <p className="text-xs text-gray-400 mt-2">Item: {fb.item}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ProductPage() {
  const t = useTranslations();
  const countdown = useCountdown(product.timeRemaining);

  const [activeTab, setActiveTab] = useState<"description" | "shipping" | "feedback">("description");
  const [quantity, setQuantity] = useState(1);
  const [isWatching, setIsWatching] = useState(false);
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [currentBid, setCurrentBid] = useState(product.currentBid);
  const [bidCount, setBidCount] = useState(product.bidCount);
  const [addedToCart, setAddedToCart] = useState(false);
  const [bidSuccess, setBidSuccess] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleBidPlaced = useCallback((amount: number) => {
    setCurrentBid(amount);
    setBidCount((c) => c + 1);
    setBidSuccess(true);
    setTimeout(() => setBidSuccess(false), 3000);
  }, []);

  const tabs = [
    { key: "description" as const, label: "Description" },
    { key: "shipping" as const, label: "Shipping & Returns" },
    { key: "feedback" as const, label: "Seller Feedback" },
  ];

  return (
    <main className="min-h-screen bg-[#F7F7F7]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <nav className="flex items-center gap-1 text-xs text-gray-500">
            <Link href="/" className="hover:text-[#105CB6] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/search?category=electronics" className="hover:text-[#105CB6] transition-colors">Electronics</Link>
            <ChevronRight size={12} />
            <Link href="/search?category=electronics&sub=laptops" className="hover:text-[#105CB6] transition-colors">Laptops</Link>
            <ChevronRight size={12} />
            <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Main product grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Left: Image gallery */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <ImageGallery images={product.images} />
          </motion.div>

          {/* Right: Product info panel */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-5"
          >
            {/* Title + badges */}
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#86B817]/10 text-[#86B817] border border-[#86B817]/20">
                  {product.condition}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#105CB6]/10 text-[#105CB6] border border-[#105CB6]/20">
                  {product.category}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Eye size={12} /> {product.watchCount} watching
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug text-balance">
                {product.title}
              </h1>
            </div>

            {/* Bid success banner */}
            <AnimatePresence>
              {bidSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 bg-[#86B817]/10 border border-[#86B817]/30 text-[#86B817] rounded-xl px-4 py-3 text-sm font-semibold"
                >
                  <Check size={16} /> Bid placed successfully! You are the highest bidder.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pricing */}
            <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
              {/* Auction section */}
              <div className="mb-4 pb-4 border-b border-black/5">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-3xl font-black text-gray-900">
                    ${currentBid.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {bidCount} bid{bidCount !== 1 ? "s" : ""}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3">Current bid</p>

                {/* Countdown */}
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={14} className="text-[#E53238]" />
                  <span className="text-sm font-semibold text-[#E53238]">Time remaining:</span>
                </div>
                <div className="flex items-center gap-2">
                  <CountdownUnit value={countdown.days} label="Days" />
                  <span className="text-gray-400 font-bold text-lg mb-4">:</span>
                  <CountdownUnit value={countdown.hours} label="Hours" />
                  <span className="text-gray-400 font-bold text-lg mb-4">:</span>
                  <CountdownUnit value={countdown.minutes} label="Mins" />
                  <span className="text-gray-400 font-bold text-lg mb-4">:</span>
                  <CountdownUnit value={countdown.seconds} label="Secs" />
                </div>
              </div>

              {/* Buy It Now */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm text-gray-500">Buy It Now</span>
                  <span className="text-2xl font-black text-gray-900">
                    ${(product.buyNowPrice ?? 0).toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-[#86B817] font-medium">
                  Free shipping · Estimated delivery Dec 18 – Dec 21
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm text-gray-600 font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-gray-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="text-xs text-gray-400">10 available</span>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                <motion.button
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    addedToCart
                      ? "bg-[#86B817] text-white shadow-[0_2px_12px_rgba(134,184,23,0.35)]"
                      : "bg-[#105CB6] text-white hover:bg-[#0d4d9e] shadow-[0_2px_12px_rgba(16,92,182,0.3)]"
                  }`}
                >
                  {addedToCart ? (
                    <><Check size={16} /> Added to Cart</>
                  ) : (
                    "Add to Cart"
                  )}
                </motion.button>

                <motion.button
                  onClick={() => setBidModalOpen(true)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#E53238] text-white hover:bg-[#cc2b30] transition-colors shadow-[0_2px_12px_rgba(229,50,56,0.3)] flex items-center justify-center gap-2"
                >
                  Place Bid
                </motion.button>

                <motion.button
                  onClick={() => setIsWatching((w) => !w)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-xl font-semibold text-sm border transition-all duration-200 flex items-center justify-center gap-2 ${
                    isWatching
                      ? "border-[#E53238] text-[#E53238] bg-[#E53238]/5"
                      : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Heart size={16} className={isWatching ? "fill-[#E53238]" : ""} />
                  {isWatching ? "Watching" : "Add to Watchlist"}
                </motion.button>
              </div>
            </div>

            {/* Seller info card */}
            <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Seller Information</h3>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#105CB6] to-[#86B817] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {product.seller.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href="/user-profile-my-ebay"
                      className="font-bold text-[#105CB6] hover:underline text-sm"
                    >
                      {product.seller.username}
                    </Link>
                    {product.seller.topRated && (
                      <span className="flex items-center gap-1 text-xs bg-[#F5AF02]/10 text-[#c48a00] border border-[#F5AF02]/30 px-2 py-0.5 rounded-full font-semibold">
                        <Award size={10} /> Top Rated
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <ThumbsUp size={12} className="text-[#86B817]" />
                    <span className="text-xs text-gray-600">
                      {product.seller.positivePercent}% positive ({(product.seller.feedbackScore ?? 0).toLocaleString("en-US")} ratings)
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Member since {product.seller.memberSince} · {(product.seller.itemsSold ?? 0).toLocaleString("en-US")} items sold
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{product.seller.responseTime}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-black/5 flex gap-2">
                <button className="flex-1 py-2 text-xs font-semibold text-[#105CB6] border border-[#105CB6]/30 rounded-xl hover:bg-[#105CB6]/5 transition-colors">
                  Contact Seller
                </button>
                <button className="flex-1 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  View Other Items
                </button>
              </div>
            </div>

            {/* Share */}
            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#105CB6] transition-colors self-start">
              <Share2 size={14} />
              Share this listing
            </button>
          </motion.div>
        </div>

        {/* Tabbed section */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] mb-10 overflow-hidden"
        >
          {/* Tab nav */}
          <div className="flex border-b border-black/5">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-6 py-4 text-sm font-semibold transition-colors ${
                  activeTab === tab.key
                    ? "text-[#105CB6]"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#105CB6]"
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="px-6">
            <AnimatePresence mode="wait">
              {activeTab === "description" && (
                <motion.div key="description" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <DescriptionTab description={product.description} />
                </motion.div>
              )}
              {activeTab === "shipping" && (
                <motion.div key="shipping" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <ShippingTab />
                </motion.div>
              )}
              {activeTab === "feedback" && (
                <motion.div key="feedback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <FeedbackTab feedback={product.feedback} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Related products */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.h2 variants={fadeInUp} className="text-xl font-bold text-gray-900 mb-5">
            Similar Items You May Like
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((item) => (
              <motion.div
                key={item.id}
                variants={scaleIn}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] overflow-hidden group cursor-pointer"
              >
                <div className="aspect-square bg-gray-50 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://sm.pcmag.com/t/pcmag_me/review/a/apple-macb/apple-macbook-pro-14-inch-2023-m3-pro_w91x.1920.jpg";
                    }}
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500 mb-1">{item.condition}</p>
                  <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 mb-2">
                    {item.title}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-gray-900">
                      ${(item.price ?? 0).toFixed(2)}
                    </span>
                    {item.bids !== null && (
                      <span className="text-xs text-gray-500">{item.bids} bids</span>
                    )}
                  </div>
                  <p className="text-xs text-[#86B817] font-medium mt-1">
                    {item.shipping === "Free" ? "Free shipping" : `$${item.shipping} shipping`}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Bid modal */}
      <BidModal
        isOpen={bidModalOpen}
        onClose={() => setBidModalOpen(false)}
        currentBid={currentBid}
        onBid={handleBidPlaced}
      />
    </main>
  );
}