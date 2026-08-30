"use client";

import { useArcadeNavigation } from "./ArcadeRouteTransition";
import { ArcadeMenuTransition } from "./ArcadeMenuTransition";
import { MainMenu } from "./MainMenu";
import { SettingsScreen } from "./SettingsScreen";

export function ArcadeScreenRouter() {
  const { activeScreen, hasNavigated, reduceMotion } = useArcadeNavigation();

  return (
    <ArcadeMenuTransition
      playTransition={hasNavigated}
      screenKey={activeScreen}
      reduceMotion={reduceMotion}
    >
      {activeScreen === "settings" ? <SettingsScreen /> : <MainMenu />}
    </ArcadeMenuTransition>
  );
}
