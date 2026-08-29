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
        right: `calc(2.6% - 23.5px * ${squareInverseScale})`,
        bottom: `calc(3.15% - 23.5px * ${squareInverseScale})`,
        width: `calc(47px * ${squareInverseScale})`,
        height: `calc(47px * ${squareInverseScale})`,
        display: "grid",
        placeItems: "center",
        border: 0,
        margin: 0,
        padding: 0,
        borderRadius: "50%",
        color: "#f5fdff",
        background: "linear-gradient(135deg, #bdf8ff 0%, #55dfff 32%, #8f7dff 62%, #ff4dcd 100%)",
        cursor: "pointer",
        outline: 0,
        boxShadow: highlighted
          ? "0 0 12px rgb(103 222 255 / 72%)"
          : "0 4px 8px rgb(0 0 0 / 72%), 0 0 6px rgb(147 77 255 / 48%)",
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
          inset: `calc(2px * ${squareInverseScale})`,
          boxSizing: "border-box",
          borderRadius: "50%",
          background: "linear-gradient(145deg, #0c1b38, #030816 68%)",
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
