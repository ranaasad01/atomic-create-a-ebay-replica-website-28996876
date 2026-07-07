"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { fadeInUp, fadeIn, scaleIn, staggerContainer } from "@/lib/motion";
import { useTranslations } from "next-intl";

const eBayLogo = () => (
  <span className="flex items-center gap-0 font-black text-4xl tracking-tight select-none">
    <span style={{ color: "#E53238" }}>e</span>
    <span style={{ color: "#F5AF02" }}>B</span>
    <span style={{ color: "#86B817" }}>a</span>
    <span style={{ color: "#105CB6" }}>y</span>
  </span>
);

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (val: string) => {
    if (!val.trim()) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Please enter a valid email address.";
    return "";
  };

  const validatePassword = (val: string) => {
    if (!val) return "Please enter your password.";
    if (val.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const handleEmailBlur = () => {
    setEmailError(validateEmail(email));
  };

  const handlePasswordBlur = () => {
    setPasswordError(validatePassword(password));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    if (eErr || pErr) return;

    setIsLoading(true);
    setGeneralError("");

    // Mock authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1400));

    // Mock: accept any valid-format credentials
    const mockToken = `mock_token_${Date.now()}`;
    try {
      if (staySignedIn) {
        localStorage.setItem("ebay_user_token", mockToken);
        localStorage.setItem("ebay_user_email", email);
      } else {
        sessionStorage.setItem("ebay_user_token", mockToken);
        sessionStorage.setItem("ebay_user_email", email);
      }
    } catch {
      // storage unavailable — continue anyway
    }

    setIsLoading(false);
    setIsSuccess(true);
  };

  const handleOAuth = (provider: string) => {
    setGeneralError(`${provider} sign-in is not available in this demo.`);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div variants={fadeInUp} className="flex justify-center mb-8">
          <Link href="/" aria-label="eBay Home">
            <eBayLogo />
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          variants={scaleIn}
          className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] border border-black/5 p-8"
        >
          {isSuccess ? (
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center text-center py-6 gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle size={36} className="text-[#86B817]" />
              </div>
              <h1 className="text-2xl font-bold text-[#333333]">Welcome back!</h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                You have signed in successfully. Redirecting you to your eBay account.
              </p>
              <Link
                href="/user-profile-my-ebay"
                className="mt-2 w-full py-3 rounded-xl bg-[#105CB6] text-white font-semibold text-sm text-center hover:bg-[#0d4d9e] transition-colors duration-200"
              >
                Go to My eBay
              </Link>
            </motion.div>
          ) : (
            <>
              <motion.h1
                variants={fadeInUp}
                className="text-2xl font-bold text-[#333333] mb-6 text-center"
              >
                Sign in to eBay
              </motion.h1>

              {/* General error */}
              {generalError && (
                <motion.div
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700"
                >
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{generalError}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Email field */}
                <motion.div variants={fadeInUp}>
                  <label htmlFor="email" className="block text-sm font-medium text-[#333333] mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail size={16} />
                    </span>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(validateEmail(e.target.value));
                      }}
                      onBlur={handleEmailBlur}
                      placeholder="you@example.com"
                      className={`w-full pl-9 pr-4 py-3 rounded-xl border text-sm text-[#333333] placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6] ${
                        emailError
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    />
                  </div>
                  {emailError && (
                    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {emailError}
                    </p>
                  )}
                </motion.div>

                {/* Password field */}
                <motion.div variants={fadeInUp}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="block text-sm font-medium text-[#333333]">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-[#105CB6] hover:underline font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock size={16} />
                    </span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError(validatePassword(e.target.value));
                      }}
                      onBlur={handlePasswordBlur}
                      placeholder="Enter your password"
                      className={`w-full pl-9 pr-10 py-3 rounded-xl border text-sm text-[#333333] placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#105CB6]/30 focus:border-[#105CB6] ${
                        passwordError
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {passwordError}
                    </p>
                  )}
                </motion.div>

                {/* Stay signed in */}
                <motion.div variants={fadeInUp} className="flex items-center gap-2.5">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={staySignedIn}
                    onClick={() => setStaySignedIn((v) => !v)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                      staySignedIn
                        ? "bg-[#105CB6] border-[#105CB6]"
                        : "bg-white border-gray-300 hover:border-[#105CB6]"
                    }`}
                  >
                    {staySignedIn && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                  <span className="text-sm text-gray-600 select-none cursor-pointer" onClick={() => setStaySignedIn((v) => !v)}>
                    Stay signed in
                  </span>
                </motion.div>

                {/* Submit button */}
                <motion.div variants={fadeInUp}>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.01 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className="w-full py-3 rounded-xl bg-[#105CB6] text-white font-semibold text-sm hover:bg-[#0d4d9e] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </motion.button>
                </motion.div>
              </form>

              {/* Divider */}
              <motion.div variants={fadeInUp} className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">or continue with</span>
                <div className="flex-1 h-px bg-gray-200" />
              </motion.div>

              {/* OAuth buttons */}
              <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-3">
                <motion.button
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => handleOAuth("Google")}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm font-medium text-[#333333] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                >
                  <GoogleIcon />
                  Google
                </motion.button>
                <motion.button
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => handleOAuth("Apple")}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm font-medium text-[#333333] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                >
                  <AppleIcon />
                  Apple
                </motion.button>
              </motion.div>

              {/* Register link */}
              <motion.p
                variants={fadeInUp}
                className="mt-6 text-center text-sm text-gray-500"
              >
                New to eBay?{" "}
                <Link
                  href="/register"
                  className="text-[#105CB6] font-semibold hover:underline"
                >
                  Create an account
                </Link>
              </motion.p>
            </>
          )}
        </motion.div>

        {/* Footer note */}
        <motion.p
          variants={fadeIn}
          className="mt-6 text-center text-xs text-gray-400 leading-relaxed px-4"
        >
          By signing in, you agree to eBay's{" "}
          <Link href="/" className="underline hover:text-gray-600 transition-colors">
            User Agreement
          </Link>{" "}
          and{" "}
          <Link href="/" className="underline hover:text-gray-600 transition-colors">
            Privacy Notice
          </Link>
          .
        </motion.p>
      </motion.div>
    </div>
  );
}