import type { ReactNode } from "react";
import { DESIGN_SIZE, useSquareScale } from "./useSquareScale";

export function GameShell({
  children,
  compact = false,
}: {
  children: ReactNode;
  compact?: boolean;
}) {
  const scale = useSquareScale();
  const renderedSize = DESIGN_SIZE * scale;

  return (
    <main
      style={{
        width: "100%",
        minHeight: "100svh",
        overflow: "hidden",
        display: "grid",
        placeItems: "center",
        background: "#00030a",
      }}
    >
      <div style={{ position: "relative", width: renderedSize, height: renderedSize }}>
        <div
          style={{
            position: "absolute",
            inset: "50% auto auto 50%",
            width: DESIGN_SIZE,
            height: DESIGN_SIZE,
            overflow: "hidden",
            isolation: "isolate",
            display: "grid",
            gridTemplateRows: compact ? "minmax(0, 1fr)" : undefined,
            placeItems: "center",
            transform: `translate(-50%, -50%) scale(${scale})`,
            background:
              "radial-gradient(circle at 18% 22%, rgb(15 111 255 / 18%), transparent 30%), radial-gradient(circle at 84% 76%, rgb(255 13 100 / 18%), transparent 31%), linear-gradient(128deg, #010713 0%, #03020c 50%, #090013 100%)",
            boxShadow: "0 28px 70px rgb(0 0 0 / 72%)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: -2,
              pointerEvents: "none",
              opacity: 0.36,
              backgroundImage:
                "linear-gradient(rgb(57 167 255 / 8%) 1px, transparent 1px), linear-gradient(90deg, rgb(57 167 255 / 8%) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
              transform: "perspective(640px) rotateX(61deg) scale(1.8) translateY(34%)",
              transformOrigin: "50% 100%",
              maskImage: "linear-gradient(to top, #000, transparent 76%)",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: -1,
              pointerEvents: "none",
              background:
                "linear-gradient(90deg, rgb(0 234 255 / 16%), transparent 12% 88%, rgb(255 33 189 / 16%)), radial-gradient(ellipse at center, transparent 44%, rgb(0 0 0 / 72%) 100%)",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "-30%",
              zIndex: -1,
              opacity: 0.55,
              background:
                "conic-gradient(from 210deg at 50% 50%, transparent, rgb(0 234 255 / 10%), transparent 38%, rgb(255 33 189 / 11%), transparent 72%)",
            }}
          />
          {children}
        </div>
      </div>
    </main>
  );
}
