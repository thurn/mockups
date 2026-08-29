"use client";

import { useState } from "react";
import { ArcadeFrame } from "./ArcadeFrame";
import { ArcadeTitle } from "./ArcadeTitle";
import { ReturnButton } from "./ReturnButton";
import { SelectControl, ToggleControl } from "./SettingsControls";
import { SettingsTabs } from "./SettingsTabs";

export function SettingsScreen({ onReturn }: { onReturn: () => void }) {
  const [language, setLanguage] = useState("English");
  const [textSize, setTextSize] = useState("Medium");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [increaseMoveDuration, setIncreaseMoveDuration] = useState(true);
  const [uploadCrashReports, setUploadCrashReports] = useState(true);

  return (
    <ArcadeFrame label="Gameplay settings" settings>
      <ArcadeTitle settings />
      <div
        style={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          minHeight: 0,
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
        }}
      >
        <SettingsTabs />
        <div
          style={{
            boxSizing: "border-box",
            position: "relative",
            flex: "1 1 auto",
            display: "grid",
            gridTemplateRows: "repeat(5, minmax(0, 1fr))",
            border: "2px solid transparent",
            padding: "8px 10px",
            clipPath: "polygon(2% 0, 98% 0, 100% 4%, 100% 96%, 98% 100%, 2% 100%, 0 96%, 0 4%)",
            background:
              "linear-gradient(180deg, rgb(3 11 30 / 97%), rgb(2 8 22 / 98%)) padding-box, linear-gradient(110deg, #68eaff, #6b7fea 52%, #fc45ce) border-box",
            boxShadow:
              "inset 0 0 0 8px #020819, inset 0 0 0 10px rgb(75 130 207 / 58%), inset 0 0 36px #000",
          }}
        >
          <SelectControl
            first
            label="Language"
            onChange={setLanguage}
            options={["English", "Español", "Français", "Deutsch"]}
            value={language}
          />
          <SelectControl
            label="Text Size"
            onChange={setTextSize}
            options={["Small", "Medium", "Large"]}
            value={textSize}
          />
          <ToggleControl checked={reduceMotion} label="Reduce Motion" onChange={setReduceMotion} />
          <ToggleControl
            checked={increaseMoveDuration}
            label="Increase Move Duration"
            onChange={setIncreaseMoveDuration}
          />
          <ToggleControl
            checked={uploadCrashReports}
            label="Upload Crash Reports"
            onChange={setUploadCrashReports}
            withInfo
          />
        </div>
      </div>
      <ReturnButton onClick={onReturn} />
    </ArcadeFrame>
  );
}
