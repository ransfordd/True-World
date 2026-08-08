"use client";

import { FormEvent, useEffect, useState } from "react";
import type { CmsSiteSettings } from "@/lib/cms/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<CmsSiteSettings | null>(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwBusy, setPwBusy] = useState(false);

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

  async function onChangePassword(e: FormEvent) {
    e.preventDefault();
    setPwMsg("");
    setPwError("");

    if (newPassword.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("New password and confirmation do not match.");
      return;
    }

    setPwBusy(true);
    const res = await fetch("/api/cms/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setPwBusy(false);

    if (res.status === 401) {
      window.location.href = "/admin";
      return;
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setPwError(data.error || "Could not change password.");
      return;
    }

    setPwMsg("Password updated. Use it the next time you sign in.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
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
    <div className="max-w-xl space-y-8">
      <div className="cms-page-header">
        <div>
          <h1 className="cms-page-title">Settings</h1>
          <p className="cms-page-sub">
            Site details and your staff account password
          </p>
        </div>
      </div>

      <form onSubmit={onSave} className="cms-panel p-5 md:p-6">
        <h2 className="cms-page-title text-xl mb-1">Site settings</h2>
        <p className="cms-page-sub mb-5">
          Name, contact links, and featured YouTube video
        </p>
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

      <form onSubmit={onChangePassword} className="cms-panel p-5 md:p-6">
        <h2 className="cms-page-title text-xl mb-1">Change password</h2>
        <p className="cms-page-sub mb-5">
          Update the password you use to sign in to this CMS.
        </p>
        <div className="field">
          <label htmlFor="currentPassword">Current password</label>
          <input
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="newPassword">New password</label>
          <input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
          />
          <span className="field-help">At least 8 characters</span>
        </div>
        <div className="field">
          <label htmlFor="confirmPassword">Confirm new password</label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>
        {pwError ? <p className="text-red-400 text-sm mb-2">{pwError}</p> : null}
        {pwMsg ? <p className="text-ttw-gold text-sm mb-2">{pwMsg}</p> : null}
        <button type="submit" className="btn btn-primary" disabled={pwBusy}>
          {pwBusy ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
