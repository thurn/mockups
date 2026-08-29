import { ArcadeFrame } from "./ArcadeFrame";
import { ArcadeTitle } from "./ArcadeTitle";
import { MenuButton } from "./MenuButton";

const menuItems = ["Play", "Settings", "About", "Quit"];

export function MainMenu({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <ArcadeFrame label="Chess Chess Revolution main menu">
      <ArcadeTitle />
      <nav
        aria-label="Main navigation"
        style={{ width: "min(100%, 700px)", display: "grid", gap: "clamp(13px, 1.9vh, 20px)" }}
      >
        {menuItems.map((item) => (
          <MenuButton key={item} onClick={item === "Settings" ? onOpenSettings : undefined}>
            {item}
          </MenuButton>
        ))}
      </nav>
    </ArcadeFrame>
  );
}
