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
    <>
      <SelectControl
        first
        label="Resolution"
        value={resolution}
        options={["1920 × 1080", "2560 × 1440", "3840 × 2160"]}
        onChange={onResolutionChange}
        rowHeight={194}
      />
      <SelectControl
        label="Max Framerate"
        value={maxFramerate}
        options={["60 FPS", "120 FPS", "144 FPS", "240 FPS"]}
        onChange={onMaxFramerateChange}
        rowHeight={194}
      />
      <SelectControl
        label="Display Mode"
        value={displayMode}
        options={["Borderless", "Fullscreen", "Windowed"]}
        onChange={onDisplayModeChange}
        rowHeight={194}
      />
      <ToggleControl
        checked={screenshake}
        label="Screenshake"
        onChange={onScreenshakeChange}
        rowHeight={194}
      />
      <ToggleControl checked={vsync} label="VSync" onChange={onVsyncChange} rowHeight={195} />
    </>
  );
}
