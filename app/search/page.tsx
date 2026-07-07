"use client";

import { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Search, SlidersHorizontal, ChevronDown, ChevronRight, Heart, Star, MapPin, Clock, Tag, X, Check, ArrowUpDown, Grid, List, ChevronLeft, AlertCircle, Truck } from 'lucide-react';
import { featuredProducts, categories, type Product } from "@/lib/data";
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { useTranslations } from "next-intl";

// ─── Supplemental mock products to enrich results ───────────────────────────

const extraProducts: Product[] = [
  {
    id: "e1",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones Black",
    price: 279.99,
    isAuction: false,
    isBuyNow: true,
    image: "/images/sony-wh1000xm5-headphones-black.jpg",
    images: ["/images/sony-wh1000xm5-headphones-black.jpg"],
    category: "electronics",
    condition: "New",
    seller: "audio_world_store",
    sellerRating: 99.2,
    location: "New York, NY",
    shipping: "Free",
    watchCount: 87,
    description: "Sony WH-1000XM5 with industry-leading noise cancellation. 30-hour battery life.",
  },
  {
    id: "e2",
    title: "Samsung 65-inch QLED 4K Smart TV QN65Q80C 2023 Model",
    price: 1099.99,
    currentBid: 950.0,
    bidCount: 14,
    isAuction: true,
    isBuyNow: true,
    buyNowPrice: 1099.99,
    image: "/images/samsung-65-qled-4k-tv.jpg",
    images: ["/images/samsung-65-qled-4k-tv.jpg"],
    category: "electronics",
    condition: "New",
    seller: "electronics_hub",
    sellerRating: 98.7,
    location: "Chicago, IL",
    timeRemaining: "1d 8h",
    shipping: "Free",
    watchCount: 203,
    description: "Samsung 65-inch QLED 4K Smart TV with Quantum HDR and built-in Alexa.",
  },
  {
    id: "e3",
    title: "Nike Air Jordan 1 Retro High OG Chicago Men's Size 10",
    price: 349.0,
    isAuction: false,
    isBuyNow: true,
    image: "/images/nike-air-jordan-1-chicago-red.jpg",
    images: ["/images/nike-air-jordan-1-chicago-red.jpg"],
    category: "fashion",
    condition: "New",
    seller: "sneaker_vault",
    sellerRating: 99.5,
    location: "Los Angeles, CA",
    shipping: "Free",
    watchCount: 312,
    description: "Authentic Nike Air Jordan 1 Retro High OG Chicago colorway. DS in box.",
  },
  {
    id: "e4",
    title: "Vintage Rolex Submariner 16610 Stainless Steel Black Dial 2001",
    price: 8500.0,
    currentBid: 7800.0,
    bidCount: 41,
    isAuction: true,
    isBuyNow: false,
    image: "/images/rolex-submariner-16610-black-dial.jpg",
    images: ["/images/rolex-submariner-16610-black-dial.jpg"],
    category: "collectibles",
    condition: "Used",
    seller: "luxury_timepieces",
    sellerRating: 100,
    location: "Beverly Hills, CA",
    timeRemaining: "3d 12h",
    shipping: 25,
    watchCount: 589,
    description: "Authentic Rolex Submariner 16610 from 2001. Full set with box and papers.",
  },
  {
    id: "e5",
    title: "LEGO Technic Bugatti Chiron 42083 Complete Set with Instructions",
    price: 189.99,
    isAuction: false,
    isBuyNow: true,
    image: "/images/lego-technic-bugatti-chiron-42083.jpg",
    images: ["/images/lego-technic-bugatti-chiron-42083.jpg"],
    category: "toys",
    condition: "Used",
    seller: "brick_collector",
    sellerRating: 97.3,
    location: "Austin, TX",
    shipping: 12,
    watchCount: 64,
    description: "Complete LEGO Technic Bugatti Chiron set. All pieces present, instructions included.",
  },
  {
    id: "e6",
    title: "Canon EOS R5 Mirrorless Camera Body Only 45MP Full Frame",
    price: 2899.0,
    currentBid: 2650.0,
    bidCount: 8,
    isAuction: true,
    isBuyNow: true,
    buyNowPrice: 2899.0,
    image: "https://content.abt.com/image.php/4f99a48ed93890932b0e789e025d8b3d?image=/images/products/BDP_Images/big-EOSR5-BODY.jpg&ck=2&width=750&height=550&canvas",
    images: ["https://content.abt.com/image.php/4f99a48ed93890932b0e789e025d8b3d?image=/images/products/BDP_Images/big-EOSR5-BODY.jpg&ck=2&width=750&height=550&canvas"],
    category: "electronics",
    condition: "Refurbished",
    seller: "camera_pro_deals",
    sellerRating: 98.1,
    location: "Seattle, WA",
    timeRemaining: "5d 2h",
    shipping: "Free",
    watchCount: 178,
    description: "Canon EOS R5 body only. Certified refurbished with 90-day warranty.",
  },
  {
    id: "e7",
    title: "Dyson V15 Detect Absolute Cordless Vacuum Cleaner Gold",
    price: 649.99,
    isAuction: false,
    isBuyNow: true,
    image: "/images/dyson-v15-detect-cordless-vacuum.jpg",
    images: ["/images/dyson-v15-detect-cordless-vacuum.jpg"],
    category: "home",
    condition: "New",
    seller: "home_essentials_co",
    sellerRating: 99.0,
    location: "Dallas, TX",
    shipping: "Free",
    watchCount: 95,
    description: "Dyson V15 Detect with laser dust detection and HEPA filtration. 60-min runtime.",
  },
  {
    id: "e8",
    title: "Vintage 1st Edition Harry Potter Philosopher's Stone UK Hardcover",
    price: 4200.0,
    currentBid: 3900.0,
    bidCount: 29,
    isAuction: true,
    isBuyNow: false,
    image: "/images/harry-potter-first-edition-hardcover.jpg",
    images: ["/images/harry-potter-first-edition-hardcover.jpg"],
    category: "books",
    condition: "Used",
    seller: "rare_books_emporium",
    sellerRating: 99.9,
    location: "London, UK",
    timeRemaining: "6d 18h",
    shipping: 35,
    watchCount: 441,
    description: "True first edition, first printing Harry Potter and the Philosopher's Stone. Bloomsbury 1997.",
  },
  {
    id: "e9",
    title: "Apple iPhone 15 Pro Max 256GB Natural Titanium Unlocked",
    price: 1099.0,
    isAuction: false,
    isBuyNow: true,
    image: "/images/apple-iphone-15-pro-max-titanium.jpg",
    images: ["/images/apple-iphone-15-pro-max-titanium.jpg"],
    category: "electronics",
    condition: "New",
    seller: "apple_authorized_reseller",
    sellerRating: 99.7,
    location: "San Francisco, CA",
    shipping: "Free",
    watchCount: 267,
    description: "Apple iPhone 15 Pro Max 256GB in Natural Titanium. Factory unlocked, sealed box.",
  },
  {
    id: "e10",
    title: "Adidas Yeezy Boost 350 V2 Zebra CP9654 Size 11 DS",
    price: 299.0,
    currentBid: 260.0,
    bidCount: 17,
    isAuction: true,
    isBuyNow: true,
    buyNowPrice: 299.0,
    image: "/images/adidas-yeezy-boost-350-v2-zebra.jpg",
    images: ["/images/adidas-yeezy-boost-350-v2-zebra.jpg"],
    category: "fashion",
    condition: "New",
    seller: "kicks_kingdom",
    sellerRating: 98.4,
    location: "Miami, FL",
    timeRemaining: "12h 30m",
    shipping: "Free",
    watchCount: 198,
    description: "Deadstock Adidas Yeezy Boost 350 V2 Zebra. Size 11 US. Original box included.",
  },
  {
    id: "e11",
    title: "Weber Spirit II E-310 3-Burner Propane Gas Grill Black",
    price: 499.0,
    isAuction: false,
    isBuyNow: true,
    image: "/images/weber-spirit-ii-e310-gas-grill.jpg",
    images: ["/images/weber-spirit-ii-e310-gas-grill.jpg"],
    category: "home",
    condition: "New",
    seller: "outdoor_living_store",
    sellerRating: 97.8,
    location: "Phoenix, AZ",
    shipping: 49,
    watchCount: 43,
    description: "Weber Spirit II E-310 with GS4 grilling system. 529 sq in cooking area.",
  },
  {
    id: "e12",
    title: "Pokémon Charizard Holo 1st Edition Base Set PSA 9 MINT",
    price: 12500.0,
    currentBid: 11000.0,
    bidCount: 67,
    isAuction: true,
    isBuyNow: false,
    image: "/images/pokemon-charizard-holo-1st-edition-psa9.jpg",
    images: ["/images/pokemon-charizard-holo-1st-edition-psa9.jpg"],
    category: "collectibles",
    condition: "Used",
    seller: "card_grail_collector",
    sellerRating: 100,
    location: "Portland, OR",
    timeRemaining: "4d 6h",
    shipping: "Free",
    watchCount: 1204,
    description: "PSA 9 MINT graded Charizard Holo 1st Edition from the original Base Set. Investment grade.",
  },
];

