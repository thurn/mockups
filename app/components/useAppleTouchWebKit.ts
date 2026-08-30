"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => undefined;

export function detectAppleTouchWebKit() {
  const userAgent = navigator.userAgent;
  const isAppleTouchDevice =
    /iPad|iPhone|iPod/.test(userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  return isAppleTouchDevice && /AppleWebKit/.test(userAgent);
}

export function useAppleTouchWebKit() {
  return useSyncExternalStore(subscribe, detectAppleTouchWebKit, () => false);
}
