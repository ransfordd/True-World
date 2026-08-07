"use client";

import { useMemo } from "react";
import { FadeIn } from "@/components/ui/FadeIn";

export type DailyTruthItem = {
  text: string;
  ref: string;
};

export function DailyTruth({ truths }: { truths: DailyTruthItem[] }) {
  const list = truths.length
    ? truths
    : [{ text: "The Truth sets free.", ref: "John 8:32" }];

  const truth = useMemo(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const dayOfYear = Math.floor(
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return list[dayOfYear % list.length];
  }, [list]);

  const date = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    []
  );

  return (
    <FadeIn className="mb-28">
      <div className="max-w-4xl mx-auto text-center p-8 md:p-12 rounded-2xl border border-ttw-gold/20 bg-gradient-to-br from-[#0a0a0a] to-[#080808]">
        <p className="text-ttw-gold/70 text-sm uppercase tracking-widest mb-3">
          Daily Truth Revelation
        </p>
        <p id="truthDate" className="text-gray-500 text-sm mb-6">
          {date}
        </p>
        <p
          id="truthText"
          className="font-cinzel text-2xl md:text-3xl text-ttw-gold gold-glow mb-4 leading-relaxed"
        >
          &ldquo;{truth.text}&rdquo;
        </p>
        <p id="truthReference" className="text-gray-400">
          {truth.ref}
        </p>
      </div>
    </FadeIn>
  );
}
