"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CmsArticle } from "@/lib/cms/types";

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

  if (loading) return <p className="text-gray-400">Loading articles…</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="font-cinzel text-3xl text-ttw-gold">Articles</h1>
        <Link href="/admin/articles/new" className="btn btn-primary">
          New article
        </Link>
      </div>
      <div className="overflow-x-auto rounded-xl border border-ttw-gold/20">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Category</th>
              <th>Featured</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id}>
                <td>
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs text-gray-500">/{a.slug}</div>
                </td>
                <td>{a.status}</td>
                <td>{a.category}</td>
                <td>{a.featured ? "Yes" : "—"}</td>
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
