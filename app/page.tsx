'use client';

import { useState } from 'react';
import { GameShell } from './components/GameShell';
import { MainMenu } from './components/MainMenu';
import { SettingsScreen } from './components/SettingsScreen';

export default function Home() {
  const [screen, setScreen] = useState<'menu' | 'settings'>('menu');

  return (
    <GameShell compact={screen === 'settings'}>
      {screen === 'menu' ? (
        <MainMenu onOpenSettings={() => setScreen('settings')} />
      ) : (
        <SettingsScreen onReturn={() => setScreen('menu')} />
      )}
    </GameShell>
  );
}
