"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, ChevronDown, ChevronRight, Info, Tag, Package, DollarSign, Truck, Eye, Check, AlertCircle, Plus, Minus, Clock, Shield, Star } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { useTranslations } from "next-intl";

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Motors",
  "Sports & Outdoors",
  "Toys & Hobbies",
  "Collectibles & Art",
  "Books, Movies & Music",
  "Health & Beauty",
  "Business & Industrial",
];

const CONDITIONS = [
  { value: "new", label: "New", desc: "Brand new, unused, unopened, undamaged item in original packaging." },
  { value: "open-box", label: "Open Box", desc: "Opened, but unused. Original packaging may be missing or damaged." },
  { value: "refurbished", label: "Certified Refurbished", desc: "Restored to working order by a manufacturer or seller." },
  { value: "used-excellent", label: "Used – Excellent", desc: "Item in excellent condition with minimal signs of use." },
  { value: "used-good", label: "Used – Good", desc: "Item in good condition with some signs of use." },
  { value: "used-fair", label: "Used – Fair", desc: "Item in fair condition with significant signs of use." },
  { value: "for-parts", label: "For Parts or Not Working", desc: "Item does not function as intended or is incomplete." },
];

const DURATIONS = ["1 day", "3 days", "5 days", "7 days", "10 days", "30 days (fixed price only)"];

const SHIPPING_SERVICES = [
  "USPS First Class",
  "USPS Priority Mail",
  "USPS Priority Mail Express",
  "UPS Ground",
  "UPS 2-Day Air",
  "FedEx Ground",
  "FedEx 2Day",
  "Local Pickup Only",
];

const RETURN_POLICIES = [
  "No Returns",
  "30-Day Returns – Buyer Pays Shipping",
  "30-Day Returns – Free Returns",
  "60-Day Returns – Buyer Pays Shipping",
  "60-Day Returns – Free Returns",
];

const TIPS = [
  { icon: Camera, title: "Great Photos Sell", desc: "Use natural light and multiple angles. Clear photos increase bids by up to 40%." },
  { icon: Tag, title: "Competitive Pricing", desc: "Check completed listings to price your item right and attract more buyers." },
  { icon: Truck, title: "Offer Free Shipping", desc: "Listings with free shipping appear higher in search results and sell faster." },
  { icon: Star, title: "Build Your Reputation", desc: "Accurate descriptions and fast shipping earn positive feedback and repeat buyers." },
];

type ListingType = "auction" | "buynow" | "both";

interface FormState {
  title: string;
  category: string;
  condition: string;
  conditionDesc: string;
  description: string;
  listingType: ListingType;
  startingBid: string;
  reservePrice: string;
  buyNowPrice: string;
  quantity: string;
  duration: string;
  shippingService: string;
  shippingCost: string;
  freeShipping: boolean;
  handlingTime: string;
  returnPolicy: string;
  itemLocation: string;
  sku: string;
  acceptOffers: boolean;
  autoAcceptPrice: string;
  autoDeclinePrice: string;
}

const defaultForm: FormState = {
  title: "",
  category: "",
  condition: "",
  conditionDesc: "",
  description: "",
  listingType: "buynow",
  startingBid: "",
  reservePrice: "",
  buyNowPrice: "",
  quantity: "1",
  duration: "7 days",
  shippingService: "USPS Priority Mail",
  shippingCost: "",
  freeShipping: false,
  handlingTime: "1",
  returnPolicy: "30-Day Returns – Free Returns",
  itemLocation: "",
  sku: "",
  acceptOffers: false,
  autoAcceptPrice: "",
  autoDeclinePrice: "",
};

type Step = "details" | "pricing" | "shipping" | "review";

const STEPS: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: "details", label: "Item Details", icon: Package },
  { id: "pricing", label: "Pricing", icon: DollarSign },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "review", label: "Review & List", icon: Eye },
];

