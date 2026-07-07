"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, ChevronDown, ChevronRight, Heart, Star, MapPin, Truck, Clock, Grid, List, X, Check, ArrowUpDown, Eye, Gavel, ShoppingCart, Filter } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { useTranslations } from "next-intl";

// ─── Mock Data ────────────────────────────────────────────────────────────────

interface SearchProduct {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  currentBid?: number;
  bidCount?: number;
  isAuction: boolean;
  isBuyNow: boolean;
  buyNowPrice?: number;
  image: string;
  category: string;
  condition: "New" | "Used" | "Refurbished" | "For Parts";
  seller: string;
  sellerRating: number;
  sellerReviews: number;
  location: string;
  timeRemaining?: string;
  shipping: number | "Free";
  watchCount: number;
  isWatched: boolean;
  sponsored?: boolean;
  returns: string;
  sold?: number;
}

const mockProducts: SearchProduct[] = [
  {
    id: "1",
    title: "Apple MacBook Pro 14-inch M3 Pro Chip 512GB SSD Space Gray 2023",
    price: 1799.99,
    currentBid: 1650.0,
    bidCount: 23,
    isAuction: true,
    isBuyNow: true,
    buyNowPrice: 1799.99,
    image: "https://sm.pcmag.com/t/pcmag_me/review/a/apple-macb/apple-macbook-pro-14-inch-2023-m3-pro_w91x.1920.jpg",
    category: "Electronics",
    condition: "New",
    seller: "tech_deals_pro",
    sellerRating: 99.8,
    sellerReviews: 4821,
    location: "San Jose, CA",
    timeRemaining: "2d 4h",
    shipping: "Free",
    watchCount: 142,
    isWatched: false,
    returns: "30-day returns",
    sold: 12,
  },
  {
    id: "2",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones Black",
    price: 279.99,
    originalPrice: 349.99,
    isAuction: false,
    isBuyNow: true,
    image: "https://m.media-amazon.com/images/I/61O3iMlnJIL._AC_UF894,1000_QL80_.jpg",
    category: "Electronics",
    condition: "New",
    seller: "audio_world_store",
    sellerRating: 98.5,
    sellerReviews: 2310,
    location: "New York, NY",
    shipping: "Free",
    watchCount: 89,
    isWatched: false,
    sponsored: true,
    returns: "30-day returns",
    sold: 47,
  },
  {
    id: "3",
    title: "Samsung 65-inch QLED 4K Smart TV QN65Q80C 2023 Model",
    price: 899.0,
    currentBid: 820.0,
    bidCount: 11,
    isAuction: true,
    isBuyNow: false,
    image: "/images/samsung-65-qled-tv.jpg",
    category: "Electronics",
    condition: "Refurbished",
    seller: "electronics_hub_usa",
    sellerRating: 97.2,
    sellerReviews: 1540,
    location: "Chicago, IL",
    timeRemaining: "5h 22m",
    shipping: 49.99,
    watchCount: 63,
    isWatched: false,
    returns: "No returns",
    sold: 3,
  },
  {
    id: "4",
    title: "Apple iPhone 15 Pro Max 256GB Natural Titanium Unlocked",
    price: 1099.0,
    originalPrice: 1199.0,
    isAuction: false,
    isBuyNow: true,
    image: "/images/iphone-15-pro-max-titanium.jpg",
    category: "Electronics",
    condition: "New",
    seller: "apple_reseller_official",
    sellerRating: 99.9,
    sellerReviews: 8920,
    location: "Austin, TX",
    shipping: "Free",
    watchCount: 215,
    isWatched: false,
    sponsored: true,
    returns: "30-day returns",
    sold: 88,
  },
  {
    id: "5",
    title: "Dell XPS 15 9530 Intel Core i9 32GB RAM 1TB SSD OLED Touch",
    price: 1450.0,
    currentBid: 1380.0,
    bidCount: 7,
    isAuction: true,
    isBuyNow: true,
    buyNowPrice: 1450.0,
    image: "/images/dell-xps-15-laptop-oled.jpg",
    category: "Electronics",
    condition: "Used",
    seller: "laptop_liquidators",
    sellerRating: 96.1,
    sellerReviews: 730,
    location: "Seattle, WA",
    timeRemaining: "1d 12h",
    shipping: "Free",
    watchCount: 54,
    isWatched: false,
    returns: "14-day returns",
    sold: 5,
  },
  {
    id: "6",
    title: "Nintendo Switch OLED Model White Joy-Con Console Bundle",
    price: 319.99,
    isAuction: false,
    isBuyNow: true,
    image: "/images/nintendo-switch-oled-white.jpg",
    category: "Electronics",
    condition: "New",
    seller: "gaming_paradise_store",
    sellerRating: 98.9,
    sellerReviews: 3450,
    location: "Los Angeles, CA",
    shipping: "Free",
    watchCount: 178,
    isWatched: false,
    returns: "30-day returns",
    sold: 62,
  },
  {
    id: "7",
    title: "Bose QuietComfort 45 Bluetooth Wireless Headphones Triple Black",
    price: 199.0,
    originalPrice: 329.0,
    isAuction: false,
    isBuyNow: true,
    image: "/images/bose-quietcomfort-45-headphones.jpg",
    category: "Electronics",
    condition: "Refurbished",
    seller: "certified_audio_deals",
    sellerRating: 97.8,
    sellerReviews: 1120,
    location: "Miami, FL",
    shipping: "Free",
    watchCount: 91,
    isWatched: false,
    returns: "30-day returns",
    sold: 29,
  },
  {
    id: "8",
    title: "GoPro HERO12 Black Action Camera 5.3K Video Waterproof Bundle",
    price: 349.99,
    currentBid: 310.0,
    bidCount: 15,
    isAuction: true,
    isBuyNow: true,
    buyNowPrice: 349.99,
    image: "/images/gopro-hero12-black-camera.jpg",
    category: "Electronics",
    condition: "New",
    seller: "adventure_gear_co",
    sellerRating: 99.1,
    sellerReviews: 2200,
    location: "Denver, CO",
    timeRemaining: "3d 8h",
    shipping: 9.99,
    watchCount: 77,
    isWatched: false,
    returns: "30-day returns",
    sold: 18,
  },
  {
    id: "9",
    title: "LG 27-inch 4K UHD IPS Monitor 27UK850-W USB-C HDR10",
    price: 329.0,
    originalPrice: 449.0,
    isAuction: false,
    isBuyNow: true,
    image: "/images/lg-27-4k-monitor-usbc.jpg",
    category: "Electronics",
    condition: "Used",
    seller: "monitor_megastore",
    sellerRating: 95.4,
    sellerReviews: 890,
    location: "Phoenix, AZ",
    shipping: 29.99,
    watchCount: 43,
    isWatched: false,
    returns: "14-day returns",
    sold: 9,
  },
  {
    id: "10",
    title: "Logitech MX Master 3S Wireless Mouse Graphite 8K DPI Quiet",
    price: 79.99,
    isAuction: false,
    isBuyNow: true,
    image: "/images/logitech-mx-master-3s-mouse.jpg",
    category: "Electronics",
    condition: "New",
    seller: "peripherals_plus",
    sellerRating: 99.3,
    sellerReviews: 5670,
    location: "Portland, OR",
    shipping: "Free",
    watchCount: 134,
    isWatched: false,
    sponsored: true,
    returns: "30-day returns",
    sold: 203,
  },
  {
    id: "11",
    title: "iPad Pro 12.9-inch M2 Chip 256GB Wi-Fi Space Gray 6th Gen",
    price: 999.0,
    currentBid: 940.0,
    bidCount: 19,
    isAuction: true,
    isBuyNow: false,
    image: "/images/ipad-pro-12-m2-space-gray.jpg",
    category: "Electronics",
    condition: "New",
    seller: "apple_deals_direct",
    sellerRating: 99.6,
    sellerReviews: 6100,
    location: "San Francisco, CA",
    timeRemaining: "6h 45m",
    shipping: "Free",
    watchCount: 198,
    isWatched: false,
    returns: "30-day returns",
    sold: 7,
  },
  {
    id: "12",
    title: "Dyson V15 Detect Absolute Cordless Vacuum Cleaner Yellow",
    price: 549.99,
    originalPrice: 749.99,
    isAuction: false,
    isBuyNow: true,
    image: "/images/dyson-v15-detect-vacuum.jpg",
    category: "Home & Garden",
    condition: "New",
    seller: "home_essentials_shop",
    sellerRating: 98.2,
    sellerReviews: 3300,
    location: "Boston, MA",
    shipping: "Free",
    watchCount: 112,
    isWatched: false,
    returns: "30-day returns",
    sold: 34,
  },
];

