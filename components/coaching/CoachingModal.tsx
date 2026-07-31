"use client";

import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { COACHING_PACKAGES } from "@/lib/site-data";
import { useToast } from "@/components/providers/ToastProvider";
import { mailtoFallbackUrl } from "@/lib/client-mail";

type Props = {
  packageName: string | null;
  onClose: () => void;
};

export function CoachingModal({ packageName, onClose }: Props) {
  const open = Boolean(packageName);
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const info = COACHING_PACKAGES.find((p) => p.name === packageName);

  useEffect(() => {
    if (!open) {
      setSuccess(false);
      setLoading(false);
    }
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const payload = {
      name: String(data.contactName || "").trim(),
      email: String(data.contactEmail || "").trim(),
      phone: String(data.contactPhone || "").trim(),
      message: String(data.contactMessage || "").trim(),
      package: packageName || "",
      action: "enroll",
    };

    if (!payload.name || !payload.email.includes("@") || !payload.phone) {
      showToast("Please fill in name, email, and phone.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/coaching-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      setSuccess(true);
      showToast("Request sent successfully!", "success");
      form.reset();
    } catch {
      window.location.href = mailtoFallbackUrl(
        `Coaching Inquiry: ${payload.package}`,
        `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nPackage: ${payload.package}\n\n${payload.message}`
      );
      showToast("Opening email client as fallback…", "warning");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Coaching enrollment"
            className="w-full max-w-lg bg-[#0a0a0a] border border-ttw-gold/30 rounded-2xl p-6 md:p-8 relative"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-ttw-gold"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h3 className="font-cinzel text-2xl text-ttw-gold mb-1">
              {packageName}
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {info ? `${info.path} (${info.duration})` : ""}
            </p>

            {success ? (
              <div className="text-center py-8">
                <p className="text-ttw-gold font-cinzel text-xl mb-2">Thank you!</p>
                <p className="text-gray-300">
                  We received your interest in{" "}
                  <span className="text-ttw-gold">{packageName}</span>. We&apos;ll
                  contact you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <input type="hidden" name="selectedPackage" value={packageName || ""} />
                <div>
                  <label className="block text-sm text-gray-400 mb-1" htmlFor="contactName">
                    Name *
                  </label>
                  <input
                    id="contactName"
                    name="contactName"
                    required
                    className="w-full bg-black border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1" htmlFor="contactEmail">
                    Email *
                  </label>
                  <input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    required
                    className="w-full bg-black border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1" htmlFor="contactPhone">
                    Phone *
                  </label>
                  <input
                    id="contactPhone"
                    name="contactPhone"
                    required
                    className="w-full bg-black border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1" htmlFor="contactMessage">
                    Message
                  </label>
                  <textarea
                    id="contactMessage"
                    name="contactMessage"
                    rows={3}
                    className="w-full bg-black border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-ttw-gold text-black py-3 rounded-full font-bold disabled:opacity-60"
                >
                  {loading ? "Sending…" : "Submit"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
