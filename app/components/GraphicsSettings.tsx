import { SelectControl, ToggleControl } from "./SettingsControls";

export function GraphicsSettings({
  resolution,
  maxFramerate,
  displayMode,
  screenshake,
  vsync,
  onResolutionChange,
  onMaxFramerateChange,
  onDisplayModeChange,
  onScreenshakeChange,
  onVsyncChange,
}: {
  resolution: string;
  maxFramerate: string;
  displayMode: string;
  screenshake: boolean;
  vsync: boolean;
  onResolutionChange: (value: string) => void;
  onMaxFramerateChange: (value: string) => void;
  onDisplayModeChange: (value: string) => void;
  onScreenshakeChange: (checked: boolean) => void;
  onVsyncChange: (checked: boolean) => void;
}) {
  return (
    <div style={{ position: "relative", height: 971 }}>
      <SelectControl
        first
        label="Resolution"
        value={resolution}
        options={["1920 × 1080", "2560 × 1440", "3840 × 2160"]}
        onChange={onResolutionChange}
      />
      <SelectControl
        label="Max Framerate"
        value={maxFramerate}
        options={["60 FPS", "120 FPS", "144 FPS", "240 FPS"]}
        onChange={onMaxFramerateChange}
      />
      <SelectControl
        label="Display Mode"
        value={displayMode}
        options={["Borderless", "Fullscreen", "Windowed"]}
        onChange={onDisplayModeChange}
      />
      <ToggleControl checked={screenshake} label="Screenshake" onChange={onScreenshakeChange} />
      <ToggleControl checked={vsync} label="VSync" onChange={onVsyncChange} />
    </div>
  );
}
