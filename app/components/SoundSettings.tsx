"use client";

import { ToggleControl } from "./SettingsControls";
import { VolumeControl } from "./VolumeControl";

export function SoundSettings({
  masterVolume,
  musicVolume,
  effectsVolume,
  muteInBackground,
  onMasterVolumeChange,
  onMusicVolumeChange,
  onEffectsVolumeChange,
  onMuteInBackgroundChange,
}: {
  masterVolume: number;
  musicVolume: number;
  effectsVolume: number;
  muteInBackground: boolean;
  onMasterVolumeChange: (value: number) => void;
  onMusicVolumeChange: (value: number) => void;
  onEffectsVolumeChange: (value: number) => void;
  onMuteInBackgroundChange: (checked: boolean) => void;
}) {
  return (
    <div style={{ position: "relative", height: 971 }}>
      <VolumeControl
        first
        label="Master Volume"
        value={masterVolume}
        onChange={onMasterVolumeChange}
      />
      <VolumeControl label="Music Volume" value={musicVolume} onChange={onMusicVolumeChange} />
      <VolumeControl
        label="Effects Volume"
        value={effectsVolume}
        onChange={onEffectsVolumeChange}
      />
      <ToggleControl
        checked={muteInBackground}
        label={
          <>
            Mute in
            <br />
            Background
          </>
        }
        ariaLabel="Mute in Background"
        onChange={onMuteInBackgroundChange}
      />
    </div>
  );
}
