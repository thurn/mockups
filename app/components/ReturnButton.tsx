import { ActionButton } from "./ActionButton";

export function ReturnButton({ onClick }: { onClick: () => void }) {
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 8,
        left: 328,
        top: 1358,
        width: 368,
        height: 120,
      }}
    >
      <ActionButton onClick={onClick}>RETURN</ActionButton>
    </div>
  );
}
