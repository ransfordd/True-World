"use client";

import { FormEvent, useEffect, useState } from "react";
import type { CmsSiteSettings } from "@/lib/cms/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<CmsSiteSettings | null>(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/cms/settings");
      if (res.status === 401) {
        window.location.href = "/admin";
        return;
      }
      const data = await res.json();
      setSettings(data.settings);
    })();
  }, []);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setMsg("");
    setError("");
    const res = await fetch("/api/cms/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Save failed (admin role required)");
      return;
    }
    const data = await res.json();
    setSettings(data.settings);
    setMsg("Settings saved.");
  }

  if (!settings) return <p className="cms-loading">Loading…</p>;

  function field(key: keyof CmsSiteSettings, label: string) {
    return (
      <div className="field" key={key}>
        <label>{label}</label>
        <input
          value={settings![key]}
          onChange={(e) =>
            setSettings((s) => (s ? { ...s, [key]: e.target.value } : s))
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <div className="cms-page-header">
        <div>
          <h1 className="cms-page-title">Site settings</h1>
          <p className="cms-page-sub">
            Name, contact links, and featured YouTube video
          </p>
        </div>
      </div>
      <form onSubmit={onSave} className="cms-panel p-5 md:p-6">
        {field("name", "Site name")}
        {field("tagline", "Tagline")}
        {field("email", "Email")}
        {field("website", "Website")}
        {field("instagram", "Instagram URL")}
        {field("instagramHandle", "Instagram handle")}
        {field("youtube", "YouTube channel URL")}
        {field("youtubeFeaturedVideoId", "Featured YouTube video ID")}
        {field("logo", "Logo path")}
        {error ? <p className="text-red-400 text-sm mb-2">{error}</p> : null}
        {msg ? <p className="text-ttw-gold text-sm mb-2">{msg}</p> : null}
        <button type="submit" className="btn btn-primary">
          Save settings
        </button>
      </form>
    </div>
  );
}
