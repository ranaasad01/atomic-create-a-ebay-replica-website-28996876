"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { useTranslations } from "next-intl";
import { User, Mail, Lock, Eye, EyeOff, Check, AlertCircle, Building, ChevronRight, Star, Shield, Zap } from 'lucide-react';

const eBayLogo = () => (
  <span className="flex items-center gap-0 font-black text-3xl tracking-tight select-none">
    <span style={{ color: "#E53238" }}>e</span>
    <span style={{ color: "#F5AF02" }}>B</span>
    <span style={{ color: "#86B817" }}>a</span>
    <span style={{ color: "#105CB6" }}>y</span>
  </span>
);

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "#E53238" };
  if (score <= 2) return { score, label: "Fair", color: "#F5AF02" };
  if (score <= 3) return { score, label: "Good", color: "#86B817" };
  return { score, label: "Strong", color: "#105CB6" };
}

const valueProps = [
  {
    icon: Shield,
    title: "Buyer Protection",
    desc: "Shop with confidence. Every purchase is covered by eBay Money Back Guarantee.",
    color: "#105CB6",
  },
  {
    icon: Zap,
    title: "Fast & Easy Selling",
    desc: "List an item in minutes and reach millions of buyers worldwide.",
    color: "#86B817",
  },
  {
    icon: Star,
    title: "Trusted Community",
    desc: "Join over 135 million buyers and sellers in the world's largest marketplace.",
    color: "#F5AF02",
  },
];

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountType: "personal" | "business";
  businessName: string;
  agreeTerms: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  businessName?: string;
  agreeTerms?: string;
}

