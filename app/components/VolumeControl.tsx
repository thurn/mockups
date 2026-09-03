"use client";

import { useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  mergeProps,
  useNumberFormatter,
  useSlider,
  useSliderThumb,
  VisuallyHidden,
} from "react-aria";
import { useSliderState } from "react-stately";
import { ArcadeSliderEffect } from "./ArcadeSliderEffect";
import { keyboardFocusFilter, keyboardFocusGradient } from "./ControlInteraction";
import { SettingRow } from "./SettingRow";
import { useInteraction } from "./useInteraction";
import { VolumeSliderRasterParts } from "./RasterFrame";
import { useUiRenderMode } from "./UiRenderMode";
import { useFontScale } from "./FontScale";

const sliderTrackWidth = 284;

export function VolumeControl({
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
  const trackRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const numberFormatter = useNumberFormatter({ style: "unit", unit: "percent" });
  const props = {
    label,
    value,
    minValue: 0,
    maxValue: 100,
    step: 5,
    onChange: (next: number) => {
      onChange(next);
      setBurstId((current) => current + 1);
    },
  };
  const sliderState = useSliderState({ ...props, numberFormatter });
  const { groupProps, trackProps, labelProps, outputProps } = useSlider(
    props,
    sliderState,
    trackRef,
  );
  const { thumbProps, inputProps, isDragging } = useSliderThumb(
    { index: 0, trackRef, inputRef },
    sliderState,
  );
  const { state: interaction, handlers } = useInteraction({ within: true });
  const state = { ...interaction, pressed: isDragging };
  const reduceMotion = useReducedMotion();
  const { mode } = useUiRenderMode();
  const { fontScale } = useFontScale();
  const usingPng = mode === "png";
  const elementScale = 1 + (fontScale - 1) * 0.35;

  return (
    <SettingRow first={first} label={label} labelId={labelProps.id}>
      <div
        {...groupProps}
        style={{
          position: "relative",
          width: 398,
          height: 82,
          display: "flex",
          alignItems: "center",
          gap: 18,
          transform: `scale(${elementScale})`,
          transformOrigin: "left center",
          filter: usingPng && state.focused ? keyboardFocusFilter : undefined,
        }}
      >
        <div
          {...mergeProps(trackProps, handlers)}
          ref={trackRef}
          style={{ position: "relative", width: sliderTrackWidth, height: 64, touchAction: "none" }}
        >
          <span
            aria-hidden="true"
            style={{ position: "absolute", inset: "-34px 0", cursor: "pointer" }}
          />
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
          <div
            {...thumbProps}
            style={{
              ...thumbProps.style,
              position: "absolute",
              top: "50%",
              width: 84,
              height: 132,
              zIndex: 3,
              cursor: "pointer",
            }}
          >
            <VisuallyHidden>
              <input {...inputProps} ref={inputRef} />
            </VisuallyHidden>
          </div>
        </div>
        <output
          {...outputProps}
          aria-hidden="true"
          style={{
            width: 96,
            color: "#f5f5f8",
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: 55 * (fontScale / elementScale),
            lineHeight: 1,
            letterSpacing: "1px",
            textShadow: "2px 4px 0 #182b4d, 0 5px 7px #000",
          }}
        >
          {value}%
        </output>
      </div>
    </SettingRow>
  );
}
