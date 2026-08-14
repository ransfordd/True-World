"use client";

import { useEffect, useState } from "react";
import type { CmsMedia } from "@/lib/cms/types";

type Props = {
  onSelect: (url: string) => void;
  onClose: () => void;
};

export function MediaLibraryPicker({ onSelect, onClose }: Props) {
  const [media, setMedia] = useState<CmsMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/cms/media");
      if (res.ok) {
        const data = await res.json();
        setMedia(data.media || []);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="cms-panel max-w-3xl w-full max-h-[80vh] overflow-y-auto p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="cms-page-title text-xl">Choose from library</h2>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
        {loading ? <p className="cms-loading">Loading…</p> : null}
        {!loading && media.length === 0 ? (
          <p className="text-gray-500 text-sm">No images in the library yet.</p>
        ) : null}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {media.map((item) => (
            <button
              key={item.id}
              type="button"
              className="text-left rounded-lg overflow-hidden border border-white/10 hover:border-ttw-gold/50"
              onClick={() => {
                onSelect(item.url);
                onClose();
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={item.alt}
                className="w-full h-28 object-cover bg-black"
              />
              <p className="text-xs text-gray-400 p-2 truncate">{item.filename}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
