"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, ShoppingCart, Bell, BellOff, Eye, Filter, ChevronDown, ArrowUpDown, Star, Clock, Tag, Search, X } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { useTranslations } from "next-intl";

interface WatchItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  currentBid?: number;
  bidCount?: number;
  isAuction: boolean;
  image: string;
  condition: string;
  seller: string;
  sellerRating: number;
  timeRemaining?: string;
  shipping: number | string;
  watchCount: number;
  category: string;
  alertEnabled: boolean;
  addedDate: string;
  status: "active" | "ending-soon" | "ended" | "sold";
}

const mockWatchlist: WatchItem[] = [
  {
    id: "w1",
    title: "Apple MacBook Pro 14-inch M3 Pro 512GB Space Gray",
    price: 1799.99,
    currentBid: 1650.00,
    bidCount: 23,
    isAuction: true,
    image: "https://sm.pcmag.com/t/pcmag_me/review/a/apple-macb/apple-macbook-pro-14-inch-2023-m3-pro_w91x.1920.jpg",
    condition: "New",
    seller: "tech_deals_pro",
    sellerRating: 99.8,
    timeRemaining: "2d 4h",
    shipping: "Free",
    watchCount: 142,
    category: "Electronics",
    alertEnabled: true,
    addedDate: "Dec 10, 2024",
    status: "active",
  },
  {
    id: "w2",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones Black",
    price: 279.99,
    originalPrice: 349.99,
    isAuction: false,
    image: "https://m.media-amazon.com/images/I/61O3iMlnJIL._AC_UF894,1000_QL80_.jpg",
    condition: "New",
    seller: "sony_official_store",
    sellerRating: 100,
    shipping: "Free",
    watchCount: 89,
    category: "Electronics",
    alertEnabled: false,
    addedDate: "Dec 8, 2024",
    status: "active",
  },
  {
    id: "w3",
    title: "Vintage Rolex Submariner 1680 Red Writing Tropical Dial 1970s",
    price: 18500.00,
    currentBid: 17200.00,
    bidCount: 41,
    isAuction: true,
    image: "https://collectorscornerny.com/cdn/shop/files/rolex-submariner-1680-tropical-red-sub-vintage-watches-collectors-corner-ny_2000x.jpg?v=1741276383",
    condition: "Used",
    seller: "luxury_timepieces_ny",
    sellerRating: 98.7,
    timeRemaining: "0d 3h",
    shipping: 25,
    watchCount: 312,
    category: "Collectibles",
    alertEnabled: true,
    addedDate: "Dec 5, 2024",
    status: "ending-soon",
  },
  {
    id: "w4",
    title: "Nike Air Jordan 1 Retro High OG Chicago Lost and Found Size 10",
    price: 420.00,
    isAuction: false,
    image: "https://picsum.photos/seed/cb53363835ae/800/600",
    condition: "New",
    seller: "sneaker_vault_official",
    sellerRating: 99.2,
    shipping: "Free",
    watchCount: 567,
    category: "Fashion",
    alertEnabled: true,
    addedDate: "Dec 3, 2024",
    status: "active",
  },
  {
    id: "w5",
    title: "LEGO Technic Bugatti Chiron 42083 Complete Set with Box",
    price: 289.99,
    currentBid: 245.00,
    bidCount: 15,
    isAuction: true,
    image: "https://m.media-amazon.com/images/I/91M+Wu21lzL._AC_UF894,1000_QL80_.jpg",
    condition: "Used",
    seller: "brick_collector_uk",
    sellerRating: 97.5,
    timeRemaining: "4d 12h",
    shipping: 12,
    watchCount: 78,
    category: "Toys",
    alertEnabled: false,
    addedDate: "Nov 28, 2024",
    status: "active",
  },
  {
    id: "w6",
    title: "Canon EOS R5 Mirrorless Camera Body Only 45MP Full Frame",
    price: 2899.00,
    isAuction: false,
    image: "https://content.abt.com/image.php/4f99a48ed93890932b0e789e025d8b3d?image=/images/products/BDP_Images/big-EOSR5-BODY.jpg&ck=2&width=750&height=550&canvas",
    condition: "Refurbished",
    seller: "camera_world_pro",
    sellerRating: 99.1,
    shipping: "Free",
    watchCount: 203,
    category: "Electronics",
    alertEnabled: false,
    addedDate: "Nov 25, 2024",
    status: "ended",
  },
  {
    id: "w7",
    title: "Patagonia Down Sweater Hoody Men's Medium Forge Grey",
    price: 95.00,
    originalPrice: 229.00,
    isAuction: false,
    image: "/images/patagonia-down-sweater-hoody.jpg",
    condition: "Used",
    seller: "outdoor_gear_resale",
    sellerRating: 98.3,
    shipping: 8,
    watchCount: 44,
    category: "Fashion",
    alertEnabled: false,
    addedDate: "Nov 20, 2024",
    status: "sold",
  },
  {
    id: "w8",
    title: "Dyson V15 Detect Absolute Cordless Vacuum Cleaner Gold",
    price: 649.99,
    currentBid: 580.00,
    bidCount: 9,
    isAuction: true,
    image: "/images/dyson-v15-detect-vacuum.jpg",
    condition: "New",
    seller: "dyson_authorized_reseller",
    sellerRating: 99.6,
    timeRemaining: "1d 8h",
    shipping: "Free",
    watchCount: 91,
    category: "Home & Garden",
    alertEnabled: true,
    addedDate: "Nov 18, 2024",
    status: "ending-soon",
  },
];

