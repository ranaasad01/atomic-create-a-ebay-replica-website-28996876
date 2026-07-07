"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { ChevronRight, Lock, CreditCard, MapPin, Package, Check, Shield, Truck, AlertCircle, Star, ChevronDown } from 'lucide-react';
import { useTranslations } from "next-intl";

// ─── Mock cart items ───────────────────────────────────────────────────────────
const cartItems = [
  {
    id: "1",
    title: "Apple MacBook Pro 14-inch M3 Pro Chip 512GB SSD Space Gray",
    price: 1799.99,
    image: "https://sm.pcmag.com/t/pcmag_me/review/a/apple-macb/apple-macbook-pro-14-inch-2023-m3-pro_w91x.1920.jpg",
    condition: "New",
    seller: "tech_deals_pro",
    sellerRating: 99.8,
    shipping: 0,
    quantity: 1,
    timeRemaining: "2d 4h",
  },
  {
    id: "2",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones Black",
    price: 279.99,
    image: "https://m.media-amazon.com/images/I/61O3iMlnJIL._AC_UF894,1000_QL80_.jpg",
    condition: "New",
    seller: "audio_world_store",
    sellerRating: 98.5,
    shipping: 0,
    quantity: 1,
    timeRemaining: null,
  },
  {
    id: "3",
    title: "Nike Air Jordan 1 Retro High OG Chicago Size 10",
    price: 189.0,
    image: "https://picsum.photos/seed/cb53363835ae/800/600",
    condition: "New",
    seller: "sneaker_vault",
    sellerRating: 97.2,
    shipping: 9.99,
    quantity: 1,
    timeRemaining: null,
  },
];

const savedAddresses = [
  {
    id: "addr1",
    name: "Alex Johnson",
    line1: "1234 Market Street",
    line2: "Apt 5B",
    city: "San Francisco",
    state: "CA",
    zip: "94103",
    country: "United States",
    isDefault: true,
  },
  {
    id: "addr2",
    name: "Alex Johnson",
    line1: "789 Oak Avenue",
    line2: "",
    city: "Oakland",
    state: "CA",
    zip: "94601",
    country: "United States",
    isDefault: false,
  },
];

const savedCards = [
  { id: "card1", brand: "Visa", last4: "4242", expiry: "08/27", isDefault: true },
  { id: "card2", brand: "Mastercard", last4: "5555", expiry: "12/26", isDefault: false },
];

const shippingOptions = [
  { id: "standard", label: "Standard Shipping", eta: "5-8 business days", price: 0 },
  { id: "expedited", label: "Expedited Shipping", eta: "2-3 business days", price: 12.99 },
  { id: "overnight", label: "Overnight Shipping", eta: "Next business day", price: 29.99 },
];

