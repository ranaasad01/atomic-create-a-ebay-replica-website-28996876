"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Heart, ShoppingCart, Star, Package, Bell, Settings, ChevronRight, Eye, Clock, CheckCircle, AlertCircle, TrendingUp, DollarSign, ArrowUp, ArrowDown, Search, Filter } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { useTranslations } from "next-intl";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const mockUser = {
  name: "Alex Johnson",
  username: "alex_j_deals",
  email: "alex.johnson@email.com",
  memberSince: "March 2018",
  feedbackScore: 347,
  positivePercent: 99.4,
  avatar: "/images/user-avatar-profile.jpg",
  location: "Portland, OR",
};

const mockStats = [
  { label: "Active Bids", value: 4, icon: TrendingUp, color: "#105CB6", change: "+2 this week" },
  { label: "Watching", value: 23, icon: Eye, color: "#F5AF02", change: "+5 this week" },
  { label: "Purchases", value: 12, icon: Package, color: "#86B817", change: "This month" },
  { label: "Total Spent", value: "$1,842", icon: DollarSign, color: "#E53238", change: "This year" },
];

const mockWatchlist = [
  {
    id: "w1",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    price: 279.99,
    originalPrice: 349.99,
    image: "https://m.media-amazon.com/images/I/61O3iMlnJIL._AC_UF894,1000_QL80_.jpg",
    timeLeft: "1d 6h",
    bids: 8,
    isAuction: true,
    condition: "New",
    seller: "audio_world_store",
  },
  {
    id: "w2",
    title: "Vintage Leica M6 35mm Film Camera Body Only",
    price: 1850.00,
    originalPrice: 1850.00,
    image: "/images/leica-m6-film-camera.jpg",
    timeLeft: "3d 12h",
    bids: 14,
    isAuction: true,
    condition: "Used",
    seller: "vintage_optics_co",
  },
  {
    id: "w3",
    title: "Nike Air Jordan 1 Retro High OG Chicago Size 10",
    price: 320.00,
    originalPrice: 320.00,
    image: "https://picsum.photos/seed/cb53363835ae/800/600",
    timeLeft: "Buy Now",
    bids: 0,
    isAuction: false,
    condition: "New",
    seller: "sneaker_vault",
  },
  {
    id: "w4",
    title: "Apple iPad Pro 12.9-inch M2 256GB WiFi Space Gray",
    price: 899.00,
    originalPrice: 1099.00,
    image: "/images/apple-ipad-pro-m2.jpg",
    timeLeft: "6h 30m",
    bids: 31,
    isAuction: true,
    condition: "Refurbished",
    seller: "certified_apple_deals",
  },
];

const mockPurchases = [
  {
    id: "p1",
    title: "Mechanical Keyboard Keychron Q1 Pro QMK Wireless",
    price: 189.00,
    image: "/images/keychron-q1-pro-keyboard.jpg",
    date: "Dec 18, 2024",
    status: "Delivered",
    orderId: "EB-2024-88421",
    seller: "keyboard_kingdom",
    tracking: "1Z999AA10123456784",
  },
  {
    id: "p2",
    title: "Levi's 501 Original Fit Jeans Dark Stonewash 32x32",
    price: 54.99,
    image: "/images/levis-501-jeans-dark.jpg",
    date: "Dec 14, 2024",
    status: "Delivered",
    orderId: "EB-2024-87903",
    seller: "denim_direct",
    tracking: "1Z999AA10123456785",
  },
  {
    id: "p3",
    title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker 6Qt",
    price: 79.95,
    image: "https://m.media-amazon.com/images/I/71Z401LjFFL._AC_UF894,1000_QL80_.jpg",
    date: "Dec 10, 2024",
    status: "In Transit",
    orderId: "EB-2024-87201",
    seller: "kitchen_essentials_co",
    tracking: "1Z999AA10123456786",
  },
  {
    id: "p4",
    title: "Funko Pop Marvel Spider-Man No Way Home Set of 3",
    price: 42.00,
    image: "/images/funko-pop-spiderman-set.jpg",
    date: "Dec 5, 2024",
    status: "Delivered",
    orderId: "EB-2024-86540",
    seller: "collectibles_hub",
    tracking: "1Z999AA10123456787",
  },
];

