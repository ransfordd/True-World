import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { BackToTop, ReadingProgress } from "@/components/ui/ScrollExtras";
import { SITE } from "@/lib/site-data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "The True Word — awakening the divine within humanity through prophetic insight, coaching, and spiritual teaching by Eric Paddy Boso.",
  metadataBase: new URL("https://www.thetrueword-gh.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${cinzel.variable} font-sans min-h-screen antialiased overflow-x-hidden`}
      >
        <ThemeProvider>
          <ToastProvider>
            <ReadingProgress />
            <Header />
            <main className="pt-16 min-h-screen">{children}</main>
            <Footer />
            <BackToTop />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