const SORT_OPTIONS = [
  { value: "date-added", label: "Date Added" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "ending-soon", label: "Ending Soonest" },
  { value: "most-watched", label: "Most Watched" },
];

const STATUS_FILTERS = [
  { value: "all", label: "All Items" },
  { value: "active", label: "Active" },
  { value: "ending-soon", label: "Ending Soon" },
  { value: "ended", label: "Ended" },
  { value: "sold", label: "Sold" },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "#86B817", bg: "#f0f9e8" },
  "ending-soon": { label: "Ending Soon", color: "#E53238", bg: "#fef2f2" },
  ended: { label: "Ended", color: "#6b7280", bg: "#f3f4f6" },
  sold: { label: "Sold", color: "#F5AF02", bg: "#fffbeb" },
};

export default function WatchlistPage() {
  const t = useTranslations();
  const [items, setItems] = useState<WatchItem[]>(mockWatchlist);
  const [sortBy, setSortBy] = useState("date-added");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const toggleAlert = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, alertEnabled: !item.alertEnabled } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const removeSelected = () => {
    setItems((prev) => prev.filter((item) => !selectedIds.has(item.id)));
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map((i) => i.id)));
    }
  };

  const filtered = items.filter((item) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredItems = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "most-watched") return b.watchCount - a.watchCount;
    if (sortBy === "ending-soon") {
      const aEnding = a.timeRemaining ? 1 : 0;
      const bEnding = b.timeRemaining ? 1 : 0;
      return bEnding - aEnding;
    }
    return 0;
  });

  const activeCount = items.filter((i) => i.status === "active").length;
  const endingSoonCount = items.filter((i) => i.status === "ending-soon").length;
  const auctionCount = items.filter((i) => i.isAuction).length;

  return (
    <main className="min-h-screen bg-[#F7F7F7]">
      {/* Page Header */}
      <div className="bg-white border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl font-bold text-[#333333] tracking-tight">
                Watchlist
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {items.length} {items.length === 1 ? "item" : "items"} saved
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/search"
                className="flex items-center gap-2 px-4 py-2 border border-[#105CB6] text-[#105CB6] rounded-full text-sm font-medium hover:bg-[#105CB6] hover:text-white transition-all duration-200"
              >
                <Search size={14} />
                Find More Items
              </Link>
            </div>
          </motion.div>

          {/* Stat Pills */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-3 mt-5"
          >
            {[
              { label: "Active Listings", value: activeCount, color: "#86B817", bg: "#f0f9e8" },
              { label: "Ending Soon", value: endingSoonCount, color: "#E53238", bg: "#fef2f2" },
              { label: "Auctions", value: auctionCount, color: "#105CB6", bg: "#eff6ff" },
              { label: "Total Saved", value: items.length, color: "#F5AF02", bg: "#fffbeb" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={scaleIn}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{ backgroundColor: stat.bg, color: stat.color }}
              >
                <span className="font-bold text-base">{stat.value}</span>
                <span>{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Toolbar */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)] p-4 mb-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your watchlist..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#105CB6]/20 focus:border-[#105CB6] transition-all"
            />
            {searchQuery !== "" && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setFilterDropdownOpen(!filterDropdownOpen);
                  setSortDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-full hover:border-gray-300 transition-all bg-white"
              >
                <Filter size={13} className="text-gray-500" />
                <span className="text-gray-700">
                  {STATUS_FILTERS.find((f) => f.value === statusFilter)?.label ?? "All Items"}
                </span>
                <ChevronDown size={12} className="text-gray-400" />
              </button>
              <AnimatePresence>
                {filterDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-1 right-0 bg-white border border-black/8 rounded-xl shadow-[0_8px_24px_-8px_rgba(0,0,0,0.15)] z-20 min-w-[160px] py-1 overflow-hidden"
                  >
                    {STATUS_FILTERS.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => {
                          setStatusFilter(f.value);
                          setFilterDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          statusFilter === f.value
                            ? "bg-[#105CB6]/5 text-[#105CB6] font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => {
                  setSortDropdownOpen(!sortDropdownOpen);
                  setFilterDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-full hover:border-gray-300 transition-all bg-white"
              >
                <ArrowUpDown size={13} className="text-gray-500" />
                <span className="text-gray-700">
                  {SORT_OPTIONS.find((s) => s.value === sortBy)?.label ?? "Sort"}
                </span>
                <ChevronDown size={12} className="text-gray-400" />
              </button>
              <AnimatePresence>
                {sortDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-1 right-0 bg-white border border-black/8 rounded-xl shadow-[0_8px_24px_-8px_rgba(0,0,0,0.15)] z-20 min-w-[180px] py-1 overflow-hidden"
                  >
                    {SORT_OPTIONS.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => {
                          setSortBy(s.value);
                          setSortDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          sortBy === s.value
                            ? "bg-[#105CB6]/5 text-[#105CB6] font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bulk actions */}
            {selectedIds.size > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={removeSelected}
                className="flex items-center gap-1.5 px-3 py-2 text-sm bg-[#E53238] text-white rounded-full hover:bg-[#c42a2f] transition-all"
              >
                <Trash2 size={13} />
                Remove ({selectedIds.size})
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Select All Row */}
        {filteredItems.length > 0 && (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-3 mb-3 px-1"
          >
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 select-none">
              <input
                type="checkbox"
                checked={selectedIds.size === filteredItems.length && filteredItems.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-gray-300 accent-[#105CB6]"
              />
              Select all ({filteredItems.length})
            </label>
          </motion.div>
        )}

        {/* Items List */}
        {filteredItems.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-16 text-center"
          >
            <Heart size={48} className="mx-auto text-gray-200 mb-4" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              {searchQuery !== "" || statusFilter !== "all"
                ? "No items match your filters"
                : "Your watchlist is empty"}
            </h2>
            <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
              {searchQuery !== "" || statusFilter !== "all"
                ? "Try adjusting your search or filter to find items."
                : "Save items you love by clicking the heart icon on any listing."}
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#105CB6] text-white rounded-full text-sm font-semibold hover:bg-[#0d4d9e] transition-all"
            >
              <Search size={14} />
              Browse Listings
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => {
                const status = statusConfig[item.status] ?? statusConfig["active"];
                const isSelected = selectedIds.has(item.id);
                const displayPrice = item.isAuction
                  ? (item.currentBid ?? item.price)
                  : item.price;

                return (
                  <motion.div
                    key={item.id}
                    variants={fadeInUp}
                    layout
                    exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
                    whileHover={{ y: -1 }}
                    className={`bg-white rounded-xl border transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.06)] overflow-hidden ${
                      isSelected
                        ? "border-[#105CB6]/40 ring-1 ring-[#105CB6]/20"
                        : "border-black/5 hover:border-black/10"
                    } ${item.status === "ended" || item.status === "sold" ? "opacity-70" : ""}`}
                  >
                    <div className="flex gap-0">
                      {/* Checkbox column */}
                      <div className="flex items-center px-4 border-r border-black/5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(item.id)}
                          className="w-4 h-4 rounded border-gray-300 accent-[#105CB6]"
                        />
                      </div>

                      {/* Image */}
                      <Link href={`/search`} className="flex-shrink-0 w-28 h-28 sm:w-36 sm:h-36 relative overflow-hidden bg-gray-50">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/images/product-placeholder.jpg";
                          }}
                        />
                        {item.isAuction && (
                          <div className="absolute top-2 left-2 bg-[#E53238] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            AUCTION
                          </div>
                        )}
                      </Link>

                      {/* Content */}
                      <div className="flex-1 p-4 flex flex-col sm:flex-row gap-3 min-w-0">
                        <div className="flex-1 min-w-0">
                          {/* Status + Category */}
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide"
                              style={{ color: status.color, backgroundColor: status.bg }}
                            >
                              {status.label}
                            </span>
                            <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                              {item.category}
                            </span>
                            <span className="text-[10px] text-gray-400">{item.condition}</span>
                          </div>

                          {/* Title */}
                          <Link href="/search">
                            <h3 className="text-sm font-semibold text-[#333333] hover:text-[#105CB6] transition-colors line-clamp-2 leading-snug mb-2">
                              {item.title}
                            </h3>
                          </Link>

                          {/* Seller */}
                          <div className="flex items-center gap-1.5 mb-2">
                            <Star size={11} className="text-[#F5AF02] fill-[#F5AF02]" />
                            <span className="text-xs text-gray-500">
                              {item.sellerRating}% positive
                            </span>
                            <span className="text-xs text-gray-400">by</span>
                            <span className="text-xs text-[#105CB6] font-medium">{item.seller}</span>
                          </div>

                          {/* Shipping + Time */}
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>
                              Shipping:{" "}
                              <span className={item.shipping === "Free" ? "text-[#86B817] font-semibold" : "text-gray-700"}>
                                {item.shipping === "Free" ? "Free" : `$${item.shipping}`}
                              </span>
                            </span>
                            {item.timeRemaining && (
                              <span className="flex items-center gap-1">
                                <Clock size={11} className={item.status === "ending-soon" ? "text-[#E53238]" : "text-gray-400"} />
                                <span className={item.status === "ending-soon" ? "text-[#E53238] font-semibold" : ""}>
                                  {item.timeRemaining} left
                                </span>
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Eye size={11} />
                              {item.watchCount} watching
                            </span>
                          </div>

                          <div className="text-[11px] text-gray-400 mt-1.5">
                            Added {item.addedDate}
                          </div>
                        </div>

                        {/* Price + Actions */}
                        <div className="flex flex-col items-start sm:items-end justify-between gap-3 sm:min-w-[140px]">
                          <div className="text-right">
                            {item.isAuction ? (
                              <>
                                <div className="text-xs text-gray-500 mb-0.5">
                                  Current bid ({item.bidCount ?? 0} bids)
                                </div>
                                <div className="text-xl font-bold text-[#333333]">
                                  ${displayPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                              </>
                            ) : (
                              <>
                                {item.originalPrice != null && (
                                  <div className="text-xs text-gray-400 line-through text-right">
                                    ${item.originalPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </div>
                                )}
                                <div className="text-xl font-bold text-[#333333]">
                                  ${displayPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                {item.originalPrice != null && (
                                  <div className="text-xs text-[#86B817] font-semibold text-right">
                                    Save ${(item.originalPrice - item.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2 w-full sm:w-auto">
                            {item.status !== "ended" && item.status !== "sold" && (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#105CB6] text-white text-xs font-semibold rounded-full hover:bg-[#0d4d9e] transition-all shadow-[0_2px_8px_rgba(16,92,182,0.25)]"
                              >
                                {item.isAuction ? (
                                  <>
                                    <Tag size={12} />
                                    Place Bid
                                  </>
                                ) : (
                                  <>
                                    <ShoppingCart size={12} />
                                    Add to Cart
                                  </>
                                )}
                              </motion.button>
                            )}

                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleAlert(item.id)}
                                title={item.alertEnabled ? "Disable price alert" : "Enable price alert"}
                                className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs rounded-full border transition-all ${
                                  item.alertEnabled
                                    ? "bg-[#F5AF02]/10 border-[#F5AF02]/30 text-[#c48a00]"
                                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                                }`}
                              >
                                {item.alertEnabled ? <Bell size={11} /> : <BellOff size={11} />}
                                {item.alertEnabled ? "Alert On" : "Alert Off"}
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => removeItem(item.id)}
                                title="Remove from watchlist"
                                className="flex items-center justify-center px-2.5 py-1.5 text-xs rounded-full border border-gray-200 text-gray-400 hover:border-[#E53238]/40 hover:text-[#E53238] hover:bg-[#E53238]/5 transition-all"
                              >
                                <Trash2 size={11} />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Recommendations Banner */}
        {items.length > 0 && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-8 bg-gradient-to-r from-[#105CB6] to-[#1a7ad4] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_4px_24px_rgba(16,92,182,0.2)]"
          >
            <div className="text-center sm:text-left">
              <h3 className="text-white font-bold text-lg mb-1">
                Find More Items You'll Love
              </h3>
              <p className="text-blue-100 text-sm">
                Based on your watchlist, we found deals in Electronics, Fashion, and Collectibles.
              </p>
            </div>
            <Link
              href="/search"
              className="flex-shrink-0 px-6 py-2.5 bg-white text-[#105CB6] rounded-full text-sm font-bold hover:bg-blue-50 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
            >
              Browse Deals
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  );
}