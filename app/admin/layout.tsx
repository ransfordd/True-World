import type { Metadata } from "next";
import Link from "next/link";
import "./admin.css";

export const metadata: Metadata = {
  title: "CMS Admin | THE TRUE WORD",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="cms-admin min-h-screen bg-[#0c0c0c] text-gray-100">
      <header className="border-b border-ttw-gold/25 bg-black/80">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/admin" className="font-cinzel text-ttw-gold font-semibold tracking-wide">
            True Word CMS
          </Link>
          <nav className="flex flex-wrap gap-3 text-sm text-gray-300">
            <Link href="/admin" className="hover:text-ttw-gold">
              Dashboard
            </Link>
            <Link href="/admin/articles" className="hover:text-ttw-gold">
              Articles
            </Link>
            <Link href="/admin/testimonials" className="hover:text-ttw-gold">
              Testimonials
            </Link>
            <Link href="/admin/resources" className="hover:text-ttw-gold">
              Resources
            </Link>
            <Link href="/admin/daily-truths" className="hover:text-ttw-gold">
              Daily Truth
            </Link>
            <Link href="/admin/coaching" className="hover:text-ttw-gold">
              Coaching
            </Link>
            <Link href="/admin/journey" className="hover:text-ttw-gold">
              Journey
            </Link>
            <Link href="/admin/settings" className="hover:text-ttw-gold">
              Settings
            </Link>
            <Link href="/" className="hover:text-ttw-gold">
              View site
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
