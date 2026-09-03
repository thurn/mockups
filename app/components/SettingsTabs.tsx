"use client";

import { motionAriaProps } from "./motionAriaProps";

import { motion } from "framer-motion";
import { useRef } from "react";
import { mergeProps, useTab, useTabList } from "react-aria";
import { Item, useTabListState, type TabListState } from "react-stately";
import { ArcadeButtonEffect } from "./ArcadeButtonEffect";
import { ClippedInset, tabInnerClip, tabOuterClip } from "./ClippedInset";
import { useInteraction } from "./useInteraction";
import { keyboardFocusFilter, keyboardFocusGradient } from "./ControlInteraction";
import { SettingsTabRasterFrame } from "./RasterFrame";
import { useUiRenderMode } from "./UiRenderMode";
import { useFontScale } from "./FontScale";

export const settingsTabs = ["Gameplay", "Graphics", "Sound", "Input"] as const;

export type SettingsTab = (typeof settingsTabs)[number];

export function useSettingsTabState(activeTab: SettingsTab, onSelect: (tab: SettingsTab) => void) {
  return useTabListState({
    selectedKey: activeTab,
    onSelectionChange: (key) => onSelect(key as SettingsTab),
    children: settingsTabs.map((tab) => <Item key={tab}>{tab}</Item>),
  });
}

export function SettingsTabs({ tabState }: { tabState: TabListState<object> }) {
  const ref = useRef<HTMLDivElement>(null);
  const { tabListProps } = useTabList({ "aria-label": "Settings categories" }, tabState, ref);
  return (
    <div
      {...tabListProps}
      ref={ref}
      style={{
        height: 129,
        display: "grid",
        gridTemplateColumns: "264px 212px 205px 200px",
        gap: 2,
        alignItems: "end",
      }}
    >
      {settingsTabs.map((tab) => (
        <SettingsTabButton key={tab} tab={tab} tabState={tabState} />
      ))}
    </div>
  );
}

function SettingsTabButton({
  tab,
  tabState,
}: {
  tab: SettingsTab;
  tabState: TabListState<object>;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const { tabProps, isSelected: active, isPressed } = useTab({ key: tab }, tabState, ref);
  const { state: interaction, handlers } = useInteraction({ isPressed });
  const state = { ...interaction, pressed: isPressed };
  const { mode } = useUiRenderMode();
  const { fontScale } = useFontScale();
  const usingPng = mode === "png";
  const tabTextScale = 1 + (fontScale - 1) * 0.25;
  const longLabelScale = fontScale === 1 || (tab !== "Gameplay" && tab !== "Graphics") ? 1 : 0.92;

  return (
    <span
      style={{
        position: "relative",
        width: "100%",
        height: active ? 130 : 127,
        alignSelf: "end",
        overflow: "visible",
      }}
    >
      <motion.button
        {...motionAriaProps(mergeProps(tabProps, handlers))}
        ref={ref}
        type="button"
        animate={{ y: active ? 0 : 3, scale: 1 }}
        whileHover={{ y: active ? 0 : -1, scale: 1 }}
        whileTap={{ scale: 0.955 }}
        transition={{ type: "spring", stiffness: 520, damping: 32, mass: 0.7 }}
        style={{
          position: "relative",
          boxSizing: "border-box",
          width: "100%",
          height: "100%",
          marginTop: 0,
          border: 0,
          padding: 0,
          clipPath: usingPng ? undefined : tabOuterClip,
          color: "#f7f7fb",
          outline: 0,
          background: usingPng
            ? "transparent"
            : state.focused
              ? keyboardFocusGradient
              : state.hovered
                ? "linear-gradient(112deg, #efffff 0%, #6be6ff 40%, #c3adff 68%, #ff8de4 100%)"
                : active
                  ? "linear-gradient(112deg, #72f5ff 0%, #53afff 44%, #9a83ff 68%, #ff4ed3 100%)"
                  : "linear-gradient(110deg, #657287, #454f64 52%, #6f6577)",
          filter: `${
            state.focused
              ? keyboardFocusFilter
              : state.hovered
                ? "brightness(1.16) drop-shadow(0 0 11px rgba(83,177,255,.78))"
                : active
                  ? usingPng
                    ? ""
                    : "drop-shadow(0 0 10px rgba(35,133,255,.86))"
                  : ""
          } var(--music-control-pulse-filter, brightness(1))`,
          fontFamily: "'Barlow Condensed', Impact, sans-serif",
          fontWeight: 700,
          fontSize: (active ? 55 : 51) * tabTextScale * longLabelScale,
          lineHeight: 1,
          letterSpacing: "1px",
          textShadow: "2px 4px 0 #182b50, 0 5px 7px #000",
          cursor: "pointer",
        }}
      >
        {usingPng ? (
          <SettingsTabRasterFrame active={active} />
        ) : (
          <ClippedInset
            inset={4}
            clipPath={tabInnerClip}
            background={
              active
                ? "linear-gradient(180deg, #071831, #030b1d)"
                : "linear-gradient(180deg, #071328, #020817)"
            }
            boxShadow={
              active
                ? "inset 0 0 34px rgba(20,98,226,.52), inset 0 -3px 0 #f14dd7"
                : "inset 0 0 24px rgba(0,0,0,.5)"
            }
          />
        )}
        <span style={{ position: "relative", zIndex: 1 }}>{tab}</span>
      </motion.button>
      <ArcadeButtonEffect burstId={state.releaseCount} compact />
    </span>
  );
}