const SORT_OPTIONS = [
  { value: "best_match", label: "Best Match" },
  { value: "price_asc", label: "Price: Lowest First" },
  { value: "price_desc", label: "Price: Highest First" },
  { value: "ending_soonest", label: "Time: Ending Soonest" },
  { value: "newly_listed", label: "Newly Listed" },
  { value: "most_watched", label: "Most Watched" },
];

const CONDITION_OPTIONS = ["New", "Used", "Refurbished", "For Parts"];
const SHIPPING_OPTIONS = ["Free Shipping", "Local Pickup", "Expedited Shipping"];
const BUYING_FORMAT = ["All Listings", "Auction", "Buy It Now", "Accepts Offers"];
const ITEM_LOCATION = ["US Only", "North America", "Worldwide"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ConditionBadge({ condition }: { condition: SearchProduct["condition"] }) {
  const colors: Record<string, string> = {
    New: "bg-green-100 text-green-700",
    Used: "bg-yellow-100 text-yellow-700",
    Refurbished: "bg-blue-100 text-blue-700",
    "For Parts": "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[condition] ?? "bg-gray-100 text-gray-600"}`}>
      {condition}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={10}
          className={i <= Math.round(rating / 20) ? "fill-[#F5AF02] text-[#F5AF02]" : "text-gray-300"}
        />
      ))}
    </span>
  );
}

