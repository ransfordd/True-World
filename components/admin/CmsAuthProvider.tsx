"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CmsAuthStatus = "loading" | "authed" | "guest";

type CmsAuthContextValue = {
  status: CmsAuthStatus;
  email: string | null;
  refresh: () => Promise<void>;
  markGuest: () => void;
};

const CmsAuthContext = createContext<CmsAuthContextValue | null>(null);

export function CmsAuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<CmsAuthStatus>("loading");
  const [email, setEmail] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/cms/me");
      if (res.ok) {
        const data = await res.json();
        setStatus("authed");
        setEmail(data.user?.email || null);
      } else {
        setStatus("guest");
        setEmail(null);
      }
    } catch {
      setStatus("guest");
      setEmail(null);
    }
  }, []);

  const markGuest = useCallback(() => {
    setStatus("guest");
    setEmail(null);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ status, email, refresh, markGuest }),
    [status, email, refresh, markGuest]
  );

  return (
    <CmsAuthContext.Provider value={value}>{children}</CmsAuthContext.Provider>
  );
}

export function useCmsAuth() {
  const ctx = useContext(CmsAuthContext);
  if (!ctx) {
    throw new Error("useCmsAuth must be used within CmsAuthProvider");
  }
  return ctx;
}
