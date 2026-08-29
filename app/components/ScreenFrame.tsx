import type { ReactNode } from "react";
import { ConceptFrame } from "./ConceptFrame";
import { PORTRAIT_DESIGN_HEIGHT, PORTRAIT_DESIGN_WIDTH } from "./PortraitViewport";

export function ScreenFrame({ children }: { children: ReactNode }) {
  return (
    <div
      data-testid="screen-frame"
      style={{
        position: "relative",
        width: PORTRAIT_DESIGN_WIDTH,
        height: PORTRAIT_DESIGN_HEIGHT,
        overflow: "hidden",
        color: "#f7f8ff",
        background:
          "radial-gradient(circle at 50% 43%, #06152c 0, #020817 42%, #01030b 70%, #000107 100%)",
      }}
    >
      <ConceptFrame />
      {children}
    </div>
  );
}
