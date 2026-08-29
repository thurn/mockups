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
        right: -18,
        bottom: -18,
        width: 36,
        height: 36,
        display: "grid",
        placeItems: "center",
        border: "2px solid rgb(224 250 255 / 92%)",
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
          width: 19,
          height: 19,
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