const mockActiveBids = [
  {
    id: "b1",
    title: "Rolex Submariner Date 116610LN Black Dial",
    myBid: 7200.00,
    currentBid: 7450.00,
    image: "/images/rolex-submariner-black.jpg",
    timeLeft: "4h 15m",
    totalBids: 42,
    status: "outbid",
  },
  {
    id: "b2",
    title: "Gibson Les Paul Standard 60s Bourbon Burst Electric Guitar",
    myBid: 2100.00,
    currentBid: 2100.00,
    image: "/images/gibson-les-paul-bourbon.jpg",
    timeLeft: "1d 8h",
    totalBids: 17,
    status: "winning",
  },
  {
    id: "b3",
    title: "Vintage Omega Speedmaster Professional Moonwatch 1969",
    myBid: 4500.00,
    currentBid: 4500.00,
    image: "/images/omega-speedmaster-vintage.jpg",
    timeLeft: "2d 3h",
    totalBids: 28,
    status: "winning",
  },
  {
    id: "b4",
    title: "Canon EOS R5 Mirrorless Camera Body Only",
    myBid: 2800.00,
    currentBid: 2950.00,
    image: "/images/canon-eos-r5-camera.jpg",
    timeLeft: "12h 45m",
    totalBids: 19,
    status: "outbid",
  },
];

const mockNotifications = [
  { id: "n1", type: "outbid", message: "You've been outbid on Rolex Submariner Date", time: "2 hours ago", read: false },
  { id: "n2", type: "delivered", message: "Your Keychron Q1 Pro has been delivered", time: "Yesterday", read: false },
  { id: "n3", type: "ending", message: "Item ending soon: Sony WH-1000XM5 (1d 6h left)", time: "3 hours ago", read: true },
  { id: "n4", type: "outbid", message: "You've been outbid on Canon EOS R5", time: "5 hours ago", read: false },
  { id: "n5", type: "message", message: "New message from seller: keyboard_kingdom", time: "2 days ago", read: true },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; bg: string; text: string }> = {
    Delivered: { label: "Delivered", bg: "bg-green-100", text: "text-green-700" },
    "In Transit": { label: "In Transit", bg: "bg-blue-100", text: "text-blue-700" },
    Processing: { label: "Processing", bg: "bg-yellow-100", text: "text-yellow-700" },
    winning: { label: "Winning", bg: "bg-green-100", text: "text-green-700" },
    outbid: { label: "Outbid", bg: "bg-red-100", text: "text-red-700" },
  };
  const s = map[status] ?? { label: status, bg: "bg-gray-100", text: "text-gray-600" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
};

