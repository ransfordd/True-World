"use client";

import { FormEvent, useEffect, useState } from "react";

type Field =
  | { key: string; label: string; type?: "text" | "textarea" | "number" | "checkbox" }
  | { key: string; label: string; type: "list" };

type Props = {
  title: string;
  collection: string;
  fields: Field[];
  defaults: Record<string, unknown>;
};

export function CollectionAdmin({ title, collection, fields, defaults }: Props) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [form, setForm] = useState<Record<string, unknown>>(defaults);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/cms/collections/${collection}`);
    if (res.status === 401) {
      window.location.href = "/admin";
      return;
    }
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [collection]);

  function startEdit(item: Record<string, unknown>) {
    setEditingId(String(item.id));
    const next = { ...item };
    for (const f of fields) {
      if (f.type === "list" && Array.isArray(item[f.key])) {
        next[f.key] = (item[f.key] as string[]).join("\n");
      }
    }
    setForm(next);
  }

  function resetForm() {
    setEditingId(null);
    setForm(defaults);
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setError("");
    const payload: Record<string, unknown> = { ...form };
    for (const f of fields) {
      if (f.type === "list") {
        payload[f.key] = String(form[f.key] || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
    const res = editingId
      ? await fetch(`/api/cms/collections/${collection}/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch(`/api/cms/collections/${collection}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Save failed");
      return;
    }
    resetForm();
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/cms/collections/${collection}/${id}`, {
      method: "DELETE",
    });
    load();
  }

  if (loading) return <p className="cms-loading">Loading…</p>;

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
      <div>
        <div className="cms-page-header mb-5">
          <div>
            <h1 className="cms-page-title">{title}</h1>
            <p className="cms-page-sub">
              {items.length} item{items.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        <ul className="cms-item-list">
          {items.map((item) => (
            <li key={String(item.id)} className="cms-item-card">
              <p className="cms-item-card-title">
                {String(
                  item.name ||
                    item.title ||
                    item.names ||
                    item.reference ||
                    item.text ||
                    item.id
                ).slice(0, 80)}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => startEdit(item)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => remove(String(item.id))}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {items.length === 0 ? (
            <li className="cms-item-card text-gray-500 text-sm">
              No items yet — add one on the right.
            </li>
          ) : null}
        </ul>
      </div>
      <div className="cms-panel p-5 md:p-6">
        <h2 className="cms-page-title text-xl mb-4">
          {editingId ? "Edit item" : "Add item"}
        </h2>
        <form onSubmit={onSave}>
          {fields.map((f) => (
            <div className="field" key={f.key}>
              {f.type === "checkbox" ? (
                <label className="flex items-center gap-2 !normal-case !tracking-normal !text-gray-300 !text-sm !font-medium">
                  <input
                    type="checkbox"
                    checked={Boolean(form[f.key])}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [f.key]: e.target.checked }))
                    }
                    className="!w-auto"
                  />
                  <span>{f.label}</span>
                </label>
              ) : (
                <>
                  <label>{f.label}</label>
                  {f.type === "textarea" || f.type === "list" ? (
                    <textarea
                      rows={f.type === "list" ? 5 : 3}
                      value={String(form[f.key] ?? "")}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, [f.key]: e.target.value }))
                      }
                      placeholder={
                        f.type === "list" ? "One item per line" : undefined
                      }
                    />
                  ) : (
                    <input
                      type={f.type === "number" ? "number" : "text"}
                      value={String(form[f.key] ?? "")}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          [f.key]:
                            f.type === "number"
                              ? Number(e.target.value)
                              : e.target.value,
                        }))
                      }
                    />
                  )}
                </>
              )}
            </div>
          ))}
          {error ? <p className="text-red-400 text-sm mb-2">{error}</p> : null}
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            {editingId ? (
              <button type="button" className="btn btn-ghost" onClick={resetForm}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
