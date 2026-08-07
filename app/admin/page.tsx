"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminHomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email: string; role: string } | null>(
    null
  );
  const [counts, setCounts] = useState<Record<string, number>>({});
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
  }

  async function onLogout() {
    await fetch("/api/cms/logout", { method: "POST" });
    setUser(null);
  }

  if (loading) {
    return <p className="text-gray-400">Loading…</p>;
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <h1 className="font-cinzel text-3xl text-ttw-gold mb-2">Staff login</h1>
        <p className="text-gray-400 text-sm mb-6">
          Manage articles, resources, coaching, and site settings.
        </p>
        <form onSubmit={onLogin} className="space-y-4">
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
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error ? <p className="text-red-400 text-sm">{error}</p> : null}
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-cinzel text-3xl text-ttw-gold">Dashboard</h1>
          <p className="text-gray-400 text-sm">
            Signed in as {user.email} ({user.role})
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onLogout}>
          Sign out
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {[
          ["Articles", counts.articles, "/admin/articles"],
          ["Testimonials", counts.testimonials, "/admin/testimonials"],
          ["Resources", counts.resources, "/admin/resources"],
          ["Daily Truths", counts.dailyTruths, "/admin/daily-truths"],
          ["Coaching packages", counts.coachingPackages, "/admin/coaching"],
          ["Journey tiers", counts.courseTiers, "/admin/journey"],
        ].map(([label, n, href]) => (
          <button
            key={String(href)}
            type="button"
            className="text-left p-5 rounded-xl border border-ttw-gold/20 bg-black/40 hover:border-ttw-gold/50"
            onClick={() => router.push(String(href))}
          >
            <p className="text-ttw-gold font-cinzel text-lg">{label}</p>
            <p className="text-3xl font-bold mt-2">{n ?? 0}</p>
          </button>
        ))}
      </div>

      <p className="text-gray-500 text-sm">
        Tip: uploads are saved under <code className="text-ttw-gold">/uploads</code>.
        Persist the <code className="text-ttw-gold">data/cms</code> and{" "}
        <code className="text-ttw-gold">public/uploads</code> volumes in Coolify.
      </p>
    </div>
  );
}
