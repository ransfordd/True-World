"use client";

import { FormEvent, useEffect, useState } from "react";
import type { CmsAbout } from "@/lib/cms/types";

function linesToText(lines: string[]) {
  return (lines || []).join("\n");
}

export default function AdminAboutPage() {
  const [about, setAbout] = useState<CmsAbout | null>(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/cms/about");
      if (res.status === 401) {
        window.location.href = "/admin";
        return;
      }
      const data = await res.json();
      setAbout(data.about);
    })();
  }, []);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!about) return;
    setMsg("");
    setError("");
    const res = await fetch("/api/cms/about", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(about),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Save failed");
      return;
    }
    const data = await res.json();
    setAbout(data.about);
    setMsg("About page saved.");
  }

  if (!about) return <p className="cms-loading">Loading…</p>;

  function setField<K extends keyof CmsAbout>(key: K, value: CmsAbout[K]) {
    setAbout((a) => (a ? { ...a, [key]: value } : a));
  }

  function setUnique(i: number, key: "title" | "text", value: string) {
    setAbout((a) => {
      if (!a) return a;
      const uniqueItems = [...a.uniqueItems];
      uniqueItems[i] = { ...uniqueItems[i], [key]: value };
      return { ...a, uniqueItems };
    });
  }

  function setImpact(i: number, key: "title" | "text", value: string) {
    setAbout((a) => {
      if (!a) return a;
      const impactItems = [...a.impactItems];
      impactItems[i] = { ...impactItems[i], [key]: value };
      return { ...a, impactItems };
    });
  }

  return (
    <div className="max-w-2xl">
      <div className="cms-page-header">
        <div>
          <h1 className="cms-page-title">About page</h1>
          <p className="cms-page-sub">Story, founder, unique points, and CTA</p>
        </div>
      </div>
      <form onSubmit={onSave} className="cms-panel p-5 md:p-6 space-y-1">
        <div className="field">
          <label>Intro heading line</label>
          <textarea
            rows={2}
            value={about.introLead}
            onChange={(e) => setField("introLead", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Intro subtext</label>
          <textarea
            rows={2}
            value={about.introSub}
            onChange={(e) => setField("introSub", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Our story (one paragraph per line)</label>
          <textarea
            rows={6}
            value={linesToText(about.story)}
            onChange={(e) =>
              setField(
                "story",
                e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)
              )
            }
          />
        </div>
        <div className="field">
          <label>Founder name</label>
          <input
            value={about.founderName}
            onChange={(e) => setField("founderName", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Founder intro</label>
          <textarea
            rows={3}
            value={about.founderLead}
            onChange={(e) => setField("founderLead", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Founder body</label>
          <textarea
            rows={3}
            value={about.founderBody}
            onChange={(e) => setField("founderBody", e.target.value)}
          />
        </div>
        {(about.uniqueItems || []).map((item, i) => (
          <div key={i} className="grid sm:grid-cols-2 gap-3">
            <div className="field">
              <label>Unique {i + 1} title</label>
              <input
                value={item.title}
                onChange={(e) => setUnique(i, "title", e.target.value)}
              />
            </div>
            <div className="field">
              <label>Unique {i + 1} text</label>
              <textarea
                rows={2}
                value={item.text}
                onChange={(e) => setUnique(i, "text", e.target.value)}
              />
            </div>
          </div>
        ))}
        {(about.impactItems || []).map((item, i) => (
          <div key={`imp-${i}`} className="grid sm:grid-cols-2 gap-3">
            <div className="field">
              <label>Impact {i + 1} title</label>
              <input
                value={item.title}
                onChange={(e) => setImpact(i, "title", e.target.value)}
              />
            </div>
            <div className="field">
              <label>Impact {i + 1} text</label>
              <textarea
                rows={2}
                value={item.text}
                onChange={(e) => setImpact(i, "text", e.target.value)}
              />
            </div>
          </div>
        ))}
        <div className="field">
          <label>Vision</label>
          <textarea
            rows={4}
            value={about.vision}
            onChange={(e) => setField("vision", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Mission (one line per item)</label>
          <textarea
            rows={4}
            value={linesToText(about.missionLines)}
            onChange={(e) =>
              setField(
                "missionLines",
                e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)
              )
            }
          />
        </div>
        <div className="field">
          <label>Join CTA title</label>
          <input
            value={about.joinTitle}
            onChange={(e) => setField("joinTitle", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Join CTA text</label>
          <textarea
            rows={3}
            value={about.joinBody}
            onChange={(e) => setField("joinBody", e.target.value)}
          />
        </div>
        {error ? <p className="text-red-400 text-sm mb-2">{error}</p> : null}
        {msg ? <p className="text-ttw-gold text-sm mb-2">{msg}</p> : null}
        <button type="submit" className="btn btn-primary">
          Save about page
        </button>
      </form>
    </div>
  );
}