const TabButton = ({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
      active
        ? "bg-[#105CB6] text-white shadow-sm"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    {children}
    {count !== undefined && (
      <span
        className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
          active ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
        }`}
      >
        {count}
      </span>
    )}
  </button>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MyEbayPage() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<"overview" | "watchlist" | "bids" | "purchases" | "notifications">("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <main className="min-h-screen bg-[#F7F7F7]">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={mockUser.avatar}
                  alt={mockUser.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-[#105CB6]/20 shadow-md"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "";
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#86B817] rounded-full flex items-center justify-center shadow">
                  <CheckCircle size={14} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{mockUser.name}</h1>
                <p className="text-sm text-gray-500">
                  @{mockUser.username} &middot; Member since {mockUser.memberSince}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={13} className="text-[#F5AF02] fill-[#F5AF02]" />
                  <span className="text-sm font-semibold text-gray-700">{mockUser.feedbackScore}</span>
                  <span className="text-xs text-gray-400">({mockUser.positivePercent}% positive)</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-center gap-3">
              <Link
                href="/sell-list-item"
                className="px-4 py-2 bg-[#105CB6] text-white text-sm font-semibold rounded-lg hover:bg-[#0d4fa0] transition-colors shadow-sm"
              >
                + List an Item
              </Link>
              <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600">
                <Settings size={18} />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* ── Tabs ── */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-2 mb-6"
        >
          <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
            <User size={15} /> Overview
          </TabButton>
          <TabButton active={activeTab === "watchlist"} onClick={() => setActiveTab("watchlist")} count={mockWatchlist.length}>
            <Heart size={15} /> Watchlist
          </TabButton>
          <TabButton active={activeTab === "bids"} onClick={() => setActiveTab("bids")} count={mockActiveBids.length}>
            <TrendingUp size={15} /> Active Bids
          </TabButton>
          <TabButton active={activeTab === "purchases"} onClick={() => setActiveTab("purchases")} count={mockPurchases.length}>
            <Package size={15} /> Purchases
          </TabButton>
          <TabButton active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} count={unreadCount}>
            <Bell size={15} /> Notifications
          </TabButton>
        </motion.div>

        {/* ── Overview Tab ── */}
        {activeTab === "overview" && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Stat Cards */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mockStats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={scaleIn}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className="bg-white rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] border border-black/5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</span>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: stat.color + "18" }}
                    >
                      <stat.icon size={16} style={{ color: stat.color }} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Two-column layout: Recent Bids + Recent Purchases */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Bids */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] border border-black/5 overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">Active Bids</h2>
                  <button
                    onClick={() => setActiveTab("bids")}
                    className="text-xs text-[#105CB6] hover:underline font-medium flex items-center gap-1"
                  >
                    View all <ChevronRight size={12} />
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {mockActiveBids.slice(0, 3).map((bid) => (
                    <div key={bid.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                      <img
                        src={bid.image}
                        alt={bid.title}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{bid.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500">
                            Your bid: <span className="font-semibold text-gray-700">${(bid.myBid ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                          </span>
                          <StatusBadge status={bid.status} />
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={10} /> {bid.timeLeft}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Purchases */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] border border-black/5 overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">Recent Purchases</h2>
                  <button
                    onClick={() => setActiveTab("purchases")}
                    className="text-xs text-[#105CB6] hover:underline font-medium flex items-center gap-1"
                  >
                    View all <ChevronRight size={12} />
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {mockPurchases.slice(0, 3).map((purchase) => (
                    <div key={purchase.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                      <img
                        src={purchase.image}
                        alt={purchase.title}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{purchase.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-semibold text-gray-700">${(purchase.price ?? 0).toFixed(2)}</span>
                          <StatusBadge status={purchase.status} />
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 flex-shrink-0">{purchase.date}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Watchlist Preview */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] border border-black/5 overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Watchlist</h2>
                <button
                  onClick={() => setActiveTab("watchlist")}
                  className="text-xs text-[#105CB6] hover:underline font-medium flex items-center gap-1"
                >
                  View all <ChevronRight size={12} />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-gray-100">
                {mockWatchlist.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors group cursor-pointer">
                    <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    </div>
                    <p className="text-xs font-medium text-gray-800 line-clamp-2 mb-1">{item.title}</p>
                    <p className="text-sm font-bold text-gray-900">${(item.price ?? 0).toFixed(2)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.isAuction ? `${item.bids} bids` : "Buy Now"} &middot; {item.timeLeft}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Account Info */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] border border-black/5 p-5"
            >
              <h2 className="font-semibold text-gray-900 mb-4">Account Details</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Email</p>
                  <p className="text-sm font-medium text-gray-800">{mockUser.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Location</p>
                  <p className="text-sm font-medium text-gray-800">{mockUser.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Feedback Score</p>
                  <div className="flex items-center gap-1.5">
                    <Star size={14} className="text-[#F5AF02] fill-[#F5AF02]" />
                    <p className="text-sm font-medium text-gray-800">{mockUser.feedbackScore} ({mockUser.positivePercent}% positive)</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ── Watchlist Tab ── */}
        {activeTab === "watchlist" && (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
            <motion.div variants={fadeInUp} className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Watchlist ({mockWatchlist.length} items)</h2>
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search watchlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6] bg-white"
                />
              </div>
            </motion.div>

            {mockWatchlist
              .filter((item) =>
                searchQuery.trim() === "" || item.title.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((item) => (
                <motion.div
                  key={item.id}
                  variants={fadeInUp}
                  whileHover={{ y: -1, transition: { duration: 0.15 } }}
                  className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] border border-black/5 p-4 flex gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-gray-900 leading-snug">{item.title}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Condition: {item.condition} &middot; Seller: {item.seller}
                        </p>
                      </div>
                      <button className="text-[#E53238] hover:text-red-700 transition-colors flex-shrink-0">
                        <Heart size={18} className="fill-[#E53238]" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      <div>
                        <span className="text-xl font-bold text-gray-900">${(item.price ?? 0).toFixed(2)}</span>
                        {item.originalPrice > item.price && (
                          <span className="text-sm text-gray-400 line-through ml-2">${(item.originalPrice ?? 0).toFixed(2)}</span>
                        )}
                      </div>
                      {item.isAuction && (
                        <span className="text-xs text-gray-500">{item.bids} bids</span>
                      )}
                      <div className="flex items-center gap-1 text-xs text-orange-600 font-medium">
                        <Clock size={12} />
                        {item.timeLeft}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {item.isAuction ? (
                        <button className="px-4 py-1.5 bg-[#105CB6] text-white text-sm font-semibold rounded-lg hover:bg-[#0d4fa0] transition-colors">
                          Place Bid
                        </button>
                      ) : (
                        <button className="px-4 py-1.5 bg-[#105CB6] text-white text-sm font-semibold rounded-lg hover:bg-[#0d4fa0] transition-colors">
                          Buy Now
                        </button>
                      )}
                      <button className="px-4 py-1.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        View Item
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        )}

        {/* ── Active Bids Tab ── */}
        {activeTab === "bids" && (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
            <motion.div variants={fadeInUp} className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Active Bids ({mockActiveBids.length})</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Winning: {mockActiveBids.filter((b) => b.status === "winning").length}
                </span>
                <span className="flex items-center gap-1 ml-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span> Outbid: {mockActiveBids.filter((b) => b.status === "outbid").length}
                </span>
              </div>
            </motion.div>

            {mockActiveBids.map((bid) => (
              <motion.div
                key={bid.id}
                variants={fadeInUp}
                whileHover={{ y: -1, transition: { duration: 0.15 } }}
                className={`bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] border overflow-hidden ${
                  bid.status === "outbid" ? "border-red-200" : "border-green-200"
                }`}
              >
                <div className={`h-1 ${bid.status === "outbid" ? "bg-[#E53238]" : "bg-[#86B817]"}`} />
                <div className="p-4 flex gap-4">
                  <img
                    src={bid.image}
                    alt={bid.title}
                    className="w-24 h-24 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-gray-900 leading-snug">{bid.title}</p>
                      <StatusBadge status={bid.status} />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-gray-400">Your Bid</p>
                        <p className="text-base font-bold text-gray-900">${(bid.myBid ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Current Bid</p>
                        <p className={`text-base font-bold ${bid.status === "outbid" ? "text-[#E53238]" : "text-[#86B817]"}`}>
                          ${(bid.currentBid ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Time Left</p>
                        <p className="text-base font-bold text-orange-600 flex items-center gap-1">
                          <Clock size={13} /> {bid.timeLeft}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {bid.status === "outbid" && (
                        <button className="px-4 py-1.5 bg-[#E53238] text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors">
                          Bid Again
                        </button>
                      )}
                      <button className="px-4 py-1.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        View Item
                      </button>
                      <span className="text-xs text-gray-400 ml-auto">{bid.totalBids} total bids</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── Purchases Tab ── */}
        {activeTab === "purchases" && (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
            <motion.div variants={fadeInUp} className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Purchase History ({mockPurchases.length})</h2>
              <button className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
                <Filter size={14} /> Filter
              </button>
            </motion.div>

            {mockPurchases.map((purchase) => (
              <motion.div
                key={purchase.id}
                variants={fadeInUp}
                whileHover={{ y: -1, transition: { duration: 0.15 } }}
                className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] border border-black/5 p-4"
              >
                <div className="flex gap-4">
                  <img
                    src={purchase.image}
                    alt={purchase.title}
                    className="w-20 h-20 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-gray-900">{purchase.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Order {purchase.orderId} &middot; {purchase.date} &middot; Seller: {purchase.seller}
                        </p>
                      </div>
                      <StatusBadge status={purchase.status} />
                    </div>
                    <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                      <span className="text-lg font-bold text-gray-900">${(purchase.price ?? 0).toFixed(2)}</span>
                      <div className="flex gap-2">
                        {purchase.status === "In Transit" && (
                          <button className="px-3 py-1.5 bg-[#105CB6] text-white text-xs font-semibold rounded-lg hover:bg-[#0d4fa0] transition-colors">
                            Track Package
                          </button>
                        )}
                        {purchase.status === "Delivered" && (
                          <button className="px-3 py-1.5 bg-[#86B817] text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors">
                            Leave Feedback
                          </button>
                        )}
                        <button className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors">
                          View Order
                        </button>
                        <button className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors">
                          Buy Again
                        </button>
                      </div>
                    </div>
                    {purchase.status === "In Transit" && (
                      <div className="mt-2 text-xs text-gray-400">
                        Tracking: <span className="font-mono text-gray-600">{purchase.tracking}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── Notifications Tab ── */}
        {activeTab === "notifications" && (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
            <motion.div variants={fadeInUp} className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Notifications <span className="text-sm font-normal text-gray-400">({unreadCount} unread)</span>
              </h2>
              <button className="text-sm text-[#105CB6] hover:underline font-medium">Mark all as read</button>
            </motion.div>

            {mockNotifications.map((notif) => {
              const iconMap: Record<string, React.ReactNode> = {
                outbid: <AlertCircle size={18} className="text-[#E53238]" />,
                delivered: <CheckCircle size={18} className="text-[#86B817]" />,
                ending: <Clock size={18} className="text-[#F5AF02]" />,
                message: <Bell size={18} className="text-[#105CB6]" />,
              };
              return (
                <motion.div
                  key={notif.id}
                  variants={fadeInUp}
                  className={`bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] border p-4 flex items-start gap-3 transition-colors ${
                    !notif.read ? "border-[#105CB6]/20 bg-blue-50/30" : "border-black/5"
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {iconMap[notif.type] ?? <Bell size={18} className="text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notif.read ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{notif.time}</p>
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-[#105CB6] flex-shrink-0 mt-1.5" />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </main>
  );
}