// ─── Step indicator ────────────────────────────────────────────────────────────
const steps = ["Shipping", "Payment", "Review"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                i < current
                  ? "bg-[#86B817] text-white"
                  : i === current
                  ? "bg-[#105CB6] text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {i < current ? <Check size={14} /> : i + 1}
            </div>
            <span
              className={`text-xs mt-1 font-medium ${
                i === current ? "text-[#105CB6]" : i < current ? "text-[#86B817]" : "text-gray-400"
              }`}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-16 md:w-24 h-0.5 mx-1 mb-5 transition-all duration-300 ${
                i < current ? "bg-[#86B817]" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Order summary sidebar ─────────────────────────────────────────────────────
function OrderSummary({
  shippingCost,
  promoDiscount,
}: {
  shippingCost: number;
  promoDiscount: number;
}) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemShipping = cartItems.reduce(
    (sum, item) => sum + (typeof item.shipping === "number" ? item.shipping : 0),
    0
  );
  const tax = (subtotal - promoDiscount) * 0.0875;
  const total = subtotal + itemShipping + shippingCost + tax - promoDiscount;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] overflow-hidden"
    >
      <div className="p-5 border-b border-black/5">
        <h2 className="font-bold text-gray-900 text-base">Order Summary</h2>
      </div>

      {/* Items */}
      <div className="divide-y divide-black/5">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-3 p-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-black/5">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' fill='%23e5e7eb'%3E%3Crect width='56' height='56'/%3E%3C/svg%3E";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-700 font-medium leading-snug line-clamp-2">
                {item.title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{item.condition}</p>
              <p className="text-sm font-bold text-gray-900 mt-1">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="p-5 space-y-2 border-t border-black/5 bg-gray-50/50">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal ({cartItems.length} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {itemShipping > 0 && (
          <div className="flex justify-between text-sm text-gray-600">
            <span>Item shipping</span>
            <span>${itemShipping.toFixed(2)}</span>
          </div>
        )}
        {shippingCost > 0 && (
          <div className="flex justify-between text-sm text-gray-600">
            <span>Delivery upgrade</span>
            <span>${shippingCost.toFixed(2)}</span>
          </div>
        )}
        {promoDiscount > 0 && (
          <div className="flex justify-between text-sm text-[#86B817] font-medium">
            <span>Promo discount</span>
            <span>-${promoDiscount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-gray-600">
          <span>Estimated tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-black/8">
          <span>Order Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Trust badges */}
      <div className="px-5 pb-5 pt-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Shield size={13} className="text-[#86B817] flex-shrink-0" />
          <span>eBay Money Back Guarantee on all orders</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Lock size={13} className="text-[#105CB6] flex-shrink-0" />
          <span>256-bit SSL encrypted checkout</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Shipping step ─────────────────────────────────────────────────────────────
function ShippingStep({
  selectedAddress,
  setSelectedAddress,
  selectedShipping,
  setSelectedShipping,
  onNext,
}: {
  selectedAddress: string;
  setSelectedAddress: (id: string) => void;
  selectedShipping: string;
  setSelectedShipping: (id: string) => void;
  onNext: () => void;
}) {
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      {/* Saved addresses */}
      <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] overflow-hidden">
        <div className="p-5 border-b border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-[#105CB6]" />
            <h2 className="font-bold text-gray-900">Shipping Address</h2>
          </div>
          <button
            onClick={() => setShowNewAddress(!showNewAddress)}
            className="text-xs text-[#105CB6] font-medium hover:underline"
          >
            {showNewAddress ? "Cancel" : "+ Add new address"}
          </button>
        </div>

        <div className="p-5 space-y-3">
          {savedAddresses.map((addr) => (
            <label
              key={addr.id}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedAddress === addr.id
                  ? "border-[#105CB6] bg-blue-50/40"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <input
                type="radio"
                name="address"
                value={addr.id}
                checked={selectedAddress === addr.id}
                onChange={() => setSelectedAddress(addr.id)}
                className="mt-0.5 accent-[#105CB6]"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-900">{addr.name}</span>
                  {addr.isDefault && (
                    <span className="text-xs bg-[#105CB6]/10 text-[#105CB6] px-2 py-0.5 rounded-full font-medium">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  {addr.line1}
                  {addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.state} {addr.zip}
                </p>
                <p className="text-sm text-gray-400">{addr.country}</p>
              </div>
            </label>
          ))}

          {showNewAddress && (
            <motion.div
              variants={fadeInUp}
              className="p-4 rounded-xl border-2 border-dashed border-gray-200 space-y-3"
            >
              <p className="text-sm font-semibold text-gray-700">New Address</p>
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="text"
                  placeholder="Full name"
                  value={newAddr.name}
                  onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6]"
                />
                <input
                  type="text"
                  placeholder="Street address"
                  value={newAddr.line1}
                  onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6]"
                />
                <input
                  type="text"
                  placeholder="Apt, suite, etc. (optional)"
                  value={newAddr.line2}
                  onChange={(e) => setNewAddr({ ...newAddr, line2: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6]"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6]"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6]"
                  />
                  <input
                    type="text"
                    placeholder="ZIP"
                    value={newAddr.zip}
                    onChange={(e) => setNewAddr({ ...newAddr, zip: e.target.value })}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6]"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Shipping speed */}
      <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] overflow-hidden">
        <div className="p-5 border-b border-black/5 flex items-center gap-2">
          <Truck size={16} className="text-[#105CB6]" />
          <h2 className="font-bold text-gray-900">Delivery Speed</h2>
        </div>
        <div className="p-5 space-y-3">
          {shippingOptions.map((opt) => (
            <label
              key={opt.id}
              className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedShipping === opt.id
                  ? "border-[#105CB6] bg-blue-50/40"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shipping"
                  value={opt.id}
                  checked={selectedShipping === opt.id}
                  onChange={() => setSelectedShipping(opt.id)}
                  className="accent-[#105CB6]"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{opt.label}</p>
                  <p className="text-xs text-gray-400">{opt.eta}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {opt.price === 0 ? (
                  <span className="text-[#86B817]">Free</span>
                ) : (
                  `$${opt.price.toFixed(2)}`
                )}
              </span>
            </label>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="w-full bg-[#105CB6] hover:bg-[#0d4d9e] text-white font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(16,92,182,0.35)]"
        >
          Continue to Payment
          <ChevronRight size={16} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ─── Payment step ──────────────────────────────────────────────────────────────
function PaymentStep({
  selectedCard,
  setSelectedCard,
  promoCode,
  setPromoCode,
  promoApplied,
  setPromoApplied,
  onNext,
  onBack,
}: {
  selectedCard: string;
  setSelectedCard: (id: string) => void;
  promoCode: string;
  setPromoCode: (v: string) => void;
  promoApplied: boolean;
  setPromoApplied: (v: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [showNewCard, setShowNewCard] = useState(false);
  const [newCard, setNewCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [promoError, setPromoError] = useState("");

  const handlePromo = () => {
    if (promoCode.trim().toUpperCase() === "SAVE10") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code. Try SAVE10.");
      setPromoApplied(false);
    }
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      {/* Saved cards */}
      <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] overflow-hidden">
        <div className="p-5 border-b border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-[#105CB6]" />
            <h2 className="font-bold text-gray-900">Payment Method</h2>
          </div>
          <button
            onClick={() => setShowNewCard(!showNewCard)}
            className="text-xs text-[#105CB6] font-medium hover:underline"
          >
            {showNewCard ? "Cancel" : "+ Add new card"}
          </button>
        </div>

        <div className="p-5 space-y-3">
          {savedCards.map((card) => (
            <label
              key={card.id}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedCard === card.id
                  ? "border-[#105CB6] bg-blue-50/40"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <input
                type="radio"
                name="card"
                value={card.id}
                checked={selectedCard === card.id}
                onChange={() => setSelectedCard(card.id)}
                className="accent-[#105CB6]"
              />
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-7 bg-gray-100 rounded-md flex items-center justify-center">
                  <CreditCard size={14} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {card.brand} ending in {card.last4}
                  </p>
                  <p className="text-xs text-gray-400">Expires {card.expiry}</p>
                </div>
              </div>
              {card.isDefault && (
                <span className="text-xs bg-[#105CB6]/10 text-[#105CB6] px-2 py-0.5 rounded-full font-medium">
                  Default
                </span>
              )}
            </label>
          ))}

          {/* PayPal option */}
          <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 cursor-pointer transition-all duration-200">
            <input type="radio" name="card" value="paypal" checked={selectedCard === "paypal"} onChange={() => setSelectedCard("paypal")} className="accent-[#105CB6]" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 bg-[#003087] rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-black">PP</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">PayPal</span>
            </div>
          </label>

          {showNewCard && (
            <motion.div
              variants={fadeInUp}
              className="p-4 rounded-xl border-2 border-dashed border-gray-200 space-y-3"
            >
              <p className="text-sm font-semibold text-gray-700">New Card</p>
              <input
                type="text"
                placeholder="Card number"
                value={newCard.number}
                onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6]"
              />
              <input
                type="text"
                placeholder="Name on card"
                value={newCard.name}
                onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6]"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={newCard.expiry}
                  onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6]"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={newCard.cvv}
                  onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6]"
                />
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Promo code */}
      <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] p-5">
        <h2 className="font-bold text-gray-900 mb-3 text-sm">Promo Code</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter code (try SAVE10)"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6]"
          />
          <button
            onClick={handlePromo}
            className="bg-[#F5AF02] hover:bg-[#e09e00] text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Apply
          </button>
        </div>
        {promoApplied && (
          <p className="text-xs text-[#86B817] mt-2 flex items-center gap-1">
            <Check size={12} /> Promo code applied. $22.69 off your order.
          </p>
        )}
        {promoError && (
          <p className="text-xs text-[#E53238] mt-2 flex items-center gap-1">
            <AlertCircle size={12} /> {promoError}
          </p>
        )}
      </motion.div>

      <motion.div variants={fadeInUp} className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:border-gray-300 transition-all duration-200"
        >
          Back
        </button>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="flex-[2] bg-[#105CB6] hover:bg-[#0d4d9e] text-white font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(16,92,182,0.35)]"
        >
          Review Order
          <ChevronRight size={16} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ─── Review step ───────────────────────────────────────────────────────────────
function ReviewStep({
  selectedAddress,
  selectedCard,
  selectedShipping,
  promoApplied,
  onBack,
  onPlace,
}: {
  selectedAddress: string;
  selectedCard: string;
  selectedShipping: string;
  promoApplied: boolean;
  onBack: () => void;
  onPlace: () => void;
}) {
  const addr = savedAddresses.find((a) => a.id === selectedAddress) ?? savedAddresses[0];
  const card = savedCards.find((c) => c.id === selectedCard);
  const shipping = shippingOptions.find((s) => s.id === selectedShipping) ?? shippingOptions[0];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      {/* Shipping summary */}
      <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] overflow-hidden">
        <div className="p-5 border-b border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-[#105CB6]" />
            <h2 className="font-bold text-gray-900 text-sm">Ship to</h2>
          </div>
          <button className="text-xs text-[#105CB6] hover:underline">Edit</button>
        </div>
        <div className="p-5">
          {addr && (
            <>
              <p className="text-sm font-semibold text-gray-900">{addr.name}</p>
              <p className="text-sm text-gray-500">
                {addr.line1}
                {addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.state} {addr.zip}
              </p>
              <p className="text-sm text-gray-400">{addr.country}</p>
            </>
          )}
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
            <Truck size={12} className="text-[#105CB6]" />
            <span>
              {shipping.label} ({shipping.eta})
            </span>
          </div>
        </div>
      </motion.div>

      {/* Payment summary */}
      <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] overflow-hidden">
        <div className="p-5 border-b border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard size={15} className="text-[#105CB6]" />
            <h2 className="font-bold text-gray-900 text-sm">Payment</h2>
          </div>
          <button className="text-xs text-[#105CB6] hover:underline">Edit</button>
        </div>
        <div className="p-5">
          {selectedCard === "paypal" ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-6 bg-[#003087] rounded flex items-center justify-center">
                <span className="text-white text-xs font-black">PP</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">PayPal</span>
            </div>
          ) : card ? (
            <div className="flex items-center gap-2">
              <CreditCard size={14} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-900">
                {card.brand} ending in {card.last4}
              </span>
              <span className="text-xs text-gray-400">Exp {card.expiry}</span>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No payment method selected</p>
          )}
          {promoApplied && (
            <div className="mt-2 flex items-center gap-1 text-xs text-[#86B817]">
              <Check size={11} />
              <span>Promo code SAVE10 applied</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Items review */}
      <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] overflow-hidden">
        <div className="p-5 border-b border-black/5 flex items-center gap-2">
          <Package size={15} className="text-[#105CB6]" />
          <h2 className="font-bold text-gray-900 text-sm">Items ({cartItems.length})</h2>
        </div>
        <div className="divide-y divide-black/5">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-3 p-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-black/5">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' fill='%23e5e7eb'%3E%3Crect width='48' height='48'/%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-700 font-medium leading-snug line-clamp-2">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">{item.condition}</span>
                  <span className="text-gray-200">|</span>
                  <span className="text-xs text-gray-400">
                    Seller: {item.seller}
                  </span>
                  <Star size={10} className="text-[#F5AF02] fill-[#F5AF02]" />
                  <span className="text-xs text-gray-400">{item.sellerRating}%</span>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                ${item.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Legal notice */}
      <motion.div variants={fadeInUp} className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
        <AlertCircle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 leading-relaxed">
          By placing your order, you agree to eBay's User Agreement and Privacy Notice. You also confirm that you are authorized to use the selected payment method.
        </p>
      </motion.div>

      <motion.div variants={fadeInUp} className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:border-gray-300 transition-all duration-200"
        >
          Back
        </button>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPlace}
          className="flex-[2] bg-[#E53238] hover:bg-[#c92a2f] text-white font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(229,50,56,0.35)]"
        >
          <Lock size={15} />
          Place Order
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ─── Confirmation screen ───────────────────────────────────────────────────────
function ConfirmationScreen() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="text-center py-12 px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="w-20 h-20 bg-[#86B817] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_8px_32px_rgba(134,184,23,0.35)]"
      >
        <Check size={36} className="text-white" strokeWidth={3} />
      </motion.div>

      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Order Confirmed!</h2>
        <p className="text-gray-500 mb-1">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Order #EB-{Math.floor(100000 + 823456)} confirmation sent to your email.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] p-6 mb-8 text-left max-w-md mx-auto"
      >
        <h3 className="font-bold text-gray-900 mb-4 text-sm">Order Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Items</span>
            <span className="font-medium text-gray-900">{cartItems.length} items</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Estimated delivery</span>
            <span className="font-medium text-gray-900">5-8 business days</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-black/5">
            <span className="text-gray-500">Ship to</span>
            <span className="font-medium text-gray-900">1234 Market St, San Francisco, CA</span>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="bg-[#105CB6] hover:bg-[#0d4d9e] text-white font-bold px-8 py-3 rounded-xl transition-all duration-200 shadow-[0_4px_14px_rgba(16,92,182,0.25)]"
        >
          Continue Shopping
        </Link>
        <Link
          href="/user-profile-my-ebay"
          className="border-2 border-gray-200 text-gray-700 font-bold px-8 py-3 rounded-xl hover:border-gray-300 transition-all duration-200"
        >
          View My Orders
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState(false);

  // Shipping
  const [selectedAddress, setSelectedAddress] = useState("addr1");
  const [selectedShipping, setSelectedShipping] = useState("standard");

  // Payment
  const [selectedCard, setSelectedCard] = useState("card1");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const shippingCost =
    shippingOptions.find((s) => s.id === selectedShipping)?.price ?? 0;
  const promoDiscount = promoApplied ? 22.69 : 0;

  if (placed) {
    return (
      <main className="min-h-screen bg-[#F7F7F7] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <ConfirmationScreen />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F7F7] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Link href="/cart" className="hover:text-[#105CB6] transition-colors">
              Cart
            </Link>
            <ChevronRight size={12} />
            <span className="text-gray-700 font-medium">Checkout</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Secure Checkout
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <Lock size={12} className="text-[#86B817]" />
            <p className="text-sm text-gray-500">
              Your information is protected with 256-bit SSL encryption.
            </p>
          </div>
        </motion.div>

        {/* Step indicator */}
        <StepIndicator current={step} />

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: steps */}
          <div className="lg:col-span-2">
            {step === 0 && (
              <ShippingStep
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
                selectedShipping={selectedShipping}
                setSelectedShipping={setSelectedShipping}
                onNext={() => setStep(1)}
              />
            )}
            {step === 1 && (
              <PaymentStep
                selectedCard={selectedCard}
                setSelectedCard={setSelectedCard}
                promoCode={promoCode}
                setPromoCode={setPromoCode}
                promoApplied={promoApplied}
                setPromoApplied={setPromoApplied}
                onNext={() => setStep(2)}
                onBack={() => setStep(0)}
              />
            )}
            {step === 2 && (
              <ReviewStep
                selectedAddress={selectedAddress}
                selectedCard={selectedCard}
                selectedShipping={selectedShipping}
                promoApplied={promoApplied}
                onBack={() => setStep(1)}
                onPlace={() => setPlaced(true)}
              />
            )}
          </div>

          {/* Right: order summary */}
          <div className="lg:col-span-1">
            <OrderSummary shippingCost={shippingCost} promoDiscount={promoDiscount} />
          </div>
        </div>
      </div>
    </main>
  );
}