export default function RegisterPage() {
  const t = useTranslations();

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "personal",
    businessName: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordStrength = getPasswordStrength(form.password);

  const handleChange = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (form.accountType === "business" && !form.businessName.trim()) {
      newErrors.businessName = "Business name is required.";
    }
    if (!form.agreeTerms) {
      newErrors.agreeTerms = "You must accept the terms to continue.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1400));
    setLoading(false);
    setSubmitted(true);
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
          <div className="w-20 h-20 rounded-full bg-[#86B817]/10 flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-[#86B817]" />
          </div>
          <h1 className="text-2xl font-bold text-[#333333] mb-2">Account Created!</h1>
          <p className="text-gray-500 mb-2">
            Welcome to eBay, <span className="font-semibold text-[#333333]">{form.firstName}</span>.
          </p>
          <p className="text-gray-400 text-sm mb-8">
            A confirmation email has been sent to{" "}
            <span className="font-medium text-[#105CB6]">{form.email}</span>. Please verify your
            address to start buying and selling.
          </p>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 bg-[#105CB6] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#0e4fa0] transition-all duration-300 shadow-[0_2px_12px_rgba(16,92,182,0.25)]"
          >
            Sign In to Your Account <ChevronRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: Brand illustration + value props */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="hidden lg:flex flex-col justify-center pt-8"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <eBayLogo />
              <h1 className="mt-6 text-4xl font-black text-[#333333] leading-tight tracking-tight text-balance">
                The world&apos;s marketplace,{" "}
                <span className="text-[#105CB6]">in your hands.</span>
              </h1>
              <p className="mt-4 text-gray-500 text-lg leading-relaxed text-pretty">
                Create a free account and join over 135 million people buying, selling, and
                discovering unique items every day.
              </p>
            </motion.div>

            {/* Value props */}
            <div className="space-y-5">
              {valueProps.map((vp) => {
                const Icon = vp.icon;
                return (
                  <motion.div
                    key={vp.title}
                    variants={fadeInUp}
                    className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)] border border-black/5"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${vp.color}15` }}
                    >
                      <Icon size={22} style={{ color: vp.color }} />
                    </div>
                    <div>
                      <p className="font-semibold text-[#333333] text-sm">{vp.title}</p>
                      <p className="text-gray-500 text-sm leading-relaxed mt-0.5">{vp.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Decorative color bar */}
            <motion.div variants={fadeIn} className="mt-10 flex gap-2">
              {["#E53238", "#F5AF02", "#86B817", "#105CB6"].map((c) => (
                <div
                  key={c}
                  className="h-1.5 flex-1 rounded-full"
                  style={{ backgroundColor: c }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Registration form */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.10)] border border-black/5 p-8 md:p-10"
          >
            {/* Mobile logo */}
            <div className="flex justify-center mb-6 lg:hidden">
              <eBayLogo />
            </div>

            <h2 className="text-2xl font-bold text-[#333333] mb-1">Create your account</h2>
            <p className="text-gray-500 text-sm mb-7">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-[#105CB6] font-semibold hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>

            {/* Account type toggle */}
            <div className="mb-7">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Account Type
              </p>
              <div className="flex rounded-xl border border-black/10 overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleChange("accountType", "personal")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all duration-200 ${
                    form.accountType === "personal"
                      ? "bg-[#105CB6] text-white"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <User size={15} />
                  Personal
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("accountType", "business")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all duration-200 ${
                    form.accountType === "business"
                      ? "bg-[#105CB6] text-white"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Building size={15} />
                  Business
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    First Name
                  </label>
                  <div className="relative">
                    <User
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      placeholder="Jane"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm text-[#333333] placeholder-gray-300 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#105CB6]/20 focus:border-[#105CB6] ${
                        errors.firstName ? "border-[#E53238] bg-red-50" : "border-black/10 bg-white"
                      }`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-[#E53238] flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Last Name
                  </label>
                  <div className="relative">
                    <User
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      placeholder="Doe"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm text-[#333333] placeholder-gray-300 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#105CB6]/20 focus:border-[#105CB6] ${
                        errors.lastName ? "border-[#E53238] bg-red-50" : "border-black/10 bg-white"
                      }`}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-[#E53238] flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Business name (conditional) */}
              {form.accountType === "business" && (
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                >
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Business Name
                  </label>
                  <div className="relative">
                    <Building
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={form.businessName}
                      onChange={(e) => handleChange("businessName", e.target.value)}
                      placeholder="Acme Corp"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm text-[#333333] placeholder-gray-300 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#105CB6]/20 focus:border-[#105CB6] ${
                        errors.businessName
                          ? "border-[#E53238] bg-red-50"
                          : "border-black/10 bg-white"
                      }`}
                    />
                  </div>
                  {errors.businessName && (
                    <p className="mt-1 text-xs text-[#E53238] flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.businessName}
                    </p>
                  )}
                </motion.div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="jane@example.com"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm text-[#333333] placeholder-gray-300 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#105CB6]/20 focus:border-[#105CB6] ${
                      errors.email ? "border-[#E53238] bg-red-50" : "border-black/10 bg-white"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-[#E53238] flex items-center gap-1">
                    <AlertCircle size={11} /> {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Min. 8 characters"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-sm text-[#333333] placeholder-gray-300 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#105CB6]/20 focus:border-[#105CB6] ${
                      errors.password ? "border-[#E53238] bg-red-50" : "border-black/10 bg-white"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-[#E53238] flex items-center gap-1">
                    <AlertCircle size={11} /> {errors.password}
                  </p>
                )}

                {/* Strength meter */}
                {form.password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor:
                              i <= passwordStrength.score
                                ? passwordStrength.color
                                : "#E5E7EB",
                          }}
                        />
                      ))}
                    </div>
                    <p
                      className="text-xs font-medium"
                      style={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.label} password
                    </p>
                  </div>
                )}

                {/* Password hints */}
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                  {[
                    { label: "8+ characters", met: form.password.length >= 8 },
                    { label: "Uppercase letter", met: /[A-Z]/.test(form.password) },
                    { label: "Number", met: /[0-9]/.test(form.password) },
                    { label: "Special character", met: /[^A-Za-z0-9]/.test(form.password) },
                  ].map((hint) => (
                    <div key={hint.label} className="flex items-center gap-1.5">
                      <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                          hint.met ? "bg-[#86B817]" : "bg-gray-200"
                        }`}
                      >
                        {hint.met && <Check size={8} className="text-white" strokeWidth={3} />}
                      </div>
                      <span
                        className={`text-xs transition-colors duration-200 ${
                          hint.met ? "text-[#86B817]" : "text-gray-400"
                        }`}
                      >
                        {hint.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    placeholder="Re-enter your password"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-sm text-[#333333] placeholder-gray-300 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#105CB6]/20 focus:border-[#105CB6] ${
                      errors.confirmPassword
                        ? "border-[#E53238] bg-red-50"
                        : form.confirmPassword && form.password === form.confirmPassword
                        ? "border-[#86B817] bg-green-50"
                        : "border-black/10 bg-white"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  {form.confirmPassword && form.password === form.confirmPassword && (
                    <div className="absolute right-9 top-1/2 -translate-y-1/2">
                      <Check size={15} className="text-[#86B817]" />
                    </div>
                  )}
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-[#E53238] flex items-center gap-1">
                    <AlertCircle size={11} /> {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms checkbox */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={form.agreeTerms}
                      onChange={(e) => handleChange("agreeTerms", e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      onClick={() => handleChange("agreeTerms", !form.agreeTerms)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                        form.agreeTerms
                          ? "bg-[#105CB6] border-[#105CB6]"
                          : errors.agreeTerms
                          ? "border-[#E53238] bg-red-50"
                          : "border-gray-300 bg-white group-hover:border-[#105CB6]"
                      }`}
                    >
                      {form.agreeTerms && (
                        <Check size={12} className="text-white" strokeWidth={3} />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 leading-relaxed">
                    I agree to eBay&apos;s{" "}
                    <Link href="/" className="text-[#105CB6] hover:underline font-medium">
                      User Agreement
                    </Link>{" "}
                    and{" "}
                    <Link href="/" className="text-[#105CB6] hover:underline font-medium">
                      Privacy Notice
                    </Link>
                    . I understand that eBay will use my information as described in these documents.
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="mt-1.5 text-xs text-[#E53238] flex items-center gap-1">
                    <AlertCircle size={11} /> {errors.agreeTerms}
                  </p>
                )}
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full py-3.5 rounded-full bg-[#105CB6] text-white font-bold text-base shadow-[0_2px_16px_rgba(16,92,182,0.30)] hover:bg-[#0e4fa0] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Creating your account...
                  </>
                ) : (
                  <>
                    Create Account <ChevronRight size={18} />
                  </>
                )}
              </motion.button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-black/8" />
                <span className="text-xs text-gray-400 font-medium">or continue with</span>
                <div className="flex-1 h-px bg-black/8" />
              </div>

              {/* Social sign-up buttons */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Google",
                    bg: "bg-white border border-black/10",
                    text: "text-[#333333]",
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                    ),
                  },
                  {
                    label: "Facebook",
                    bg: "bg-[#1877F2]",
                    text: "text-white",
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="white">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    ),
                  },
                ].map((provider) => (
                  <motion.button
                    key={provider.label}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${provider.bg} ${provider.text} shadow-[0_1px_4px_rgba(0,0,0,0.08)]`}
                  >
                    {provider.icon}
                    {provider.label}
                  </motion.button>
                ))}
              </div>

              <p className="text-center text-xs text-gray-400 pt-1">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="text-[#105CB6] font-semibold hover:underline transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}