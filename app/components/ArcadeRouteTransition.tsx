"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

export type RouteTransitionPhase = "idle" | "exiting" | "entering";

type ArcadeNavigationContextValue = {
  navigate: (href: string) => void;
  reduceMotion: boolean;
  routeTransitionPhase: RouteTransitionPhase;
  setReduceMotion: (reduceMotion: boolean) => void;
};

const ArcadeNavigationContext = createContext<ArcadeNavigationContextValue | null>(null);

const exitDuration = 390;
const enterDuration = 520;

export function ArcadeRouteTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [routeTransitionPhase, setRouteTransitionPhase] = useState<RouteTransitionPhase>("idle");
  const pendingHref = useRef<string | null>(null);
  const transitionTimer = useRef<number | null>(null);
  const motionDisabled = reduceMotion || Boolean(prefersReducedMotion);

  const clearTransitionTimer = useCallback(() => {
    if (transitionTimer.current !== null) {
      window.clearTimeout(transitionTimer.current);
      transitionTimer.current = null;
    }
  }, []);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname || routeTransitionPhase !== "idle") return;

      if (motionDisabled) {
        router.push(href);
        return;
      }

      clearTransitionTimer();
      pendingHref.current = href;
      setRouteTransitionPhase("exiting");
      transitionTimer.current = window.setTimeout(() => {
        router.push(href);
      }, exitDuration);
    },
    [clearTransitionTimer, motionDisabled, pathname, routeTransitionPhase, router],
  );

  useEffect(() => {
    if (pendingHref.current !== pathname) return;

    clearTransitionTimer();
    pendingHref.current = null;
    setRouteTransitionPhase("entering");
    transitionTimer.current = window.setTimeout(() => {
      setRouteTransitionPhase("idle");
      transitionTimer.current = null;
    }, enterDuration);
  }, [clearTransitionTimer, pathname]);

  useEffect(() => clearTransitionTimer, [clearTransitionTimer]);

  return (
    <ArcadeNavigationContext.Provider
      value={{ navigate, reduceMotion, routeTransitionPhase, setReduceMotion }}
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
