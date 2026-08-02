"use client";

import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SITE } from "@/lib/site-data";

const DISPLAY_MS = 2800;
const SEEN_KEY = "ttw-welcome-seen";

/**
 * Shows the welcome overlay alone first (once per browser session),
 * then reveals homepage content after the overlay has fully faded out.
 */
export function HomeWelcomeGate({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    setMounted(true);

    const seen = sessionStorage.getItem(SEEN_KEY);
    if (seen) {
      setContentReady(true);
      setShowOverlay(false);
      return;
    }

    setShowOverlay(true);
    setOverlayVisible(true);
    document.body.classList.add("overflow-hidden");

    const timer = window.setTimeout(() => {
      sessionStorage.setItem(SEEN_KEY, "1");
      setOverlayVisible(false);
    }, DISPLAY_MS);

    return () => {
      window.clearTimeout(timer);
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const overlay = (
    <AnimatePresence
      onExitComplete={() => {
        document.body.classList.remove("overflow-hidden");
        setContentReady(true);
        setShowOverlay(false);
      }}
    >
      {overlayVisible && (
        <motion.div
          key="welcome-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Welcome"
          className="fixed inset-0 z-[9999] welcome-scrim flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="text-center px-6"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0.9, 0.2, 1] }}
          >
            <Image
              src={SITE.logo}
              alt="TTW Logo"
              width={200}
              height={200}
              className="mx-auto mb-6 max-w-[200px] h-auto"
              priority
            />
            <h1 className="font-cinzel text-4xl sm:text-5xl font-black text-ttw-gold gold-glow mb-4 uppercase tracking-tight">
              Welcome TO
              <br />
              THE TRUE WORD
            </h1>
            <p className="text-lg text-gray-300">{SITE.tagline}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {!contentReady && (
        <div
          className="fixed inset-0 z-[9998] welcome-scrim"
          aria-hidden="true"
        />
      )}

      {mounted && showOverlay ? createPortal(overlay, document.body) : null}

      <div
        className={
          contentReady
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none h-0 overflow-hidden"
        }
        aria-hidden={!contentReady}
      >
        {children}
      </div>
    </>
  );
}
