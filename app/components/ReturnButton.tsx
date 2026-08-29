import { useInteraction } from "./useInteraction";
import { squareInverseScale } from "./squareScale";

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
        right: `calc(2.6% - 18px * ${squareInverseScale})`,
        bottom: `calc(3.15% - 18px * ${squareInverseScale})`,
        width: `calc(36px * ${squareInverseScale})`,
        height: `calc(36px * ${squareInverseScale})`,
        display: "grid",
        placeItems: "center",
        border: `calc(2px * ${squareInverseScale}) solid rgb(224 250 255 / 92%)`,
        borderRadius: "50%",
        margin: 0,
        padding: 0,
        color: "#f5fdff",
        background:
          "linear-gradient(135deg, #173d73 0%, #09162f 48%, #411b57 100%) padding-box, linear-gradient(135deg, #bff7ff, #61ddff 34%, #c783ff 68%, #ff62d5) border-box",
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
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        style={{
          width: `calc(19px * ${squareInverseScale})`,
          height: `calc(19px * ${squareInverseScale})`,
          overflow: "visible",
          filter: "drop-shadow(0 2px 1px #000) drop-shadow(0 0 3px rgb(98 224 255 / 72%))",
        }}
      >
        <path
          d="M9.2 6.2 3.8 12l5.4 5.8M4.3 12h9.1c4.2 0 6.8 2.1 6.8 6"
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
