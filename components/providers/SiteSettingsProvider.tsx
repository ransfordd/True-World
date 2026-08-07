"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { SITE } from "@/lib/site-data";
import type { CmsSiteSettings } from "@/lib/cms/types";

const defaults: CmsSiteSettings = {
  name: SITE.name,
  tagline: SITE.tagline,
  email: SITE.email,
  website: SITE.website,
  instagram: SITE.instagram,
  instagramHandle: SITE.instagramHandle,
  youtube: SITE.youtube,
  youtubeFeaturedVideoId: SITE.youtubeFeaturedVideoId || "",
  logo: SITE.logo,
};

const SiteSettingsContext = createContext<CmsSiteSettings>(defaults);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<CmsSiteSettings>(defaults);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/site")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data.name === "string") {
          setSettings(data as CmsSiteSettings);
        }
      })
      .catch(() => {
        /* keep defaults */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