export default function SellListItemPage() {
  const t = useTranslations();
  const [currentStep, setCurrentStep] = useState<Step>("details");
  const [form, setForm] = useState<FormState>(defaultForm);
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const updateField = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);

  const validateStep = (step: Step): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (step === "details") {
      if (!form.title.trim()) newErrors.title = "Title is required.";
      if (!form.category) newErrors.category = "Please select a category.";
      if (!form.condition) newErrors.condition = "Please select a condition.";
    }
    if (step === "pricing") {
      if (form.listingType === "auction" || form.listingType === "both") {
        if (!form.startingBid || isNaN(Number(form.startingBid))) newErrors.startingBid = "Enter a valid starting bid.";
      }
      if (form.listingType === "buynow" || form.listingType === "both") {
        if (!form.buyNowPrice || isNaN(Number(form.buyNowPrice))) newErrors.buyNowPrice = "Enter a valid Buy It Now price.";
      }
    }
    if (step === "shipping") {
      if (!form.freeShipping && (!form.shippingCost || isNaN(Number(form.shippingCost)))) {
        newErrors.shippingCost = "Enter a shipping cost or select free shipping.";
      }
      if (!form.itemLocation.trim()) newErrors.itemLocation = "Item location is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    const idx = STEPS.findIndex((s) => s.id === currentStep);
    if (idx < STEPS.length - 1) setCurrentStep(STEPS[idx + 1].id);
  };

  const goBack = () => {
    const idx = STEPS.findIndex((s) => s.id === currentStep);
    if (idx > 0) setCurrentStep(STEPS[idx - 1].id);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const addPhoto = () => {
    const slugs = [
      "product-electronics-gadget",
      "product-fashion-item",
      "product-home-decor",
      "product-collectible-item",
      "product-sports-equipment",
    ];
    const next = slugs[photos.length % slugs.length];
    if (photos.length < 12) {
      setPhotos((prev) => [...prev, `/images/${next}.jpg`]);
    }
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center px-4">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.10)] p-10 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Item is Listed!</h1>
          <p className="text-gray-500 mb-6 leading-relaxed">
            Congratulations! Your listing is now live on eBay. Buyers can find and purchase your item right away.
          </p>
          <div className="bg-[#F7F7F7] rounded-xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Title</span>
              <span className="font-medium text-gray-800 truncate max-w-[180px]">{form.title || "Your Item"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Price</span>
              <span className="font-semibold text-[#E53238]">
                ${form.buyNowPrice || form.startingBid || "0.00"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Listing Type</span>
              <span className="font-medium text-gray-800 capitalize">{form.listingType === "buynow" ? "Buy It Now" : form.listingType === "auction" ? "Auction" : "Auction + Buy It Now"}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/seller-dashboard"
              className="w-full bg-[#105CB6] text-white font-semibold py-3 rounded-xl hover:bg-[#0d4d9e] transition-colors"
            >
              Go to Seller Dashboard
            </Link>
            <button
              onClick={() => { setSubmitted(false); setForm(defaultForm); setPhotos([]); setCurrentStep("details"); }}
              className="w-full border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              List Another Item
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Page Header */}
      <div className="bg-white border-b border-black/5">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Link href="/" className="hover:text-[#105CB6] transition-colors">Home</Link>
              <ChevronRight size={14} />
              <Link href="/seller-dashboard" className="hover:text-[#105CB6] transition-colors">Seller Dashboard</Link>
              <ChevronRight size={14} />
              <span className="text-gray-800 font-medium">List an Item</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">List Your Item</h1>
            <p className="text-gray-500 mt-1">Reach millions of buyers worldwide. It only takes a few minutes.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Form */}
          <div className="flex-1 min-w-0">
            {/* Step Indicator */}
            <motion.div variants={fadeIn} initial="hidden" animate="visible" className="mb-6">
              <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-4 flex items-center justify-between">
                {STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = step.id === currentStep;
                  const isDone = idx < stepIndex;
                  return (
                    <div key={step.id} className="flex items-center flex-1">
                      <button
                        onClick={() => isDone && setCurrentStep(step.id)}
                        className={`flex items-center gap-2 group ${isDone ? "cursor-pointer" : "cursor-default"}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                            isActive
                              ? "bg-[#105CB6] text-white shadow-[0_0_0_3px_rgba(16,92,182,0.15)]"
                              : isDone
                              ? "bg-green-500 text-white"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {isDone ? <Check size={14} /> : <Icon size={14} />}
                        </div>
                        <span
                          className={`hidden sm:block text-sm font-medium transition-colors ${
                            isActive ? "text-[#105CB6]" : isDone ? "text-green-600" : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </span>
                      </button>
                      {idx < STEPS.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-3 rounded-full transition-colors duration-300 ${isDone ? "bg-green-400" : "bg-gray-100"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {/* STEP 1: Item Details */}
              {currentStep === "details" && (
                <motion.div key="details" variants={fadeInUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}>
                  <div className="space-y-5">
                    {/* Photos */}
                    <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
                      <div className="flex items-center gap-2 mb-1">
                        <Camera size={18} className="text-[#105CB6]" />
                        <h2 className="text-lg font-semibold text-gray-900">Photos</h2>
                        <span className="ml-auto text-xs text-gray-400">{photos.length}/12</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">Add up to 12 photos. The first photo is your main listing image.</p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {photos.map((src, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-black/5 group">
                            <img src={src} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                            {idx === 0 && (
                              <div className="absolute bottom-0 left-0 right-0 bg-[#105CB6] text-white text-[10px] font-semibold text-center py-0.5">
                                Main
                              </div>
                            )}
                            <button
                              onClick={() => removePhoto(idx)}
                              className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={10} className="text-white" />
                            </button>
                          </div>
                        ))}
                        {photos.length < 12 && (
                          <button
                            onClick={addPhoto}
                            className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-[#105CB6] hover:bg-blue-50 transition-all group"
                          >
                            <Camera size={20} className="text-gray-300 group-hover:text-[#105CB6] transition-colors" />
                            <span className="text-[10px] text-gray-400 group-hover:text-[#105CB6] transition-colors font-medium">Add Photo</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Title & Category */}
                    <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6 space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Item Title <span className="text-[#E53238]">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.title}
                          onChange={(e) => updateField("title", e.target.value)}
                          maxLength={80}
                          placeholder="e.g. Apple iPhone 15 Pro 256GB Natural Titanium Unlocked"
                          className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6] transition-all ${errors.title ? "border-[#E53238]" : "border-gray-200"}`}
                        />
                        <div className="flex justify-between mt-1">
                          {errors.title ? (
                            <span className="text-xs text-[#E53238] flex items-center gap-1"><AlertCircle size={11} />{errors.title}</span>
                          ) : (
                            <span className="text-xs text-gray-400">Be specific: brand, model, size, color</span>
                          )}
                          <span className="text-xs text-gray-400">{form.title.length}/80</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Category <span className="text-[#E53238]">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={form.category}
                            onChange={(e) => updateField("category", e.target.value)}
                            className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6] transition-all bg-white ${errors.category ? "border-[#E53238]" : "border-gray-200"}`}
                          >
                            <option value="">Select a category</option>
                            {CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        {errors.category && (
                          <span className="text-xs text-[#E53238] flex items-center gap-1 mt-1"><AlertCircle size={11} />{errors.category}</span>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Condition <span className="text-[#E53238]">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {CONDITIONS.map((cond) => (
                            <button
                              key={cond.value}
                              onClick={() => updateField("condition", cond.value)}
                              className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                                form.condition === cond.value
                                  ? "border-[#105CB6] bg-blue-50 text-[#105CB6]"
                                  : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              <div className="font-semibold">{cond.label}</div>
                              <div className="text-xs text-gray-500 mt-0.5 leading-snug">{cond.desc}</div>
                            </button>
                          ))}
                        </div>
                        {errors.condition && (
                          <span className="text-xs text-[#E53238] flex items-center gap-1 mt-1"><AlertCircle size={11} />{errors.condition}</span>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                        <textarea
                          value={form.description}
                          onChange={(e) => updateField("description", e.target.value)}
                          rows={5}
                          placeholder="Describe your item in detail: features, any defects, what's included, etc."
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6] transition-all resize-none"
                        />
                        <span className="text-xs text-gray-400">{form.description.length} characters</span>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">SKU / Custom Label</label>
                        <input
                          type="text"
                          value={form.sku}
                          onChange={(e) => updateField("sku", e.target.value)}
                          placeholder="Optional — for your own tracking"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6] transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Pricing */}
              {currentStep === "pricing" && (
                <motion.div key="pricing" variants={fadeInUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}>
                  <div className="space-y-5">
                    {/* Listing Format */}
                    <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <DollarSign size={18} className="text-[#105CB6]" />
                        <h2 className="text-lg font-semibold text-gray-900">Listing Format</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {([
                          { id: "auction", label: "Auction", desc: "Buyers bid. Highest bid wins when time expires.", icon: Clock },
                          { id: "buynow", label: "Buy It Now", desc: "Set a fixed price. Buyers purchase immediately.", icon: Tag },
                          { id: "both", label: "Auction + Buy It Now", desc: "Accept bids or let buyers purchase at your price.", icon: DollarSign },
                        ] as { id: ListingType; label: string; desc: string; icon: React.ElementType }[]).map((opt) => {
                          const Icon = opt.icon;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => updateField("listingType", opt.id)}
                              className={`text-left p-4 rounded-xl border-2 transition-all ${
                                form.listingType === opt.id
                                  ? "border-[#105CB6] bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <Icon size={20} className={form.listingType === opt.id ? "text-[#105CB6] mb-2" : "text-gray-400 mb-2"} />
                              <div className={`font-semibold text-sm ${form.listingType === opt.id ? "text-[#105CB6]" : "text-gray-800"}`}>{opt.label}</div>
                              <div className="text-xs text-gray-500 mt-1 leading-snug">{opt.desc}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Price Fields */}
                    <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6 space-y-5">
                      <h2 className="text-lg font-semibold text-gray-900">Pricing Details</h2>

                      {(form.listingType === "auction" || form.listingType === "both") && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                              Starting Bid <span className="text-[#E53238]">*</span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                              <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={form.startingBid}
                                onChange={(e) => updateField("startingBid", e.target.value)}
                                placeholder="0.99"
                                className={`w-full border rounded-xl pl-7 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6] transition-all ${errors.startingBid ? "border-[#E53238]" : "border-gray-200"}`}
                              />
                            </div>
                            {errors.startingBid && (
                              <span className="text-xs text-[#E53238] flex items-center gap-1 mt-1"><AlertCircle size={11} />{errors.startingBid}</span>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                              Reserve Price <span className="text-xs font-normal text-gray-400">(optional)</span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                              <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={form.reservePrice}
                                onChange={(e) => updateField("reservePrice", e.target.value)}
                                placeholder="Minimum acceptable bid"
                                className="w-full border border-gray-200 rounded-xl pl-7 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6] transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {(form.listingType === "buynow" || form.listingType === "both") && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Buy It Now Price <span className="text-[#E53238]">*</span>
                          </label>
                          <div className="relative max-w-xs">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                            <input
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={form.buyNowPrice}
                              onChange={(e) => updateField("buyNowPrice", e.target.value)}
                              placeholder="0.00"
                              className={`w-full border rounded-xl pl-7 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6] transition-all ${errors.buyNowPrice ? "border-[#E53238]" : "border-gray-200"}`}
                            />
                          </div>
                          {errors.buyNowPrice && (
                            <span className="text-xs text-[#E53238] flex items-center gap-1 mt-1"><AlertCircle size={11} />{errors.buyNowPrice}</span>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quantity</label>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateField("quantity", String(Math.max(1, Number(form.quantity) - 1)))}
                              className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={form.quantity}
                              onChange={(e) => updateField("quantity", e.target.value)}
                              className="w-16 border border-gray-200 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6] transition-all"
                            />
                            <button
                              onClick={() => updateField("quantity", String(Number(form.quantity) + 1))}
                              className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Duration</label>
                          <div className="relative">
                            <select
                              value={form.duration}
                              onChange={(e) => updateField("duration", e.target.value)}
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6] transition-all bg-white"
                            >
                              {DURATIONS.map((d) => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Best Offer */}
                    <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="text-base font-semibold text-gray-900">Best Offer</h2>
                          <p className="text-sm text-gray-500 mt-0.5">Let buyers negotiate a price with you.</p>
                        </div>
                        <button
                          onClick={() => updateField("acceptOffers", !form.acceptOffers)}
                          className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${form.acceptOffers ? "bg-[#105CB6]" : "bg-gray-200"}`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${form.acceptOffers ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                      </div>
                      {form.acceptOffers && (
                        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Auto-Accept Price</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                              <input
                                type="number"
                                value={form.autoAcceptPrice}
                                onChange={(e) => updateField("autoAcceptPrice", e.target.value)}
                                placeholder="Auto-accept offers above"
                                className="w-full border border-gray-200 rounded-xl pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6] transition-all"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Auto-Decline Price</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                              <input
                                type="number"
                                value={form.autoDeclinePrice}
                                onChange={(e) => updateField("autoDeclinePrice", e.target.value)}
                                placeholder="Auto-decline offers below"
                                className="w-full border border-gray-200 rounded-xl pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6] transition-all"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Shipping */}
              {currentStep === "shipping" && (
                <motion.div key="shipping" variants={fadeInUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}>
                  <div className="space-y-5">
                    <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6 space-y-5">
                      <div className="flex items-center gap-2">
                        <Truck size={18} className="text-[#105CB6]" />
                        <h2 className="text-lg font-semibold text-gray-900">Shipping Details</h2>
                      </div>

                      {/* Free Shipping Toggle */}
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                        <div>
                          <div className="font-semibold text-sm text-gray-800">Free Shipping</div>
                          <div className="text-xs text-gray-500 mt-0.5">Listings with free shipping rank higher in search results.</div>
                        </div>
                        <button
                          onClick={() => updateField("freeShipping", !form.freeShipping)}
                          className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${form.freeShipping ? "bg-green-500" : "bg-gray-200"}`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${form.freeShipping ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Shipping Service</label>
                          <div className="relative">
                            <select
                              value={form.shippingService}
                              onChange={(e) => updateField("shippingService", e.target.value)}
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6] transition-all bg-white"
                            >
                              {SHIPPING_SERVICES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                        {!form.freeShipping && (
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                              Shipping Cost <span className="text-[#E53238]">*</span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.shippingCost}
                                onChange={(e) => updateField("shippingCost", e.target.value)}
                                placeholder="0.00"
                                className={`w-full border rounded-xl pl-7 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6] transition-all ${errors.shippingCost ? "border-[#E53238]" : "border-gray-200"}`}
                              />
                            </div>
                            {errors.shippingCost && (
                              <span className="text-xs text-[#E53238] flex items-center gap-1 mt-1"><AlertCircle size={11} />{errors.shippingCost}</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Item Location <span className="text-[#E53238]">*</span>
                          </label>
                          <input
                            type="text"
                            value={form.itemLocation}
                            onChange={(e) => updateField("itemLocation", e.target.value)}
                            placeholder="City, State or ZIP Code"
                            className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6] transition-all ${errors.itemLocation ? "border-[#E53238]" : "border-gray-200"}`}
                          />
                          {errors.itemLocation && (
                            <span className="text-xs text-[#E53238] flex items-center gap-1 mt-1"><AlertCircle size={11} />{errors.itemLocation}</span>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Handling Time</label>
                          <div className="relative">
                            <select
                              value={form.handlingTime}
                              onChange={(e) => updateField("handlingTime", e.target.value)}
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6] transition-all bg-white"
                            >
                              {["1", "2", "3", "5", "7", "10"].map((d) => (
                                <option key={d} value={d}>{d} business day{d !== "1" ? "s" : ""}</option>
                              ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Return Policy</label>
                        <div className="relative">
                          <select
                            value={form.returnPolicy}
                            onChange={(e) => updateField("returnPolicy", e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6] transition-all bg-white"
                          >
                            {RETURN_POLICIES.map((p) => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* eBay Guarantee Banner */}
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
                      <Shield size={24} className="text-[#105CB6] flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">eBay Money Back Guarantee</div>
                        <div className="text-xs text-gray-600 mt-1 leading-relaxed">
                          All listings are covered by the eBay Money Back Guarantee. Buyers who don't receive their item or receive something significantly different can request a refund.
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Review */}
              {currentStep === "review" && (
                <motion.div key="review" variants={fadeInUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}>
                  <div className="space-y-5">
                    <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6">
                      <div className="flex items-center gap-2 mb-5">
                        <Eye size={18} className="text-[#105CB6]" />
                        <h2 className="text-lg font-semibold text-gray-900">Listing Preview</h2>
                      </div>

                      {/* Preview Card */}
                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="flex gap-4 p-4">
                          <div className="w-24 h-24 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                            {photos[0] ? (
                              <img src={photos[0]} alt="Main photo" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Camera size={24} className="text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">
                              {form.title || "Your Item Title"}
                            </h3>
                            <div className="text-xs text-gray-500 mb-2">{form.condition ? CONDITIONS.find(c => c.value === form.condition)?.label : "Condition not set"} · {form.category || "Category not set"}</div>
                            <div className="flex items-baseline gap-2 flex-wrap">
                              {(form.listingType === "auction" || form.listingType === "both") && form.startingBid && (
                                <span className="text-sm text-gray-600">Starting bid: <span className="font-bold text-gray-900">${Number(form.startingBid).toFixed(2)}</span></span>
                              )}
                              {(form.listingType === "buynow" || form.listingType === "both") && form.buyNowPrice && (
                                <span className="text-base font-bold text-[#E53238]">${Number(form.buyNowPrice).toFixed(2)}</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {form.freeShipping ? "Free shipping" : form.shippingCost ? `$${Number(form.shippingCost).toFixed(2)} shipping` : "Shipping not set"} · {form.itemLocation || "Location not set"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Summary Sections */}
                    <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-6 space-y-4">
                      <h2 className="text-base font-semibold text-gray-900">Listing Summary</h2>
                      {[
                        { label: "Title", value: form.title || "Not set", step: "details" as Step },
                        { label: "Category", value: form.category || "Not set", step: "details" as Step },
                        { label: "Condition", value: CONDITIONS.find(c => c.value === form.condition)?.label || "Not set", step: "details" as Step },
                        { label: "Format", value: form.listingType === "buynow" ? "Buy It Now" : form.listingType === "auction" ? "Auction" : "Auction + Buy It Now", step: "pricing" as Step },
                        { label: "Duration", value: form.duration, step: "pricing" as Step },
                        { label: "Quantity", value: form.quantity, step: "pricing" as Step },
                        { label: "Shipping", value: form.freeShipping ? "Free" : form.shippingCost ? `$${Number(form.shippingCost).toFixed(2)}` : "Not set", step: "shipping" as Step },
                        { label: "Return Policy", value: form.returnPolicy, step: "shipping" as Step },
                        { label: "Item Location", value: form.itemLocation || "Not set", step: "shipping" as Step },
                      ].map((row) => (
                        <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                          <span className="text-sm text-gray-500">{row.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800 text-right max-w-[200px] truncate">{row.value}</span>
                            <button
                              onClick={() => setCurrentStep(row.step)}
                              className="text-xs text-[#105CB6] hover:underline font-medium"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Fees Notice */}
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-start gap-3">
                      <Info size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-800 leading-relaxed">
                        <span className="font-semibold">Seller Fees:</span> eBay charges a final value fee of 10-15% when your item sells, depending on category. Listing is free for up to 250 items per month.
                      </div>
                    </div>

                    {/* Submit */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleSubmit}
                      className="w-full bg-[#E53238] text-white font-bold py-4 rounded-xl text-base hover:bg-[#c92a2f] transition-colors shadow-[0_4px_16px_rgba(229,50,56,0.25)]"
                    >
                      List My Item Now
                    </motion.button>
                    <p className="text-xs text-center text-gray-400">
                      By listing, you agree to eBay's User Agreement and Seller Policies.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            {currentStep !== "review" && (
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={goBack}
                  disabled={stepIndex === 0}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={goNext}
                  className="px-8 py-3 rounded-xl bg-[#105CB6] text-white text-sm font-semibold hover:bg-[#0d4d9e] transition-colors shadow-[0_2px_12px_rgba(16,92,182,0.20)]"
                >
                  Continue
                </motion.button>
              </div>
            )}
            {currentStep === "review" && stepIndex > 0 && (
              <div className="mt-4">
                <button
                  onClick={goBack}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              </div>
            )}
          </div>

          {/* Sidebar Tips */}
          <div className="lg:w-72 flex-shrink-0">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-4 sticky top-24"
            >
              <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-5">
                <h3 className="font-semibold text-gray-900 text-sm mb-4 flex items-center gap-2">
                  <Star size={15} className="text-[#F5AF02]" />
                  Seller Tips
                </h3>
                <div className="space-y-4">
                  {TIPS.map((tip) => {
                    const Icon = tip.icon;
                    return (
                      <div key={tip.title} className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Icon size={14} className="text-[#105CB6]" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-800">{tip.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{tip.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-[#105CB6] rounded-2xl p-5 text-white">
                <div className="font-semibold text-sm mb-1">Need Help?</div>
                <p className="text-xs text-blue-100 leading-relaxed mb-3">
                  Our Seller Center has guides, fee calculators, and tips to help you sell more.
                </p>
                <Link
                  href="/seller-dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white text-[#105CB6] px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Seller Center <ChevronRight size={12} />
                </Link>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-5">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Listing Fees</h3>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Insertion fee</span>
                    <span className="font-semibold text-green-600">Free (up to 250/mo)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Final value fee</span>
                    <span className="font-semibold text-gray-800">10–15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PayPal / payment</span>
                    <span className="font-semibold text-gray-800">Included</span>
                  </div>
                  <div className="pt-2 border-t border-gray-100 text-gray-400 leading-relaxed">
                    Fees vary by category. No charge until your item sells.
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}