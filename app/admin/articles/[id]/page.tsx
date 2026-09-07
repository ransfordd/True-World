"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { CmsArticle } from "@/lib/cms/types";
import { ArticleBodyEditor } from "@/components/admin/ArticleBodyEditor";
import { MediaLibraryPicker } from "@/components/admin/MediaLibraryPicker";
import { ExternalLink } from "lucide-react";

const empty: Partial<CmsArticle> = {
  title: "",
  slug: "",
  description: "",
  excerpt: "",
  category: "TEACHING",
  coverImageUrl: "/images/logo.png.png",
  bodyHtml: "<p></p>",
  featured: false,
  status: "draft",
};

export default function AdminArticleEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id || "");
  const isNew = id === "new";
  const [form, setForm] = useState<Partial<CmsArticle>>(empty);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [pickerOpen, setPickerOpen] = useState(false);
  const snapshot = useRef(JSON.stringify(empty));
  const dirtyRef = useRef(false);

  useEffect(() => {
    if (isNew) {
      snapshot.current = JSON.stringify(empty);
      return;
    }
    (async () => {
      const res = await fetch(`/api/cms/articles/${id}`);
      if (res.status === 401) {
        window.location.href = "/admin";
        return;
      }
      if (!res.ok) {
        setError("Article not found");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setForm(data.article);
      snapshot.current = JSON.stringify(data.article);
      setLoading(false);
    })();
  }, [id, isNew]);

  useEffect(() => {
    dirtyRef.current = JSON.stringify(form) !== snapshot.current;
  }, [form]);

  useEffect(() => {
    function onLeave(e: BeforeUnloadEvent) {
      if (!dirtyRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, []);

  function set<K extends keyof CmsArticle>(key: K, value: CmsArticle[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onUpload(file: File) {
    const fd = new FormData();
    fd.set("file", file);
    fd.set("alt", form.title || "Article cover");
    const res = await fetch("/api/cms/upload", { method: "POST", body: fd });
    if (!res.ok) {
      setError("Upload failed");
      return;
    }
    const data = await res.json();
    set("coverImageUrl", data.media.url);
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch(
      isNew ? "/api/cms/articles" : `/api/cms/articles/${id}`,
      {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Save failed");
      return;
    }
    snapshot.current = JSON.stringify(form);
    dirtyRef.current = false;
    router.push("/admin/articles");
    router.refresh();
  }

  if (loading) return <p className="cms-loading">Loading…</p>;

  return (
    <div className="max-w-3xl">
      <div className="cms-page-header">
        <div>
          <nav className="cms-breadcrumb" aria-label="Breadcrumb">
            <Link href="/admin/articles">Articles</Link>
            <span className="cms-breadcrumb-sep" aria-hidden>
              /
            </span>
            <span className="cms-breadcrumb-current">
              {isNew ? "New" : form.title?.trim() || "Untitled"}
            </span>
          </nav>
          <h1 className="cms-page-title">
            {isNew ? "New article" : "Edit article"}
          </h1>
          <p className="cms-page-sub">
            Write the body with the formatting toolbar — no code required.
          </p>
        </div>
        {form.status === "published" && form.slug ? (
          <a
            href={`/articles/${form.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost inline-flex items-center gap-1"
          >
            View on site
            <ExternalLink size={14} />
          </a>
        ) : null}
      </div>
      <form onSubmit={onSave} className="cms-panel p-5 md:p-6">
        <div className="field">
          <label>Title</label>
          <input
            value={form.title || ""}
            onChange={(e) => {
              set("title", e.target.value);
              if (isNew) {
                set(
                  "slug",
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "")
                );
              }
            }}
            required
          />
        </div>
        <div className="field">
          <label>Slug</label>
          <input
            value={form.slug || ""}
            onChange={(e) => set("slug", e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Description</label>
          <span className="field-help">
            SEO / meta description shown in search results.
          </span>
          <textarea
            rows={2}
            value={form.description || ""}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Excerpt</label>
          <span className="field-help">
            Short blurb on article cards and listings.
          </span>
          <textarea
            rows={2}
            value={form.excerpt || ""}
            onChange={(e) => set("excerpt", e.target.value)}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="field">
            <label>Category</label>
            <select
              value={form.category || "TEACHING"}
              onChange={(e) =>
                set("category", e.target.value as CmsArticle["category"])
              }
            >
              <option value="TEACHING">TEACHING</option>
              <option value="FAITH">FAITH</option>
            </select>
          </div>
          <div className="field">
            <label>Status</label>
            <select
              value={form.status || "draft"}
              onChange={(e) =>
                set("status", e.target.value as CmsArticle["status"])
              }
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label>Cover image URL</label>
          <input
            value={form.coverImageUrl || ""}
            onChange={(e) => set("coverImageUrl", e.target.value)}
          />
          {form.coverImageUrl ? (
            <div className="mt-3 rounded-lg overflow-hidden border border-white/10 max-w-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.coverImageUrl}
                alt="Cover preview"
                className="w-full h-36 object-cover bg-black"
              />
            </div>
          ) : null}
        </div>
        <div className="field">
          <label>Upload cover</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(f);
            }}
          />
        </div>
        <div className="field">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setPickerOpen(true)}
          >
            Choose from library
          </button>
        </div>
        <div className="field">
          <label className="flex items-center gap-2 normal-case tracking-normal text-gray-300">
            <input
              type="checkbox"
              checked={Boolean(form.featured)}
              onChange={(e) => set("featured", e.target.checked)}
              className="w-auto"
            />
            Featured on homepage
          </label>
        </div>
        <div className="field">
          <label>Article body</label>
          <span className="field-help">
            Write and format the article here. Bold, headings, and lists are
            available from the toolbar.
          </span>
          <ArticleBodyEditor
            value={form.bodyHtml || ""}
            onChange={(html) => set("bodyHtml", html)}
          />
        </div>
        <div className="field">
          <label>Preview</label>
          <div
            className="prose-article rounded-xl border border-white/10 p-4 bg-black/40"
            dangerouslySetInnerHTML={{ __html: form.bodyHtml || "" }}
          />
        </div>
        {error ? <p className="text-red-400 text-sm mb-3">{error}</p> : null}
        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => router.push("/admin/articles")}
          >
            Cancel
          </button>
        </div>
      </form>
      {pickerOpen ? (
        <MediaLibraryPicker
          onSelect={(url) => set("coverImageUrl", url)}
          onClose={() => setPickerOpen(false)}
        />
      ) : null}
    </div>
  );
}
