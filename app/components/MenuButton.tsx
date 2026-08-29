import type { ReactNode } from "react";
import { buttonClip, impactFont, mergeStyles, textGradient } from "./styles";
import { useInteraction } from "./useInteraction";

export function MenuButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  const { state, handlers } = useInteraction();
  const highlighted = state.hovered || state.focused;

  return (
    <button
      {...handlers}
      onClick={onClick}
      type="button"
      style={{
        boxSizing: "border-box",
        position: "relative",
        height: 104,
        border: 0,
        padding: 3,
        cursor: "pointer",
        color: "#fff",
        clipPath: buttonClip,
        background: state.focused
          ? "linear-gradient(105deg, #fff 0%, #fff700 12%, #fff4a1 47%, #ffd500 87%, #fff 100%)"
          : "linear-gradient(105deg, #effeff 0%, #42c8ff 12%, #b7c9ff 47%, #fc45ce 87%, #fff 100%)",
        boxShadow: "0 10px 14px rgb(0 0 0 / 55%)",
        outline: 0,
        transition: "transform 150ms ease, filter 150ms ease",
        transform: state.pressed
          ? "translateY(2px) scale(0.985)"
          : highlighted
            ? "scale(1.01)"
            : undefined,
        filter: state.pressed
          ? "brightness(0.82) drop-shadow(0 0 5px currentColor)"
          : state.focused
            ? "drop-shadow(0 0 3px #fff) drop-shadow(0 0 12px rgb(255 242 0 / 88%))"
            : state.hovered
              ? "brightness(1.12) drop-shadow(0 0 7px rgb(148 91 255 / 58%))"
              : undefined,
        font: "inherit",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 3,
          clipPath: buttonClip,
          background:
            "linear-gradient(180deg, rgb(14 33 65 / 88%), rgb(1 4 15 / 94%)), radial-gradient(ellipse at 50% 0, rgb(52 126 255 / 23%), transparent 62%)",
          boxShadow: "inset 0 0 22px rgb(0 0 0 / 65%)",
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: "7px 10px auto",
            height: 1,
            background: "linear-gradient(90deg, transparent, rgb(255 255 255 / 45%), transparent)",
          }}
        />
      </span>
      {highlighted && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 1,
            background:
              "linear-gradient(90deg, transparent 10%, rgb(255 255 255 / 35%), transparent 38%)",
            transform: "translateX(35%)",
            pointerEvents: "none",
          }}
        />
      )}
      <span
        style={mergeStyles(textGradient, {
          position: "relative",
          zIndex: 2,
          display: "inline-block",
          overflow: "visible",
          paddingRight: "0.18em",
          paddingLeft: "0.04em",
          marginRight: "-0.18em",
          marginLeft: "-0.04em",
          transform: "skewX(-7deg)",
          fontFamily: impactFont,
          fontSize: 56,
          fontStyle: "italic",
          lineHeight: 1,
          letterSpacing: "0.01em",
          WebkitTextStroke: "0.8px #f6ffff",
          filter: "drop-shadow(2px 4px 0 #173a74) drop-shadow(0 6px 5px rgb(0 0 0 / 82%))",
        })}
      >
        {children}
      </span>
    </button>
  );
}
