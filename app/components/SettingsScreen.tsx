"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ReturnButton } from "./ReturnButton";
import { EraseControl, SelectControl, ToggleControl } from "./SettingsControls";
import { SettingsTabs } from "./SettingsTabs";
import { ClippedInset } from "./ClippedInset";

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
      <header
        style={{
          position: "absolute",
          zIndex: 5,
          top: 74,
          left: 84,
          width: 854,
          height: 122,
          display: "grid",
          placeItems: "center",
        }}
      >
        <StripeBar side="left" />
        <StripeBar side="right" />
        <h1
          style={{
            position: "relative",
            zIndex: 2,
            margin: "-20px 0 -26px",
            padding: "20px 20px 36px 4px",
            color: "transparent",
            background:
              "linear-gradient(174deg, #ffffff 2%, #e5f5ff 20%, #74c9ff 38%, #f8fbff 51%, #8d72ff 70%, #ff68d9 94%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            WebkitTextStroke: "1.4px #f9ffff",
            fontFamily: "'Barlow Condensed', Impact, sans-serif",
            fontSize: 165,
            fontStyle: "italic",
            fontWeight: 800,
            lineHeight: 0.82,
            letterSpacing: "-5px",
            transform: "translate(14px, -7px) scale(1.01, .83) skewX(-5deg)",
            filter:
              "drop-shadow(4px 6px 0 #092463) drop-shadow(-3px -2px 0 #61096a) drop-shadow(0 12px 8px #000)",
          }}
        >
          Settings
        </h1>
      </header>
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

function StripeBar({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 44,
        [isLeft ? "left" : "right"]: 0,
        width: 314,
        height: 58,
        clipPath: isLeft
          ? "polygon(0 0, 100% 0, 93% 100%, 0 100%)"
          : "polygon(7% 0, 100% 0, 100% 100%, 0 100%)",
        background: isLeft
          ? "repeating-linear-gradient(132deg, #075fff 0 17px, #05164b 17px 32px)"
          : "repeating-linear-gradient(132deg, #f21160 0 17px, #4b0827 17px 32px)",
        boxShadow: isLeft ? "0 0 18px #075fff" : "0 0 18px #f21160",
      }}
    />
  );
}
