import type { ReactNode } from "react";
import { frameClip, mergeStyles } from "./styles";

export function ArcadeFrame({
  children,
  settings = false,
  label,
}: {
  children: ReactNode;
  settings?: boolean;
  label: string;
}) {
  return (
    <section
      aria-label={label}
      style={mergeStyles({
        boxSizing: "border-box",
        position: "relative",
        width: settings ? 870 : 820,
        height: settings ? 870 : 820,
        padding: 15,
        filter: "drop-shadow(0 26px 50px rgb(0 0 0 / 58%))",
        clipPath: frameClip,
        background:
          "linear-gradient(112deg, #f8fdff 0%, #76dcff 3%, #0d70e8 8%, #041331 11%, #00eaff 28%, #e9faff 46%, #7657ff 61%, #ff25c8 82%, #fff0f8 96%, #ff617c 100%)",
        boxShadow:
          "inset 0 0 0 2px rgb(255 255 255 / 88%), inset 0 0 0 6px rgb(3 11 29 / 88%), inset 0 0 0 9px rgb(109 194 255 / 55%)",
        alignSelf: "center",
      })}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "inherit",
          filter: "blur(18px)",
          opacity: 0.48,
          zIndex: -1,
          clipPath: frameClip,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 6,
          zIndex: 0,
          pointerEvents: "none",
          clipPath: frameClip,
          border: "2px solid rgb(235 250 255 / 72%)",
          background:
            "linear-gradient(112deg, #05091a, #173361 21%, #06102b 36% 64%, #3f174a 83%, #130715)",
          boxShadow: "inset 0 0 0 4px rgb(1 4 14 / 92%), inset 0 0 0 7px rgb(145 159 255 / 42%)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 11,
          zIndex: 1,
          pointerEvents: "none",
          clipPath: frameClip,
          border: "2px solid rgb(106 165 255 / 38%)",
          boxShadow: "inset 0 0 18px rgb(0 0 0 / 94%), 0 0 10px rgb(79 150 255 / 42%)",
        }}
      />
      <div
        style={{
          boxSizing: "border-box",
          position: "relative",
          zIndex: 2,
          height: "100%",
          overflow: settings ? "visible" : "hidden",
          display: settings ? "grid" : "flex",
          gridTemplateRows: settings ? "minmax(0, 1fr)" : undefined,
          flexDirection: settings ? undefined : "column",
          alignItems: settings ? "stretch" : "center",
          justifyContent: settings ? "stretch" : "space-evenly",
          padding: settings ? "28px 35px 34px" : "0 70px",
          clipPath: frameClip,
          border: "3px solid rgb(201 231 255 / 65%)",
          background:
            "linear-gradient(90deg, rgb(0 82 255 / 8%), transparent 24% 76%, rgb(255 0 160 / 9%)), radial-gradient(ellipse at 50% 24%, #0b1735 0%, #030715 44%, #02030c 78%)",
          boxShadow:
            "inset 0 0 0 8px #020718, inset 0 0 0 11px rgb(57 141 255 / 42%), inset 0 0 0 16px rgb(0 3 14 / 90%), inset 0 0 0 18px rgb(198 226 255 / 18%), inset 0 0 62px rgb(0 0 0 / 94%)",
        }}
      >
        <FrameLine top={17} />
        {children}
        <FrameLine bottom={settings ? 34 : 17} />
      </div>
    </section>
  );
}

function FrameLine({ top, bottom }: { top?: number | string; bottom?: number | string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "10%",
        right: "10%",
        top,
        bottom,
        height: 2,
        opacity: 0.58,
        background: "linear-gradient(90deg, transparent, #00eaff, #fff, #ff21bd, transparent)",
        boxShadow: "0 0 12px currentColor",
        pointerEvents: "none",
      }}
    />
  );
}
