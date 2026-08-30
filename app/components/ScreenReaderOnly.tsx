import type { ReactNode } from "react";

export function ScreenReaderOnly({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <span
      id={id}
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: 0,
      }}
    >
      {children}
    </span>
  );
}
