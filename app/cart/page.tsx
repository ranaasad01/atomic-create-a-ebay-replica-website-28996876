"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Heart, ShoppingCart, ChevronRight, Shield, Truck, RotateCcw, Tag, Plus, Minus, X } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { useTranslations } from "next-intl";

interface CartItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  condition: string;
  seller: string;
  sellerRating: number;
  shipping: number | "Free";
  quantity: number;
  maxQuantity: number;
  isAuction: boolean;
  timeRemaining?: string;
  location: string;
}

const initialCartItems: CartItem[] = [
  {
    id: "1",
    title: "Apple MacBook Pro 14-inch M3 Pro Chip 512GB SSD Space Gray",
    price: 1799.99,
    originalPrice: 1999.99,
    image: "https://sm.pcmag.com/t/pcmag_me/review/a/apple-macb/apple-macbook-pro-14-inch-2023-m3-pro_w91x.1920.jpg",
    condition: "New",
    seller: "tech_deals_pro",
    sellerRating: 99.8,
    shipping: "Free",
    quantity: 1,
    maxQuantity: 3,
    isAuction: false,
    location: "San Jose, CA",
  },
  {
    id: "2",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones Black",
    price: 279.99,
    originalPrice: 349.99,
    image: "https://m.media-amazon.com/images/I/61O3iMlnJIL._AC_UF894,1000_QL80_.jpg",
    condition: "New",
    seller: "audio_world_store",
    sellerRating: 98.5,
    shipping: "Free",
    quantity: 1,
    maxQuantity: 5,
    isAuction: false,
    location: "New York, NY",
  },
  {
    id: "3",
    title: "Vintage Rolex Submariner 1680 Red Writing Tropical Dial 1970s",
    price: 18500.0,
    image: "https://collectorscornerny.com/cdn/shop/files/rolex-submariner-1680-tropical-red-sub-vintage-watches-collectors-corner-ny_2000x.jpg?v=1741276383",
    condition: "Used",
    seller: "luxury_timepieces_nyc",
    sellerRating: 100,
    shipping: 25,
    quantity: 1,
    maxQuantity: 1,
    isAuction: false,
    location: "Manhattan, NY",
  },
  {
    id: "4",
    title: "Nike Air Jordan 1 Retro High OG Chicago 2022 Size 10",
    price: 385.0,
    originalPrice: 170.0,
    image: "/images/nike-air-jordan-1-chicago-sneakers.jpg",
    condition: "New",
    seller: "sneaker_vault_official",
    sellerRating: 99.1,
    shipping: 12,
    quantity: 1,
    maxQuantity: 1,
    isAuction: false,
    location: "Chicago, IL",
  },
];

const savedItems: CartItem[] = [
  {
    id: "5",
    title: "Canon EOS R5 Mirrorless Camera Body Only",
    price: 2899.0,
    image: "https://content.abt.com/image.php/4f99a48ed93890932b0e789e025d8b3d?image=/images/products/BDP_Images/big-EOSR5-BODY.jpg&ck=2&width=750&height=550&canvas",
    condition: "New",
    seller: "camera_pro_shop",
    sellerRating: 99.3,
    shipping: "Free",
    quantity: 1,
    maxQuantity: 2,
    isAuction: false,
    location: "Los Angeles, CA",
  },
  {
    id: "6",
    title: "Lego Technic Bugatti Chiron 42083 Complete Set",
    price: 349.99,
    image: "/images/lego-technic-bugatti-chiron-set.jpg",
    condition: "New",
    seller: "brick_kingdom",
    sellerRating: 97.8,
    shipping: 15,
    quantity: 1,
    maxQuantity: 4,
    isAuction: false,
    location: "Austin, TX",
  },
];

