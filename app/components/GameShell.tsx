import type { ReactNode } from "react";
import { DESIGN_SIZE, squareScale, squareSize } from "./squareScale";

export function GameShell({ children }: { children: ReactNode }) {
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
      <div
        style={{
          position: "relative",
          width: squareSize,
          height: squareSize,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            width: DESIGN_SIZE,
            height: DESIGN_SIZE,
            overflow: "visible",
            isolation: "isolate",
            display: "grid",
            placeItems: "center",
            transform: `translateX(-50%) scale(${squareScale})`,
            transformOrigin: "top center",
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
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
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
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgb(0 234 255 / 16%), transparent 12% 88%, rgb(255 33 189 / 16%)), radial-gradient(ellipse at center, transparent 44%, rgb(0 0 0 / 72%) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: "-30%",
                opacity: 0.55,
                background:
                  "conic-gradient(from 210deg at 50% 50%, transparent, rgb(0 234 255 / 10%), transparent 38%, rgb(255 33 189 / 11%), transparent 72%)",
              }}
            />
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
