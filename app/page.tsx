import { GameShell } from "./components/GameShell";
import { MainMenu } from "./components/MainMenu";

export default function Home() {
  return (
    <GameShell>
      <MainMenu />
    </GameShell>
  );
}
