import { actionClip, impactFont, mergeStyles, textGradient } from "./styles";
import { useInteraction } from "./useInteraction";

export function ReturnButton({ onClick }: { onClick: () => void }) {
  const { state, handlers } = useInteraction();
  const highlighted = state.hovered || state.focused;

  return (
    <button
      {...handlers}
      onClick={onClick}
      type="button"
      style={{
        boxSizing: "border-box",
        position: "absolute",
        zIndex: 4,
        left: "50%",
        bottom: -120,
        height: 100,
        width: 340,
        border: 0,
        margin: 0,
        padding: 0,
        clipPath: actionClip,
        color: "transparent",
        background:
          "linear-gradient(105deg, #dffbff, #61ddff 24%, #aca1ff 54%, #ff62d5 82%, #fff) border-box",
        cursor: "pointer",
        outline: 0,
        filter: highlighted
          ? "brightness(1.16) drop-shadow(0 0 11px rgb(103 222 255 / 74%))"
          : "drop-shadow(0 9px 9px rgb(0 0 0 / 72%)) drop-shadow(0 0 7px rgb(147 77 255 / 55%))",
        transform: state.pressed
          ? "translate(-50%, 2px) scale(0.98)"
          : highlighted
            ? "translateX(-50%) scale(1.015)"
            : "translateX(-50%)",
        font: "inherit",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 3,
          clipPath: actionClip,
          background: "linear-gradient(180deg, #0c1a36, #020612)",
          boxShadow: "inset 0 0 16px #000",
        }}
      />
      <span
        style={mergeStyles(textGradient, {
          position: "relative",
          display: "inline-block",
          paddingRight: "0.18em",
          transform: "skewX(-7deg)",
          fontFamily: impactFont,
          fontSize: 54,
          fontStyle: "italic",
          lineHeight: 1,
          WebkitTextStroke: "0.8px #fff",
          filter: "drop-shadow(2px 4px 0 #173a74) drop-shadow(0 5px 4px #000)",
        })}
      >
        Return
      </span>
    </button>
  );
}
