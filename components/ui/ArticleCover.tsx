"use client";

import Image from "next/image";
import { useState } from "react";
import { SITE } from "@/lib/site-data";

type Props = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
};

/** Responsive cover with soft gradient fallback if the image fails to load. */
export function ArticleCover({
  src,
  alt,
  className = "relative h-48",
  sizes = "(max-width: 768px) 100vw, 33vw",
}: Props) {
  const [failed, setFailed] = useState(false);
  const imageSrc = failed ? SITE.logo : src;

  return (
    <div className={`${className} overflow-hidden bg-gradient-to-br from-[#1a1510] to-[#0a0a0a]`}>
      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4">
          <div className="relative h-14 w-14 opacity-80">
            <Image src={SITE.logo} alt="" fill className="object-contain" sizes="56px" />
          </div>
          <p className="text-center text-xs text-ttw-gold/70 line-clamp-2 font-cinzel">{alt}</p>
        </div>
      ) : (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes={sizes}
          unoptimized
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
