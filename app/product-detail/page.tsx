"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Heart, ShoppingCart, Star, Shield, Truck, RotateCcw, ChevronRight, ChevronLeft, Eye, Clock, MapPin, Award, ThumbsUp, Share2, Flag, Check, Plus, Minus, Zap } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { useTranslations } from "next-intl";

// ─── Inline mock data ────────────────────────────────────────────────────────

const product = {
  id: "1",
  title: "Apple MacBook Pro 14-inch M3 Pro Chip 512GB SSD Space Gray",
  subtitle: "Latest generation with Apple Silicon — sealed in original box",
  price: 1799.99,
  originalPrice: 1999.99,
  currentBid: 1650.0,
  bidCount: 23,
  isAuction: true,
  isBuyNow: true,
  buyNowPrice: 1799.99,
  condition: "New",
  conditionNote: "Brand new, sealed in original Apple packaging.",
  seller: "tech_deals_pro",
  sellerRating: 99.8,
  sellerSales: 4821,
  sellerJoined: "2011",
  location: "San Jose, CA",
  timeRemaining: "2d 4h 17m",
  shipping: "Free",
  shippingMethod: "FedEx 2-Day",
  estimatedDelivery: "Thu, Jun 12",
  returns: "30-day returns",
  watchCount: 142,
  viewCount: 3204,
  images: [
    "https://sm.pcmag.com/t/pcmag_me/review/a/apple-macb/apple-macbook-pro-14-inch-2023-m3-pro_w91x.1920.jpg",
    "/images/macbook-pro-keyboard-closeup.jpg",
    "/images/macbook-pro-side-profile.jpg",
    "/images/macbook-pro-open-display.jpg",
  ],
  specs: [
    { label: "Brand", value: "Apple" },
    { label: "Model", value: "MacBook Pro 14-inch (2023)" },
    { label: "Chip", value: "Apple M3 Pro" },
    { label: "Memory", value: "18GB Unified Memory" },
    { label: "Storage", value: "512GB SSD" },
    { label: "Display", value: '14.2" Liquid Retina XDR' },
    { label: "Battery", value: "Up to 18 hours" },
    { label: "Color", value: "Space Gray" },
    { label: "OS", value: "macOS Sonoma" },
    { label: "Ports", value: "3x Thunderbolt 4, HDMI, SD Card, MagSafe 3" },
  ],
  description: `Experience the power of Apple's M3 Pro chip in this stunning MacBook Pro 14-inch. Featuring a breathtaking Liquid Retina XDR display with ProMotion technology, this machine handles everything from everyday tasks to professional video editing with ease.

The M3 Pro chip delivers up to 40% faster CPU performance than the previous generation, with a 18-core GPU that accelerates graphics-intensive workflows. With 18GB of unified memory and a 512GB SSD, you get fast, responsive performance for demanding applications.

This unit is brand new, sealed in original Apple packaging with all accessories included: MagSafe 3 charging cable, 96W USB-C power adapter, and documentation.`,
  category: "Electronics",
  categoryPath: ["Electronics", "Computers & Tablets", "Laptops & Netbooks", "Apple Laptops"],
};

const reviews = [
  {
    id: "r1",
    author: "james_tech_buyer",
    rating: 5,
    date: "May 28, 2025",
    title: "Exactly as described, fast shipping",
    body: "Arrived sealed, exactly as listed. Seller communicated quickly and shipped same day. Highly recommend.",
    helpful: 14,
  },
  {
    id: "r2",
    author: "sarah_m_nyc",
    rating: 5,
    date: "May 15, 2025",
    title: "Great deal on a premium machine",
    body: "Got it for a great price compared to Apple Store. Packaging was perfect, no issues at all. The M3 Pro is incredibly fast.",
    helpful: 9,
  },
  {
    id: "r3",
    author: "devguru_2024",
    rating: 4,
    date: "Apr 30, 2025",
    title: "Solid purchase, minor delay in shipping",
    body: "Product is perfect. Shipping took one extra day but seller kept me updated. Would buy from again.",
    helpful: 6,
  },
];

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
    bids: 8,
  },
  {
    id: "r3",
    title: "Apple Magic Keyboard with Touch ID Space Gray",
    price: 89.99,
    image: "/images/apple-magic-keyboard-space-gray.jpg",
    condition: "New",
    shipping: "Free",
    bids: null,
  },
  {
    id: "r4",
    title: "Apple USB-C to MagSafe 3 Cable 2m",
    price: 34.99,
    image: "/images/apple-magsafe-cable.jpg",
    condition: "New",
    shipping: "Free",
    bids: null,
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? "text-[#F5AF02] fill-[#F5AF02]" : "text-gray-300 fill-gray-300"}
        />
      ))}
    </span>
  );
}

function ImageGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a === 0 ? images.length - 1 : a - 1));
  const next = () => setActive((a) => (a === images.length - 1 ? 0 : a + 1));

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-50 border border-black/5 aspect-[4/3] group">
        <motion.img
          key={active}
          src={images[active] ?? "https://sm.pcmag.com/t/pcmag_me/review/a/apple-macb/apple-macbook-pro-14-inch-2023-m3-pro_w91x.1920.jpg"}
          alt={`Product image ${active + 1}`}
          className="w-full h-full object-contain p-4"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "https://sm.pcmag.com/t/pcmag_me/review/a/apple-macb/apple-macbook-pro-14-inch-2023-m3-pro_w91x.1920.jpg";
          }}
        />
        {/* Nav arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200"
          aria-label="Previous image"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200"
          aria-label="Next image"
        >
          <ChevronRight size={18} />
        </button>
        {/* Counter */}
        <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {active + 1} / {images.length}
        </span>
      </div>
      {/* Thumbnails */}
      <div className="flex gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-xl overflow-hidden border-2 transition-all duration-200 flex-1 aspect-square bg-gray-50 ${
              active === i ? "border-[#105CB6]" : "border-transparent hover:border-gray-300"
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${i + 1}`}
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "https://sm.pcmag.com/t/pcmag_me/review/a/apple-macb/apple-macbook-pro-14-inch-2023-m3-pro_w91x.1920.jpg";
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function BidTimer({ timeRemaining }: { timeRemaining: string }) {
  return (
    <div className="flex items-center gap-2 text-[#E53238] font-semibold text-sm">
      <Clock size={15} className="flex-shrink-0" />
      <span>Ends in {timeRemaining}</span>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const t = useTranslations();
  const [quantity, setQuantity] = useState(1);
  const [watchlisted, setWatchlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [bidAmount, setBidAmount] = useState("");

  const incQty = () => setQuantity((q) => q + 1);
  const decQty = () => setQuantity((q) => Math.max(1, q - 1));

  const savings = product.originalPrice - product.buyNowPrice;
  const savingsPct = Math.round((savings / product.originalPrice) * 100);

  return (
    <main className="min-h-screen bg-[#F7F7F7]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <nav className="flex items-center gap-1 text-xs text-gray-500 flex-wrap">
            {product.categoryPath.map((crumb, i) => (
              <span key={crumb} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={12} />}
                <Link
                  href={i === 0 ? "/search" : `/search?category=${crumb.toLowerCase().replace(/\s+/g, "-")}`}
                  className="hover:text-[#105CB6] transition-colors"
                >
                  {crumb}
                </Link>
              </span>
            ))}
            <ChevronRight size={12} />
            <span className="text-gray-400 truncate max-w-[200px]">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6"
        >
          {/* Left column */}
          <div className="flex flex-col gap-6">
            {/* Image + info card */}
            <motion.div
              variants={fadeIn}
              className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gallery */}
                <ImageGallery images={product.images} />

                {/* Core info */}
                <div className="flex flex-col gap-4">
                  {/* Condition badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold bg-[#86B817]/10 text-[#86B817] px-2.5 py-1 rounded-full border border-[#86B817]/20">
                      {product.condition}
                    </span>
                    <span className="text-xs text-gray-500">{product.conditionNote}</span>
                  </div>

                  {/* Title */}
                  <h1 className="text-xl font-bold text-gray-900 leading-snug tracking-tight text-pretty">
                    {product.title}
                  </h1>

                  {/* Watch / view counts */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye size={13} /> {product.viewCount.toLocaleString("en-US")} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={13} /> {product.watchCount} watching
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="border-t border-black/5 pt-4">
                    {product.isAuction && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-0.5">Current bid</p>
                        <p className="text-3xl font-black text-gray-900">
                          ${(product.currentBid ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{product.bidCount} bids</p>
                        <BidTimer timeRemaining={product.timeRemaining ?? ""} />
                      </div>
                    )}
                    {product.isBuyNow && (
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-2xl font-bold text-gray-900">
                          ${(product.buyNowPrice ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          ${product.originalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs font-semibold text-[#E53238] bg-[#E53238]/10 px-2 py-0.5 rounded-full">
                          Save {savingsPct}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Shipping */}
                  <div className="flex flex-col gap-1.5 text-sm">
                    <div className="flex items-center gap-2 text-[#86B817] font-semibold">
                      <Truck size={15} />
                      <span>{product.shipping === "Free" ? "Free shipping" : `$${product.shipping} shipping`}</span>
                    </div>
                    <p className="text-xs text-gray-500 pl-5">
                      {product.shippingMethod} — Est. delivery {product.estimatedDelivery}
                    </p>
                    <div className="flex items-center gap-2 text-gray-600 text-xs pl-5">
                      <MapPin size={12} />
                      <span>Ships from {product.location}</span>
                    </div>
                  </div>

                  {/* Returns */}
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <RotateCcw size={13} className="text-[#105CB6]" />
                    <span>{product.returns} — Buyer pays return shipping</span>
                  </div>

                  {/* eBay Money Back */}
                  <div className="flex items-center gap-2 bg-[#105CB6]/5 border border-[#105CB6]/15 rounded-xl px-3 py-2.5">
                    <Shield size={16} className="text-[#105CB6] flex-shrink-0" />
                    <p className="text-xs text-[#105CB6] font-medium">
                      eBay Money Back Guarantee — Get the item you ordered or your money back.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tabs: Description / Specs / Reviews */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] overflow-hidden"
            >
              {/* Tab bar */}
              <div className="flex border-b border-black/5">
                {(["description", "specs", "reviews"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3.5 text-sm font-semibold capitalize transition-all duration-200 ${
                      activeTab === tab
                        ? "text-[#105CB6] border-b-2 border-[#105CB6] bg-[#105CB6]/3"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {tab === "reviews" ? `Reviews (${reviews.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="p-6">
                {activeTab === "description" && (
                  <motion.div
                    key="description"
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                  >
                    {product.description.split("\n\n").map((para, i) => (
                      <p key={i} className="mb-4 last:mb-0">
                        {para}
                      </p>
                    ))}
                  </motion.div>
                )}

                {activeTab === "specs" && (
                  <motion.div
                    key="specs"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y divide-black/5"
                  >
                    {product.specs.map((spec, i) => (
                      <motion.div
                        key={spec.label}
                        variants={fadeInUp}
                        className={`flex gap-4 py-3 ${i % 2 === 0 ? "sm:pr-6" : "sm:pl-6 sm:border-l sm:border-black/5"}`}
                      >
                        <span className="text-sm text-gray-500 w-28 flex-shrink-0">{spec.label}</span>
                        <span className="text-sm font-medium text-gray-900">{spec.value}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {activeTab === "reviews" && (
                  <motion.div
                    key="reviews"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col gap-5"
                  >
                    {reviews.map((review) => (
                      <motion.div
                        key={review.id}
                        variants={fadeInUp}
                        className="border border-black/5 rounded-xl p-4 hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-shadow duration-200"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{review.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <StarRating rating={review.rating} size={13} />
                              <span className="text-xs text-gray-500">by {review.author}</span>
                              <span className="text-xs text-gray-400">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#105CB6] transition-colors">
                            <ThumbsUp size={12} />
                            Helpful ({review.helpful})
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Related items */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">You might also like</h2>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
              >
                {relatedProducts.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={scaleIn}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <Link
                      href="/product-detail"
                      className="block bg-white rounded-xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] transition-all duration-300 overflow-hidden group"
                    >
                      <div className="aspect-square bg-gray-50 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "https://sm.pcmag.com/t/pcmag_me/review/a/apple-macb/apple-macbook-pro-14-inch-2023-m3-pro_w91x.1920.jpg";
                          }}
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-gray-800 font-medium line-clamp-2 leading-snug mb-1.5">
                          {item.title}
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                          ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-[#86B817] font-medium mt-0.5">
                          {item.shipping === "Free" ? "Free shipping" : `$${item.shipping}`}
                        </p>
                        {item.bids !== null && (
                          <p className="text-xs text-gray-500 mt-0.5">{item.bids} bids</p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Right column — Purchase panel */}
          <motion.div variants={fadeInUp} className="flex flex-col gap-4">
            {/* Buy / Bid card */}
            <div className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] p-5 sticky top-24">
              {/* Price summary */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-0.5">Buy It Now</p>
                <p className="text-3xl font-black text-gray-900">
                  ${(product.buyNowPrice ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Was{" "}
                  <span className="line-through">
                    ${product.originalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>{" "}
                  — Save ${savings.toLocaleString("en-US", { minimumFractionDigits: 2 })} ({savingsPct}% off)
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm text-gray-600">Qty:</span>
                <div className="flex items-center border border-black/10 rounded-lg overflow-hidden">
                  <button
                    onClick={decQty}
                    className="px-3 py-2 hover:bg-gray-50 transition-colors text-gray-600"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold border-x border-black/10 min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incQty}
                    className="px-3 py-2 hover:bg-gray-50 transition-colors text-gray-600"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="text-xs text-gray-400">10 available</span>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col gap-2.5 mb-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/checkout"
                    className="flex items-center justify-center gap-2 w-full bg-[#105CB6] hover:bg-[#0d4d9e] text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-[0_2px_8px_rgba(16,92,182,0.35)] hover:shadow-[0_4px_16px_rgba(16,92,182,0.45)] text-sm"
                  >
                    <Zap size={16} />
                    Buy It Now
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/cart"
                    className="flex items-center justify-center gap-2 w-full bg-[#F5AF02] hover:bg-[#e09e00] text-gray-900 font-bold py-3.5 rounded-xl transition-all duration-200 shadow-[0_2px_8px_rgba(245,175,2,0.30)] hover:shadow-[0_4px_16px_rgba(245,175,2,0.40)] text-sm"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setWatchlisted((w) => !w)}
                  className={`flex items-center justify-center gap-2 w-full border font-semibold py-3 rounded-xl transition-all duration-200 text-sm ${
                    watchlisted
                      ? "border-[#E53238] text-[#E53238] bg-[#E53238]/5"
                      : "border-black/15 text-gray-700 hover:border-[#E53238] hover:text-[#E53238]"
                  }`}
                >
                  <Heart size={15} className={watchlisted ? "fill-[#E53238]" : ""} />
                  {watchlisted ? "Watching" : "Add to Watchlist"}
                </motion.button>
              </div>

              {/* Auction section */}
              {product.isAuction && (
                <div className="border-t border-black/5 pt-4 mb-4">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Place a bid</p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={(product.currentBid + 25).toFixed(2)}
                        className="w-full pl-7 pr-3 py-2.5 border border-black/15 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6]"
                      />
                    </div>
                    <button className="bg-[#E53238] hover:bg-[#c92a2f] text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
                      Bid
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    Min. bid: ${(product.currentBid + 25).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                  <BidTimer timeRemaining={product.timeRemaining ?? ""} />
                </div>
              )}

              {/* Delivery info */}
              <div className="border-t border-black/5 pt-4 flex flex-col gap-2.5">
                <div className="flex items-start gap-2.5">
                  <Truck size={15} className="text-[#86B817] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-800">Free shipping</p>
                    <p className="text-xs text-gray-500">{product.shippingMethod} — Est. {product.estimatedDelivery}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <RotateCcw size={15} className="text-[#105CB6] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{product.returns}</p>
                    <p className="text-xs text-gray-500">Buyer pays return shipping</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Shield size={15} className="text-[#105CB6] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-800">eBay Money Back Guarantee</p>
                    <p className="text-xs text-gray-500">If item doesn't match description, get a full refund.</p>
                  </div>
                </div>
              </div>

              {/* Share / Report */}
              <div className="border-t border-black/5 pt-3 mt-3 flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#105CB6] transition-colors">
                  <Share2 size={13} /> Share
                </button>
                <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#E53238] transition-colors">
                  <Flag size={13} /> Report item
                </button>
              </div>
            </div>

            {/* Seller card */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] p-5"
            >
              <h3 className="text-sm font-bold text-gray-900 mb-3">Seller information</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#105CB6]/10 flex items-center justify-center text-[#105CB6] font-bold text-sm flex-shrink-0">
                  {product.seller.charAt(0).toUpperCase()}
                </div>
                <div>
                  <Link
                    href="/user-profile-my-ebay"
                    className="text-sm font-semibold text-[#105CB6] hover:underline"
                  >
                    {product.seller}
                  </Link>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <StarRating rating={5} size={11} />
                    <span className="text-xs text-gray-500">{product.sellerRating}% positive</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 text-xs text-gray-600 mb-3">
                <div className="flex items-center gap-2">
                  <Award size={12} className="text-[#F5AF02]" />
                  <span>{product.sellerSales.toLocaleString("en-US")} items sold</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={12} className="text-[#86B817]" />
                  <span>Member since {product.sellerJoined}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-gray-400" />
                  <span>{product.location}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 border border-black/15 text-gray-700 hover:border-[#105CB6] hover:text-[#105CB6] text-xs font-semibold py-2 rounded-lg transition-all duration-200">
                  Contact seller
                </button>
                <Link
                  href="/search"
                  className="flex-1 text-center border border-black/15 text-gray-700 hover:border-[#105CB6] hover:text-[#105CB6] text-xs font-semibold py-2 rounded-lg transition-all duration-200"
                >
                  See other items
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}