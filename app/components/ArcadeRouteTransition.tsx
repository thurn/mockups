"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

type ArcadeNavigationContextValue = {
  activePath: string;
  hasNavigated: boolean;
  navigate: (href: string) => void;
  reduceMotion: boolean;
  setReduceMotion: (reduceMotion: boolean) => void;
};

const ArcadeNavigationContext = createContext<ArcadeNavigationContextValue | null>(null);

export function ArcadeRouteTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [reduceMotion, setReduceMotionState] = useState(false);
  const [activePath, setActivePath] = useState(pathname);
  const [hasNavigated, setHasNavigated] = useState(false);
  const effectiveReduceMotion = reduceMotion || Boolean(prefersReducedMotion);

  const setReduceMotion = useCallback((value: boolean) => {
    setReduceMotionState(value);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      if (href === activePath) return;

      const target = new URL(href, window.location.origin);
      const current = new URL(window.location.href);
      if (current.searchParams.get("render") === "png") {
        target.searchParams.set("render", "png");
      }

      setHasNavigated(true);
      setActivePath(target.pathname);
      router.push(`${target.pathname}${target.search}${target.hash}`);
    },
    [activePath, router],
  );

  useEffect(() => {
    const syncPath = window.setTimeout(() => setActivePath(pathname), 0);
    return () => window.clearTimeout(syncPath);
  }, [pathname]);

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/settings");
  }, [router]);

  useEffect(() => {
    document.documentElement.dataset.reduceMotion = String(effectiveReduceMotion);
    return () => {
      delete document.documentElement.dataset.reduceMotion;
    };
  }, [effectiveReduceMotion]);

  return (
    <ArcadeNavigationContext.Provider
      value={{
        activePath,
        hasNavigated,
        navigate,
        reduceMotion: effectiveReduceMotion,
        setReduceMotion,
      }}
    >
      {children}
    </ArcadeNavigationContext.Provider>
  );
}

export function useArcadeNavigation() {
  const context = useContext(ArcadeNavigationContext);

  if (!context) {
    throw new Error("useArcadeNavigation must be used within ArcadeRouteTransition");
  }

  return context;
}
