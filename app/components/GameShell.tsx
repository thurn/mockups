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
        background: "#000",
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
            background: "#000",
            boxShadow: "0 28px 70px rgb(0 0 0 / 72%)",
          }}
        >
          {children}
        </div>
      </div>
    </main>
  );
}
