"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_LINKS } from "@/lib/site-data";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const site = useSiteSettings();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className="premium-nav theme-nav fixed w-full top-0 z-50 backdrop-blur-md border-b border-ttw-gold/10"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3" aria-label="Home">
            <Image
              src={site.logo}
              alt="The True Word logo"
              width={36}
              height={36}
              className="h-9 w-auto"
              priority
            />
            <span className="hidden sm:inline text-ttw-gold font-cinzel font-semibold text-sm tracking-wide">
              {site.name}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link text-sm ${isActive(link.href) ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-ttw-gold hover:bg-ttw-gold/10 rounded-md"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-ttw-gold"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              type="button"
              className="p-2 text-ttw-gold"
              aria-expanded={open}
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden theme-nav border-t border-ttw-gold/10 overflow-hidden"
          >
            <div className="flex flex-col items-center py-4 gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`mobile-nav-link ${isActive(link.href) ? "active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
