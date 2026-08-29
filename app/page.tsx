'use client';

import { useState } from 'react';

const menuItems = ['Play', 'Settings', 'About', 'Quit'];
const settingsTabs = ['Gameplay', 'Graphics', 'Sound', 'Input'];

function MainMenu({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <section className="menu-frame" aria-label="Chess Chess Revolution main menu">
      <div className="frame-glow" aria-hidden="true" />
      <div className="frame-inset">
        <header className="logo-lockup">
          <h1>
            <span>CHESS CHESS</span>
            <span>REVOLUTION</span>
          </h1>
        </header>

        <nav className="menu" aria-label="Main navigation">
          {menuItems.map((item) => (
            <button
              className="menu-button"
              key={item}
              onClick={item === 'Settings' ? onOpenSettings : undefined}
              type="button"
            >
              <span className="button-surface" aria-hidden="true" />
              <span className="button-label">{item}</span>
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}

function SelectControl({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="setting-row">
      <span className="setting-name">{label}</span>
      <span className="select-shell">
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </span>
    </label>
  );
}

function ToggleControl({
  checked,
  label,
  onChange,
  withInfo = false,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
  withInfo?: boolean;
}) {
  return (
    <label className="setting-row toggle-row">
      <span className="setting-name">
        {label}
        {withInfo && (
          <span
            aria-label="Crash reports help us diagnose unexpected errors"
            className="info-badge"
            role="img"
            title="Crash reports help us diagnose unexpected errors"
          >
            i
          </span>
        )}
      </span>
      <span className="toggle-cell">
        <input
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          type="checkbox"
        />
        <span className="checkbox-art" aria-hidden="true" />
      </span>
    </label>
  );
}

function SettingsScreen({ onReturn }: { onReturn: () => void }) {
  const [language, setLanguage] = useState('English');
  const [textSize, setTextSize] = useState('Medium');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [increaseMoveDuration, setIncreaseMoveDuration] = useState(true);
  const [uploadCrashReports, setUploadCrashReports] = useState(true);

  return (
    <section className="menu-frame settings-frame" aria-label="Gameplay settings">
      <div className="frame-glow" aria-hidden="true" />
      <div className="frame-inset settings-inset">
        <header className="settings-title-lockup">
          <h1>Settings</h1>
        </header>

        <div className="settings-console">
          <nav className="settings-tabs" aria-label="Settings categories">
            {settingsTabs.map((tab) => (
              <button
                aria-current={tab === 'Gameplay' ? 'page' : undefined}
                className={tab === 'Gameplay' ? 'settings-tab active' : 'settings-tab'}
                disabled
                key={tab}
                type="button"
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="settings-panel">
            <SelectControl label="Language" onChange={setLanguage} options={['English', 'Español', 'Français', 'Deutsch']} value={language} />
            <SelectControl label="Text Size" onChange={setTextSize} options={['Small', 'Medium', 'Large']} value={textSize} />
            <ToggleControl checked={reduceMotion} label="Reduce Motion" onChange={setReduceMotion} />
            <ToggleControl checked={increaseMoveDuration} label="Increase Move Duration" onChange={setIncreaseMoveDuration} />
            <ToggleControl checked={uploadCrashReports} label="Upload Crash Reports" onChange={setUploadCrashReports} withInfo />
            <div className="setting-row erase-row">
              <span className="setting-name">Erase Saved Data</span>
              <span className="erase-cell">
                <button className="erase-button" type="button">Erase</button>
              </span>
            </div>
          </div>
        </div>

        <button className="return-button" onClick={onReturn} type="button">
          <span className="return-surface" aria-hidden="true" />
          <span>Return</span>
        </button>
      </div>
    </section>
  );
}

export default function Home() {
  const [screen, setScreen] = useState<'menu' | 'settings'>('menu');

  return (
    <main className="game-shell">
      <div className="atmosphere" aria-hidden="true" />
      {screen === 'menu' ? (
        <MainMenu onOpenSettings={() => setScreen('settings')} />
      ) : (
        <SettingsScreen onReturn={() => setScreen('menu')} />
      )}
    </main>
  );
}
