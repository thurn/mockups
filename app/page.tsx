import { ArcadeRouteTransition } from "./components/ArcadeRouteTransition";
import { ArcadeScreenRouter } from "./components/ArcadeScreenRouter";

export default function Home() {
  return (
    <ArcadeRouteTransition>
      <ArcadeScreenRouter />
    </ArcadeRouteTransition>
  );
}
