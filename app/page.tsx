"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Search, ChevronRight, Star, Shield, Truck, RotateCcw, Heart, Clock, TrendingUp, Award, Users, Package, ArrowRight, Zap, Tag } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn, slideInLeft, slideInRight } from "@/lib/motion";
import { categories, featuredProducts, APP_NAME } from "@/lib/data";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

// ─── Inline mock data ────────────────────────────────────────────────────────

const heroBanners = [
  {
    id: "b1",
    tag: "Limited Time",
    headline: "Up to 40% off Electronics",
    sub: "MacBooks, iPhones, gaming gear and more. New deals added daily.",
    cta: "Shop Electronics",
    href: "/search?category=electronics",
    accent: "#105CB6",
    bg: "from-[#0a3d7a] to-[#105CB6]",
    image: "https://thumbs.dreamstime.com/b/top-view-responsive-design-mockup-office-desk-hero-modern-electronics-76293003.jpg",
  },
  {
    id: "b2",
    tag: "Trending Now",
    headline: "Fashion Finds Under $50",
    sub: "Thousands of styles from top brands. Free shipping on orders over $35.",
    cta: "Browse Fashion",
    href: "/search?category=fashion",
    accent: "#E53238",
    bg: "from-[#7a0a0e] to-[#E53238]",
    image: "https://s3-alpha.figma.com/hub/file/2487300310/4b7cf365-091f-4df0-818e-d57f3e021fec-cover.png",
  },
  {
    id: "b3",
    tag: "Best Sellers",
    headline: "Home & Garden Essentials",
    sub: "Transform your space with curated picks from top-rated sellers.",
    cta: "Shop Home",
    href: "/search?category=home",
    accent: "#86B817",
    bg: "from-[#3d5a0a] to-[#86B817]",
    image: "https://m.media-amazon.com/images/I/61O3iMlnJIL._AC_UF894,1000_QL80_.jpg",
  },
];

const dealItems = [
  {
    id: "d1",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    originalPrice: 399.99,
    salePrice: 279.99,
    discount: 30,
    image: "https://m.media-amazon.com/images/I/61O3iMlnJIL._AC_UF894,1000_QL80_.jpg",
    condition: "New",
    shipping: "Free",
    timeLeft: "3h 22m",
    bids: 0,
    href: "/search?q=sony+headphones",
  },
  {
    id: "d2",
    title: "Nike Air Jordan 1 Retro High OG Chicago Size 10",
    originalPrice: 180,
    salePrice: 145,
    discount: 19,
    image: "https://picsum.photos/seed/cb53363835ae/800/600",
    condition: "New",
    shipping: "Free",
    timeLeft: "1d 6h",
    bids: 12,
    href: "/search?q=jordan+1",
  },
  {
    id: "d3",
    title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker 6 Qt",
    originalPrice: 99.99,
    salePrice: 59.99,
    discount: 40,
    image: "https://m.media-amazon.com/images/I/71Z401LjFFL._AC_UF894,1000_QL80_.jpg",
    condition: "New",
    shipping: "Free",
    timeLeft: "5h 45m",
    bids: 0,
    href: "/search?q=instant+pot",
  },
  {
    id: "d4",
    title: "Vintage Rolex Submariner 1680 Red Sub Tropical Dial 1970s",
    originalPrice: 28000,
    salePrice: 22500,
    discount: 20,
    image: "https://collectorscornerny.com/cdn/shop/files/rolex-submariner-1680-tropical-red-sub-vintage-watches-collectors-corner-ny_2000x.jpg?v=1741276383",
    condition: "Used",
    shipping: "Free",
    timeLeft: "2d 14h",
    bids: 7,
    href: "/search?q=rolex+submariner",
  },
  {
    id: "d5",
    title: "LEGO Technic Bugatti Chiron 42083 Building Kit",
    originalPrice: 349.99,
    salePrice: 219.99,
    discount: 37,
    image: "https://m.media-amazon.com/images/I/91M+Wu21lzL._AC_UF894,1000_QL80_.jpg",
    condition: "New",
    shipping: "Free",
    timeLeft: "8h 10m",
    bids: 3,
    href: "/search?q=lego+bugatti",
  },
  {
    id: "d6",
    title: "Canon EOS R6 Mark II Mirrorless Camera Body Only",
    originalPrice: 2499,
    salePrice: 1999,
    discount: 20,
    image: "http://procam.com/cdn/shop/products/canon-eos-r6-mark-ii-mirrorless-camera-procam-1.jpg?v=1768433949",
    condition: "Refurbished",
    shipping: "Free",
    timeLeft: "4d 2h",
    bids: 18,
    href: "/search?q=canon+eos+r6",
  },
];

