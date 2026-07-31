"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SITE } from "@/lib/site-data";

export function WelcomeOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem("ttw-welcome-seen");
    if (seen) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("ttw-welcome-seen", "1");
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Welcome"
          className="fixed inset-0 z-[9999] bg-black/97 flex items-center justify-center"
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
}