const allProducts: Product[] = [...featuredProducts, ...extraProducts];

// ─── Types ───────────────────────────────────────────────────────────────────

type SortKey = "best_match" | "price_low" | "price_high" | "ending_soonest" | "newly_listed" | "most_watched";
type ViewMode = "grid" | "list";
type ConditionFilter = "New" | "Used" | "Refurbished" | "For Parts";

interface FilterState {
  category: string;
  minPrice: string;
  maxPrice: string;
  conditions: ConditionFilter[];
  freeShipping: boolean;
  location: string;
  minSellerRating: number;
  listingType: "all" | "auction" | "buy_now";
}

const DEFAULT_FILTERS: FilterState = {
  category: "all",
  minPrice: "",
  maxPrice: "",
  conditions: [],
  freeShipping: false,
  location: "",
  minSellerRating: 0,
  listingType: "all",
};

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "best_match", label: "Best Match" },
  { key: "price_low", label: "Price: Lowest First" },
  { key: "price_high", label: "Price: Highest First" },
  { key: "ending_soonest", label: "Time: Ending Soonest" },
  { key: "newly_listed", label: "Newly Listed" },
  { key: "most_watched", label: "Most Watched" },
];

const ITEMS_PER_PAGE = 12;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getEffectivePrice(p: Product): number {
  if (p.isAuction && p.currentBid != null) return p.currentBid;
  return p.price;
}

