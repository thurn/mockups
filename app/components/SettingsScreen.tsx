"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

const settingsTabs: SettingsTab[] = ["Gameplay", "Graphics", "Sound", "Input"];

export function SettingsScreen() {
  const { navigate, reduceMotion, routeTransitionPhase, setReduceMotion, transitionDestination } =
    useArcadeNavigation();
  const exiting = routeTransitionPhase === "exiting";
  const entering = routeTransitionPhase === "entering";
  const leavingSettings = exiting && transitionDestination === "/";
  const [activeTab, setActiveTab] = useState<SettingsTab>("Graphics");
  const [tabDirection, setTabDirection] = useState(1);
  const [language, setLanguage] = useState("English");
  const [textSize, setTextSize] = useState("Medium");
  const [increaseMoveDuration, setIncreaseMoveDuration] = useState(true);
  const [uploadCrashReports, setUploadCrashReports] = useState(true);
  const [resolution, setResolution] = useState("1920 × 1080");
  const [maxFramerate, setMaxFramerate] = useState("144 FPS");
  const [displayMode, setDisplayMode] = useState("Borderless");
  const [screenshake, setScreenshake] = useState(true);
  const [vsync, setVsync] = useState(true);
  const [masterVolume, setMasterVolume] = useState(80);
  const [musicVolume, setMusicVolume] = useState(65);
  const [effectsVolume, setEffectsVolume] = useState(75);
  const [muteInBackground, setMuteInBackground] = useState(false);

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
        pointerEvents: routeTransitionPhase === "idle" ? "auto" : "none",
      }}
    >
      <motion.div
        initial={false}
        animate={{ opacity: exiting ? 0 : 1, y: exiting ? -30 : 0 }}
        transition={{
          duration: exiting ? 0.27 : 0.38,
          delay: entering ? 0.02 : 0,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{ position: "absolute", inset: 0, willChange: "transform, opacity" }}
      >
        <ScreenHeader variant="settings" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          opacity: exiting ? 0 : 1,
          y: exiting ? 30 : 0,
          scale: exiting ? 0.985 : 1,
        }}
        transition={{
          duration: exiting ? 0.34 : 0.44,
          delay: entering ? 0.08 : 0,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          position: "absolute",
          zIndex: 4,
          top: 233,
          left: 68,
          width: 887,
          transformOrigin: "bottom center",
          willChange: "transform, opacity",
        }}
      >
        <motion.div
          initial={false}
          animate={{ opacity: exiting ? 0 : 1, x: exiting ? 54 : 0 }}
          transition={{
            duration: exiting ? 0.24 : 0.36,
            delay: entering ? 0.04 : 0,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ willChange: "transform, opacity" }}
        >
          <SettingsTabs activeTab={activeTab} onSelect={handleTabSelect} />
        </motion.div>
        <motion.div
          initial={false}
          animate={{
            opacity: exiting ? 0 : 1,
            y: exiting ? 20 : 0,
            scaleY: exiting ? 0.985 : 1,
          }}
          transition={{
            duration: exiting ? 0.32 : 0.42,
            delay: entering ? 0.1 : 0,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            position: "relative",
            boxSizing: "border-box",
            height: 1021,
            overflow: "hidden",
            clipPath:
              "polygon(0 0, 98.5% 0, 100% 1.4%, 100% 98.5%, 98.4% 100%, 1.5% 100%, 0 98.5%)",
            background: "linear-gradient(110deg, #446690, #2c456f 54%, #875984)",
            filter: "drop-shadow(0 0 5px rgba(28,89,180,.28))",
            transformOrigin: "bottom center",
            willChange: "transform, opacity",
          }}
        >
          <ClippedInset
            inset={2}
            clipPath="polygon(0 0, 98.35% 0, 100% 1.35%, 100% 98.45%, 98.25% 100%, 1.35% 100%, 0 98.4%)"
            background="radial-gradient(ellipse at 7% 46%, rgba(5,83,184,.15), transparent 36%), linear-gradient(90deg, rgba(0,83,190,.07), transparent 25% 75%, rgba(126,0,145,.055)), linear-gradient(180deg, #041126 0%, #020b1b 100%)"
            boxShadow="inset 0 0 45px #000710"
          />
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
                    value={textSize}
                    options={["Small", "Medium", "Large"]}
                    onChange={setTextSize}
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
                  />
                  <EraseControl />
                </>
              )}
            </ArcadeTabTransition>
          </div>
        </motion.div>
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          opacity: exiting ? (leavingSettings ? 1 : 0) : 1,
          y: exiting ? (leavingSettings ? 10 : 26) : 0,
          scale: leavingSettings ? 1.045 : 1,
        }}
        transition={{
          duration: exiting ? 0.28 : 0.38,
          delay: entering ? 0.22 : 0,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          position: "absolute",
          zIndex: 8,
          inset: 0,
          pointerEvents: "none",
          willChange: "transform, opacity",
        }}
      >
        <ReturnButton disabled={routeTransitionPhase !== "idle"} onClick={() => navigate("/")} />
      </motion.div>
    </section>
  );
}
