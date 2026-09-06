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
  const [submitError, setSubmitError] = useState("");
  const [mailtoHref, setMailtoHref] = useState("");
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

    const topic = String(fd.get("topic") || "").trim();

    setSubmitError("");
    setMailtoHref("");

    if (variant === "question" || variant === "prayer") {
      if (message.length < 10) {
        showToast("Please enter at least 10 characters.", "warning");
        return;
      }
    }

    if (variant === "question") {
      if (!name || !email.includes("@")) {
        showToast(
          "Please enter your name and a valid email so we can reply.",
          "error"
        );
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
        ? { name, email, phone, request: message, private: privateRequest }
        : variant === "contact"
          ? {
              name,
              email,
              phone,
              message,
              package: packageName || "",
              type: "enrollment",
            }
          : { name, email, phone, message, topic, type: "question" };

    const subject =
      variant === "prayer"
        ? "Prayer Request"
        : variant === "contact"
          ? `Enrollment: ${packageName || "Coaching"}`
          : "Ask a Question";

    const mailto = mailtoFallbackUrl(
      subject,
      Object.entries(body)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n")
    );

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
      setMailtoHref(mailto);
      setSubmitError(
        "We could not send your message right now. Your answers are still in the form — try again, or open email instead."
      );
      showToast("Could not submit. You can open email instead.", "warning");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    const thankYouBody =
      variant === "prayer"
        ? "We received your prayer request and will lift it up."
        : variant === "contact"
          ? `We received your request${
              packageName ? ` for ${packageName}` : ""
            }. We'll be in touch soon.`
          : "We received your question and will reply by email when we can.";

    return (
      <div className="text-center p-8 border border-ttw-gold/30 rounded-2xl theme-surface max-w-xl mx-auto">
        <h3 className="font-cinzel text-2xl text-ttw-gold mb-2">Thank you!</h3>
        <p className="text-gray-300">
          {variant === "contact" && packageName ? (
            <>
              We received your request for{" "}
              <span className="text-ttw-gold">{packageName}</span>. We&apos;ll
              be in touch soon.
            </>
          ) : (
            thankYouBody
          )}
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
              className="w-full theme-surface theme-input border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
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
              className="w-full theme-surface theme-input border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
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
              className="w-full theme-surface theme-input border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
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
              className="w-full theme-surface theme-input border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
            />
          </div>
        </>
      )}

      {variant === "question" && (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1" htmlFor="questionName">
                Name *
              </label>
              <input
                id="questionName"
                name="name"
                required
                autoComplete="name"
                className="w-full theme-surface theme-input border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1" htmlFor="questionEmail">
                Email *
              </label>
              <input
                id="questionEmail"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full theme-surface theme-input border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1" htmlFor="questionPhone">
                Phone
              </label>
              <input
                id="questionPhone"
                name="phone"
                type="tel"
                autoComplete="tel"
                className="w-full theme-surface theme-input border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1" htmlFor="questionTopic">
                Topic
              </label>
              <select
                id="questionTopic"
                name="topic"
                defaultValue=""
                className="w-full theme-surface theme-input border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
              >
                <option value="">Select a topic</option>
                <option value="Teaching">Teaching</option>
                <option value="Faith & Scripture">Faith & Scripture</option>
                <option value="Coaching">Coaching</option>
                <option value="Prayer">Prayer</option>
                <option value="Community">Community</option>
                <option value="Other">Other</option>
              </select>
            </div>
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
              placeholder="Write your question here…"
              className="w-full theme-surface theme-input border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
            />
          </div>
        </>
      )}

      {variant === "prayer" && (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1" htmlFor="prayerName">
                Name
              </label>
              <input
                id="prayerName"
                name="name"
                autoComplete="name"
                className="w-full theme-surface theme-input border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1" htmlFor="prayerEmail">
                Email
              </label>
              <input
                id="prayerEmail"
                name="email"
                type="email"
                autoComplete="email"
                className="w-full theme-surface theme-input border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1" htmlFor="prayerPhone">
              Phone
            </label>
            <input
              id="prayerPhone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className="w-full theme-surface theme-input border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
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
              className="w-full theme-surface theme-input border border-ttw-gold/30 rounded-lg px-3 py-2 focus:outline-none focus:border-ttw-gold"
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

      {submitError ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <p>{submitError}</p>
          {mailtoHref ? (
            <a
              href={mailtoHref}
              className="inline-block mt-2 text-ttw-gold underline-offset-2 hover:underline"
            >
              Open email instead
            </a>
          ) : null}
        </div>
      ) : null}

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
