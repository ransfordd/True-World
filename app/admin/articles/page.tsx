"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { CmsArticle } from "@/lib/cms/types";
import { ExternalLink, Plus } from "lucide-react";

export default function AdminArticlesPage() {
  return (
    <Suspense fallback={<p className="cms-loading">Loading articles…</p>}>
      <AdminArticlesInner />
    </Suspense>
  );
}

function AdminArticlesInner() {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<CmsArticle[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(searchParams.get("status") || "all");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/cms/articles");
    if (res.status === 401) {
      window.location.href = "/admin";
      return;
    }
    if (!res.ok) {
      setError("Failed to load articles");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setArticles(data.articles || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this article permanently?")) return;
    const res = await fetch(`/api/cms/articles/${id}`, { method: "DELETE" });
    if (res.ok) load();
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (status !== "all" && a.status !== status) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) || a.slug.toLowerCase().includes(q)
      );
    });
  }, [articles, query, status]);

  if (loading) return <p className="cms-loading">Loading articles…</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div>
      <div className="cms-page-header">
        <div>
          <h1 className="cms-page-title">Articles</h1>
          <p className="cms-page-sub">
            {filtered.length} of {articles.length} teaching
            {articles.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link href="/admin/articles/new" className="btn btn-primary">
          <Plus size={16} strokeWidth={2.5} />
          New article
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title or slug…"
          className="flex-1"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="sm:w-48"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      <div className="cms-panel overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Category</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id}>
                <td>
                  <div className="font-medium text-gray-100">{a.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">/{a.slug}</div>
                </td>
                <td>
                  <span
                    className={`cms-badge ${
                      a.status === "published"
                        ? "cms-badge-published"
                        : "cms-badge-draft"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
                <td>
                  <span className="cms-badge cms-badge-muted">{a.category}</span>
                </td>
                <td className="text-gray-400 text-sm">
                  {a.featured ? "Yes" : "—"}
                </td>
                <td className="space-x-2 whitespace-nowrap">
                  <Link
                    href={`/admin/articles/${a.id}`}
                    className="btn btn-ghost"
                  >
                    Edit
                  </Link>
                  {a.status === "published" && a.slug ? (
                    <a
                      href={`/articles/${a.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost inline-flex items-center gap-1"
                    >
                      View on site
                      <ExternalLink size={12} />
                    </a>
                  ) : null}
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => remove(a.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <p className="p-6 text-gray-500 text-sm">No articles match.</p>
        ) : null}
      </div>
    </div>
  );
}
