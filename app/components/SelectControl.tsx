"use client";

import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { HiddenSelect, useSelect } from "react-aria";
import { Item, useSelectState, type Key } from "react-stately";
import { ArcadeButtonEffect } from "./ArcadeButtonEffect";
import { ClippedInset, controlInnerClip, controlOuterClip } from "./ClippedInset";
import { SettingRow } from "./SettingRow";
import { useArcadeButton } from "./useArcadeButton";
import { keyboardFocusFilter, keyboardFocusGradient } from "./ControlInteraction";
import { SmallControlRasterFrame } from "./RasterFrame";
import { useUiRenderMode } from "./UiRenderMode";
import { dynamicTypeScale, useFontScale } from "./FontScale";
import { SelectPopover } from "./SelectPopover";

type BaseProps = { label: ReactNode; first?: boolean; offsetY?: number; rowHeight?: number };

export function SelectControl({
  label,
  options,
  value,
  onChange,
  first = false,
  offsetY = 0,
  rowHeight,
}: BaseProps & { options: string[]; value: string; onChange: (value: string) => void }) {
  const { mode } = useUiRenderMode();
  const { fontScale } = useFontScale();
  const usingPng = mode === "png";
  const controlScale = dynamicTypeScale(fontScale, "control");
  const controlWidth = Math.round(396 + (fontScale - 1) * 300);
  const controlHeight = Math.round(106 * (1 + (fontScale - 1) * 0.35));
  const [isClosing, setIsClosing] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const selectProps = {
    label,
    value,
    onChange: (key: Key | null) => {
      if (key !== null) onChange(String(key));
    },
    onOpenChange: (open: boolean) => setIsClosing(!open),
    children: options.map((option) => <Item key={option}>{option}</Item>),
  };
  const state = useSelectState<object>(selectProps);
  const { labelProps, triggerProps, valueProps, menuProps, hiddenSelectProps } = useSelect(
    selectProps,
    state,
    triggerRef,
  );
  const { buttonProps, state: pressState } = useArcadeButton(triggerProps, triggerRef);
  const { isOpen } = state;
  const highlighted = pressState.hovered || pressState.focused;

  return (
    <SettingRow first={first} label={label} labelProps={labelProps} rowHeight={rowHeight}>
      <div
        style={{
          position: "relative",
          zIndex: isOpen || isClosing ? 20 : 1,
          width: controlWidth,
          height: controlHeight,
          flex: "none",
          display: "flex",
          alignItems: "center",
          transform: `translateY(${offsetY}px)`,
        }}
      >
        <span
          style={{
            position: "relative",
            width: controlWidth,
            height: controlHeight,
            display: "block",
            overflow: "visible",
          }}
        >
          <button
            {...buttonProps}
            ref={triggerRef}
            style={{
              position: "relative",
              boxSizing: "border-box",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              clipPath: controlOuterClip,
              padding: `0 ${74 * controlScale}px 0 ${39 * controlScale}px`,
              border: 0,
              outline: 0,
              color: "#f5f6fb",
              background: usingPng
                ? "transparent"
                : pressState.focused
                  ? keyboardFocusGradient
                  : highlighted
                    ? "linear-gradient(106deg, #b5ffff, #d3ddff 48%, #ff75dc)"
                    : "linear-gradient(106deg, #5df5ff, #a5cbff 48%, #ff4bc9)",
              filter: `${
                pressState.focused
                  ? keyboardFocusFilter
                  : highlighted || isOpen
                    ? "brightness(1.12) drop-shadow(0 0 13px rgba(83,226,255,.78))"
                    : usingPng
                      ? ""
                      : "drop-shadow(0 0 6px rgba(42,103,255,.38))"
              } var(--music-control-pulse-filter, brightness(1))`,
              fontFamily: "'Barlow Condensed', Impact, sans-serif",
              fontWeight: 700,
              fontSize: 60 * controlScale,
              textAlign: "left",
              lineHeight: 1,
              textShadow: "2px 4px 0 #19284a, 0 4px 7px #000",
              cursor: "pointer",
              transform: `scale(${pressState.pressed && !reduceMotion ? 0.965 : 1}) var(--music-control-pulse-transform, scale(1))`,
              transition: "transform 90ms cubic-bezier(.2,.8,.2,1), filter 140ms ease",
            }}
          >
            {usingPng ? (
              <SmallControlRasterFrame />
            ) : (
              <ClippedInset
                inset={3}
                clipPath={controlInnerClip}
                background="linear-gradient(180deg, #050b1c, #020611)"
                boxShadow="inset 0 0 24px #000"
              />
            )}
            <span {...valueProps} style={{ position: "relative", zIndex: 1 }}>
              {value}
            </span>
            <Caret isOpen={isOpen} />
          </button>
          <ArcadeButtonEffect burstId={pressState.releaseCount} compact />
        </span>
        <HiddenSelect {...hiddenSelectProps} />
        <AnimatePresence initial={false} onExitComplete={() => setIsClosing(false)}>
          {isOpen && (
            <SelectPopover
              state={state}
              menuProps={menuProps}
              triggerRef={triggerRef}
              controlWidth={controlWidth}
              controlHeight={controlHeight}
            />
          )}
        </AnimatePresence>
      </div>
    </SettingRow>
  );
}

function Caret({ isOpen }: { isOpen: boolean }) {
  const { fontScale } = useFontScale();
  const controlScale = dynamicTypeScale(fontScale, "control");

  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        zIndex: 2,
        top: "50%",
        right: 45 * controlScale,
        width: 0,
        height: 0,
        borderLeft: `${15 * controlScale}px solid transparent`,
        borderRight: `${15 * controlScale}px solid transparent`,
        borderTop: `${18 * controlScale}px solid #f4f5fa`,
        filter: "drop-shadow(0 3px 2px #000)",
        pointerEvents: "none",
        transform: `translateY(-50%) rotate(${isOpen ? 180 : 0}deg)`,
        transition: "transform 140ms ease",
      }}
    />
  );
}
