"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, Bell } from 'lucide-react';
import { navLinks, categories, APP_NAME } from "@/lib/data";
import { useTranslations } from "next-intl";

const eBayLogo = () => (
  <span className="flex items-center gap-0 font-black text-3xl tracking-tight select-none">
    <span style={{ color: "#E53238" }}>e</span>
    <span style={{ color: "#F5AF02" }}>B</span>
    <span style={{ color: "#86B817" }}>a</span>
    <span style={{ color: "#105CB6" }}>y</span>
  </span>
);

export default function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}&category=${encodeURIComponent(selectedCategory)}`);
    }
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    type: "route" | "anchor"
  ) => {
    if (type === "anchor") {
      if (pathname === "/") {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const getNavHref = (href: string, type: "route" | "anchor") => {
    if (type === "anchor") {
      return pathname === "/" ? href : "/" + href;
    }
    return href;
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-[0_2px_16px_rgba(0,0,0,0.10)]" : "shadow-[0_1px_0_rgba(0,0,0,0.08)]"
        }`}
      >
        {/* Top bar */}
        <div className="bg-[#F7F7F7] border-b border-black/5">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-8 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>{t("nav.topbar.hi")}</span>
              <Link href="/sign-in" className="hover:text-[#105CB6] transition-colors font-medium">
                {t("nav.topbar.signin")}
              </Link>
              <span>{t("nav.topbar.or")}</span>
              <Link href="/register" className="hover:text-[#105CB6] transition-colors font-medium">
                {t("nav.topbar.register")}
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/user-profile-my-ebay" className="hover:text-[#105CB6] transition-colors">
                {t("nav.topbar.myebay")}
              </Link>
              <Link href="/sell-list-item" className="hover:text-[#105CB6] transition-colors">
                {t("nav.topbar.sell")}
              </Link>
              <button className="hover:text-[#105CB6] transition-colors flex items-center gap-1">
                {t("nav.topbar.help")} <ChevronDown size={10} />
              </button>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 mr-2">
              <eBayLogo />
            </Link>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex-1 flex items-center min-w-0">
              <div className="flex w-full rounded-full border-2 border-[#333333] overflow-hidden focus-within:border-[#105CB6] transition-colors">
                {/* Category selector */}
                <div className="relative hidden md:block">
                  <button
                    type="button"
                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                    className="flex items-center gap-1 px-3 h-10 bg-[#F7F7F7] border-r border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
                  >
                    <span className="max-w-[100px] truncate">{selectedCategory}</span>
                    <ChevronDown size={12} />
                  </button>
                  <AnimatePresence>
                    {categoryDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-black/5 z-50 py-1 overflow-hidden"
                      >
                        {["All Categories", ...categories.map((c) => c.name)].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat);
                              setCategoryDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-[#F7F7F7] transition-colors ${
                              selectedCategory === cat ? "font-semibold text-[#105CB6]" : "text-gray-700"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Search input */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("nav.search.placeholder")}
                  className="flex-1 px-4 h-10 text-sm text-gray-800 bg-white outline-none placeholder-gray-400 min-w-0"
                />

                {/* Search button */}
                <button
                  type="submit"
                  className="px-5 h-10 bg-[#105CB6] hover:bg-[#0d4fa0] text-white transition-colors flex items-center gap-2 font-medium text-sm"
                >
                  <Search size={16} />
                  <span className="hidden sm:inline">{t("nav.search.button")}</span>
                </button>
              </div>
            </form>

            {/* Right icons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Link
                href="/user-profile-my-ebay"
                className="hidden md:flex flex-col items-center p-2 rounded-lg hover:bg-[#F7F7F7] transition-colors group"
              >
                <User size={20} className="text-gray-600 group-hover:text-[#105CB6] transition-colors" />
                <span className="text-[10px] text-gray-500 mt-0.5">{t("nav.icons.account")}</span>
              </Link>
              <Link
                href="/watchlist"
                className="hidden md:flex flex-col items-center p-2 rounded-lg hover:bg-[#F7F7F7] transition-colors group"
              >
                <Heart size={20} className="text-gray-600 group-hover:text-[#E53238] transition-colors" />
                <span className="text-[10px] text-gray-500 mt-0.5">{t("nav.icons.watchlist")}</span>
              </Link>
              <Link
                href="/cart"
                className="hidden md:flex flex-col items-center p-2 rounded-lg hover:bg-[#F7F7F7] transition-colors group relative"
              >
                <ShoppingCart size={20} className="text-gray-600 group-hover:text-[#105CB6] transition-colors" />
                <span className="text-[10px] text-gray-500 mt-0.5">{t("nav.icons.cart")}</span>
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#E53238] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  3
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-[#F7F7F7] transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Category nav strip */}
          <nav className="hidden md:flex items-center gap-1 pb-2 overflow-x-auto scrollbar-hide">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={getNavHref(link.href, link.type)}
                onClick={(e) => handleNavClick(e, link.href, link.type)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  pathname === link.href
                    ? "bg-[#333333] text-white"
                    : "text-gray-700 hover:bg-[#F7F7F7] hover:text-[#105CB6]"
                }`}
              >
                {t(`nav.links.${link.label.toLowerCase().replace(/\s+/g, "").replace(/\//g, "")}`)}
              </Link>
            ))}
            <Link
              href="/search?category=deals"
              className="px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap text-[#E53238] hover:bg-red-50 transition-all duration-200"
            >
              {t("nav.links.dailydeals")}
            </Link>
            <Link
              href="/search?category=electronics"
              className="px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap text-gray-700 hover:bg-[#F7F7F7] hover:text-[#105CB6] transition-all duration-200"
            >
              {t("nav.links.electronics")}
            </Link>
            <Link
              href="/search?category=fashion"
              className="px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap text-gray-700 hover:bg-[#F7F7F7] hover:text-[#105CB6] transition-all duration-200"
            >
              {t("nav.links.fashion")}
            </Link>
            <Link
              href="/search?category=motors"
              className="px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap text-gray-700 hover:bg-[#F7F7F7] hover:text-[#105CB6] transition-all duration-200"
            >
              {t("nav.links.motors")}
            </Link>
          </nav>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden border-t border-black/5 bg-white overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={getNavHref(link.href, link.type)}
                    onClick={(e) => {
                      handleNavClick(e, link.href, link.type);
                      setMobileOpen(false);
                    }}
                    className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "bg-[#105CB6] text-white"
                        : "text-gray-700 hover:bg-[#F7F7F7]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 border-t border-black/5 flex gap-2">
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2 rounded-xl border border-[#105CB6] text-[#105CB6] text-sm font-medium hover:bg-blue-50 transition-colors"
                  >
                    {t("nav.topbar.signin")}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2 rounded-xl bg-[#105CB6] text-white text-sm font-medium hover:bg-[#0d4fa0] transition-colors"
                  >
                    {t("nav.topbar.register")}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}