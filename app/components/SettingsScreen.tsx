"use client";

import { useState } from "react";
import Image from "next/image";
import { ReturnButton } from "./ReturnButton";
import { EraseControl, SelectControl, ToggleControl } from "./SettingsControls";
import { SettingsTabs, type SettingsTab } from "./SettingsTabs";
import { ClippedInset } from "./ClippedInset";
import { ScreenHeader } from "./ScreenHeader";
import { GraphicsSettings } from "./GraphicsSettings";
import { SoundSettings } from "./SoundSettings";
import { InputSettings } from "./InputSettings";
import { ArcadeTabTransition } from "./ArcadeTabTransition";
import { useArcadeNavigation } from "./ArcadeRouteTransition";
import { useBackgroundMusic } from "./BackgroundMusic";
import { fixedRasterImageStyle } from "./RasterFrame";
import { useUiRenderMode } from "./UiRenderMode";
import { fontScaleFromLabel, fontScaleOptions, fontScaleToLabel, useFontScale } from "./FontScale";
import { ArcadeModal } from "./ArcadeModal";

const settingsTabs: SettingsTab[] = ["Gameplay", "Graphics", "Sound", "Input"];

export function SettingsScreen() {
  const { mode } = useUiRenderMode();
  const usingPng = mode === "png";
  const { fontScaleLabel, setFontScale } = useFontScale();
  const { navigate, reduceMotion, setReduceMotion } = useArcadeNavigation();
  const {
    masterVolume,
    musicVolume,
    muteInBackground,
    setMasterVolume,
    setMusicVolume,
    setMuteInBackground,
  } = useBackgroundMusic();
  const [activeTab, setActiveTab] = useState<SettingsTab>("Gameplay");
  const [tabDirection, setTabDirection] = useState(1);
  const [language, setLanguage] = useState("English");
  const [increaseMoveDuration, setIncreaseMoveDuration] = useState(true);
  const [uploadCrashReports, setUploadCrashReports] = useState(true);
  const [resolution, setResolution] = useState("1920 × 1080");
  const [maxFramerate, setMaxFramerate] = useState("144 FPS");
  const [displayMode, setDisplayMode] = useState("Borderless");
  const [screenshake, setScreenshake] = useState(true);
  const [vsync, setVsync] = useState(true);
  const [effectsVolume, setEffectsVolume] = useState(75);
  const [activeModal, setActiveModal] = useState<"erase" | "crash-reports" | null>(null);

  const handleTabSelect = (tab: SettingsTab) => {
    if (tab === activeTab) return;
    setTabDirection(settingsTabs.indexOf(tab) > settingsTabs.indexOf(activeTab) ? 1 : -1);
    setActiveTab(tab);
  };

  return (
    <section
      aria-label={`${activeTab} settings`}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        overflow: "hidden",
        pointerEvents: "auto",
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <ScreenHeader variant="settings" />
      </div>
      <div
        style={{
          position: "absolute",
          zIndex: 4,
          top: 233,
          left: 68,
          width: 887,
        }}
      >
        <div>
          <SettingsTabs activeTab={activeTab} onSelect={handleTabSelect} />
        </div>
        <div
          style={{
            position: "relative",
            boxSizing: "border-box",
            height: 1021,
            overflow: "hidden",
            clipPath: "polygon(0 0, 100% 0, 100% 98.5%, 98.4% 100%, 1.5% 100%, 0 98.5%)",
            background: usingPng
              ? "transparent"
              : "linear-gradient(110deg, #446690, #2c456f 54%, #875984)",
            filter: usingPng ? undefined : "drop-shadow(0 0 5px rgba(28,89,180,.28))",
          }}
        >
          {usingPng ? (
            <Image
              alt=""
              src="/generated-ui/settings-panel-frame.png"
              width={1774}
              height={2042}
              unoptimized
              style={fixedRasterImageStyle}
            />
          ) : (
            <ClippedInset
              inset={2}
              clipPath="polygon(0 0, 100% 0, 100% 98.45%, 98.25% 100%, 1.35% 100%, 0 98.4%)"
              background="radial-gradient(ellipse at 7% 46%, rgba(5,83,184,.15), transparent 36%), linear-gradient(90deg, rgba(0,83,190,.07), transparent 25% 75%, rgba(126,0,145,.055)), linear-gradient(180deg, #041126 0%, #020b1b 100%)"
              boxShadow="inset 0 0 45px #000710"
            />
          )}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              boxSizing: "border-box",
              height: "100%",
              padding: "18px 24px 32px",
            }}
          >
            <ArcadeTabTransition
              activeKey={activeTab}
              direction={tabDirection}
              reduceMotion={reduceMotion}
            >
              {activeTab === "Graphics" ? (
                <GraphicsSettings
                  resolution={resolution}
                  maxFramerate={maxFramerate}
                  displayMode={displayMode}
                  screenshake={screenshake}
                  vsync={vsync}
                  onResolutionChange={setResolution}
                  onMaxFramerateChange={setMaxFramerate}
                  onDisplayModeChange={setDisplayMode}
                  onScreenshakeChange={setScreenshake}
                  onVsyncChange={setVsync}
                />
              ) : activeTab === "Sound" ? (
                <SoundSettings
                  masterVolume={masterVolume}
                  musicVolume={musicVolume}
                  effectsVolume={effectsVolume}
                  muteInBackground={muteInBackground}
                  onMasterVolumeChange={setMasterVolume}
                  onMusicVolumeChange={setMusicVolume}
                  onEffectsVolumeChange={setEffectsVolume}
                  onMuteInBackgroundChange={setMuteInBackground}
                />
              ) : activeTab === "Input" ? (
                <InputSettings />
              ) : (
                <>
                  <SelectControl
                    first
                    label="Language"
                    value={language}
                    options={["English", "Español", "Français", "Deutsch"]}
                    onChange={setLanguage}
                  />
                  <SelectControl
                    label="Text Size"
                    value={fontScaleLabel}
                    options={fontScaleOptions.map(fontScaleToLabel)}
                    onChange={(value) => setFontScale(fontScaleFromLabel(value))}
                  />
                  <ToggleControl
                    checked={reduceMotion}
                    label="Reduce Motion"
                    onChange={setReduceMotion}
                  />
                  <ToggleControl
                    checked={increaseMoveDuration}
                    label={
                      <>
                        Increase Move
                        <br />
                        Duration
                      </>
                    }
                    ariaLabel="Increase Move Duration"
                    onChange={setIncreaseMoveDuration}
                  />
                  <ToggleControl
                    checked={uploadCrashReports}
                    label={
                      <>
                        Upload Crash
                        <br />
                        Reports
                      </>
                    }
                    ariaLabel="Upload Crash Reports"
                    onChange={setUploadCrashReports}
                    withInfo
                    onInfoClick={() => setActiveModal("crash-reports")}
                  />
                  <EraseControl onClick={() => setActiveModal("erase")} />
                </>
              )}
            </ArcadeTabTransition>
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          zIndex: 8,
          inset: 0,
          pointerEvents: "none",
        }}
      >
        <ReturnButton onClick={() => navigate("main")} />
      </div>
      <ArcadeModal
        open={activeModal === "erase"}
        title="Erase Saved Data?"
        confirmLabel="Erase"
        cancelLabel="Cancel"
        danger
        reduceMotion={reduceMotion}
        onClose={() => setActiveModal(null)}
        onConfirm={() => setActiveModal(null)}
      >
        All saved data will be permanently erased. This cannot be undone.
      </ArcadeModal>
      <ArcadeModal
        open={activeModal === "crash-reports"}
        ariaLabel="Crash report upload information"
        reduceMotion={reduceMotion}
        onClose={() => setActiveModal(null)}
        onConfirm={() => setActiveModal(null)}
      >
        <span style={{ display: "block" }}>We upload crash reports to Unity Diagnostics.</span>
        <a
          href="https://unity.com/legal/game-player-and-app-user-privacy-policy"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-block",
            marginTop: 34,
            color: "#70efff",
            fontSize: 42,
            textDecoration: "underline",
            textDecorationColor: "rgba(255,88,210,.8)",
            textUnderlineOffset: 7,
            textShadow: "0 0 12px rgba(55,210,255,.65)",
          }}
        >
          Privacy Policy
        </a>
      </ArcadeModal>
    </section>
  );
}