function formatPrice(price: number): string {
  return price.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function formatShipping(shipping: number | "Free"): string {
  if (shipping === "Free") return "Free shipping";
  return `+${formatPrice(shipping)} shipping`;
}

export default function CartPage() {
  const t = useTranslations();
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [saved, setSaved] = useState<CartItem[]>(savedItems);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Math.min(item.maxQuantity, item.quantity + delta)) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      setRemovingId(null);
    }, 300);
  };

  const moveToSaved = (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) {
      setSaved((prev) => [...prev, item]);
      removeItem(id);
    }
  };

  const moveToCart = (id: string) => {
    const item = saved.find((i) => i.id === id);
    if (item) {
      setCartItems((prev) => [...prev, item]);
      setSaved((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const removeSaved = (id: string) => {
    setSaved((prev) => prev.filter((i) => i.id !== id));
  };

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === "SAVE10") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code. Try SAVE10.");
      setPromoApplied(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingTotal = cartItems.reduce((sum, item) => {
    const s = item.shipping;
    return sum + (s === "Free" ? 0 : s) * item.quantity;
  }, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const tax = (subtotal + shippingTotal - discount) * 0.08;
  const total = subtotal + shippingTotal - discount + tax;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen bg-[#F7F7F7]">
      {/* Page Header */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="bg-white border-b border-black/5"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:text-[#105CB6] transition-colors">
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-gray-800 font-medium">Shopping Cart</span>
          </div>
          <div className="flex items-center gap-3">
            <ShoppingCart size={24} className="text-[#105CB6]" />
            <h1 className="text-2xl font-bold text-gray-900">
              Shopping Cart
              {itemCount > 0 && (
                <span className="ml-2 text-base font-normal text-gray-500">
                  ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
              )}
            </h1>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {cartItems.length === 0 ? (
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] p-16 text-center"
          >
            <ShoppingCart size={64} className="mx-auto text-gray-200 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">
              Looks like you have not added anything to your cart yet.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 bg-[#105CB6] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#0d4fa0] transition-all duration-300"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Trust badges */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] p-4"
              >
                <div className="flex flex-wrap gap-4 justify-around">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield size={16} className="text-[#86B817]" />
                    <span>eBay Money Back Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck size={16} className="text-[#105CB6]" />
                    <span>Fast, reliable shipping</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <RotateCcw size={16} className="text-[#E53238]" />
                    <span>Easy returns</span>
                  </div>
                </div>
              </motion.div>

              {/* Items list */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={fadeInUp}
                      exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
                      animate={removingId === item.id ? { opacity: 0, x: -40 } : { opacity: 1, x: 0 }}
                      className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] p-4 border border-black/5"
                    >
                      <div className="flex gap-4">
                        {/* Image */}
                        <Link href={`/product/${item.id}`} className="flex-shrink-0">
                          <div className="w-28 h-28 rounded-xl overflow-hidden bg-gray-50 border border-black/5">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='112' height='112' viewBox='0 0 112 112'%3E%3Crect width='112' height='112' fill='%23f3f4f6'/%3E%3Ctext x='56' y='60' text-anchor='middle' font-size='32' fill='%23d1d5db'%3E🛍️%3C/text%3E%3C/svg%3E";
                              }}
                            />
                          </div>
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-2">
                            <Link
                              href={`/product/${item.id}`}
                              className="text-sm font-semibold text-gray-900 hover:text-[#105CB6] transition-colors line-clamp-2 leading-snug"
                            >
                              {item.title}
                            </Link>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="flex-shrink-0 text-gray-400 hover:text-[#E53238] transition-colors p-1 rounded-lg hover:bg-red-50"
                              aria-label="Remove item"
                            >
                              <X size={16} />
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-1 mb-2">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                item.condition === "New"
                                  ? "bg-green-50 text-green-700"
                                  : item.condition === "Used"
                                  ? "bg-yellow-50 text-yellow-700"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {item.condition}
                            </span>
                            <span className="text-xs text-gray-500">
                              Seller:{" "}
                              <span className="text-[#105CB6] font-medium">{item.seller}</span>{" "}
                              ({item.sellerRating}% positive)
                            </span>
                          </div>

                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-lg font-bold text-gray-900">
                                  {formatPrice(item.price)}
                                </span>
                                {item.originalPrice && item.originalPrice > item.price && (
                                  <span className="text-sm text-gray-400 line-through">
                                    {formatPrice(item.originalPrice)}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {formatShipping(item.shipping)} from {item.location}
                              </p>
                            </div>

                            {/* Quantity + actions */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 border border-gray-200 rounded-full overflow-hidden">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  disabled={item.quantity <= 1}
                                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="w-8 text-center text-sm font-semibold text-gray-900">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  disabled={item.quantity >= item.maxQuantity}
                                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>

                              <button
                                onClick={() => moveToSaved(item.id)}
                                className="flex items-center gap-1 text-xs text-[#105CB6] hover:text-[#0d4fa0] font-medium transition-colors"
                              >
                                <Heart size={13} />
                                Save
                              </button>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#E53238] font-medium transition-colors"
                              >
                                <Trash2 size={13} />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Saved for later */}
              {saved.length > 0 && (
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] p-5 border border-black/5"
                >
                  <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Heart size={16} className="text-[#E53238]" />
                    Saved for Later ({saved.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {saved.map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3 p-3 rounded-xl border border-black/5 hover:border-[#105CB6]/20 hover:shadow-[0_4px_12px_rgba(16,92,182,0.08)] transition-all duration-300"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23f3f4f6'/%3E%3Ctext x='32' y='38' text-anchor='middle' font-size='20' fill='%23d1d5db'%3E🛍️%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug mb-1">
                            {item.title}
                          </p>
                          <p className="text-sm font-bold text-gray-900 mb-2">
                            {formatPrice(item.price)}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => moveToCart(item.id)}
                              className="text-xs bg-[#105CB6] text-white px-3 py-1 rounded-full font-medium hover:bg-[#0d4fa0] transition-colors"
                            >
                              Add to Cart
                            </button>
                            <button
                              onClick={() => removeSaved(item.id)}
                              className="text-xs text-gray-400 hover:text-[#E53238] transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] p-5 border border-black/5 sticky top-24"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

                {/* Line items */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                    </span>
                    <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className={shippingTotal === 0 ? "text-[#86B817] font-medium" : "font-medium text-gray-900"}>
                      {shippingTotal === 0 ? "Free" : formatPrice(shippingTotal)}
                    </span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#86B817] font-medium flex items-center gap-1">
                        <Tag size={13} />
                        Promo (SAVE10)
                      </span>
                      <span className="text-[#86B817] font-medium">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Estimated Tax</span>
                    <span className="font-medium text-gray-900">{formatPrice(tax)}</span>
                  </div>
                </div>

                <div className="border-t border-black/5 pt-4 mb-5">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-xl text-gray-900">{formatPrice(total)}</span>
                  </div>
                  {promoApplied && (
                    <p className="text-xs text-[#86B817] mt-1 text-right">
                      You saved {formatPrice(discount)}!
                    </p>
                  )}
                </div>

                {/* Promo code */}
                <div className="mb-5">
                  <label className="text-xs font-semibold text-gray-700 mb-2 block uppercase tracking-wide">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        setPromoError("");
                      }}
                      placeholder="Enter code"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6] transition-all"
                    />
                    <button
                      onClick={applyPromo}
                      className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-xs text-[#E53238] mt-1">{promoError}</p>
                  )}
                  {promoApplied && (
                    <p className="text-xs text-[#86B817] mt-1 font-medium">Promo code applied!</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">Try: SAVE10</p>
                </div>

                {/* Checkout button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/checkout"
                    className="block w-full bg-[#105CB6] text-white text-center py-3.5 rounded-full font-bold text-base hover:bg-[#0d4fa0] transition-all duration-300 shadow-[0_4px_14px_rgba(16,92,182,0.35)]"
                  >
                    Proceed to Checkout
                  </Link>
                </motion.div>

                <p className="text-xs text-gray-400 text-center mt-3">
                  Secure checkout powered by eBay
                </p>

                {/* Payment icons */}
                <div className="flex justify-center gap-2 mt-3 flex-wrap">
                  {["Visa", "MC", "PayPal", "Amex", "Apple Pay"].map((method) => (
                    <span
                      key={method}
                      className="text-xs bg-gray-50 border border-gray-200 rounded-md px-2 py-1 text-gray-500 font-medium"
                    >
                      {method}
                    </span>
                  ))}
                </div>

                {/* Trust signals */}
                <div className="mt-5 pt-4 border-t border-black/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Shield size={13} className="text-[#86B817] flex-shrink-0" />
                    <span>eBay Money Back Guarantee on all orders</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Truck size={13} className="text-[#105CB6] flex-shrink-0" />
                    <span>Estimated delivery within 3-7 business days</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <RotateCcw size={13} className="text-[#E53238] flex-shrink-0" />
                    <span>30-day returns on most items</span>
                  </div>
                </div>
              </motion.div>

              {/* Continue shopping */}
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="mt-4 text-center"
              >
                <Link
                  href="/search"
                  className="inline-flex items-center gap-1 text-sm text-[#105CB6] hover:text-[#0d4fa0] font-medium transition-colors"
                >
                  <ChevronRight size={14} className="rotate-180" />
                  Continue Shopping
                </Link>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}