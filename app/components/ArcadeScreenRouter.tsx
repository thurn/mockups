"use client";

import { useArcadeNavigation } from "./ArcadeRouteTransition";
import { ArcadeMenuTransition } from "./ArcadeMenuTransition";
import { MainMenu } from "./MainMenu";
import { SettingsScreen } from "./SettingsScreen";

export function ArcadeScreenRouter() {
  const { activePath, reduceMotion } = useArcadeNavigation();

  return (
    <ArcadeMenuTransition screenKey={activePath} reduceMotion={reduceMotion}>
      {activePath === "/settings" ? <SettingsScreen /> : <MainMenu />}
    </ArcadeMenuTransition>
  );
}