interface ProductCardGridProps {
  product: SearchProduct;
  onToggleWatch: (id: string) => void;
}

function ProductCardGrid({ product, onToggleWatch }: ProductCardGridProps) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -4, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-xl border border-black/5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden group flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {product.sponsored && (
          <span className="absolute top-2 left-2 z-10 text-[10px] text-gray-500 bg-white/90 px-1.5 py-0.5 rounded border border-black/5">
            Sponsored
          </span>
        )}
        <Link href={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <button
          onClick={() => onToggleWatch(product.id)}
          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          aria-label={product.isWatched ? "Remove from watchlist" : "Add to watchlist"}
        >
          <Heart
            size={15}
            className={product.isWatched ? "fill-[#E53238] text-[#E53238]" : "text-gray-400"}
          />
        </button>
        {product.isAuction && product.timeRemaining && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 text-white text-[10px] px-2 py-1 rounded-full">
            <Clock size={9} />
            {product.timeRemaining}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <Link href={`/product/${product.id}`} className="block mb-2">
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug hover:text-[#105CB6] transition-colors">
            {product.title}
          </h3>
        </Link>

        <ConditionBadge condition={product.condition} />

        <div className="mt-2 flex-1">
          {product.isAuction && product.currentBid != null ? (
            <div>
              <p className="text-xs text-gray-500">Current bid</p>
              <p className="text-lg font-bold text-gray-900">
                ${(product.currentBid ?? 0).toFixed(2)}
              </p>
              <p className="text-xs text-gray-400">{product.bidCount ?? 0} bids</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-bold text-gray-900">
                ${(product.price ?? 0).toFixed(2)}
              </p>
              {product.originalPrice != null && (
                <p className="text-xs text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Truck size={11} />
            <span>{product.shipping === "Free" ? "Free shipping" : `+$${product.shipping} shipping`}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin size={11} />
            <span>{product.location}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <StarRating rating={product.sellerRating} />
            <span className="text-[10px] text-gray-400">({(product.sellerReviews ?? 0).toLocaleString("en-US")})</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <Eye size={10} />
            {product.watchCount}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="mt-3 w-full py-2 rounded-full text-sm font-semibold bg-[#105CB6] text-white hover:bg-[#0d4d9e] transition-colors"
        >
          {product.isAuction ? "Place Bid" : "Buy It Now"}
        </motion.button>
      </div>
    </motion.div>
  );
}

interface ProductCardListProps {
  product: SearchProduct;
  onToggleWatch: (id: string) => void;
}

function ProductCardList({ product, onToggleWatch }: ProductCardListProps) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ x: 2, boxShadow: "0 4px_20px rgba(0,0,0,0.08)" }}
      className="bg-white rounded-xl border border-black/5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden flex gap-0"
    >
      {/* Image */}
      <div className="relative w-44 flex-shrink-0 bg-gray-50">
        {product.sponsored && (
          <span className="absolute top-2 left-2 z-10 text-[10px] text-gray-500 bg-white/90 px-1.5 py-0.5 rounded border border-black/5">
            Sponsored
          </span>
        )}
        <Link href={`/product/${product.id}`} className="block h-full">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
            style={{ minHeight: "160px", maxHeight: "180px" }}
          />
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link href={`/product/${product.id}`}>
              <h3 className="text-sm font-semibold text-gray-800 hover:text-[#105CB6] transition-colors leading-snug line-clamp-2">
                {product.title}
              </h3>
            </Link>
            <button
              onClick={() => onToggleWatch(product.id)}
              className="flex-shrink-0 w-8 h-8 rounded-full border border-black/5 flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label={product.isWatched ? "Remove from watchlist" : "Add to watchlist"}
            >
              <Heart
                size={14}
                className={product.isWatched ? "fill-[#E53238] text-[#E53238]" : "text-gray-400"}
              />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-1.5">
            <ConditionBadge condition={product.condition} />
            {product.sold != null && (
              <span className="text-[10px] text-gray-400">{product.sold} sold</span>
            )}
          </div>
        </div>

        <div className="flex items-end justify-between mt-3">
          <div>
            {product.isAuction && product.currentBid != null ? (
              <div>
                <p className="text-xs text-gray-500">Current bid</p>
                <p className="text-xl font-bold text-gray-900">
                  ${(product.currentBid ?? 0).toFixed(2)}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <Gavel size={11} />
                  <span>{product.bidCount ?? 0} bids</span>
                  {product.timeRemaining && (
                    <>
                      <span>·</span>
                      <Clock size={11} />
                      <span>{product.timeRemaining} left</span>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xl font-bold text-gray-900">
                  ${(product.price ?? 0).toFixed(2)}
                </p>
                {product.originalPrice != null && (
                  <p className="text-xs text-gray-400">
                    Was{" "}
                    <span className="line-through">${product.originalPrice.toFixed(2)}</span>
                    {" "}
                    <span className="text-green-600 font-medium">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                    </span>
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Truck size={11} />
                {product.shipping === "Free" ? "Free shipping" : `+$${product.shipping} shipping`}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={11} />
                {product.location}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1.5">
              <StarRating rating={product.sellerRating} />
              <span className="text-[10px] text-gray-500">
                {product.seller} ({(product.sellerReviews ?? 0).toLocaleString("en-US")})
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2 rounded-full text-sm font-semibold bg-[#105CB6] text-white hover:bg-[#0d4d9e] transition-colors whitespace-nowrap"
            >
              {product.isAuction ? "Place Bid" : "Buy It Now"}
            </motion.button>
            {product.isBuyNow && product.isAuction && product.buyNowPrice != null && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2 rounded-full text-sm font-semibold border border-[#105CB6] text-[#105CB6] hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                Buy Now ${product.buyNowPrice.toFixed(2)}
              </motion.button>
            )}
            <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#E53238] transition-colors">
              <ShoppingCart size={12} />
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

interface FilterSidebarProps {
  selectedConditions: string[];
  onToggleCondition: (c: string) => void;
  selectedShipping: string[];
  onToggleShipping: (s: string) => void;
  selectedFormat: string;
  onSetFormat: (f: string) => void;
  priceMin: string;
  priceMax: string;
  onPriceMin: (v: string) => void;
  onPriceMax: (v: string) => void;
  selectedLocation: string;
  onSetLocation: (l: string) => void;
  onClearAll: () => void;
}

function FilterSidebar({
  selectedConditions,
  onToggleCondition,
  selectedShipping,
  onToggleShipping,
  selectedFormat,
  onSetFormat,
  priceMin,
  priceMax,
  onPriceMin,
  onPriceMax,
  selectedLocation,
  onSetLocation,
  onClearAll,
}: FilterSidebarProps) {
  const [conditionOpen, setConditionOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [shippingOpen, setShippingOpen] = useState(true);
  const [formatOpen, setFormatOpen] = useState(true);
  const [locationOpen, setLocationOpen] = useState(false);

  return (
    <aside className="w-56 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800 text-sm">Filter Results</h2>
        <button
          onClick={onClearAll}
          className="text-xs text-[#105CB6] hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Buying Format */}
      <div className="mb-5">
        <button
          onClick={() => setFormatOpen((v) => !v)}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-2"
        >
          Buying Format
          <ChevronDown size={14} className={`transition-transform ${formatOpen ? "rotate-180" : ""}`} />
        </button>
        {formatOpen && (
          <div className="space-y-1.5">
            {BUYING_FORMAT.map((f) => (
              <button
                key={f}
                onClick={() => onSetFormat(f)}
                className={`flex items-center gap-2 w-full text-left text-xs px-2 py-1.5 rounded-lg transition-colors ${
                  selectedFormat === f
                    ? "bg-blue-50 text-[#105CB6] font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {selectedFormat === f && <Check size={11} className="text-[#105CB6]" />}
                {selectedFormat !== f && <span className="w-[11px]" />}
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-black/5 mb-5" />

      {/* Condition */}
      <div className="mb-5">
        <button
          onClick={() => setConditionOpen((v) => !v)}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-2"
        >
          Condition
          <ChevronDown size={14} className={`transition-transform ${conditionOpen ? "rotate-180" : ""}`} />
        </button>
        {conditionOpen && (
          <div className="space-y-1.5">
            {CONDITION_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => onToggleCondition(c)}
                className={`flex items-center gap-2 w-full text-left text-xs px-2 py-1.5 rounded-lg transition-colors ${
                  selectedConditions.includes(c)
                    ? "bg-blue-50 text-[#105CB6] font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${
                    selectedConditions.includes(c)
                      ? "bg-[#105CB6] border-[#105CB6]"
                      : "border-gray-300"
                  }`}
                >
                  {selectedConditions.includes(c) && <Check size={9} className="text-white" />}
                </span>
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-black/5 mb-5" />

      {/* Price Range */}
      <div className="mb-5">
        <button
          onClick={() => setPriceOpen((v) => !v)}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-2"
        >
          Price
          <ChevronDown size={14} className={`transition-transform ${priceOpen ? "rotate-180" : ""}`} />
        </button>
        {priceOpen && (
          <div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => onPriceMin(e.target.value)}
                  className="w-full pl-5 pr-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#105CB6]"
                />
              </div>
              <span className="text-gray-400 text-xs">to</span>
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => onPriceMax(e.target.value)}
                  className="w-full pl-5 pr-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#105CB6]"
                />
              </div>
            </div>
            <button className="mt-2 w-full py-1.5 text-xs font-medium text-[#105CB6] border border-[#105CB6] rounded-lg hover:bg-blue-50 transition-colors">
              Apply
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-black/5 mb-5" />

      {/* Shipping */}
      <div className="mb-5">
        <button
          onClick={() => setShippingOpen((v) => !v)}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-2"
        >
          Shipping Options
          <ChevronDown size={14} className={`transition-transform ${shippingOpen ? "rotate-180" : ""}`} />
        </button>
        {shippingOpen && (
          <div className="space-y-1.5">
            {SHIPPING_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => onToggleShipping(s)}
                className={`flex items-center gap-2 w-full text-left text-xs px-2 py-1.5 rounded-lg transition-colors ${
                  selectedShipping.includes(s)
                    ? "bg-blue-50 text-[#105CB6] font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${
                    selectedShipping.includes(s)
                      ? "bg-[#105CB6] border-[#105CB6]"
                      : "border-gray-300"
                  }`}
                >
                  {selectedShipping.includes(s) && <Check size={9} className="text-white" />}
                </span>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-black/5 mb-5" />

      {/* Item Location */}
      <div className="mb-5">
        <button
          onClick={() => setLocationOpen((v) => !v)}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-2"
        >
          Item Location
          <ChevronDown size={14} className={`transition-transform ${locationOpen ? "rotate-180" : ""}`} />
        </button>
        {locationOpen && (
          <div className="space-y-1.5">
            {ITEM_LOCATION.map((l) => (
              <button
                key={l}
                onClick={() => onSetLocation(l)}
                className={`flex items-center gap-2 w-full text-left text-xs px-2 py-1.5 rounded-lg transition-colors ${
                  selectedLocation === l
                    ? "bg-blue-50 text-[#105CB6] font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {selectedLocation === l && <Check size={11} className="text-[#105CB6]" />}
                {selectedLocation !== l && <span className="w-[11px]" />}
                {l}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SearchResultsPage() {
  const t = useTranslations();

  // View state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("best_match");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter state
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState("All Listings");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("US Only");

  // Products state (for watchlist toggling)
  const [products, setProducts] = useState<SearchProduct[]>(mockProducts);

  const [searchInput, setSearchInput] = useState("Electronics");

  const toggleWatch = useCallback((id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isWatched: !p.isWatched } : p))
    );
  }, []);

  const toggleCondition = useCallback((c: string) => {
    setSelectedConditions((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }, []);

  const toggleShipping = useCallback((s: string) => {
    setSelectedShipping((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }, []);

  const clearAll = useCallback(() => {
    setSelectedConditions([]);
    setSelectedShipping([]);
    setSelectedFormat("All Listings");
    setPriceMin("");
    setPriceMax("");
    setSelectedLocation("US Only");
  }, []);

  // Filtered + sorted products
  const filteredProducts = products.filter((p) => {
    if (selectedConditions.length > 0 && !selectedConditions.includes(p.condition)) return false;
    if (selectedFormat === "Auction" && !p.isAuction) return false;
    if (selectedFormat === "Buy It Now" && !p.isBuyNow) return false;
    if (selectedShipping.includes("Free Shipping") && p.shipping !== "Free") return false;
    const minVal = parseFloat(priceMin);
    const maxVal = parseFloat(priceMax);
    const effectivePrice = p.currentBid ?? p.price;
    if (!isNaN(minVal) && effectivePrice < minVal) return false;
    if (!isNaN(maxVal) && effectivePrice > maxVal) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price_asc") return (a.currentBid ?? a.price) - (b.currentBid ?? b.price);
    if (sortBy === "price_desc") return (b.currentBid ?? b.price) - (a.currentBid ?? a.price);
    if (sortBy === "most_watched") return b.watchCount - a.watchCount;
    return 0;
  });

  const activeFilterCount =
    selectedConditions.length +
    selectedShipping.length +
    (selectedFormat !== "All Listings" ? 1 : 0) +
    (priceMin || priceMax ? 1 : 0);

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Best Match";

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Search bar strip */}
      <div className="bg-white border-b border-black/5 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="flex items-center gap-2 max-w-2xl"
          >
            <div className="flex-1 flex items-center border border-gray-300 rounded-full overflow-hidden focus-within:border-[#105CB6] transition-colors bg-white">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for anything"
                className="flex-1 px-4 py-2 text-sm outline-none bg-transparent"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#105CB6] text-white flex items-center justify-center hover:bg-[#0d4d9e] transition-colors"
              >
                <Search size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <motion.nav
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-1.5 text-xs text-gray-500 mb-4"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-[#105CB6] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/search" className="hover:text-[#105CB6] transition-colors">Electronics</Link>
          <ChevronRight size={12} />
          <span className="text-gray-700 font-medium">Search Results</span>
        </motion.nav>

        {/* Page heading + result count */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-5"
        >
          <h1 className="text-xl font-bold text-gray-900">
            Results for &ldquo;{searchInput}&rdquo;
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {sortedProducts.length.toLocaleString("en-US")} results found
          </p>
        </motion.div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-2 mb-4"
          >
            {selectedConditions.map((c) => (
              <button
                key={c}
                onClick={() => toggleCondition(c)}
                className="flex items-center gap-1.5 text-xs bg-blue-50 text-[#105CB6] px-3 py-1 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
              >
                {c} <X size={11} />
              </button>
            ))}
            {selectedShipping.map((s) => (
              <button
                key={s}
                onClick={() => toggleShipping(s)}
                className="flex items-center gap-1.5 text-xs bg-blue-50 text-[#105CB6] px-3 py-1 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
              >
                {s} <X size={11} />
              </button>
            ))}
            {selectedFormat !== "All Listings" && (
              <button
                onClick={() => setSelectedFormat("All Listings")}
                className="flex items-center gap-1.5 text-xs bg-blue-50 text-[#105CB6] px-3 py-1 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
              >
                {selectedFormat} <X size={11} />
              </button>
            )}
            {(priceMin || priceMax) && (
              <button
                onClick={() => { setPriceMin(""); setPriceMax(""); }}
                className="flex items-center gap-1.5 text-xs bg-blue-50 text-[#105CB6] px-3 py-1 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
              >
                ${priceMin || "0"} – ${priceMax || "any"} <X size={11} />
              </button>
            )}
            <button
              onClick={clearAll}
              className="text-xs text-gray-500 hover:text-[#E53238] transition-colors underline"
            >
              Clear all
            </button>
          </motion.div>
        )}

        <div className="flex gap-6">
          {/* Sidebar — desktop */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            animate="visible"
            className="hidden lg:block"
          >
            <FilterSidebar
              selectedConditions={selectedConditions}
              onToggleCondition={toggleCondition}
              selectedShipping={selectedShipping}
              onToggleShipping={toggleShipping}
              selectedFormat={selectedFormat}
              onSetFormat={setSelectedFormat}
              priceMin={priceMin}
              priceMax={priceMax}
              onPriceMin={setPriceMin}
              onPriceMax={setPriceMax}
              selectedLocation={selectedLocation}
              onSetLocation={setSelectedLocation}
              onClearAll={clearAll}
            />
          </motion.div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
              >
                <Filter size={14} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-[#105CB6] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort */}
              <div className="relative ml-auto">
                <button
                  onClick={() => setSortDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 text-sm text-gray-700 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <ArrowUpDown size={13} />
                  Sort: <span className="font-medium">{currentSortLabel}</span>
                  <ChevronDown size={13} className={`transition-transform ${sortDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {sortDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl border border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-30 overflow-hidden"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setSortBy(opt.value); setSortDropdownOpen(false); }}
                          className={`flex items-center justify-between w-full text-left px-4 py-2.5 text-sm transition-colors ${
                            sortBy === opt.value
                              ? "bg-blue-50 text-[#105CB6] font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {opt.label}
                          {sortBy === opt.value && <Check size={13} />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* View toggle */}
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${viewMode === "grid" ? "bg-[#105CB6] text-white" : "text-gray-500 hover:bg-gray-50"}`}
                  aria-label="Grid view"
                >
                  <Grid size={14} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${viewMode === "list" ? "bg-[#105CB6] text-white" : "text-gray-500 hover:bg-gray-50"}`}
                  aria-label="List view"
                >
                  <List size={14} />
                </button>
              </div>
            </div>

            {/* Results */}
            {sortedProducts.length === 0 ? (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="text-center py-24"
              >
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-lg font-semibold text-gray-700 mb-2">No results found</h2>
                <p className="text-sm text-gray-500 mb-6">Try adjusting your filters or search for something else.</p>
                <button
                  onClick={clearAll}
                  className="px-6 py-2.5 rounded-full bg-[#105CB6] text-white text-sm font-semibold hover:bg-[#0d4d9e] transition-colors"
                >
                  Clear all filters
                </button>
              </motion.div>
            ) : viewMode === "grid" ? (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {sortedProducts.map((product) => (
                  <ProductCardGrid
                    key={product.id}
                    product={product}
                    onToggleWatch={toggleWatch}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-3"
              >
                {sortedProducts.map((product) => (
                  <ProductCardList
                    key={product.id}
                    product={product}
                    onToggleWatch={toggleWatch}
                  />
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {sortedProducts.length > 0 && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-center justify-center gap-2 mt-10"
              >
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                      page === 1
                        ? "bg-[#105CB6] text-white"
                        : "text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="w-9 h-9 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 border border-gray-200 flex items-center justify-center">
                  <ChevronRight size={14} />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 overflow-y-auto p-5 shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-900">Filters</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
              <FilterSidebar
                selectedConditions={selectedConditions}
                onToggleCondition={toggleCondition}
                selectedShipping={selectedShipping}
                onToggleShipping={toggleShipping}
                selectedFormat={selectedFormat}
                onSetFormat={setSelectedFormat}
                priceMin={priceMin}
                priceMax={priceMax}
                onPriceMin={setPriceMin}
                onPriceMax={setPriceMax}
                selectedLocation={selectedLocation}
                onSetLocation={setSelectedLocation}
                onClearAll={clearAll}
              />
              <button
                onClick={() => setSidebarOpen(false)}
                className="mt-4 w-full py-3 rounded-full bg-[#105CB6] text-white font-semibold text-sm hover:bg-[#0d4d9e] transition-colors"
              >
                Show {sortedProducts.length} results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Missing import for slideInLeft ──────────────────────────────────────────
// (imported at top from @/lib/motion — already present above)