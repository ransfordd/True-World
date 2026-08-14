"use client";

import { FormEvent, useEffect, useState } from "react";
import type { CmsHomepage } from "@/lib/cms/types";

function linesToText(lines: string[]) {
  return (lines || []).join("\n");
}

export default function AdminHomepagePage() {
  const [page, setPage] = useState<CmsHomepage | null>(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/cms/homepage");
      if (res.status === 401) {
        window.location.href = "/admin";
        return;
      }
      const data = await res.json();
      setPage(data.homepage);
    })();
  }, []);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!page) return;
    setMsg("");
    setError("");
    const res = await fetch("/api/cms/homepage", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(page),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Save failed");
      return;
    }
    const data = await res.json();
    setPage(data.homepage);
    setMsg("Homepage copy saved.");
  }

  if (!page) return <p className="cms-loading">Loading…</p>;

  function setField<K extends keyof CmsHomepage>(key: K, value: CmsHomepage[K]) {
    setPage((p) => (p ? { ...p, [key]: value } : p));
  }

  function setPillar(i: number, key: "name" | "line", value: string) {
    setPage((p) => {
      if (!p) return p;
      const pillars = [...p.pillars];
      pillars[i] = { ...pillars[i], [key]: value };
      return { ...p, pillars };
    });
  }

  return (
    <div className="max-w-2xl">
      <div className="cms-page-header">
        <div>
          <h1 className="cms-page-title">Homepage</h1>
          <p className="cms-page-sub">Hero, about blurb, pillars, and welcome overlay</p>
        </div>
      </div>
      <form onSubmit={onSave} className="cms-panel p-5 md:p-6">
        <div className="field">
          <label>Hero headline</label>
          <input
            value={page.heroHeadline}
            onChange={(e) => setField("heroHeadline", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Hero subtitle</label>
          <input
            value={page.heroSub}
            onChange={(e) => setField("heroSub", e.target.value)}
          />
        </div>
        <div className="field">
          <label>About heading</label>
          <input
            value={page.aboutHeading}
            onChange={(e) => setField("aboutHeading", e.target.value)}
          />
        </div>
        <div className="field">
          <label>About paragraphs (one per line)</label>
          <textarea
            rows={6}
            value={linesToText(page.aboutParagraphs)}
            onChange={(e) =>
              setField(
                "aboutParagraphs",
                e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)
              )
            }
          />
        </div>
        {(page.pillars || []).map((pillar, i) => (
          <div key={i} className="grid sm:grid-cols-2 gap-3">
            <div className="field">
              <label>Pillar {i + 1} name</label>
              <input
                value={pillar.name}
                onChange={(e) => setPillar(i, "name", e.target.value)}
              />
            </div>
            <div className="field">
              <label>Pillar {i + 1} line</label>
              <input
                value={pillar.line}
                onChange={(e) => setPillar(i, "line", e.target.value)}
              />
            </div>
          </div>
        ))}
        <div className="field">
          <label>Welcome overlay title</label>
          <input
            value={page.welcomeTitle}
            onChange={(e) => setField("welcomeTitle", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Welcome overlay subtitle</label>
          <input
            value={page.welcomeSubtitle}
            onChange={(e) => setField("welcomeSubtitle", e.target.value)}
          />
        </div>
        {error ? <p className="text-red-400 text-sm mb-2">{error}</p> : null}
        {msg ? <p className="text-ttw-gold text-sm mb-2">{msg}</p> : null}
        <button type="submit" className="btn btn-primary">
          Save homepage
        </button>
      </form>
    </div>
  );
}
