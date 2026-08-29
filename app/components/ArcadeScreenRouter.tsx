"use client";

import { useArcadeNavigation } from "./ArcadeRouteTransition";
import { MainMenu } from "./MainMenu";
import { SettingsScreen } from "./SettingsScreen";

export function ArcadeScreenRouter() {
  const { activePath } = useArcadeNavigation();

  return activePath === "/settings" ? <SettingsScreen /> : <MainMenu />;
}
