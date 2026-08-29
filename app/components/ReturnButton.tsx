import { useInteraction } from "./useInteraction";
import { squareInverseScale } from "./squareScale";
import { frameBezelGradient, frameClip, frameMetalGradient } from "./styles";

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
        right: `calc(2.6% - 23.5px * ${squareInverseScale})`,
        bottom: `calc(3.15% - 23.5px * ${squareInverseScale})`,
        width: `calc(47px * ${squareInverseScale})`,
        height: `calc(47px * ${squareInverseScale})`,
        display: "grid",
        placeItems: "center",
        border: 0,
        margin: 0,
        padding: 0,
        clipPath: frameClip,
        color: "#f5fdff",
        background: frameMetalGradient,
        cursor: "pointer",
        outline: 0,
        boxShadow: highlighted
          ? "inset 0 0 10px rgb(95 225 255 / 34%), 0 0 14px rgb(103 222 255 / 82%)"
          : "inset 0 0 10px rgb(0 0 0 / 78%), 0 5px 9px rgb(0 0 0 / 72%), 0 0 8px rgb(147 77 255 / 62%)",
        filter: highlighted ? "brightness(1.14)" : undefined,
        transform: state.pressed ? "scale(0.92)" : highlighted ? "scale(1.08)" : undefined,
        font: "inherit",
      }}
      aria-label="Return to main menu"
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: `calc(3px * ${squareInverseScale})`,
          clipPath: frameClip,
          border: `calc(1px * ${squareInverseScale}) solid rgb(235 250 255 / 72%)`,
          background: frameBezelGradient,
          boxShadow: `inset 0 0 0 calc(2px * ${squareInverseScale}) rgb(1 4 14 / 92%), inset 0 0 0 calc(3px * ${squareInverseScale}) rgb(145 159 255 / 42%)`,
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: `calc(7px * ${squareInverseScale})`,
          clipPath: frameClip,
          border: `calc(1px * ${squareInverseScale}) solid rgb(106 165 255 / 48%)`,
          background: "linear-gradient(135deg, #0c1b38, #020612 58%, #25102f)",
          boxShadow: "inset 0 0 9px rgb(0 0 0 / 94%)",
        }}
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        style={{
          position: "relative",
          width: `calc(21px * ${squareInverseScale})`,
          height: `calc(21px * ${squareInverseScale})`,
          zIndex: 1,
          overflow: "visible",
          filter: "drop-shadow(0 2px 1px #000) drop-shadow(0 0 3px rgb(98 224 255 / 72%))",
        }}
      >
        <path
          d="M10 5.5 3.5 12l6.5 6.5M4 12h16.5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.4"
        />
      </svg>
    </button>
  );
}
