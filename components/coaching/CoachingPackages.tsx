"use client";

import Link from "next/link";
import { useState } from "react";
import { COACHING_PACKAGES } from "@/lib/site-data";
import { FadeIn } from "@/components/ui/FadeIn";
import { CoachingModal } from "@/components/coaching/CoachingModal";

export function CoachingPackages({
  allowModal = true,
}: {
  allowModal?: boolean;
}) {
  const [modalPackage, setModalPackage] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {COACHING_PACKAGES.map((pkg, i) => (
          <FadeIn key={pkg.id} delay={i * 0.1}>
            <div
              className={`h-full p-6 md:p-8 rounded-2xl border bg-gradient-to-br from-[#0a0a0a] to-[#080808] flex flex-col ${
                pkg.featured
                  ? "border-ttw-gold shadow-lg shadow-ttw-gold/10"
                  : "border-ttw-gold/20"
              }`}
            >
              {pkg.featured && (
                <span className="self-start text-xs uppercase tracking-wider bg-ttw-gold text-black px-3 py-1 rounded-full mb-4 font-bold">
                  Featured
                </span>
              )}
              <h3 className="font-cinzel text-2xl text-ttw-gold mb-2">{pkg.name}</h3>
              <p className="text-sm text-ttw-gold/70 mb-4">
                {pkg.path} · {pkg.level} · {pkg.duration}
              </p>
              <p className="text-gray-300 mb-4 flex-grow">{pkg.purpose}</p>
              <p className="text-sm text-gray-400 mb-6">
                <strong className="text-ttw-gold">Outcome:</strong> {pkg.outcome}
              </p>
              <ul className="text-sm text-gray-400 space-y-2 mb-8">
                {pkg.includes.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-ttw-gold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2 mt-auto">
                {allowModal ? (
                  <button
                    type="button"
                    onClick={() => setModalPackage(pkg.name)}
                    className="bg-ttw-gold text-black py-3 rounded-full font-bold btn-modern"
                  >
                    Enroll Now
                  </button>
                ) : (
                  <Link
                    href={`/get-in-touch?package=${encodeURIComponent(pkg.name)}`}
                    className="bg-ttw-gold text-black py-3 rounded-full font-bold text-center btn-modern"
                  >
                    Enroll Now
                  </Link>
                )}
                <Link
                  href={`/get-in-touch?package=${encodeURIComponent(pkg.name)}`}
                  className="border border-ttw-gold text-ttw-gold py-3 rounded-full text-center hover:bg-ttw-gold/10"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
      {allowModal && (
        <CoachingModal
          packageName={modalPackage}
          onClose={() => setModalPackage(null)}
        />
      )}
    </>
  );
}
