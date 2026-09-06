"use client";

import { useEffect, useState } from "react";
import type { CmsMedia } from "@/lib/cms/types";

export default function AdminMediaPage() {
  const [media, setMedia] = useState<CmsMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/cms/media");
    if (res.status === 401) {
      window.location.href = "/admin";
      return;
    }
    if (!res.ok) {
      setError("Failed to load media");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setMedia(data.media || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onUpload(file: File) {
    setError("");
    const fd = new FormData();
    fd.set("file", file);
    fd.set("alt", file.name);
    const res = await fetch("/api/cms/upload", { method: "POST", body: fd });
    if (!res.ok) {
      setError("Upload failed. Try again or use a smaller image.");
      return;
    }
    await load();
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    window.setTimeout(() => setCopied(""), 1500);
  }

  async function remove(id: string) {
    if (!confirm("Delete this file from the library?")) return;
    setError("");
    const res = await fetch(`/api/cms/media/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Delete failed");
      return;
    }
    await load();
  }

  if (loading && media.length === 0) {
    return <p className="cms-loading">Loading media…</p>;
  }

  return (
    <div>
      <div className="cms-page-header">
        <div>
          <h1 className="cms-page-title">Media library</h1>
          <p className="cms-page-sub">
            {media.length} file{media.length === 1 ? "" : "s"}
          </p>
        </div>
        <label className="btn btn-primary cursor-pointer">
          Upload
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(f);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      {error ? (
        <p className="text-red-400 text-sm mb-4 cms-panel p-3">{error}</p>
      ) : null}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {media.map((item) => (
          <div key={item.id} className="cms-panel overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.url}
              alt={item.alt}
              className="w-full h-40 object-cover bg-black"
            />
            <div className="p-3">
              <p className="text-sm text-gray-200 truncate">{item.filename}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.alt || "—"}</p>
              <p className="text-xs text-gray-500 truncate mt-1">{item.url}</p>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => copyUrl(item.url)}
                >
                  {copied === item.url ? "Copied" : "Copy URL"}
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => remove(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {media.length === 0 ? (
        <p className="cms-panel p-6 text-gray-500 text-sm">
          No uploads yet. Use the upload button or add a cover from an article.
        </p>
      ) : null}
    </div>
  );
}
