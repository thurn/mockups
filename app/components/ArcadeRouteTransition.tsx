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

  const setReduceMotion = useCallback((value: boolean) => {
    setReduceMotionState(value);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      if (href === activePath) return;

      setHasNavigated(true);
      setActivePath(href);
      router.push(href);
    },
    [activePath, router],
  );

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/settings");
  }, [router]);

  return (
    <ArcadeNavigationContext.Provider
      value={{
        activePath,
        hasNavigated,
        navigate,
        reduceMotion: reduceMotion || Boolean(prefersReducedMotion),
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
