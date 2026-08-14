"use client";

import { FormEvent, useEffect, useState } from "react";

export default function AdminCreedPage() {
  const [creed, setCreed] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/cms/creed");
      if (res.status === 401) {
        window.location.href = "/admin";
        return;
      }
      const data = await res.json();
      setCreed(data.creed || "");
      setLoading(false);
    })();
  }, []);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setMsg("");
    setError("");
    const res = await fetch("/api/cms/creed", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creed }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Save failed");
      return;
    }
    setMsg("Creed saved.");
  }

  if (loading) return <p className="cms-loading">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <div className="cms-page-header">
        <div>
          <h1 className="cms-page-title">Creed of Sacred Union</h1>
          <p className="cms-page-sub">Shown on the testimonials page</p>
        </div>
      </div>
      <form onSubmit={onSave} className="cms-panel p-5 md:p-6">
        <div className="field">
          <label>Creed</label>
          <textarea
            rows={18}
            value={creed}
            onChange={(e) => setCreed(e.target.value)}
          />
        </div>
        {error ? <p className="text-red-400 text-sm mb-2">{error}</p> : null}
        {msg ? <p className="text-ttw-gold text-sm mb-2">{msg}</p> : null}
        <button type="submit" className="btn btn-primary">
          Save creed
        </button>
      </form>
    </div>
  );
}
