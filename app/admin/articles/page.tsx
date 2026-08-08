"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CmsArticle } from "@/lib/cms/types";
import { Plus } from "lucide-react";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<CmsArticle[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p className="cms-loading">Loading articles…</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div>
      <div className="cms-page-header">
        <div>
          <h1 className="cms-page-title">Articles</h1>
          <p className="cms-page-sub">
            {articles.length} teaching{articles.length === 1 ? "" : "s"} in the
            library
          </p>
        </div>
        <Link href="/admin/articles/new" className="btn btn-primary">
          <Plus size={16} strokeWidth={2.5} />
          New article
        </Link>
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
            {articles.map((a) => (
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
      </div>
    </div>
  );
}
