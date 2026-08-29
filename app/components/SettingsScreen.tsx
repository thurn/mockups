"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ReturnButton } from "./ReturnButton";
import { EraseControl, SelectControl, ToggleControl } from "./SettingsControls";
import { SettingsTabs } from "./SettingsTabs";
import { ClippedInset } from "./ClippedInset";
import { ScreenHeader } from "./ScreenHeader";

export function SettingsScreen() {
  const router = useRouter();
  const [language, setLanguage] = useState("English");
  const [textSize, setTextSize] = useState("Medium");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [increaseMoveDuration, setIncreaseMoveDuration] = useState(true);
  const [uploadCrashReports, setUploadCrashReports] = useState(true);

  return (
    <section
      aria-label="Gameplay settings"
      style={{ position: "absolute", inset: 0, zIndex: 2, overflow: "hidden" }}
    >
      <ScreenHeader variant="settings" />
      <div style={{ position: "absolute", zIndex: 4, top: 233, left: 68, width: 887 }}>
        <SettingsTabs />
        <div
          style={{
            position: "relative",
            boxSizing: "border-box",
            height: 1021,
            overflow: "hidden",
            clipPath:
              "polygon(0 0, 98.5% 0, 100% 1.4%, 100% 98.5%, 98.4% 100%, 1.5% 100%, 0 98.5%)",
            background: "linear-gradient(110deg, #446690, #2c456f 54%, #875984)",
            filter: "drop-shadow(0 0 5px rgba(28,89,180,.28))",
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
            <SelectControl
              first
              label="Language"
              value={language}
              options={["English", "Español", "Français", "Deutsch"]}
              onChange={setLanguage}
              offsetY={5}
            />
            <SelectControl
              label="Text Size"
              value={textSize}
              options={["Small", "Medium", "Large"]}
              onChange={setTextSize}
              offsetY={2}
            />
            <ToggleControl
              checked={reduceMotion}
              label="Reduce Motion"
              onChange={setReduceMotion}
              rowHeight={147}
              offsetY={1}
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
              rowHeight={173}
              offsetY={-7}
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
              rowHeight={166}
              offsetY={-8}
            />
            <EraseControl />
          </div>
        </div>
      </div>
      <ReturnButton onClick={() => router.push("/")} />
    </section>
  );
}
