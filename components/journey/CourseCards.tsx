"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";

export type CourseTierView = {
  id: string;
  name: string;
  theme: string;
  level: string;
  focus: string[];
  practices: string[];
  outcome: string;
};

const STORAGE_KEY = "ttw-course-progress";

export function CourseCards({
  tiers,
  showCta = true,
}: {
  tiers: CourseTierView[];
  showCta?: boolean;
}) {
  const [expanded, setExpanded] = useState<string | null>(tiers[0]?.id ?? null);
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProgress(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  function toggleComplete(id: string) {
    setProgress((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className="space-y-6">
      {tiers.map((tier, i) => {
        const open = expanded === tier.id;
        return (
          <FadeIn key={tier.id} delay={i * 0.08}>
            <div className="rounded-2xl border border-ttw-gold/20 bg-gradient-to-br from-[var(--surface)] to-[var(--surface-elevated)] overflow-hidden">
              <button
                type="button"
                className="w-full text-left p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                onClick={() => setExpanded(open ? null : tier.id)}
                aria-expanded={open}
              >
                <div>
                  <p className="text-ttw-gold/70 text-xs uppercase tracking-wider mb-1">
                    {tier.level} · {tier.theme}
                  </p>
                  <h3 className="font-cinzel text-2xl text-ttw-gold">{tier.name}</h3>
                  {!open ? (
                    <p className="text-gray-400 text-sm mt-2 line-clamp-1">{tier.outcome}</p>
                  ) : null}
                </div>
                <div className="flex items-center gap-3">
                  {progress[tier.id] && (
                    <span className="text-xs bg-ttw-gold/20 text-ttw-gold px-3 py-1 rounded-full">
                      Started
                    </span>
                  )}
                  <span className="text-ttw-gold text-sm">{open ? "Hide" : "Details"}</span>
                </div>
              </button>
              {open && (
                <div className="px-6 md:px-8 pb-8 grid md:grid-cols-2 gap-6 border-t border-ttw-gold/10 pt-6">
                  <div>
                    <h4 className="text-ttw-gold font-semibold mb-2">Focus</h4>
                    <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                      {tier.focus.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-ttw-gold font-semibold mb-2">Practices</h4>
                    <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                      {tier.practices.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="md:col-span-2 text-gray-300 text-sm">
                    <strong className="text-ttw-gold">Outcome:</strong> {tier.outcome}
                  </p>
                  <div className="md:col-span-2 flex flex-wrap gap-3">
                    <Link
                      href="/get-in-touch"
                      className="bg-ttw-gold text-black px-4 py-2 rounded-full text-sm font-bold hover:shadow-md hover:shadow-ttw-gold/30 transition"
                    >
                      Begin / Enroll
                    </Link>
                    <Link
                      href="/coaching"
                      className="border border-ttw-gold text-ttw-gold px-4 py-2 rounded-full text-sm hover:bg-ttw-gold/10"
                    >
                      View Coaching
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleComplete(tier.id)}
                      className="border border-ttw-gold/40 text-gray-300 px-4 py-2 rounded-full text-sm hover:bg-ttw-gold/10"
                    >
                      {progress[tier.id] ? "Clear started" : "Mark as started"}
                    </button>
                    {showCta && (
                      <Link
                        href="/journey"
                        className="text-ttw-gold text-sm px-2 py-2 underline-offset-4 hover:underline"
                      >
                        Full journey page →
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        );
      })}
    </div>
  );
}
