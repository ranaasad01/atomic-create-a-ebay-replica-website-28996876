"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Package, DollarSign, Eye, Star, Plus, Search, Filter, MoreHorizontal, CheckCircle, Clock, AlertCircle, XCircle, ArrowUpRight, ShoppingBag, BarChart2, Settings, Bell, ChevronDown, Edit, Trash2, Download } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { useTranslations } from "next-intl";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const revenueData = [
  { month: "Jan", revenue: 3200, orders: 28, views: 1240 },
  { month: "Feb", revenue: 4100, orders: 35, views: 1580 },
  { month: "Mar", revenue: 3750, orders: 31, views: 1420 },
  { month: "Apr", revenue: 5200, orders: 44, views: 2100 },
  { month: "May", revenue: 4800, orders: 40, views: 1950 },
  { month: "Jun", revenue: 6100, orders: 52, views: 2480 },
  { month: "Jul", revenue: 5700, orders: 48, views: 2310 },
  { month: "Aug", revenue: 7200, orders: 61, views: 2900 },
  { month: "Sep", revenue: 6800, orders: 57, views: 2750 },
  { month: "Oct", revenue: 8100, orders: 68, views: 3200 },
  { month: "Nov", revenue: 9400, orders: 79, views: 3800 },
  { month: "Dec", revenue: 11200, orders: 94, views: 4500 },
];

const categoryData = [
  { category: "Electronics", sales: 4200, items: 38 },
  { category: "Fashion", sales: 2800, items: 62 },
  { category: "Home", sales: 1900, items: 29 },
  { category: "Sports", sales: 1400, items: 21 },
  { category: "Collectibles", sales: 900, items: 14 },
];

interface Listing {
  id: string;
  title: string;
  price: number;
  status: "active" | "sold" | "ended" | "draft";
  condition: string;
  views: number;
  watchers: number;
  bids: number;
  image: string;
  category: string;
  listedDate: string;
  timeLeft: string;
}

const listings: Listing[] = [
  {
    id: "L001",
    title: "Apple MacBook Pro 14-inch M3 Pro 512GB Space Gray",
    price: 1799.99,
    status: "active",
    condition: "New",
    views: 842,
    watchers: 37,
    bids: 0,
    image: "https://sm.pcmag.com/t/pcmag_me/review/a/apple-macb/apple-macbook-pro-14-inch-2023-m3-pro_w91x.1920.jpg",
    category: "Electronics",
    listedDate: "Dec 1, 2024",
    timeLeft: "4d 12h",
  },
  {
    id: "L002",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones Black",
    price: 279.99,
    status: "active",
    condition: "Refurbished",
    views: 521,
    watchers: 24,
    bids: 8,
    image: "https://m.media-amazon.com/images/I/61O3iMlnJIL._AC_UF894,1000_QL80_.jpg",
    category: "Electronics",
    listedDate: "Nov 28, 2024",
    timeLeft: "1d 6h",
  },
  {
    id: "L003",
    title: "Vintage Levi's 501 Denim Jacket Size M Distressed Blue",
    price: 89.0,
    status: "sold",
    condition: "Used",
    views: 310,
    watchers: 15,
    bids: 12,
    image: "https://media.vogue.co.uk/photos/60d098dee1390ff25b6805b2/2:3/w_2560%2Cc_limit/Imparfaite's%2520vintage%2520501%2520calculator%25202.jpeg",
    category: "Fashion",
    listedDate: "Nov 20, 2024",
    timeLeft: "Ended",
  },
  {
    id: "L004",
    title: "LEGO Technic Bugatti Chiron 42083 Complete Set with Box",
    price: 349.0,
    status: "active",
    condition: "Used",
    views: 198,
    watchers: 9,
    bids: 3,
    image: "https://m.media-amazon.com/images/I/91M+Wu21lzL._AC_UF894,1000_QL80_.jpg",
    category: "Collectibles",
    listedDate: "Dec 3, 2024",
    timeLeft: "6d 2h",
  },
  {
    id: "L005",
    title: "Nike Air Jordan 1 Retro High OG Chicago Size 10",
    price: 420.0,
    status: "sold",
    condition: "New",
    views: 1240,
    watchers: 88,
    bids: 0,
    image: "https://picsum.photos/seed/cb53363835ae/800/600",
    category: "Fashion",
    listedDate: "Nov 15, 2024",
    timeLeft: "Ended",
  },
  {
    id: "L006",
    title: "Dyson V15 Detect Cordless Vacuum Cleaner Yellow",
    price: 599.99,
    status: "draft",
    condition: "New",
    views: 0,
    watchers: 0,
    bids: 0,
    image: "/images/dyson-v15-cordless-vacuum.jpg",
    category: "Home",
    listedDate: "Dec 5, 2024",
    timeLeft: "Draft",
  },
];