const valueProps = [
  {
    id: "v1",
    icon: Shield,
    title: "eBay Money Back Guarantee",
    desc: "If an item doesn't arrive or isn't as described, we'll cover you. Shop with total confidence.",
    color: "#105CB6",
  },
  {
    id: "v2",
    icon: Truck,
    title: "Fast and Free Shipping",
    desc: "Millions of items ship free. Filter by delivery speed to find what you need, when you need it.",
    color: "#86B817",
  },
  {
    id: "v3",
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "Changed your mind? Many sellers offer hassle-free 30-day returns. Check the listing for details.",
    color: "#E53238",
  },
  {
    id: "v4",
    icon: Tag,
    title: "Best Price Guarantee",
    desc: "Find it cheaper elsewhere? We'll match it. Competitive prices across 1.4 billion listings.",
    color: "#F5AF02",
  },
];

const stats = [
  { id: "s1", value: "1.4B+", label: "Active Listings", icon: Package },
  { id: "s2", value: "135M+", label: "Active Buyers", icon: Users },
  { id: "s3", value: "190+", label: "Countries Served", icon: TrendingUp },
  { id: "s4", value: "99.8%", label: "Seller Satisfaction", icon: Award },
];

const testimonials = [
  {
    id: "t1",
    name: "Sarah M.",
    location: "Austin, TX",
    rating: 5,
    text: "Found a rare vintage camera lens I had been searching for years. The seller was fantastic and shipping was incredibly fast. eBay never disappoints.",
    avatar: "https://mormonartist.net/images/interviews/sarah-m-eden/sarah-m-eden-01.jpg",
    purchase: "Leica 50mm Summilux",
  },
  {
    id: "t2",
    name: "James K.",
    location: "Chicago, IL",
    rating: 5,
    text: "Sold my old gaming setup in under 48 hours. The listing process was smooth and I got way more than I expected. Will definitely sell here again.",
    avatar: "https://www.cultclassicmag.com/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fcultclassic%2FZtsdkxoQrfVKlzDS_0025_22.jpg%3Fauto%3Dformat%2Ccompress&w=3840&q=75",
    purchase: "PS5 Bundle",
  },
  {
    id: "t3",
    name: "Priya L.",
    location: "Seattle, WA",
    rating: 5,
    text: "The Money Back Guarantee gave me the confidence to buy a high-end watch. It arrived exactly as described. Absolutely love it.",
    avatar: "https://media.licdn.com/dms/image/v2/C5103AQERrtj7Jl7_Ng/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1516971376224?e=2147483647&v=beta&t=fR8TxIH8oaMAK1kQPRSQkRNLoNiqVUk0VGy7sgpRWBU",
    purchase: "Omega Seamaster",
  },
];

const trendingSearches = [
  "iPhone 15 Pro",
  "Air Jordan 1",
  "Vintage Levi's",
  "Nintendo Switch",
  "Rolex Submariner",
  "LEGO Sets",
  "Canon Camera",
  "Pokémon Cards",
];

// ─── Sub-components (inline) ─────────────────────────────────────────────────

