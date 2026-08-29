import type { ReactNode } from "react";
import {
  DESIGN_SIZE,
  portraitHeight,
  portraitScale,
  portraitWidth,
  PORTRAIT_DESIGN_HEIGHT,
  squareScale,
  squareSize,
} from "./squareScale";

export function GameShell({
  children,
  portrait = false,
}: {
  children: ReactNode;
  portrait?: boolean;
}) {
  const canvasWidth = portrait ? portraitWidth : squareSize;
  const canvasHeight = portrait ? portraitHeight : squareSize;
  const canvasScale = portrait ? portraitScale : squareScale;

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
          width: canvasWidth,
          height: canvasHeight,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            width: DESIGN_SIZE,
            height: portrait ? PORTRAIT_DESIGN_HEIGHT : DESIGN_SIZE,
            overflow: "visible",
            isolation: "isolate",
            display: "grid",
            placeItems: "center",
            transform: `translateX(-50%) scale(${canvasScale})`,
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
