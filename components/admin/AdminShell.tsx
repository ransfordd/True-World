"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Compass,
  ExternalLink,
  FileText,
  Heart,
  HelpCircle,
  Home,
  ImageIcon,
  Inbox,
  LayoutDashboard,
  Library,
  LogOut,
  Menu,
  MessageSquareQuote,
  Quote,
  ScrollText,
  Settings,
  Sparkles,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { useCmsAuth } from "@/components/admin/CmsAuthProvider";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

type NavSection = {
  title: string;
  collapsible?: boolean;
  storageKey?: string;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Content",
    collapsible: true,
    storageKey: "cms-nav-content-open",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/articles", label: "Articles", icon: FileText },
      { href: "/admin/inbox", label: "Inbox", icon: Inbox },
      { href: "/admin/media", label: "Media", icon: ImageIcon },
      { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { href: "/admin/resources", label: "Resources", icon: Library },
      { href: "/admin/daily-truths", label: "Daily Truth", icon: Sparkles },
      { href: "/admin/coaching", label: "Coaching", icon: Heart },
      { href: "/admin/journey", label: "Journey", icon: Compass },
    ],
  },
  {
    title: "Pages",
    collapsible: true,
    storageKey: "cms-nav-pages-open",
    items: [
      { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
      { href: "/admin/about", label: "About", icon: User },
      { href: "/admin/homepage", label: "Homepage", icon: Home },
      { href: "/admin/exaltation", label: "Exaltation", icon: Quote },
      { href: "/admin/creed", label: "Creed", icon: ScrollText },
    ],
  },
  {
    title: "Account",
    items: [{ href: "/admin/settings", label: "Settings", icon: Settings }],
  },
];

function useSectionOpen(
  storageKey: string | undefined,
  defaultOpen: boolean
) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw === "0") setOpen(false);
      if (raw === "1") setOpen(true);
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  function toggle() {
    setOpen((prev) => {
      const next = !prev;
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, next ? "1" : "0");
        } catch {
          /* ignore */
        }
      }
      return next;
    });
  }

  return { open, toggle };
}

function NavSectionBlock({
  section,
  isActive,
  onNavigate,
}: {
  section: NavSection;
  isActive: (href: string, exact?: boolean) => boolean;
  onNavigate: () => void;
}) {
  const { open, toggle } = useSectionOpen(
    section.storageKey,
    true
  );
  const showItems = !section.collapsible || open;

  return (
    <div className="cms-sidebar-group">
      {section.collapsible ? (
        <button
          type="button"
          className="cms-sidebar-section-btn"
          onClick={toggle}
          aria-expanded={open}
        >
          <span>{section.title}</span>
          <span className="cms-sidebar-section-chevron" aria-hidden>
            {open ? "▾" : "▸"}
          </span>
        </button>
      ) : (
        <p className="cms-sidebar-section">{section.title}</p>
      )}
      {showItems ? (
        <div className="cms-sidebar-group-items">
          {section.items.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={`cms-nav-link${isActive(href, exact) ? " is-active" : ""}`}
              onClick={onNavigate}
            >
              <Icon size={18} strokeWidth={1.75} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { status, email, markGuest } = useCmsAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (status === "guest" && pathname !== "/admin") {
      router.replace("/admin");
    }
  }, [status, pathname, router]);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  async function onLogout() {
    await fetch("/api/cms/logout", { method: "POST" });
    markGuest();
    setOpen(false);
    router.replace("/admin");
  }

  if (status === "loading") {
    return <p className="cms-loading">Loading…</p>;
  }

  if (status === "guest") {
    return <>{children}</>;
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
        {NAV_SECTIONS.map((section) => (
          <NavSectionBlock
            key={section.title}
            section={section}
            isActive={isActive}
            onNavigate={() => setOpen(false)}
          />
        ))}
      </nav>

      <div className="cms-sidebar-footer">
        {email ? (
          <p className="cms-sidebar-email" title={email}>
            {email}
          </p>
        ) : null}
        <Link
          href="/"
          className="cms-nav-link cms-nav-link-external"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={18} strokeWidth={1.75} />
          <span>View site</span>
        </Link>
        <button
          type="button"
          className="cms-nav-link cms-nav-link-external w-full text-left"
          onClick={onLogout}
        >
          <LogOut size={18} strokeWidth={1.75} />
          <span>Sign out</span>
        </button>
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
