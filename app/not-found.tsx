import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-6 py-32 text-center">
      <h1 className="font-cinzel text-4xl text-ttw-gold gold-glow mb-4">404</h1>
      <p className="text-gray-400 mb-8">This page could not be found.</p>
      <a href="/" className="text-ttw-gold hover:underline">
        Return home →
      </a>
    </div>
  );
}
