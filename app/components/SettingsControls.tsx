"use client";

import { useId, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { ArcadeButtonEffect } from "./ArcadeButtonEffect";
import { actionInnerClip, actionOuterClip, ClippedInset } from "./ClippedInset";
import { ArcadeCheckboxEffect } from "./ArcadeCheckboxEffect";
import { SettingRow } from "./SettingRow";
import { useInteraction } from "./useInteraction";
import { keyboardFocusFilter, keyboardFocusGradient } from "./ControlInteraction";
import { ScreenReaderOnly } from "./ScreenReaderOnly";
import { CheckboxRasterParts } from "./RasterFrame";
import { useUiRenderMode } from "./UiRenderMode";
import { dynamicTypeScale, useFontScale } from "./FontScale";

import { mergeProps, useCheckbox } from "react-aria";
import { useToggleState } from "react-stately";
import { useArcadeButton } from "./useArcadeButton";
import { CheckMark } from "./CheckMark";
export { SelectControl } from "./SelectControl";

type BaseProps = { label: ReactNode; first?: boolean; offsetY?: number; rowHeight?: number };

export function ToggleControl({
  checked,
  label,
  ariaLabel,
  onChange,
  withInfo = false,
  onInfoClick,
  rowHeight,
  offsetY = 0,
}: BaseProps & {
  checked: boolean;
  ariaLabel?: string;
  onChange: (checked: boolean) => void;
  withInfo?: boolean;
  onInfoClick?: () => void;
}) {
  const { state: interaction, handlers } = useInteraction();
  const reduceMotion = useReducedMotion();
  const labelId = useId();
  const descriptionId = useId();
  const ref = useRef<HTMLInputElement>(null);
  const checkboxProps = {
    isSelected: checked,
    onChange,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabel ? undefined : labelId,
    "aria-describedby": withInfo ? descriptionId : undefined,
  };
  const toggleState = useToggleState(checkboxProps);
  const { inputProps, labelProps, isPressed } = useCheckbox(checkboxProps, toggleState, ref);
  const state = { ...interaction, pressed: isPressed };
  const { mode } = useUiRenderMode();
  const { fontScale } = useFontScale();
  const usingPng = mode === "png";
  const controlScale = dynamicTypeScale(fontScale, "control");
  const checkboxSize = 77 * controlScale;

  return (
    <div
      style={{
        display: "block",
        height: rowHeight,
        cursor: "pointer",
      }}
    >
      <SettingRow
        labelId={labelId}
        label={
          <>
            <label {...labelProps} style={{ cursor: "pointer" }}>
              {label}
            </label>
            {withInfo && <InfoBadge onClick={onInfoClick} />}
          </>
        }
        rowHeight={rowHeight}
      >
        <span
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            width: checkboxSize,
            height: checkboxSize,
            marginLeft: 8,
            cursor: "pointer",
            transform: `translateY(${offsetY}px)`,
          }}
        >
          <ArcadeCheckboxEffect checked={checked} />
          <input
            {...mergeProps(inputProps, handlers)}
            ref={ref}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              width: checkboxSize,
              height: checkboxSize,
              margin: 0,
              opacity: 0,
              cursor: "pointer",
              outline: 0,
            }}
          />
          <span
            aria-hidden="true"
            style={{
              position: "relative",
              zIndex: 1,
              boxSizing: "border-box",
              width: checkboxSize,
              height: checkboxSize,
              border: usingPng
                ? 0
                : state.focused
                  ? "4px solid #fff400"
                  : state.hovered
                    ? "4px solid #91faff"
                    : "4px solid #4ba3ff",
              borderRadius: 11,
              background: usingPng ? "transparent" : "linear-gradient(180deg, #06142b, #02091a)",
              boxShadow: usingPng
                ? undefined
                : state.focused
                  ? "inset 0 0 14px #000, 0 0 4px #fff, 0 0 16px #ffd900"
                  : state.hovered
                    ? "inset 0 0 12px #000, 0 0 15px #2acfff, 0 0 8px #b8ffff"
                    : "inset 0 0 14px #000, 0 0 10px #166cff, 0 0 5px #6af6ff",
              filter: `${state.focused ? keyboardFocusFilter : state.pressed ? "brightness(.76)" : ""} var(--music-control-pulse-filter, brightness(1))`,
              transform: `scale(${state.pressed && !reduceMotion ? 0.88 : state.hovered ? 1.045 : 1}) var(--music-control-pulse-transform, scale(1))`,
              transition:
                "transform 90ms cubic-bezier(.2,.8,.2,1), filter 90ms ease, border 140ms ease, box-shadow 140ms ease",
            }}
          >
            {usingPng ? (
              <CheckboxRasterParts checked={checked} size={checkboxSize} />
            ) : (
              checked && <CheckMark />
            )}
          </span>
        </span>
      </SettingRow>
      {withInfo && (
        <ScreenReaderOnly id={descriptionId}>
          We upload crash reports to Unity Diagnostics.
        </ScreenReaderOnly>
      )}
    </div>
  );
}

