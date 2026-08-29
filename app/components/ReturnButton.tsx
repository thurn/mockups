import { MenuButton } from "./MenuButton";

export function ReturnButton({ onClick }: { onClick: () => void }) {
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 6,
        left: "50%",
        bottom: "calc(2.4% - 52px)",
        width: 340,
        display: "grid",
        transform: "translateX(-50%)",
      }}
    >
      <MenuButton onClick={onClick}>Return</MenuButton>
    </div>
  );
}
