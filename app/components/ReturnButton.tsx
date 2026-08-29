import { ActionButton } from "./ActionButton";

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
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      <ActionButton onClick={disabled ? undefined : onClick}>RETURN</ActionButton>
    </div>
  );
}