export function EraseControl({ onClick }: { onClick?: () => void }) {
  const labelId = useId();
  const { state, buttonProps, ref } = useArcadeButton({
    onPress: onClick,
    "aria-labelledby": labelId,
  });
  const reduceMotion = useReducedMotion();
  const { fontScale } = useFontScale();
  const controlScale = dynamicTypeScale(fontScale, "control");

  return (
    <SettingRow label="Erase Saved Data" labelId={labelId}>
      <span
        style={{
          position: "relative",
          width: 362 * (1 + (fontScale - 1) * 0.25),
          height: 114 * (1 + (fontScale - 1) * 0.35),
          marginLeft: 21,
          display: "block",
          overflow: "visible",
          transform: "translateY(-8px)",
        }}
      >
        <button
          {...buttonProps}
          ref={ref}
          style={{
            position: "relative",
            boxSizing: "border-box",
            width: "100%",
            height: "100%",
            display: "grid",
            placeItems: "center",
            border: 0,
            outline: 0,
            padding: 0,
            clipPath: actionOuterClip,
            color: "#ff3553",
            background: state.focused
              ? keyboardFocusGradient
              : state.hovered
                ? "linear-gradient(110deg, #ff657f, #ff204f 55%, #ff75a1)"
                : "#ff355e",
            filter: `${
              state.focused
                ? keyboardFocusFilter
                : state.hovered
                  ? "brightness(1.16) drop-shadow(0 0 15px rgba(255,45,101,.82))"
                  : "drop-shadow(0 0 9px rgba(255,20,78,.55))"
            } var(--music-control-pulse-filter, brightness(1))`,
            fontFamily: "'Barlow Condensed', Impact, sans-serif",
            fontWeight: 700,
            fontSize: 67 * controlScale,
            textShadow: "0 0 11px rgba(255,25,76,.55)",
            cursor: "pointer",
            transform: `scale(${state.pressed && !reduceMotion ? 0.96 : 1}) var(--music-control-pulse-transform, scale(1))`,
            transition: "transform 90ms cubic-bezier(.2,.8,.2,1)",
          }}
        >
          <ClippedInset
            inset={4}
            clipPath={actionInnerClip}
            background="radial-gradient(ellipse at 50% 45%, #200511, #07030c 67%, #020208)"
            boxShadow="inset 0 0 22px #000"
          />
          <span
            style={{
              position: "relative",
              zIndex: 1,
              lineHeight: 0.9,
              transform: "translateY(-1px)",
            }}
          >
            ERASE
          </span>
        </button>
        <ArcadeButtonEffect burstId={state.releaseCount} compact />
      </span>
    </SettingRow>
  );
}

function InfoBadge({ onClick }: { onClick?: () => void }) {
  const { buttonProps, ref, state } = useArcadeButton({
    onPress: onClick,
    "aria-label": "About crash report uploads",
  });
  const { fontScale } = useFontScale();
  const controlScale = dynamicTypeScale(fontScale, "control");

  return (
    <button
      {...buttonProps}
      ref={ref}
      title="About crash report uploads"
      style={{
        position: "absolute",
        left: 205 * fontScale,
        bottom: 37,
        boxSizing: "border-box",
        width: 38 * controlScale,
        height: 38 * controlScale,
        display: "grid",
        placeItems: "center",
        border: "2px solid #55b8ff",
        outline: state.focused ? "3px solid #fff400" : "none",
        borderRadius: "50%",
        background: "transparent",
        color: "#bcf4ff",
        fontFamily: "Georgia, serif",
        fontSize: 27 * controlScale,
        fontStyle: "normal",
        fontWeight: 700,
        lineHeight: 1,
        textTransform: "lowercase",
        boxShadow: "0 0 8px #155eff, inset 0 0 7px rgba(13,76,180,.8)",
        transform: "translateY(1px) scaleX(.957)",
        padding: 0,
        appearance: "none",
        WebkitAppearance: "none",
        cursor: "pointer",
      }}
    >
      i
    </button>
  );
}
