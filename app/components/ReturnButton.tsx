import { ActionButton } from "./ActionButton";
import { actionOuterClip } from "./ClippedInset";

export function ReturnButton({
  disabled = false,
  onClick,
}: {
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 8,
        left: 328,
        top: 1358,
        width: 368,
        height: 120,
        isolation: "isolate",
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          zIndex: 0,
          inset: 0,
          display: "block",
          clipPath: actionOuterClip,
          background: "#020613",
          pointerEvents: "none",
        }}
      />
      <span
        style={{ position: "relative", zIndex: 1, display: "block", width: "100%", height: "100%" }}
      >
        <ActionButton onClick={disabled ? undefined : onClick}>RETURN</ActionButton>
      </span>
    </div>
  );
}
