"use client";

import { FormEvent, useMemo, useState } from "react";
import { FAQ_ITEMS } from "@/lib/site-data";
import { FadeIn } from "@/components/ui/FadeIn";

export function FaqAccordion() {
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQ_ITEMS.map((item, index) => ({ item, index }));
    return FAQ_ITEMS.map((item, index) => ({ item, index })).filter(
      ({ item }) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div>
      <div className="mb-8 max-w-xl mx-auto">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions…"
          className="faq-search-input w-full theme-surface theme-input border border-ttw-gold/30 rounded-xl px-4 py-3 focus:outline-none focus:border-ttw-gold"
          onKeyDown={(e) => {
            if (e.key === "Escape") setQuery("");
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-12">
          No questions found matching your search.
        </p>
      ) : (
        <div className="space-y-3 max-w-3xl mx-auto">
          {filtered.map(({ item, index }) => {
            const open = openIndex === index;
            return (
              <FadeIn key={item.question}>
                <div className="border border-ttw-gold/20 rounded-xl overflow-hidden theme-surface">
                  <button
                    type="button"
                    className="w-full text-left px-5 py-4 flex justify-between gap-4 items-center"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? null : index)}
                  >
                    <span className="faq-question-text font-medium text-gray-100">
                      {item.question}
                    </span>
                    <span className="text-ttw-gold shrink-0">{open ? "−" : "+"}</span>
                  </button>
                  {open && (
                    <div className="faq-answer px-5 pb-5 text-gray-400 leading-relaxed border-t border-ttw-gold/10 pt-4">
                      {item.answer}
                    </div>
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>
      )}
    </div>
  );
}
