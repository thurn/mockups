"use client";

import { useRouter } from "next/navigation";
import { ArcadeFrame } from "./ArcadeFrame";
import { ArcadeTitle } from "./ArcadeTitle";
import { MenuButton } from "./MenuButton";

const menuItems = ["Play", "Settings", "About", "Quit"];

export function MainMenu() {
  const router = useRouter();

  return (
    <ArcadeFrame label="Chess Chess Revolution main menu">
      <ArcadeTitle />
      <nav
        aria-label="Main navigation"
        style={{ width: "min(100%, 700px)", display: "grid", gap: 16 }}
      >
        {menuItems.map((item) => (
          <MenuButton
            key={item}
            onClick={item === "Settings" ? () => router.push("/settings") : undefined}
          >
            {item}
          </MenuButton>
        ))}
      </nav>
    </ArcadeFrame>
  );
}
