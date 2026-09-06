"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  FileText,
  Heart,
  Inbox,
  Info,
  Library,
  MessageSquareQuote,
  Plus,
  Sparkles,
  Video,
} from "lucide-react";
import { PasswordField } from "@/components/admin/PasswordField";
import { useCmsAuth } from "@/components/admin/CmsAuthProvider";

const STATS = [
  {
    label: "Articles",
    key: "articles" as const,
    href: "/admin/articles",
    icon: FileText,
    hint: "Edit & publish teachings",
  },
  {
    label: "Testimonials",
    key: "testimonials" as const,
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
    hint: "Client stories",
  },
  {
    label: "Resources",
    key: "resources" as const,
    href: "/admin/resources",
    icon: Library,
    hint: "Books & links",
  },
  {
    label: "Daily Truths",
    key: "dailyTruths" as const,
    href: "/admin/daily-truths",
    icon: Sparkles,
    hint: "Homepage rotation",
  },
  {
    label: "Coaching packages",
    key: "coachingPackages" as const,
    href: "/admin/coaching",
    icon: Heart,
    hint: "Paths & offers",
  },
  {
    label: "Journey tiers",
    key: "courseTiers" as const,
    href: "/admin/journey",
    icon: Compass,
    hint: "Course structure",
  },
];

export default function AdminHomePage() {
  const router = useRouter();
  const { refresh } = useCmsAuth();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email: string; role: string } | null>(
    null
  );
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [recent, setRecent] = useState<
    {
      id: string;
      title: string;
      slug: string;
      status: string;
      updatedAt: string;
    }[]
  >([]);
  const [youtubeId, setYoutubeId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadMe() {
    setLoading(true);
    const res = await fetch("/api/cms/me");
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      setCounts(data.counts || {});
      setRecent(data.recentArticles || []);
      setYoutubeId(data.youtubeFeaturedVideoId || "");
    } else {
      setUser(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadMe();
  }, []);

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/cms/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Login failed");
      return;
    }
    await loadMe();
    await refresh();
  }

  if (loading) {
    return <p className="cms-loading">Loading dashboard…</p>;
  }

  if (!user) {
    return (
      <div className="cms-login-wrap">
        <div className="cms-login-card">
          <h1>Staff login</h1>
          <p className="cms-page-sub">
            Manage articles, resources, coaching, and site settings.
          </p>
          <form onSubmit={onLogin}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <PasswordField
              id="password"
              label="Password"
              autoComplete="current-password"
              value={password}
              onChange={setPassword}
              required
            />
            {error ? <p className="text-red-400 text-sm mb-3">{error}</p> : null}
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const total =
    (counts.articles || 0) +
    (counts.testimonials || 0) +
    (counts.resources || 0);

  return (
    <div>
      <div className="cms-page-header">
        <div>
          <h1 className="cms-page-title">Dashboard</h1>
          <p className="cms-page-sub">
            Signed in as <strong className="text-gray-300">{user.email}</strong>
            {" · "}
            <span className="cms-badge cms-badge-muted">{user.role}</span>
          </p>
        </div>
      </div>

      <p className="cms-page-sub mb-5">
        {total} content items ready to edit. Choose a section below.
      </p>

      <div className="cms-stat-grid">
        {STATS.map(({ label, key, href, icon: Icon, hint }) => (
          <button
            key={href}
            type="button"
            className="cms-stat-card"
            onClick={() => router.push(href)}
          >
            <div className="cms-stat-top">
              <span className="cms-stat-label">{label}</span>
              <span className="cms-stat-icon">
                <Icon size={18} strokeWidth={1.75} />
              </span>
            </div>
            <p className="cms-stat-value">{counts[key] ?? 0}</p>
            <p className="cms-stat-cta">{hint} →</p>
          </button>
        ))}
      </div>

      <div className="cms-stat-grid mt-4">
        <button
          type="button"
          className="cms-stat-card"
          onClick={() => router.push("/admin/inbox")}
        >
          <div className="cms-stat-top">
            <span className="cms-stat-label">Unread inbox</span>
            <span className="cms-stat-icon">
              <Inbox size={18} strokeWidth={1.75} />
            </span>
          </div>
          <p className="cms-stat-value">{counts.unreadMessages ?? 0}</p>
          <p className="cms-stat-cta">Open inbox →</p>
        </button>
        <button
          type="button"
          className="cms-stat-card"
          onClick={() => router.push("/admin/articles?status=draft")}
        >
          <div className="cms-stat-top">
            <span className="cms-stat-label">Drafts</span>
            <span className="cms-stat-icon">
              <FileText size={18} strokeWidth={1.75} />
            </span>
          </div>
          <p className="cms-stat-value">{counts.drafts ?? 0}</p>
          <p className="cms-stat-cta">View drafts →</p>
        </button>
        <button
          type="button"
          className="cms-stat-card"
          onClick={() => router.push("/admin/settings")}
        >
          <div className="cms-stat-top">
            <span className="cms-stat-label">Featured YouTube</span>
            <span className="cms-stat-icon">
              <Video size={18} strokeWidth={1.75} />
            </span>
          </div>
          <p className="cms-stat-value text-lg">
            {youtubeId.trim() ? "Set" : "Empty"}
          </p>
          <p className="cms-stat-cta">
            {youtubeId.trim()
              ? "Configured — edit in Settings →"
              : "Add a video ID in Settings →"}
          </p>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-6 mb-6">
        <Link href="/admin/articles/new" className="btn btn-primary">
          <Plus size={16} />
          New article
        </Link>
        <Link href="/admin/daily-truths" className="btn btn-ghost">
          Daily Truth
        </Link>
        <Link href="/admin/inbox" className="btn btn-ghost">
          Inbox
        </Link>
      </div>

      <div className="cms-panel p-5 mb-6">
        <h2 className="cms-page-title text-xl mb-3">Recent articles</h2>
        {recent.length === 0 ? (
          <p className="text-gray-500 text-sm">No articles yet.</p>
        ) : (
          <ul className="space-y-2">
            {recent.map((a) => (
              <li key={a.id} className="flex justify-between gap-3 text-sm">
                <Link
                  href={`/admin/articles/${a.id}`}
                  className="text-gray-200 hover:text-ttw-gold"
                >
                  {a.title}
                </Link>
                <span
                  className={`cms-badge ${
                    a.status === "published"
                      ? "cms-badge-published"
                      : "cms-badge-draft"
                  }`}
                >
                  {a.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="cms-callout">
        <Info className="cms-callout-icon" size={18} />
        <p>
          Uploads save under <code>/uploads</code>. On Coolify, persist{" "}
          <code>data/cms</code> and <code>public/uploads</code> so content and
          images survive redeploys.
        </p>
      </div>
    </div>
  );
}
