"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export type ArcadeScreen = "main" | "settings";

type ArcadeNavigationContextValue = {
  activeScreen: ArcadeScreen;
  hasNavigated: boolean;
  navigate: (screen: ArcadeScreen) => void;
  reduceMotion: boolean;
  setReduceMotion: (reduceMotion: boolean) => void;
};

const ArcadeNavigationContext = createContext<ArcadeNavigationContextValue | null>(null);

export function ArcadeRouteTransition({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const [reduceMotion, setReduceMotionState] = useState(false);
  const [activeScreen, setActiveScreen] = useState<ArcadeScreen>("main");
  const [hasNavigated, setHasNavigated] = useState(false);
  const effectiveReduceMotion = reduceMotion || Boolean(prefersReducedMotion);

  const setReduceMotion = useCallback((value: boolean) => {
    setReduceMotionState(value);
  }, []);

  const navigate = useCallback(
    (screen: ArcadeScreen) => {
      if (screen === activeScreen) return;

      setHasNavigated(true);
      setActiveScreen(screen);
    },
    [activeScreen],
  );

  useEffect(() => {
    document.documentElement.dataset.reduceMotion = String(effectiveReduceMotion);
    return () => {
      delete document.documentElement.dataset.reduceMotion;
    };
  }, [effectiveReduceMotion]);

  return (
    <ArcadeNavigationContext.Provider
      value={{
        activeScreen,
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
