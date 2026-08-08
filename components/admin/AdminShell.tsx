"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  Compass,
  ExternalLink,
  FileText,
  Heart,
  LayoutDashboard,
  Library,
  Menu,
  MessageSquareQuote,
  Settings,
  Sparkles,
  X,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/resources", label: "Resources", icon: Library },
  { href: "/admin/daily-truths", label: "Daily Truth", icon: Sparkles },
  { href: "/admin/coaching", label: "Coaching", icon: Heart },
  { href: "/admin/journey", label: "Journey", icon: Compass },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const nav = (
    <>
      <div className="cms-sidebar-brand">
        <span className="cms-sidebar-brand-mark" aria-hidden>
          <BookOpen size={18} />
        </span>
        <div>
          <p className="cms-sidebar-brand-title">True Word</p>
          <p className="cms-sidebar-brand-sub">Content CMS</p>
        </div>
      </div>

      <nav className="cms-sidebar-nav" aria-label="CMS navigation">
        <p className="cms-sidebar-section">Manage</p>
        {NAV.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={`cms-nav-link${isActive(href, exact) ? " is-active" : ""}`}
            onClick={() => setOpen(false)}
          >
            <Icon size={18} strokeWidth={1.75} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="cms-sidebar-footer">
        <Link
          href="/"
          className="cms-nav-link cms-nav-link-external"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={18} strokeWidth={1.75} />
          <span>View site</span>
        </Link>
      </div>
    </>
  );

  return (
    <div className="cms-shell">
      <aside className="cms-sidebar cms-sidebar-desktop">{nav}</aside>

      {open ? (
        <div className="cms-sidebar-overlay" onClick={() => setOpen(false)} />
      ) : null}
      <aside
        className={`cms-sidebar cms-sidebar-mobile${open ? " is-open" : ""}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          className="cms-sidebar-close"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
        {nav}
      </aside>

      <div className="cms-main-wrap">
        <header className="cms-topbar">
          <button
            type="button"
            className="cms-menu-btn"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <p className="cms-topbar-title">Staff admin</p>
          <Link href="/" className="cms-topbar-site">
            Site
            <ExternalLink size={14} />
          </Link>
        </header>
        <main className="cms-content">{children}</main>
      </div>
    </div>
  );
}
