"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop, ReadingProgress } from "@/components/ui/ScrollExtras";
import { SiteSettingsProvider } from "@/components/providers/SiteSettingsProvider";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <SiteSettingsProvider>
      <ReadingProgress />
      <Header />
      <main className="pt-16 min-h-screen">{children}</main>
      <Footer />
      <BackToTop />
    </SiteSettingsProvider>
  );
}
