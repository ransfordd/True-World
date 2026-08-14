"use client";

import { useEffect, useMemo, useState } from "react";
import type { CmsMessage, CmsMessageType } from "@/lib/cms/types";

const TYPES: { value: "all" | CmsMessageType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "question", label: "Questions" },
  { value: "prayer", label: "Prayer" },
  { value: "coaching", label: "Coaching" },
  { value: "subscribe", label: "Subscribe" },
];

export default function AdminInboxPage() {
  const [messages, setMessages] = useState<CmsMessage[]>([]);
  const [filter, setFilter] = useState<"all" | CmsMessageType>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/cms/messages");
    if (res.status === 401) {
      window.location.href = "/admin";
      return;
    }
    if (!res.ok) {
      setError("Failed to load inbox");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setMessages(data.messages || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const unread = messages.filter((m) => !m.read).length;
  const shown = useMemo(
    () =>
      filter === "all" ? messages : messages.filter((m) => m.type === filter),
    [messages, filter]
  );

  async function setRead(id: string, read: boolean) {
    await fetch(`/api/cms/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/cms/messages/${id}`, { method: "DELETE" });
    load();
  }

  if (loading) return <p className="cms-loading">Loading inbox…</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div>
      <div className="cms-page-header">
        <div>
          <h1 className="cms-page-title">Inbox</h1>
          <p className="cms-page-sub">
            {unread} unread · {messages.length} total
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-5">
        {TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            className={`btn ${filter === t.value ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setFilter(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <ul className="space-y-3">
        {shown.map((m) => (
          <li
            key={m.id}
            className={`cms-panel p-4 ${m.read ? "opacity-80" : ""}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-gray-100">
                  {!m.read ? (
                    <span className="cms-badge cms-badge-published mr-2">
                      Unread
                    </span>
                  ) : null}
                  <span className="cms-badge cms-badge-muted mr-2">{m.type}</span>
                  {m.name || m.email || "(no name)"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {m.email || "—"} {m.phone ? `· ${m.phone}` : ""}{" "}
                  {m.package ? `· ${m.package}` : ""}{" "}
                  {m.isPrivate ? "· private" : ""} ·{" "}
                  {new Date(m.createdAt).toLocaleString()}
                </p>
                {m.body ? (
                  <p className="text-sm text-gray-300 mt-3 whitespace-pre-wrap">
                    {m.body}
                  </p>
                ) : null}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setRead(m.id, !m.read)}
                >
                  {m.read ? "Mark unread" : "Mark read"}
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => remove(m.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
        {shown.length === 0 ? (
          <li className="cms-panel p-6 text-gray-500 text-sm">No messages.</li>
        ) : null}
      </ul>
    </div>
  );
}