interface Order {
  id: string;
  buyer: string;
  item: string;
  amount: number;
  status: "shipped" | "processing" | "delivered" | "cancelled";
  date: string;
  trackingNumber: string;
}

const recentOrders: Order[] = [
  {
    id: "ORD-8821",
    buyer: "james_collector",
    item: "Nike Air Jordan 1 Retro High OG Chicago Size 10",
    amount: 420.0,
    status: "delivered",
    date: "Dec 4, 2024",
    trackingNumber: "1Z999AA10123456784",
  },
  {
    id: "ORD-8820",
    buyer: "sarah_m_fashion",
    item: "Vintage Levi's 501 Denim Jacket Size M",
    amount: 89.0,
    status: "shipped",
    date: "Dec 3, 2024",
    trackingNumber: "1Z999AA10123456785",
  },
  {
    id: "ORD-8819",
    buyer: "techguru_99",
    item: "Sony WH-1000XM5 Headphones",
    amount: 279.99,
    status: "processing",
    date: "Dec 5, 2024",
    trackingNumber: "Pending",
  },
  {
    id: "ORD-8818",
    buyer: "home_decor_fan",
    item: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    amount: 79.95,
    status: "delivered",
    date: "Dec 1, 2024",
    trackingNumber: "1Z999AA10123456786",
  },
  {
    id: "ORD-8817",
    buyer: "retro_gamer_x",
    item: "Nintendo Game Boy Color Purple",
    amount: 145.0,
    status: "cancelled",
    date: "Nov 30, 2024",
    trackingNumber: "N/A",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const statusConfig = {
  active: { label: "Active", color: "bg-green-100 text-green-700", icon: CheckCircle },
  sold: { label: "Sold", color: "bg-blue-100 text-blue-700", icon: DollarSign },
  ended: { label: "Ended", color: "bg-gray-100 text-gray-600", icon: XCircle },
  draft: { label: "Draft", color: "bg-yellow-100 text-yellow-700", icon: Clock },
};

const orderStatusConfig = {
  shipped: { label: "Shipped", color: "bg-blue-100 text-blue-700", icon: Package },
  processing: { label: "Processing", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: XCircle },
};

function StatCard({
  label,
  value,
  sub,
  trend,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  trend: "up" | "down" | "neutral";
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] p-6 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: accent + "18" }}
        >
          <Icon size={20} style={{ color: accent }} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
        <div className="flex items-center gap-1 mt-1">
          {trend === "up" && <TrendingUp size={14} className="text-green-500" />}
          {trend === "down" && <TrendingDown size={14} className="text-red-500" />}
          <span
            className={`text-xs font-medium ${
              trend === "up" ? "text-green-600" : trend === "down" ? "text-red-500" : "text-gray-500"
            }`}
          >
            {sub}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function ListingStatusBadge({ status }: { status: Listing["status"] }) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

function OrderStatusBadge({ status }: { status: Order["status"] }) {
  const cfg = orderStatusConfig[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SellerDashboardPage() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<"overview" | "listings" | "orders">("overview");
  const [listingFilter, setListingFilter] = useState<"all" | "active" | "sold" | "draft">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [chartView, setChartView] = useState<"revenue" | "orders">("revenue");

  const filteredListings = (listings ?? []).filter((l) => {
    const matchesFilter = listingFilter === "all" || l.status === listingFilter;
    const matchesSearch =
      searchQuery.trim() === "" ||
      l.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Page Header */}
      <div className="bg-white border-b border-black/5 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <motion.h1
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="text-2xl font-bold text-gray-900 tracking-tight"
            >
              {t("sellerDashboard.title")}
            </motion.h1>
            <motion.p
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="text-sm text-gray-500 mt-0.5"
            >
              {t("sellerDashboard.subtitle")}
            </motion.p>
          </div>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-3"
          >
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-black/10 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <Download size={15} />
              {t("sellerDashboard.exportReport")}
            </button>
            <Link
              href="/sell-list-item"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 shadow-[0_2px_8px_rgba(16,92,182,0.25)] hover:shadow-[0_4px_16px_rgba(16,92,182,0.35)] hover:scale-[1.02]"
              style={{ backgroundColor: "#105CB6" }}
            >
              <Plus size={15} />
              {t("sellerDashboard.newListing")}
            </Link>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-0 border-b border-transparent -mb-px">
            {(["overview", "listings", "orders"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-200 capitalize ${
                  activeTab === tab
                    ? "border-[#105CB6] text-[#105CB6]"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {t(`sellerDashboard.tabs.${tab}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label={t("sellerDashboard.stats.totalRevenue")}
                value="$11,200"
                sub="+22% vs last month"
                trend="up"
                icon={DollarSign}
                accent="#105CB6"
              />
              <StatCard
                label={t("sellerDashboard.stats.activeListings")}
                value="24"
                sub="3 ending soon"
                trend="neutral"
                icon={Package}
                accent="#86B817"
              />
              <StatCard
                label={t("sellerDashboard.stats.totalOrders")}
                value="94"
                sub="+18% vs last month"
                trend="up"
                icon={ShoppingBag}
                accent="#E53238"
              />
              <StatCard
                label={t("sellerDashboard.stats.sellerRating")}
                value="99.8%"
                sub="Top Rated Seller"
                trend="up"
                icon={Star}
                accent="#F5AF02"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue / Orders Chart */}
              <motion.div
                variants={fadeInUp}
                className="lg:col-span-2 bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      {t("sellerDashboard.chart.title")}
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {t("sellerDashboard.chart.subtitle")}
                    </p>
                  </div>
                  <div className="flex rounded-lg border border-black/8 overflow-hidden text-xs font-semibold">
                    <button
                      onClick={() => setChartView("revenue")}
                      className={`px-3 py-1.5 transition-colors ${
                        chartView === "revenue"
                          ? "bg-[#105CB6] text-white"
                          : "bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      Revenue
                    </button>
                    <button
                      onClick={() => setChartView("orders")}
                      className={`px-3 py-1.5 transition-colors ${
                        chartView === "orders"
                          ? "bg-[#105CB6] text-white"
                          : "bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      Orders
                    </button>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#105CB6" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#105CB6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#86B817" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#86B817" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid rgba(0,0,0,0.06)",
                        boxShadow: "0 8px 24px -8px rgba(0,0,0,0.15)",
                        fontSize: "12px",
                      }}
                    />
                    {chartView === "revenue" ? (
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#105CB6"
                        strokeWidth={2.5}
                        fill="url(#colorRevenue)"
                        dot={false}
                        activeDot={{ r: 5, fill: "#105CB6" }}
                      />
                    ) : (
                      <Area
                        type="monotone"
                        dataKey="orders"
                        stroke="#86B817"
                        strokeWidth={2.5}
                        fill="url(#colorOrders)"
                        dot={false}
                        activeDot={{ r: 5, fill: "#86B817" }}
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Category Breakdown */}
              <motion.div
                variants={fadeInUp}
                className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] p-6"
              >
                <h2 className="text-base font-bold text-gray-900 mb-1">
                  {t("sellerDashboard.categories.title")}
                </h2>
                <p className="text-xs text-gray-400 mb-5">
                  {t("sellerDashboard.categories.subtitle")}
                </p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis
                      dataKey="category"
                      type="category"
                      tick={{ fontSize: 10, fill: "#6b7280" }}
                      axisLine={false}
                      tickLine={false}
                      width={72}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "10px",
                        border: "1px solid rgba(0,0,0,0.06)",
                        fontSize: "11px",
                      }}
                    />
                    <Bar dataKey="sales" fill="#105CB6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {(categoryData ?? []).map((cat) => (
                    <div key={cat.category} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{cat.category}</span>
                      <span className="font-semibold text-gray-900">
                        ${(cat.sales ?? 0).toLocaleString("en-US")}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Recent Orders Preview */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
                <h2 className="text-base font-bold text-gray-900">
                  {t("sellerDashboard.recentOrders.title")}
                </h2>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs font-semibold text-[#105CB6] hover:underline flex items-center gap-1"
                >
                  {t("sellerDashboard.recentOrders.viewAll")} <ArrowUpRight size={13} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F7F7F7] text-xs text-gray-500 uppercase tracking-wider">
                      <th className="text-left px-6 py-3 font-semibold">Order</th>
                      <th className="text-left px-6 py-3 font-semibold">Buyer</th>
                      <th className="text-left px-6 py-3 font-semibold hidden md:table-cell">Item</th>
                      <th className="text-left px-6 py-3 font-semibold">Amount</th>
                      <th className="text-left px-6 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {(recentOrders ?? []).slice(0, 4).map((order) => (
                      <tr key={order.id} className="hover:bg-[#F7F7F7] transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">{order.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-800">{order.buyer}</td>
                        <td className="px-6 py-4 text-gray-600 hidden md:table-cell max-w-[200px] truncate">
                          {order.item}
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          ${(order.amount ?? 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <OrderStatusBadge status={order.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: t("sellerDashboard.quickActions.listItem"), icon: Plus, href: "/sell-list-item", accent: "#105CB6" },
                { label: t("sellerDashboard.quickActions.viewWatchlist"), icon: Eye, href: "/watchlist", accent: "#E53238" },
                { label: t("sellerDashboard.quickActions.myEbay"), icon: ShoppingBag, href: "/user-profile-my-ebay", accent: "#86B817" },
                { label: t("sellerDashboard.quickActions.analytics"), icon: BarChart2, href: "#", accent: "#F5AF02" },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)] p-5 flex flex-col items-center gap-3 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.14)] hover:-translate-y-1 transition-all duration-200 group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: action.accent + "18" }}
                  >
                    <action.icon size={22} style={{ color: action.accent }} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 text-center leading-tight">
                    {action.label}
                  </span>
                </Link>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ── LISTINGS TAB ── */}
        {activeTab === "listings" && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Filters */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)] p-4 flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("sellerDashboard.listings.searchPlaceholder")}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6] transition-all"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {(["all", "active", "sold", "draft"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setListingFilter(f)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all duration-200 ${
                      listingFilter === f
                        ? "bg-[#105CB6] text-white shadow-[0_2px_8px_rgba(16,92,182,0.25)]"
                        : "bg-[#F7F7F7] text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {f === "all" ? t("sellerDashboard.listings.filterAll") : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Listings Table */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F7F7F7] text-xs text-gray-500 uppercase tracking-wider border-b border-black/5">
                      <th className="text-left px-6 py-3 font-semibold">Item</th>
                      <th className="text-left px-6 py-3 font-semibold hidden sm:table-cell">Price</th>
                      <th className="text-left px-6 py-3 font-semibold">Status</th>
                      <th className="text-left px-6 py-3 font-semibold hidden md:table-cell">Views</th>
                      <th className="text-left px-6 py-3 font-semibold hidden lg:table-cell">Watchers</th>
                      <th className="text-left px-6 py-3 font-semibold hidden lg:table-cell">Time Left</th>
                      <th className="text-right px-6 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {filteredListings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-sm">
                          {t("sellerDashboard.listings.noResults")}
                        </td>
                      </tr>
                    ) : (
                      filteredListings.map((listing) => (
                        <motion.tr
                          key={listing.id}
                          variants={fadeInUp}
                          className="hover:bg-[#F7F7F7] transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-black/5">
                                <img
                                  src={listing.image}
                                  alt={listing.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src =
                                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23f3f4f6'/%3E%3C/svg%3E";
                                  }}
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900 truncate max-w-[180px] md:max-w-[260px]">
                                  {listing.title}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {listing.category} · {listing.condition}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900 hidden sm:table-cell">
                            ${(listing.price ?? 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4">
                            <ListingStatusBadge status={listing.status} />
                          </td>
                          <td className="px-6 py-4 text-gray-600 hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <Eye size={13} className="text-gray-400" />
                              {(listing.views ?? 0).toLocaleString("en-US")}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600 hidden lg:table-cell">
                            <div className="flex items-center gap-1">
                              <Heart size={13} className="text-gray-400" />
                              {listing.watchers ?? 0}
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell">
                            <span
                              className={`text-xs font-medium ${
                                listing.timeLeft === "Ended" || listing.timeLeft === "Draft"
                                  ? "text-gray-400"
                                  : "text-orange-600"
                              }`}
                            >
                              {listing.timeLeft}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-[#105CB6] transition-colors">
                                <Edit size={14} />
                              </button>
                              <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-[#E53238] transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ── ORDERS TAB ── */}
        {activeTab === "orders" && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Order Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: t("sellerDashboard.orderStats.total"), value: "94", color: "#105CB6" },
                { label: t("sellerDashboard.orderStats.processing"), value: "3", color: "#F5AF02" },
                { label: t("sellerDashboard.orderStats.shipped"), value: "12", color: "#86B817" },
                { label: t("sellerDashboard.orderStats.delivered"), value: "79", color: "#E53238" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={scaleIn}
                  className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)] p-5 text-center"
                >
                  <p className="text-3xl font-bold tracking-tight" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Orders Table */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
                <h2 className="text-base font-bold text-gray-900">
                  {t("sellerDashboard.orders.title")}
                </h2>
                <span className="text-xs text-gray-400">
                  {t("sellerDashboard.orders.showing")} {recentOrders.length} {t("sellerDashboard.orders.results")}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F7F7F7] text-xs text-gray-500 uppercase tracking-wider border-b border-black/5">
                      <th className="text-left px-6 py-3 font-semibold">Order ID</th>
                      <th className="text-left px-6 py-3 font-semibold">Buyer</th>
                      <th className="text-left px-6 py-3 font-semibold hidden md:table-cell">Item</th>
                      <th className="text-left px-6 py-3 font-semibold">Amount</th>
                      <th className="text-left px-6 py-3 font-semibold hidden sm:table-cell">Date</th>
                      <th className="text-left px-6 py-3 font-semibold">Status</th>
                      <th className="text-left px-6 py-3 font-semibold hidden lg:table-cell">Tracking</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {(recentOrders ?? []).map((order) => (
                      <motion.tr
                        key={order.id}
                        variants={fadeInUp}
                        className="hover:bg-[#F7F7F7] transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-xs font-semibold text-[#105CB6]">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800">{order.buyer}</td>
                        <td className="px-6 py-4 text-gray-600 hidden md:table-cell max-w-[200px] truncate">
                          {order.item}
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          ${(order.amount ?? 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs hidden sm:table-cell">
                          {order.date}
                        </td>
                        <td className="px-6 py-4">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-400 hidden lg:table-cell truncate max-w-[160px]">
                          {order.trackingNumber}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Seller Performance */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] p-6"
            >
              <h2 className="text-base font-bold text-gray-900 mb-5">
                {t("sellerDashboard.performance.title")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  {
                    label: t("sellerDashboard.performance.positiveFeedback"),
                    value: "99.8%",
                    detail: "312 ratings",
                    color: "#86B817",
                    icon: Star,
                  },
                  {
                    label: t("sellerDashboard.performance.onTimeShipping"),
                    value: "98.2%",
                    detail: "Last 12 months",
                    color: "#105CB6",
                    icon: Package,
                  },
                  {
                    label: t("sellerDashboard.performance.casesClosed"),
                    value: "0.2%",
                    detail: "Below 0.3% threshold",
                    color: "#E53238",
                    icon: AlertCircle,
                  },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="flex items-start gap-4 p-4 rounded-xl bg-[#F7F7F7] border border-black/5"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: metric.color + "18" }}
                    >
                      <metric.icon size={18} style={{ color: metric.color }} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 tracking-tight">
                        {metric.value}
                      </p>
                      <p className="text-xs font-semibold text-gray-700 mt-0.5">{metric.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{metric.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}