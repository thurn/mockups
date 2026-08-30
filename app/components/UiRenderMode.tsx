"use client";

import { CodeIcon } from "@phosphor-icons/react/dist/csr/Code";
import { ImageSquareIcon } from "@phosphor-icons/react/dist/csr/ImageSquare";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type UiRenderMode = "css" | "png";

const UiRenderModeContext = createContext<{
  mode: UiRenderMode;
  toggleMode: () => void;
} | null>(null);

export function UiRenderModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<UiRenderMode>("css");
  const value = useMemo(
    () => ({
      mode,
      toggleMode: () => setMode((current) => (current === "css" ? "png" : "css")),
    }),
    [mode],
  );

  return <UiRenderModeContext.Provider value={value}>{children}</UiRenderModeContext.Provider>;
}

export function useUiRenderMode() {
  const value = useContext(UiRenderModeContext);
  if (!value) throw new Error("useUiRenderMode must be used within UiRenderModeProvider");
  return value;
}

export function DebugRenderModeToggle() {
  const { mode, toggleMode } = useUiRenderMode();
  const usingPng = mode === "png";
  const label = usingPng ? "Switch to CSS rendering" : "Switch to PNG rendering";
  const Icon = usingPng ? ImageSquareIcon : CodeIcon;

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={usingPng}
      data-testid="render-mode-toggle"
      onClick={toggleMode}
      title={`${label} (currently ${usingPng ? "PNG" : "CSS"})`}
      style={{
        position: "absolute",
        zIndex: 100,
        top: 42,
        right: 42,
        boxSizing: "border-box",
        width: 62,
        height: 62,
        display: "grid",
        placeItems: "center",
        padding: 0,
        border: "2px solid rgba(177,246,255,.9)",
        borderRadius: 12,
        color: usingPng ? "#ff75da" : "#65eaff",
        background: "linear-gradient(180deg, rgba(9,24,52,.96), rgba(2,7,19,.96))",
        boxShadow: usingPng
          ? "inset 0 0 13px #000, 0 0 13px rgba(255,75,209,.72)"
          : "inset 0 0 13px #000, 0 0 13px rgba(58,185,255,.72)",
        cursor: "pointer",
      }}
    >
      <Icon aria-hidden="true" size={36} weight="bold" />
    </button>
  );
}
