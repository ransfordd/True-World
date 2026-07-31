"use client";

import { FormEvent, useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { mailtoFallbackUrl } from "@/lib/client-mail";

type Props = {
  variant?: "question" | "prayer" | "contact";
  packageName?: string;
};

export function ContactForm({ variant = "question", packageName }: Props) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [privateRequest, setPrivateRequest] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || fd.get("contactName") || "").trim();
    const email = String(fd.get("email") || fd.get("contactEmail") || "").trim();
    const phone = String(fd.get("phone") || fd.get("contactPhone") || "").trim();
    const message = String(
      fd.get("question") ||
        fd.get("request") ||
        fd.get("message") ||
        fd.get("contactMessage") ||
        ""
    ).trim();

    if (variant === "question" || variant === "prayer") {
      if (message.length < 10) {
        showToast("Please enter at least 10 characters.", "warning");
        return;
      }
    }

    if (variant === "contact") {
      if (!name || !email.includes("@") || !phone) {
        showToast("Please fill in name, email, and phone.", "error");
        return;
      }
    }

    setLoading(true);
    const endpoint =
      variant === "prayer"
        ? "/api/prayer"
        : variant === "contact"
          ? "/api/contact"
          : "/api/contact";

    const body =
      variant === "prayer"
        ? { name, request: message, private: privateRequest }
        : variant === "contact"
          ? {
              name,
              email,
              phone,
              message,
              package: packageName || "",
              type: "enrollment",
            }
          : { name, email, message, type: "question" };

    const subject =
      variant === "prayer"
        ? "Prayer Request"
        : variant === "contact"
          ? `Enrollment: ${packageName || "Coaching"}`
          : "Ask a Question";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("failed");
      setSuccess(true);
      showToast("Submitted successfully. Thank you!", "success");
      form.reset();
    } catch {
      window.location.href = mailtoFallbackUrl(
        subject,
        Object.entries(body)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n")
      );
      showToast("Opening email client as fallback…", "warning");
    } finally {
      setLoading(false);
    }
  }

  if (success && variant === "contact") {
    return (
      <div className="text-center p-8 border border-ttw-gold/30 rounded-2xl bg-[#0a0a0a]">
        <h3 className="font-cinzel text-2xl text-ttw-gold mb-2">Thank you!</h3>
        <p className="text-gray-300">
          We received your request
          {packageName ? (
            <>
              {" "}
              for <span className="text-ttw-gold">{packageName}</span>
            </>
          ) : null}
          . We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-xl mx-auto">
      {variant === "contact" && (
        <>
          <input type="hidden" name="selectedPackage" value={packageName || ""} />
          <div>
            <label className="block text-sm text-gray-400 mb-1" htmlFor="contactName">
              Name *
            </label>
            <input
              id="contactName"
              name="contactName"
              required
              className="w-full bg-[#0a0a0a] border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
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
              className="w-full bg-[#0a0a0a] border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
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
              className="w-full bg-[#0a0a0a] border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1" htmlFor="contactMessage">
              Message
            </label>
            <textarea
              id="contactMessage"
              name="contactMessage"
              rows={4}
              className="w-full bg-[#0a0a0a] border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
            />
          </div>
        </>
      )}

      {variant === "question" && (
        <>
          <div>
            <label className="block text-sm text-gray-400 mb-1" htmlFor="questionName">
              Name
            </label>
            <input
              id="questionName"
              name="name"
              className="w-full bg-[#0a0a0a] border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1" htmlFor="questionText">
              Your Question *
            </label>
            <textarea
              id="questionText"
              name="question"
              required
              minLength={10}
              rows={5}
              className="w-full bg-[#0a0a0a] border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
            />
          </div>
        </>
      )}

      {variant === "prayer" && (
        <>
          <div>
            <label className="block text-sm text-gray-400 mb-1" htmlFor="prayerName">
              Name
            </label>
            <input
              id="prayerName"
              name="name"
              className="w-full bg-[#0a0a0a] border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1" htmlFor="prayerRequest">
              Prayer Request *
            </label>
            <textarea
              id="prayerRequest"
              name="request"
              required
              minLength={10}
              rows={5}
              className="w-full bg-[#0a0a0a] border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={privateRequest}
              onChange={(e) => setPrivateRequest(e.target.checked)}
            />
            Keep this request private
          </label>
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-ttw-gold text-black py-3 rounded-full font-bold disabled:opacity-60 btn-modern"
      >
        {loading
          ? "Sending…"
          : variant === "prayer"
            ? "Submit Request"
            : variant === "contact"
              ? "Send Enrollment"
              : "Submit Question"}
      </button>
    </form>
  );
}
