"use client";

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

export const fontScaleOptions = [1, 1.5, 2] as const;
export type FontScale = (typeof fontScaleOptions)[number];
export type FontScaleLabel = "100%" | "150%" | "200%";

type FontScaleContextValue = {
  fontScale: FontScale;
  fontScaleLabel: FontScaleLabel;
  setFontScale: (scale: FontScale) => void;
};

const FontScaleContext = createContext<FontScaleContextValue | null>(null);

export function fontScaleToLabel(scale: FontScale): FontScaleLabel {
  return `${Math.round(scale * 100)}%` as FontScaleLabel;
}

export function fontScaleFromLabel(label: string): FontScale {
  if (label === "150%") return 1.5;
  if (label === "200%") return 2;
  return 1;
}

export function dynamicTypeScale(
  scale: FontScale,
  role: "body" | "control" | "navigation" | "heading" = "body",
) {
  const growth = scale - 1;

  if (role === "heading") return 1 + growth * 0.2;
  if (role === "navigation") return 1 + growth * 0.45;
  if (role === "control") return 1 + growth * 0.65;
  return scale;
}

export function FontScaleProvider({ children }: { children: ReactNode }) {
  const [fontScale, setFontScale] = useState<FontScale>(1);

  useEffect(() => {
    document.documentElement.dataset.fontScale = String(fontScale);
  }, [fontScale]);

  return (
    <FontScaleContext.Provider
      value={{ fontScale, fontScaleLabel: fontScaleToLabel(fontScale), setFontScale }}
    >
      {children}
    </FontScaleContext.Provider>
  );
}

export function useFontScale() {
  const context = useContext(FontScaleContext);

  if (!context) {
    throw new Error("useFontScale must be used within FontScaleProvider");
  }

  return context;
}
