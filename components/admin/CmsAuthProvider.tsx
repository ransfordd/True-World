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
  refresh: () => Promise<void>;
  markGuest: () => void;
};

const CmsAuthContext = createContext<CmsAuthContextValue | null>(null);

export function CmsAuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<CmsAuthStatus>("loading");

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/cms/me");
      setStatus(res.ok ? "authed" : "guest");
    } catch {
      setStatus("guest");
    }
  }, []);

  const markGuest = useCallback(() => {
    setStatus("guest");
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ status, refresh, markGuest }),
    [status, refresh, markGuest]
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
