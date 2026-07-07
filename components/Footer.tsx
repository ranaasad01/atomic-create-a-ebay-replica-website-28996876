"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { footerLinks, APP_NAME } from "@/lib/data";
import { Code2 as Github, MessageCircle as Twitter, Globe as Facebook } from 'lucide-react';
import { useTranslations } from "next-intl";

const eBayLogo = () => (
  <span className="flex items-center gap-0 font-black text-2xl tracking-tight select-none">
    <span style={{ color: "#E53238" }}>e</span>
    <span style={{ color: "#F5AF02" }}>B</span>
    <span style={{ color: "#86B817" }}>a</span>
    <span style={{ color: "#105CB6" }}>y</span>
  </span>
);

export default function Footer() {
  const t = useTranslations();
  const pathname = usePathname();

  const getHref = (href: string) => {
    if (href.startsWith("#")) {
      return pathname === "/" ? href : "/" + href;
    }
    return href;
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#") && pathname === "/") {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#333333] text-gray-300">
      {/* Main footer content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="max-w-7xl mx-auto px-4 py-12"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Buy */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              {t("footer.buy.title")}
            </h3>
            <ul className="space-y-2">
              {footerLinks.buy.map((link) => (
                <li key={link.label}>
                  <Link
                    href={getHref(link.href)}
                    onClick={(e) => handleClick(e, link.href)}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Sell */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              {t("footer.sell.title")}
            </h3>
            <ul className="space-y-2">
              {footerLinks.sell.map((link) => (
                <li key={link.label}>
                  <Link
                    href={getHref(link.href)}
                    onClick={(e) => handleClick(e, link.href)}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Tools */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              {t("footer.tools.title")}
            </h3>
            <ul className="space-y-2">
              {footerLinks.tools.map((link) => (
                <li key={link.label}>
                  <Link
                    href={getHref(link.href)}
                    onClick={(e) => handleClick(e, link.href)}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              {t("footer.company.title")}
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={getHref(link.href)}
                    onClick={(e) => handleClick(e, link.href)}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* App download strip */}
        <motion.div
          variants={fadeInUp}
          className="border-t border-white/10 pt-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white font-semibold mb-1">{t("footer.app.title")}</p>
              <p className="text-gray-400 text-sm">{t("footer.app.subtitle")}</p>
            </div>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2.5 bg-black rounded-xl border border-white/10 hover:border-white/30 transition-colors"
              >
                <span className="text-xl">🍎</span>
                <div>
                  <p className="text-[10px] text-gray-400 leading-none">{t("footer.app.appstore.label")}</p>
                  <p className="text-white text-sm font-semibold leading-tight">{t("footer.app.appstore.name")}</p>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2.5 bg-black rounded-xl border border-white/10 hover:border-white/30 transition-colors"
              >
                <span className="text-xl">▶</span>
                <div>
                  <p className="text-[10px] text-gray-400 leading-none">{t("footer.app.googleplay.label")}</p>
                  <p className="text-white text-sm font-semibold leading-tight">{t("footer.app.googleplay.name")}</p>
                </div>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          variants={fadeInUp}
          className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <eBayLogo />
            <p className="text-gray-500 text-xs">
              {t("footer.copyright", { year: "2024", name: APP_NAME })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-3">
              {[
                { label: "Privacy", href: "/" },
                { label: "User Agreement", href: "/" },
                { label: "Cookies", href: "/" },
                { label: "Accessibility", href: "/" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex gap-2 ml-2">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={14} className="text-gray-400" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={14} className="text-gray-400" />
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}