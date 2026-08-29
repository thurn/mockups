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
import { motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

type TransitionPhase = "idle" | "closing" | "opening";

type ArcadeNavigationContextValue = {
  navigate: (href: string) => void;
  reduceMotion: boolean;
  setReduceMotion: (reduceMotion: boolean) => void;
};

const ArcadeNavigationContext = createContext<ArcadeNavigationContextValue | null>(null);

export function ArcadeRouteTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const pendingHref = useRef<string | null>(null);
  const navigationStarted = useRef(false);
  const motionDisabled = reduceMotion || Boolean(prefersReducedMotion);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname || phase !== "idle") return;

      if (motionDisabled) {
        router.push(href);
        return;
      }

      pendingHref.current = href;
      navigationStarted.current = false;
      setPhase("closing");
    },
    [motionDisabled, pathname, phase, router],
  );

  useEffect(() => {
    if (navigationStarted.current && pendingHref.current === pathname) {
      pendingHref.current = null;
      setPhase("opening");
    }
  }, [pathname]);

  const handleGateAnimationComplete = () => {
    if (phase === "closing" && !navigationStarted.current && pendingHref.current) {
      navigationStarted.current = true;
      router.push(pendingHref.current);
      return;
    }

    if (phase === "opening") {
      navigationStarted.current = false;
      setPhase("idle");
    }
  };

  const gateClosed = phase === "closing";
  const gateTransition = gateClosed
    ? { duration: 0.34, ease: [0.65, 0, 0.35, 1] as const }
    : { duration: 0.4, delay: 0.04, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <ArcadeNavigationContext.Provider value={{ navigate, reduceMotion, setReduceMotion }}>
      {children}

      {phase !== "idle" && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            zIndex: 50,
            inset: 0,
            overflow: "hidden",
            pointerEvents: "auto",
          }}
        >
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: gateClosed ? "0%" : "-100%" }}
            transition={gateTransition}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              left: 0,
              height: "50.2%",
              overflow: "hidden",
              background:
                "linear-gradient(104deg, #01030b 0 23%, #06142b 23% 63%, #10071d 63% 82%, #02040d 82%)",
              borderBottom: "4px solid #66eaff",
              willChange: "transform",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <GateStripes side="top" />
          </motion.div>

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: gateClosed ? "0%" : "100%" }}
            transition={gateTransition}
            onAnimationComplete={handleGateAnimationComplete}
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              left: 0,
              height: "50.2%",
              overflow: "hidden",
              background:
                "linear-gradient(76deg, #02040d 0 18%, #0d071b 18% 40%, #06142b 40% 77%, #01030b 77%)",
              borderTop: "4px solid #ff58d3",
              willChange: "transform",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <GateStripes side="bottom" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scaleX: 0.08 }}
            animate={{
              opacity: gateClosed ? [0, 0.9, 0.64] : [0.64, 0.82, 0],
              scaleX: gateClosed ? 1 : 0.08,
            }}
            transition={{ duration: gateClosed ? 0.34 : 0.3, ease: "easeOut" }}
            style={{
              position: "absolute",
              zIndex: 2,
              top: "50%",
              right: 70,
              left: 70,
              height: 8,
              marginTop: -4,
              transformOrigin: "center",
              background:
                "linear-gradient(90deg, transparent, #57edff 12% 43%, #f8fbff 49% 51%, #ff54d0 57% 88%, transparent)",
              willChange: "transform, opacity",
            }}
          />
        </div>
      )}
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

function GateStripes({ side }: { side: "top" | "bottom" }) {
  return (
    <div
      style={{
        position: "absolute",
        right: -90,
        left: -90,
        ...(side === "top" ? { bottom: 76 } : { top: 76 }),
        height: 32,
        opacity: 0.3,
        transform: `skewX(${side === "top" ? -18 : 18}deg)`,
        background:
          side === "top"
            ? "repeating-linear-gradient(90deg, transparent 0 54px, #168bff 54px 76px, transparent 76px 104px)"
            : "repeating-linear-gradient(90deg, transparent 0 50px, #c832a7 50px 72px, transparent 72px 100px)",
      }}
    />
  );
}
