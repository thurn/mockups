"use client";

import { useArcadeNavigation } from "./ArcadeRouteTransition";
import { ArcadeMenuTransition } from "./ArcadeMenuTransition";
import { MainMenu } from "./MainMenu";
import { SettingsScreen } from "./SettingsScreen";

export function ArcadeScreenRouter() {
  const { activePath, hasNavigated, reduceMotion } = useArcadeNavigation();

  return (
    <ArcadeMenuTransition
      playTransition={hasNavigated}
      screenKey={activePath}
      reduceMotion={reduceMotion}
    >
      {activePath === "/settings" ? <SettingsScreen /> : <MainMenu />}
    </ArcadeMenuTransition>
  );
}