function formatPrice(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function matchesQuery(p: Product, q: string): boolean {
  if (!q) return true;
  const lower = q.toLowerCase();
  return (
    p.title.toLowerCase().includes(lower) ||
    p.category.toLowerCase().includes(lower) ||
    p.description.toLowerCase().includes(lower) ||
    p.seller.toLowerCase().includes(lower)
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const cardHover: Variants = {
  rest: { y: 0, boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.08)" },
  hover: { y: -4, boxShadow: "0 4px 8px rgba(0,0,0,0.06), 0 16px 32px -8px rgba(0,0,0,0.14)" },
};

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
      <span className="ml-1 text-xs text-gray-500">{rating.toFixed(1)}%</span>
    </span>
  );
}

function ConditionBadge({ condition }: { condition: Product["condition"] }) {
  const map: Record<Product["condition"], string> = {
    New: "bg-[#86B817]/10 text-[#5a7d10]",
    Used: "bg-gray-100 text-gray-600",
    Refurbished: "bg-[#105CB6]/10 text-[#105CB6]",
    "For Parts": "bg-red-50 text-red-600",
  };
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${map[condition]}`}>
      {condition}
    </span>
  );
}

function ProductCardGrid({ product, watched, onToggleWatch }: { product: Product; watched: boolean; onToggleWatch: (id: string) => void }) {
  const effectivePrice = getEffectivePrice(product);
  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="bg-white rounded-xl border border-black/5 overflow-hidden flex flex-col cursor-pointer"
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.08)" }}
    >
      <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/product-placeholder.jpg";
          }}
        />
        {product.isAuction && (
          <span className="absolute top-2 left-2 bg-[#E53238] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            AUCTION
          </span>
        )}
        {product.timeRemaining && (
          <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
            <Clock size={9} /> {product.timeRemaining}
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); onToggleWatch(product.id); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart size={13} className={watched ? "fill-[#E53238] text-[#E53238]" : "text-gray-400"} />
        </button>
      </Link>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <ConditionBadge condition={product.condition} />
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug hover:text-[#105CB6] transition-colors">
            {product.title}
          </h3>
        </Link>
        <div className="mt-auto pt-1">
          {product.isAuction && product.currentBid != null ? (
            <div>
              <p className="text-xs text-gray-500">Current bid</p>
              <p className="text-lg font-bold text-gray-900">{formatPrice(product.currentBid)}</p>
              <p className="text-xs text-gray-400">{product.bidCount ?? 0} bids</p>
            </div>
          ) : (
            <p className="text-lg font-bold text-gray-900">{formatPrice(effectivePrice)}</p>
          )}
          {product.isBuyNow && product.buyNowPrice != null && product.isAuction && (
            <p className="text-xs text-[#105CB6] font-medium">Buy It Now: {formatPrice(product.buyNowPrice)}</p>
          )}
          <div className="flex items-center gap-1 mt-1">
            {product.shipping === "Free" ? (
              <span className="text-xs text-[#86B817] font-semibold flex items-center gap-0.5">
                <Truck size={10} /> Free shipping
              </span>
            ) : (
              <span className="text-xs text-gray-500">+{formatPrice(product.shipping as number)} shipping</span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <MapPin size={10} className="text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-400 truncate">{product.location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProductCardList({ product, watched, onToggleWatch }: { product: Product; watched: boolean; onToggleWatch: (id: string) => void }) {
  const effectivePrice = getEffectivePrice(product);
  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="bg-white rounded-xl border border-black/5 overflow-hidden flex gap-0 cursor-pointer"
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.08)" }}
    >
      <Link href={`/product/${product.id}`} className="relative w-40 sm:w-52 flex-shrink-0 bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/product-placeholder.jpg";
          }}
        />
        {product.isAuction && (
          <span className="absolute top-2 left-2 bg-[#E53238] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            AUCTION
          </span>
        )}
      </Link>
      <div className="flex-1 p-4 flex flex-col gap-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <ConditionBadge condition={product.condition} />
              {product.timeRemaining && (
                <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
                  <Clock size={9} /> {product.timeRemaining}
                </span>
              )}
            </div>
            <Link href={`/product/${product.id}`}>
              <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug hover:text-[#105CB6] transition-colors">
                {product.title}
              </h3>
            </Link>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); onToggleWatch(product.id); }}
            className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center hover:scale-110 transition-transform flex-shrink-0"
          >
            <Heart size={13} className={watched ? "fill-[#E53238] text-[#E53238]" : "text-gray-400"} />
          </button>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{product.description}</p>
        <div className="flex items-end justify-between mt-auto">
          <div>
            {product.isAuction && product.currentBid != null ? (
              <div>
                <p className="text-xs text-gray-500">Current bid</p>
                <p className="text-xl font-bold text-gray-900">{formatPrice(product.currentBid)}</p>
                <p className="text-xs text-gray-400">{product.bidCount ?? 0} bids</p>
              </div>
            ) : (
              <p className="text-xl font-bold text-gray-900">{formatPrice(effectivePrice)}</p>
            )}
            {product.isBuyNow && product.buyNowPrice != null && product.isAuction && (
              <p className="text-xs text-[#105CB6] font-medium">Buy It Now: {formatPrice(product.buyNowPrice)}</p>
            )}
            <div className="flex items-center gap-3 mt-1">
              {product.shipping === "Free" ? (
                <span className="text-xs text-[#86B817] font-semibold flex items-center gap-0.5">
                  <Truck size={10} /> Free shipping
                </span>
              ) : (
                <span className="text-xs text-gray-500">+{formatPrice(product.shipping as number)} shipping</span>
              )}
              <span className="text-xs text-gray-400 flex items-center gap-0.5">
                <MapPin size={10} /> {product.location}
              </span>
            </div>
          </div>
          <div className="text-right">
            <StarRating rating={product.sellerRating} />
            <p className="text-xs text-gray-400 mt-0.5">{product.seller}</p>
            <p className="text-xs text-gray-400">{product.watchCount} watching</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function SearchPageInner() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryParam = searchParams.get("q") ?? "";
  const categoryParam = searchParams.get("category") ?? "all";

  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    category: categoryParam !== "all" ? categoryParam : "all",
  });
  const [sort, setSort] = useState<SortKey>("best_match");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);
  const [watchedIds, setWatchedIds] = useState<Set<string>>(new Set());
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(queryParam);

  // Sync category param
  useEffect(() => {
    if (categoryParam && categoryParam !== "all") {
      setFilters((f) => ({ ...f, category: categoryParam }));
    }
  }, [categoryParam]);

  const toggleWatch = useCallback((id: string) => {
    setWatchedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleCondition = useCallback((c: ConditionFilter) => {
    setFilters((f) => {
      const has = f.conditions.includes(c);
      return {
        ...f,
        conditions: has ? f.conditions.filter((x) => x !== c) : [...f.conditions, c],
      };
    });
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS });
    setPage(1);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", localSearch);
    router.push(`/search?${params.toString()}`);
  };

  // ── Filtering ──
  const filtered = useMemo(() => {
    let results = allProducts.filter((p) => matchesQuery(p, queryParam));

    if (filters.category !== "all") {
      results = results.filter((p) => p.category === filters.category);
    }
    if (filters.conditions.length > 0) {
      results = results.filter((p) => filters.conditions.includes(p.condition as ConditionFilter));
    }
    if (filters.freeShipping) {
      results = results.filter((p) => p.shipping === "Free");
    }
    if (filters.minPrice !== "") {
      const min = parseFloat(filters.minPrice);
      if (!isNaN(min)) results = results.filter((p) => getEffectivePrice(p) >= min);
    }
    if (filters.maxPrice !== "") {
      const max = parseFloat(filters.maxPrice);
      if (!isNaN(max)) results = results.filter((p) => getEffectivePrice(p) <= max);
    }
    if (filters.minSellerRating > 0) {
      results = results.filter((p) => p.sellerRating >= filters.minSellerRating);
    }
    if (filters.listingType === "auction") {
      results = results.filter((p) => p.isAuction);
    } else if (filters.listingType === "buy_now") {
      results = results.filter((p) => p.isBuyNow);
    }
    if (filters.location) {
      const loc = filters.location.toLowerCase();
      results = results.filter((p) => p.location.toLowerCase().includes(loc));
    }

    // Sort
    switch (sort) {
      case "price_low":
        results = [...results].sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
        break;
      case "price_high":
        results = [...results].sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
        break;
      case "ending_soonest":
        results = [...results].sort((a, b) => {
          if (a.timeRemaining && b.timeRemaining) return a.timeRemaining.localeCompare(b.timeRemaining);
          if (a.timeRemaining) return -1;
          if (b.timeRemaining) return 1;
          return 0;
        });
        break;
      case "most_watched":
        results = [...results].sort((a, b) => b.watchCount - a.watchCount);
        break;
      case "newly_listed":
        results = [...results].sort((a, b) => parseInt(b.id.replace("e", "9")) - parseInt(a.id.replace("e", "9")));
        break;
      default:
        break;
    }

    return results;
  }, [queryParam, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const activeSortLabel = SORT_OPTIONS.find((s) => s.key === sort)?.label ?? "Best Match";

  const activeFilterCount =
    (filters.category !== "all" ? 1 : 0) +
    filters.conditions.length +
    (filters.freeShipping ? 1 : 0) +
    (filters.minPrice !== "" || filters.maxPrice !== "" ? 1 : 0) +
    (filters.minSellerRating > 0 ? 1 : 0) +
    (filters.listingType !== "all" ? 1 : 0) +
    (filters.location !== "" ? 1 : 0);

  const currentCategory = categories.find((c) => c.id === filters.category);

  // ── Sidebar ──
  const Sidebar = (
    <aside className="w-full">
      <div className="bg-white rounded-xl border border-black/5 overflow-hidden" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.08)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-black/5">
          <span className="font-semibold text-sm text-gray-800 flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-[#105CB6]" /> Filters
            {activeFilterCount > 0 && (
              <span className="bg-[#E53238] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </span>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="text-xs text-[#105CB6] hover:underline font-medium">
              Clear all
            </button>
          )}
        </div>

        <div className="p-4 space-y-5">
          {/* Category */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</p>
            <div className="space-y-1">
              <button
                onClick={() => { setFilters((f) => ({ ...f, category: "all" })); setPage(1); }}
                className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${filters.category === "all" ? "bg-[#105CB6]/10 text-[#105CB6] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setFilters((f) => ({ ...f, category: cat.id })); setPage(1); }}
                  className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${filters.category === cat.id ? "bg-[#105CB6]/10 text-[#105CB6] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <span>{cat.icon}</span> {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-black/5" />

          {/* Price Range */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Price Range</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => { setFilters((f) => ({ ...f, minPrice: e.target.value })); setPage(1); }}
                className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6]"
              />
              <span className="text-gray-400 text-sm flex-shrink-0">to</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => { setFilters((f) => ({ ...f, maxPrice: e.target.value })); setPage(1); }}
                className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6]"
              />
            </div>
          </div>

          <div className="border-t border-black/5" />

          {/* Condition */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Condition</p>
            <div className="space-y-1.5">
              {(["New", "Used", "Refurbished", "For Parts"] as ConditionFilter[]).map((c) => (
                <label key={c} className="flex items-center gap-2 cursor-pointer group">
                  <button
                    onClick={() => toggleCondition(c)}
                    className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${filters.conditions.includes(c) ? "bg-[#105CB6] border-[#105CB6]" : "border-gray-300 group-hover:border-[#105CB6]"}`}
                  >
                    {filters.conditions.includes(c) && <Check size={10} className="text-white" />}
                  </button>
                  <span className="text-sm text-gray-700">{c}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-black/5" />

          {/* Listing Type */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Listing Type</p>
            <div className="space-y-1">
              {[{ key: "all", label: "All Listings" }, { key: "auction", label: "Auction" }, { key: "buy_now", label: "Buy It Now" }].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => { setFilters((f) => ({ ...f, listingType: opt.key as FilterState["listingType"] })); setPage(1); }}
                  className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${filters.listingType === opt.key ? "bg-[#105CB6]/10 text-[#105CB6] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-black/5" />

          {/* Shipping */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer group">
              <button
                onClick={() => { setFilters((f) => ({ ...f, freeShipping: !f.freeShipping })); setPage(1); }}
                className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${filters.freeShipping ? "bg-[#105CB6] border-[#105CB6]" : "border-gray-300 group-hover:border-[#105CB6]"}`}
              >
                {filters.freeShipping && <Check size={10} className="text-white" />}
              </button>
              <span className="text-sm text-gray-700 font-medium">Free Shipping Only</span>
            </label>
          </div>

          <div className="border-t border-black/5" />

          {/* Location */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Item Location</p>
            <input
              type="text"
              placeholder="City, State, or Country"
              value={filters.location}
              onChange={(e) => { setFilters((f) => ({ ...f, location: e.target.value })); setPage(1); }}
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6]"
            />
          </div>

          <div className="border-t border-black/5" />

          {/* Seller Rating */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Seller Rating</p>
            <div className="space-y-1">
              {[{ val: 0, label: "Any Rating" }, { val: 95, label: "95% and above" }, { val: 98, label: "98% and above" }, { val: 99, label: "99% and above" }].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => { setFilters((f) => ({ ...f, minSellerRating: opt.val })); setPage(1); }}
                  className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${filters.minSellerRating === opt.val ? "bg-[#105CB6]/10 text-[#105CB6] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Search bar strip */}
      <div className="bg-white border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-2xl">
            <div className="flex-1 relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search for anything"
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6] transition-all"
              />
            </div>
            <button
              type="submit"
              className="bg-[#105CB6] hover:bg-[#0d4d9e] text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              Search
            </button>
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
          {currentCategory ? (
            <>
              <Link href="/search" className="hover:text-[#105CB6] transition-colors">Search</Link>
              <ChevronRight size={12} />
              <span className="text-gray-800 font-medium">{currentCategory.name}</span>
            </>
          ) : queryParam ? (
            <>
              <Link href="/search" className="hover:text-[#105CB6] transition-colors">Search</Link>
              <ChevronRight size={12} />
              <span className="text-gray-800 font-medium truncate max-w-xs">{queryParam}</span>
            </>
          ) : (
            <span className="text-gray-800 font-medium">All Results</span>
          )}
        </motion.nav>

        {/* Page heading + result count */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-5"
        >
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            {queryParam ? (
              <>Results for <span className="text-[#105CB6]">&ldquo;{queryParam}&rdquo;</span></>
            ) : currentCategory ? (
              <>{currentCategory.icon} {currentCategory.name}</>
            ) : (
              "All Listings"
            )}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1.5 bg-[#105CB6]/10 text-[#105CB6] text-xs font-bold px-2.5 py-1 rounded-full">
              {filtered.length.toLocaleString("en-US")} results
            </span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <SlidersHorizontal size={11} /> {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} applied
              </span>
            )}
          </div>
        </motion.div>

        {/* Active filter chips */}
        <AnimatePresence>
          {activeFilterCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 mb-4"
            >
              {filters.category !== "all" && (
                <span className="inline-flex items-center gap-1 bg-white border border-[#105CB6]/30 text-[#105CB6] text-xs px-2.5 py-1 rounded-full">
                  {categories.find((c) => c.id === filters.category)?.name ?? filters.category}
                  <button onClick={() => { setFilters((f) => ({ ...f, category: "all" })); setPage(1); }}>
                    <X size={11} />
                  </button>
                </span>
              )}
              {filters.conditions.map((c) => (
                <span key={c} className="inline-flex items-center gap-1 bg-white border border-[#105CB6]/30 text-[#105CB6] text-xs px-2.5 py-1 rounded-full">
                  {c}
                  <button onClick={() => toggleCondition(c)}><X size={11} /></button>
                </span>
              ))}
              {filters.freeShipping && (
                <span className="inline-flex items-center gap-1 bg-white border border-[#105CB6]/30 text-[#105CB6] text-xs px-2.5 py-1 rounded-full">
                  Free Shipping
                  <button onClick={() => { setFilters((f) => ({ ...f, freeShipping: false })); setPage(1); }}><X size={11} /></button>
                </span>
              )}
              {(filters.minPrice !== "" || filters.maxPrice !== "") && (
                <span className="inline-flex items-center gap-1 bg-white border border-[#105CB6]/30 text-[#105CB6] text-xs px-2.5 py-1 rounded-full">
                  Price: {filters.minPrice !== "" ? `$${filters.minPrice}` : "Any"} to {filters.maxPrice !== "" ? `$${filters.maxPrice}` : "Any"}
                  <button onClick={() => { setFilters((f) => ({ ...f, minPrice: "", maxPrice: "" })); setPage(1); }}><X size={11} /></button>
                </span>
              )}
              {filters.listingType !== "all" && (
                <span className="inline-flex items-center gap-1 bg-white border border-[#105CB6]/30 text-[#105CB6] text-xs px-2.5 py-1 rounded-full">
                  {filters.listingType === "auction" ? "Auction" : "Buy It Now"}
                  <button onClick={() => { setFilters((f) => ({ ...f, listingType: "all" })); setPage(1); }}><X size={11} /></button>
                </span>
              )}
              {filters.minSellerRating > 0 && (
                <span className="inline-flex items-center gap-1 bg-white border border-[#105CB6]/30 text-[#105CB6] text-xs px-2.5 py-1 rounded-full">
                  Seller {filters.minSellerRating}%+
                  <button onClick={() => { setFilters((f) => ({ ...f, minSellerRating: 0 })); setPage(1); }}><X size={11} /></button>
                </span>
              )}
              {filters.location !== "" && (
                <span className="inline-flex items-center gap-1 bg-white border border-[#105CB6]/30 text-[#105CB6] text-xs px-2.5 py-1 rounded-full">
                  Near: {filters.location}
                  <button onClick={() => { setFilters((f) => ({ ...f, location: "" })); setPage(1); }}><X size={11} /></button>
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-6">
          {/* Sidebar — desktop */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            animate="visible"
            className="hidden lg:block w-56 flex-shrink-0"
          >
            {Sidebar}
          </motion.div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-4">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-white border border-black/5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
              >
                <SlidersHorizontal size={14} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-[#E53238] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2 ml-auto">
                {/* Sort dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-white border border-black/5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                    style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
                  >
                    <ArrowUpDown size={13} />
                    <span className="hidden sm:inline">{activeSortLabel}</span>
                    <span className="sm:hidden">Sort</span>
                    <ChevronDown size={13} className={`transition-transform ${sortDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {sortDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-1 bg-white border border-black/5 rounded-xl shadow-lg z-20 min-w-[200px] overflow-hidden"
                      >
                        {SORT_OPTIONS.map((opt) => (
                          <button
                            key={opt.key}
                            onClick={() => { setSort(opt.key); setSortDropdownOpen(false); setPage(1); }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${sort === opt.key ? "bg-[#105CB6]/5 text-[#105CB6] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                          >
                            {opt.label}
                            {sort === opt.key && <Check size={13} />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* View toggle */}
                <div className="flex items-center bg-white border border-black/5 rounded-xl overflow-hidden" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-colors ${viewMode === "grid" ? "bg-[#105CB6] text-white" : "text-gray-500 hover:bg-gray-50"}`}
                  >
                    <Grid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-colors ${viewMode === "list" ? "bg-[#105CB6] text-white" : "text-gray-500 hover:bg-gray-50"}`}
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile sidebar drawer */}
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden mb-4 overflow-hidden"
                >
                  {Sidebar}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            {paginated.length === 0 ? (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-xl border border-black/5 p-12 text-center"
                style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px -4px rgba(0,0,0,0.08)" }}
              >
                <AlertCircle size={40} className="text-gray-300 mx-auto mb-3" />
                <h2 className="text-lg font-semibold text-gray-700 mb-1">No results found</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Try adjusting your filters or searching for something else.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-[#105CB6] hover:bg-[#0d4d9e] text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                  Clear all filters
                </button>
              </motion.div>
            ) : viewMode === "grid" ? (
              <motion.div
                key={`grid-${page}-${sort}-${JSON.stringify(filters)}`}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3"
              >
                {paginated.map((product) => (
                  <motion.div key={product.id} variants={scaleIn}>
                    <ProductCardGrid
                      product={product}
                      watched={watchedIds.has(product.id)}
                      onToggleWatch={toggleWatch}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={`list-${page}-${sort}-${JSON.stringify(filters)}`}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-3"
              >
                {paginated.map((product) => (
                  <motion.div key={product.id} variants={fadeInUp}>
                    <ProductCardList
                      product={product}
                      watched={watchedIds.has(product.id)}
                      onToggleWatch={toggleWatch}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-center justify-center gap-2 mt-8"
              >
                <button
                  onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === 1}
                  className="w-9 h-9 rounded-xl border border-black/5 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                  .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "..." ? (
                      <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
                        ...
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => { setPage(item as number); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className={`w-9 h-9 rounded-xl border text-sm font-medium transition-colors ${page === item ? "bg-[#105CB6] text-white border-[#105CB6]" : "bg-white border-black/5 text-gray-700 hover:bg-gray-50"}`}
                        style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === totalPages}
                  className="w-9 h-9 rounded-xl border border-black/5 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
                >
                  <ChevronRight size={16} />
                </button>
              </motion.div>
            )}

            {/* Pagination info */}
            {filtered.length > 0 && (
              <p className="text-center text-xs text-gray-400 mt-3">
                Showing {((page - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length.toLocaleString("en-US")} results
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Needed for slideInLeft used above
const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageInner />
    </Suspense>
  );
}
