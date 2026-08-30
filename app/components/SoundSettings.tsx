"use client";

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useReducedMotion } from "framer-motion";
import { ArcadeSliderEffect } from "./ArcadeSliderEffect";
import { keyboardFocusGradient } from "./ControlInteraction";
import { ToggleControl } from "./SettingsControls";
import { SettingRow } from "./SettingRow";
import { useInteraction } from "./useInteraction";
import { VolumeSliderRasterParts } from "./RasterFrame";
import { useUiRenderMode } from "./UiRenderMode";

const sliderTrackWidth = 284;
const sliderHorizontalTouchPadding = 42;
const sliderTouchWidth = sliderTrackWidth + sliderHorizontalTouchPadding * 2;
const sliderPressKeys = [
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "PageDown",
  "PageUp",
  "Home",
  "End",
] as const;

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

function VolumeControl({
  label,
  value,
  onChange,
  first = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  first?: boolean;
}) {
  const [burstId, setBurstId] = useState(0);
  const labelId = useId();
  const pointerActive = useRef(false);
  const { state, handlers } = useInteraction({ pressKeys: sliderPressKeys });
  const reduceMotion = useReducedMotion();
  const { mode } = useUiRenderMode();
  const usingPng = mode === "png";

  const updateFromPointer = (event: ReactPointerEvent<HTMLInputElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const trackLeft =
      bounds.left + bounds.width * (sliderHorizontalTouchPadding / sliderTouchWidth);
    const trackWidth = bounds.width * (sliderTrackWidth / sliderTouchWidth);
    const ratio = Math.max(0, Math.min(1, (event.clientX - trackLeft) / trackWidth));
    onChange(Math.round(ratio * 100));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    handlers.onKeyDown(event);
    const changes: Record<string, number> = {
      ArrowDown: -5,
      ArrowLeft: -5,
      ArrowRight: 5,
      ArrowUp: 5,
      PageDown: -10,
      PageUp: 10,
    };

    let nextValue: number | undefined;
    if (event.key === "Home") nextValue = 0;
    else if (event.key === "End") nextValue = 100;
    else if (event.key in changes) nextValue = value + changes[event.key];

    if (nextValue === undefined) return;
    event.preventDefault();
    const clampedValue = Math.max(0, Math.min(100, nextValue));
    if (clampedValue !== value) {
      onChange(clampedValue);
      setBurstId((current) => current + 1);
    }
  };

  return (
    <SettingRow first={first} label={label} labelId={labelId}>
      <div
        style={{
          position: "relative",
          width: 398,
          height: 82,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div style={{ position: "relative", width: sliderTrackWidth, height: 64 }}>
          {usingPng && <VolumeSliderRasterParts value={value} />}
          {!usingPng && (
            <>
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 20,
                  boxSizing: "border-box",
                  width: sliderTrackWidth,
                  height: 26,
                  border: "3px solid transparent",
                  borderRadius: 8,
                  background: state.focused
                    ? `linear-gradient(#061125, #061125) padding-box, ${keyboardFocusGradient} border-box`
                    : state.hovered
                      ? "linear-gradient(#071830, #071830) padding-box, linear-gradient(90deg, #9dffff, #7c8dff 47%, #ff74d7 76%, #ff668e) border-box"
                      : "linear-gradient(#061125, #061125) padding-box, linear-gradient(90deg, #13e7ff, #735cff 47%, #ff43c7 76%, #ff326e) border-box",
                  boxShadow: state.focused
                    ? "0 0 4px #fff, 0 0 15px rgba(255,219,0,.92), inset 0 0 8px #000"
                    : state.hovered
                      ? "0 0 15px rgba(49,189,255,.88), inset 0 0 7px #000"
                      : "0 0 9px rgba(24,104,255,.72), inset 0 0 8px #000",
                  filter: `${state.pressed ? "brightness(.74)" : ""} var(--music-control-pulse-filter, brightness(1))`,
                  transform: `scaleY(${state.pressed && !reduceMotion ? 0.82 : 1}) var(--music-control-pulse-transform, scale(1))`,
                  transition:
                    "transform 90ms cubic-bezier(.2,.8,.2,1), filter 90ms ease, box-shadow 140ms ease",
                }}
              >
                <div
                  style={{
                    width: `${value}%`,
                    height: "100%",
                    borderRadius: 4,
                    background:
                      "linear-gradient(90deg, #17e9ff 0%, #286fff 35%, #8f5dff 62%, #ff3abe 86%, #ff326d 100%)",
                    boxShadow: "0 0 8px rgba(45,132,255,.8)",
                  }}
                />
              </div>
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 49,
                  width: sliderTrackWidth,
                  height: 10,
                  background:
                    "repeating-linear-gradient(90deg, transparent 0 62px, #465ccb 62px 64px)",
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  zIndex: 2,
                  left: `calc(${value}% - 21px)`,
                  top: 0,
                  boxSizing: "border-box",
                  width: 43,
                  height: 64,
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    boxSizing: "border-box",
                    width: "100%",
                    height: "100%",
                    clipPath:
                      "polygon(23% 0, 77% 0, 100% 17%, 100% 83%, 77% 100%, 23% 100%, 0 83%, 0 17%)",
                    padding: 4,
                    background: state.focused
                      ? keyboardFocusGradient
                      : state.hovered
                        ? "linear-gradient(135deg, #fff, #7edfff 55%, #b58cff)"
                        : "linear-gradient(135deg, #c8ffff, #599cff 55%, #875fff)",
                    filter: `${
                      state.focused
                        ? "drop-shadow(0 0 10px #ffe600)"
                        : state.hovered
                          ? "brightness(1.16) drop-shadow(0 0 10px #2bc8ff)"
                          : "drop-shadow(0 0 7px #1479ff)"
                    } var(--music-control-pulse-filter, brightness(1))`,
                    transform: `scale(${state.pressed && !reduceMotion ? 0.88 : 1}) var(--music-control-pulse-transform, scale(1))`,
                    transition: "transform 90ms cubic-bezier(.2,.8,.2,1), filter 140ms ease",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      clipPath: "inherit",
                      background: "linear-gradient(180deg, #07142b, #02091b)",
                      boxShadow: "inset 0 0 12px #000",
                    }}
                  />
                </div>
                <ArcadeSliderEffect burstId={burstId} />
              </div>
            </>
          )}
          {usingPng && (
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                zIndex: 3,
                left: `calc(${value}% - 21px)`,
                top: 0,
                width: 43,
                height: 64,
                pointerEvents: "none",
              }}
            >
              <ArcadeSliderEffect burstId={burstId} />
            </div>
          )}
          <input
            {...handlers}
            aria-labelledby={labelId}
            aria-valuetext={`${value} percent`}
            type="range"
            min={0}
            max={100}
            step={5}
            value={value}
            onKeyDown={handleKeyDown}
            onChange={(event) => {
              const nextValue = Number(event.target.value);
              onChange(nextValue);
              if (!pointerActive.current && nextValue !== value) {
                setBurstId((current) => current + 1);
              }
            }}
            onPointerDown={(event) => {
              handlers.onPointerDown();
              pointerActive.current = true;
              event.currentTarget.focus();
              event.currentTarget.setPointerCapture(event.pointerId);
              event.preventDefault();
              updateFromPointer(event);
            }}
            onPointerMove={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.preventDefault();
                updateFromPointer(event);
              }
            }}
            onPointerUp={(event) => {
              updateFromPointer(event);
              pointerActive.current = false;
              handlers.onPointerUp();
              setBurstId((current) => current + 1);
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }
            }}
            onPointerCancel={(event) => {
              pointerActive.current = false;
              handlers.onPointerCancel();
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }
            }}
            style={{
              position: "absolute",
              left: -sliderHorizontalTouchPadding,
              top: -34,
              zIndex: 3,
              width: sliderTouchWidth,
              height: 132,
              margin: 0,
              opacity: 0,
              cursor: "pointer",
              touchAction: "none",
              userSelect: "none",
              outline: 0,
            }}
          />
        </div>
        <div
          aria-hidden="true"
          style={{
            width: 96,
            color: "#f5f5f8",
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: 55,
            lineHeight: 1,
            letterSpacing: "1px",
            textShadow: "2px 4px 0 #182b4d, 0 5px 7px #000",
          }}
        >
          {value}%
        </div>
      </div>
    </SettingRow>
  );
}
