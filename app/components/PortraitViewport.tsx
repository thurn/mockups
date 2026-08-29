import type { ReactNode } from "react";

export const PORTRAIT_DESIGN_WIDTH = 1024;
export const PORTRAIT_DESIGN_HEIGHT = 1536;

export function PortraitViewport({ children }: { children: ReactNode }) {
  return (
    <main
      style={{
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        display: "grid",
        placeItems: "center",
        background: "#000",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "var(--portrait-width, 1024px)",
          height: "var(--portrait-height, 1536px)",
          flex: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: PORTRAIT_DESIGN_WIDTH,
            height: PORTRAIT_DESIGN_HEIGHT,
            overflow: "hidden",
            isolation: "isolate",
            display: "grid",
            placeItems: "center",
            transform: "scale(var(--portrait-scale, 1))",
            transformOrigin: "top left",
            background: "#000",
          }}
        >
          {children}
        </div>
      </div>
    </main>
  );
}