function HeroBanner() {
  const [active, setActive] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const banner = heroBanners[active];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0a3d7a] to-[#105CB6] min-h-[480px] md:min-h-[520px]">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={banner?.image ?? "https://thumbs.dreamstime.com/b/top-view-responsive-design-mockup-office-desk-hero-modern-electronics-76293003.jpg"}
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${banner?.bg ?? "from-[#0a3d7a] to-[#105CB6]"} opacity-90 transition-all duration-700`} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
        {/* Tag */}
        <motion.div
          key={`tag-${active}`}
          initial={shouldReduce ? {} : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-white text-sm font-medium mb-6"
        >
          <Zap size={14} className="text-yellow-300" />
          {banner?.tag ?? "Limited Time"}
        </motion.div>

        {/* Headline */}
        <motion.h1
          key={`h1-${active}`}
          initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-black text-white tracking-tight text-balance mb-4 max-w-3xl"
        >
          {banner?.headline ?? "Shop Millions of Items"}
        </motion.h1>

        {/* Sub */}
        <motion.p
          key={`sub-${active}`}
          initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="text-white/80 text-lg md:text-xl max-w-xl mb-8 leading-relaxed text-pretty"
        >
          {banner?.sub ?? "Find exactly what you're looking for."}
        </motion.p>

        {/* Search bar */}
        <motion.form
          initial={shouldReduce ? {} : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.26 }}
          onSubmit={handleSearch}
          className="w-full max-w-2xl flex gap-0 rounded-full overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.25)] mb-8"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for anything..."
            className="flex-1 px-6 py-4 text-gray-800 text-base outline-none bg-white placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="bg-[#E53238] hover:bg-[#c42a2f] transition-colors px-8 py-4 text-white font-bold text-base flex items-center gap-2"
          >
            <Search size={18} />
            <span className="hidden sm:inline">Search</span>
          </button>
        </motion.form>

        {/* Trending searches */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.36 }}
          className="flex flex-wrap justify-center gap-2"
        >
          <span className="text-white/60 text-sm">Trending:</span>
          {trendingSearches.slice(0, 5).map((term) => (
            <Link
              key={term}
              href={`/search?q=${encodeURIComponent(term)}`}
              className="text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-full px-3 py-0.5 transition-all duration-200"
            >
              {term}
            </Link>
          ))}
        </motion.div>

        {/* Slide indicators */}
        <div className="flex gap-2 mt-10">
          {heroBanners.map((b, i) => (
            <button
              key={b.id}
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? "w-8 bg-white" : "w-2 bg-white/40"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* CTA button */}
      <motion.div
        key={`cta-${active}`}
        initial={shouldReduce ? {} : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="absolute bottom-8 right-8 hidden md:block"
      >
        <Link
          href={banner?.href ?? "/search"}
          className="inline-flex items-center gap-2 bg-white text-[#105CB6] font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm"
        >
          {banner?.cta ?? "Shop Now"}
          <ArrowRight size={16} />
        </Link>
      </motion.div>
    </section>
  );
}

function CategoryGrid() {
  const shouldReduce = useReducedMotion();

  return (
    <section id="categories" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          variants={shouldReduce ? {} : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={shouldReduce ? {} : fadeInUp} className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Shop by Category
            </h2>
            <Link
              href="/search"
              className="text-[#105CB6] hover:text-[#0a3d7a] font-semibold text-sm flex items-center gap-1 transition-colors"
            >
              All Categories <ChevronRight size={16} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                variants={shouldReduce ? {} : scaleIn}
                whileHover={shouldReduce ? {} : { scale: 1.06, y: -4 }}
                whileTap={shouldReduce ? {} : { scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={cat.href}
                  className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-2xl bg-[#F7F7F7] hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)] border border-transparent hover:border-black/5 transition-all duration-300 group"
                >
                  <span className="text-3xl md:text-4xl">{cat.icon}</span>
                  <span className="text-xs font-semibold text-gray-700 text-center leading-tight group-hover:text-gray-900 transition-colors">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TodaysDeals() {
  const [watchedIds, setWatchedIds] = useState<Set<string>>(new Set());
  const shouldReduce = useReducedMotion();

  const toggleWatch = (id: string) => {
    setWatchedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="deals" className="py-14 bg-[#F7F7F7]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          variants={shouldReduce ? {} : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* Header */}
          <motion.div variants={shouldReduce ? {} : fadeInUp} className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-[#E53238] rounded-full" />
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                  Today's Deals
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">Limited-time offers. Don't miss out.</p>
              </div>
            </div>
            <Link
              href="/search?sort=deals"
              className="text-[#105CB6] hover:text-[#0a3d7a] font-semibold text-sm flex items-center gap-1 transition-colors"
            >
              See All Deals <ChevronRight size={16} />
            </Link>
          </motion.div>

          {/* Cards grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {dealItems.map((item) => (
              <motion.div
                key={item.id}
                variants={shouldReduce ? {} : fadeInUp}
                whileHover={shouldReduce ? {} : { y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col"
              >
                <Link href={item.href} className="block relative">
                  <div className="aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {/* Discount badge */}
                  <span className="absolute top-2 left-2 bg-[#E53238] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    -{item.discount}%
                  </span>
                  {/* Watchlist */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWatch(item.id);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                    aria-label="Add to watchlist"
                  >
                    <Heart
                      size={14}
                      className={watchedIds.has(item.id) ? "fill-[#E53238] text-[#E53238]" : "text-gray-400"}
                    />
                  </button>
                </Link>

                <div className="p-3 flex flex-col flex-1">
                  <Link href={item.href}>
                    <p className="text-xs text-gray-700 font-medium leading-snug line-clamp-2 hover:text-[#105CB6] transition-colors mb-2">
                      {item.title}
                    </p>
                  </Link>

                  <div className="mt-auto">
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-lg font-black text-gray-900">
                        ${(item.salePrice ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="line-through">
                        ${(item.originalPrice ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="flex items-center gap-0.5 text-[#E53238] font-medium">
                        <Clock size={10} />
                        {item.timeLeft}
                      </span>
                    </div>
                    {item.bids > 0 && (
                      <p className="text-xs text-gray-500 mt-1">{item.bids} bids</p>
                    )}
                    <p className="text-xs text-[#86B817] font-medium mt-1">
                      {item.shipping === "Free" ? "Free shipping" : `$${item.shipping} shipping`}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturedListings() {
  const shouldReduce = useReducedMotion();
  const [watchedIds, setWatchedIds] = useState<Set<string>>(new Set());

  const toggleWatch = (id: string) => {
    setWatchedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const displayProducts = featuredProducts.slice(0, 4);

  return (
    <section id="featured" className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          variants={shouldReduce ? {} : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={shouldReduce ? {} : fadeInUp} className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-[#105CB6] rounded-full" />
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                  Featured Listings
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">Hand-picked by our team. Updated daily.</p>
              </div>
            </div>
            <Link
              href="/search"
              className="text-[#105CB6] hover:text-[#0a3d7a] font-semibold text-sm flex items-center gap-1 transition-colors"
            >
              View All <ChevronRight size={16} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={shouldReduce ? {} : scaleIn}
                whileHover={shouldReduce ? {} : { y: -6 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden flex flex-col"
              >
                <Link href={`/search?q=${encodeURIComponent(product.title)}`} className="block relative">
                  <div className="aspect-[4/3] overflow-hidden bg-gray-50">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {product.isAuction && (
                    <span className="absolute top-2 left-2 bg-[#F5AF02] text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full">
                      Auction
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWatch(product.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                    aria-label="Add to watchlist"
                  >
                    <Heart
                      size={15}
                      className={watchedIds.has(product.id) ? "fill-[#E53238] text-[#E53238]" : "text-gray-400"}
                    />
                  </button>
                </Link>

                <div className="p-4 flex flex-col flex-1">
                  <Link href={`/search?q=${encodeURIComponent(product.title)}`}>
                    <p className="text-sm text-gray-800 font-semibold leading-snug line-clamp-2 hover:text-[#105CB6] transition-colors mb-2">
                      {product.title}
                    </p>
                  </Link>

                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                      {product.condition}
                    </span>
                    {product.timeRemaining && (
                      <span className="text-xs text-[#E53238] flex items-center gap-0.5 font-medium">
                        <Clock size={10} />
                        {product.timeRemaining}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto">
                    {product.isAuction && product.currentBid != null ? (
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Current bid</p>
                        <p className="text-xl font-black text-gray-900">
                          ${(product.currentBid).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        {product.bidCount != null && (
                          <p className="text-xs text-gray-400">{product.bidCount} bids</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xl font-black text-gray-900">
                        ${(product.price ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    )}
                    <p className="text-xs text-[#86B817] font-medium mt-1">
                      {product.shipping === "Free" ? "Free shipping" : `$${product.shipping} shipping`}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {product.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ValueProps() {
  const shouldReduce = useReducedMotion();

  return (
    <section id="about" className="py-16 bg-gradient-to-br from-[#0a3d7a] to-[#105CB6]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          variants={shouldReduce ? {} : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={shouldReduce ? {} : fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
              Why Shop on eBay?
            </h2>
            <p className="text-white/70 text-lg max-w-xl mx-auto leading-relaxed text-pretty">
              Over 30 years of connecting buyers and sellers worldwide. Here's what makes us different.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((vp) => {
              const Icon = vp.icon;
              return (
                <motion.div
                  key={vp.id}
                  variants={shouldReduce ? {} : fadeInUp}
                  whileHover={shouldReduce ? {} : { scale: 1.03, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${vp.color}30` }}
                  >
                    <Icon size={24} style={{ color: "white" }} />
                  </div>
                  <h3 className="text-white font-bold text-base mb-2 leading-snug">{vp.title}</h3>
                  <p className="text-white/65 text-sm leading-relaxed">{vp.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatsBar() {
  const shouldReduce = useReducedMotion();

  return (
    <section className="py-12 bg-[#F7F7F7] border-y border-black/5">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          variants={shouldReduce ? {} : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                variants={shouldReduce ? {} : fadeInUp}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 bg-[#105CB6]/10 rounded-xl flex items-center justify-center mb-3">
                  <Icon size={22} className="text-[#105CB6]" />
                </div>
                <span className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                  {stat.value}
                </span>
                <span className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function Testimonials() {
  const shouldReduce = useReducedMotion();

  return (
    <section id="reviews" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          variants={shouldReduce ? {} : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={shouldReduce ? {} : fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-3">
              Millions of Happy Shoppers
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed text-pretty">
              Real stories from real buyers and sellers across the globe.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                variants={shouldReduce ? {} : i === 1 ? scaleIn : fadeInUp}
                whileHover={shouldReduce ? {} : { y: -4 }}
                transition={{ duration: 0.2 }}
                className={`bg-[#F7F7F7] rounded-2xl p-6 border border-black/5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] transition-all duration-300 ${
                  i === 1 ? "md:scale-105 md:shadow-[0_4px_20px_rgba(0,0,0,0.10)]" : ""
                }`}
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, ri) => (
                    <Star key={ri} size={14} className="fill-[#F5AF02] text-[#F5AF02]" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.location}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs bg-[#105CB6]/10 text-[#105CB6] px-2 py-0.5 rounded-full font-medium">
                      {t.purchase}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SellCTA() {
  const shouldReduce = useReducedMotion();

  return (
    <section id="sell" className="py-16 bg-[#F7F7F7]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          variants={shouldReduce ? {} : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          {/* Left: copy */}
          <motion.div variants={shouldReduce ? {} : slideInLeft}>
            <span className="inline-block bg-[#86B817]/15 text-[#86B817] text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              Start Selling Today
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4 text-balance">
              Turn Your Clutter Into Cash
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6 text-pretty">
              List your first item in minutes. Reach 135 million active buyers worldwide. No upfront fees. Pay only when you sell.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Free listings every month for all sellers",
                "Seller protections built into every transaction",
                "Powerful tools to manage your store and inventory",
                "Fast payouts directly to your bank account",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-gray-700 text-sm">
                  <span className="w-5 h-5 bg-[#86B817] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/sell-list-item"
                className="inline-flex items-center gap-2 bg-[#E53238] hover:bg-[#c42a2f] text-white font-bold px-7 py-3.5 rounded-full shadow-[0_4px_16px_rgba(229,50,56,0.35)] hover:shadow-[0_6px_24px_rgba(229,50,56,0.45)] hover:scale-105 transition-all duration-300 text-sm"
              >
                List an Item <ArrowRight size={16} />
              </Link>
              <Link
                href="/seller-dashboard"
                className="inline-flex items-center gap-2 bg-white border border-black/10 text-gray-700 hover:text-gray-900 font-semibold px-7 py-3.5 rounded-full hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] hover:scale-105 transition-all duration-300 text-sm"
              >
                Seller Dashboard
              </Link>
            </div>
          </motion.div>

          {/* Right: image card */}
          <motion.div variants={shouldReduce ? {} : slideInRight} className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.15)]">
              <img
                src="https://litcommerce.com/blog/wp-content/uploads/2024/01/multi-quantity-ebay-listing-1024x545.webp"
                alt="Seller listing items on eBay"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#86B817] rounded-xl flex items-center justify-center">
                      <TrendingUp size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-sm">$2,340 earned this month</p>
                      <p className="text-xs text-gray-500">by top_seller_jane</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-xs text-[#86B817] font-bold">+18%</p>
                      <p className="text-xs text-gray-400">vs last month</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={shouldReduce ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-[#F5AF02] text-gray-900 font-black text-sm px-4 py-2 rounded-2xl shadow-lg"
            >
              Zero listing fees!
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const shouldReduce = useReducedMotion();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section id="contact" className="py-16 bg-[#333333]">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <motion.div
          variants={shouldReduce ? {} : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={shouldReduce ? {} : fadeInUp}>
            <span className="inline-block bg-[#E53238]/20 text-[#E53238] text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider border border-[#E53238]/30">
              Exclusive Deals
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3 text-balance">
              Get Deals Delivered to Your Inbox
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed text-pretty">
              Subscribe and be the first to know about flash sales, trending items, and personalized picks just for you.
            </p>
          </motion.div>

          <motion.div variants={shouldReduce ? {} : scaleIn}>
            {submitted ? (
              <div className="bg-[#86B817]/15 border border-[#86B817]/30 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-[#86B817] rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                    <path d="M1 8L7 14L19 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-white font-bold text-lg">You're in!</p>
                <p className="text-gray-400 text-sm mt-1">Check your inbox for a welcome gift.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/15 text-white placeholder:text-gray-500 outline-none focus:border-[#105CB6] focus:bg-white/15 transition-all duration-200 text-sm"
                />
                <button
                  type="submit"
                  className="bg-[#E53238] hover:bg-[#c42a2f] text-white font-bold px-7 py-3.5 rounded-full shadow-[0_4px_16px_rgba(229,50,56,0.35)] hover:shadow-[0_6px_24px_rgba(229,50,56,0.45)] hover:scale-105 transition-all duration-300 text-sm whitespace-nowrap"
                >
                  Subscribe Now
                </button>
              </form>
            )}
            <p className="text-gray-600 text-xs mt-4">
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroBanner />
      <CategoryGrid />
      <TodaysDeals />
      <FeaturedListings />
      <ValueProps />
      <StatsBar />
      <Testimonials />
      <SellCTA />
      <NewsletterCTA />
    </main>
  );
}