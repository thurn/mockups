"use client";

import type { ReactNode } from "react";
import { ArrowDownIcon } from "@phosphor-icons/react/dist/csr/ArrowDown";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/csr/ArrowLeft";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { ArrowUpIcon } from "@phosphor-icons/react/dist/csr/ArrowUp";
import { controlInnerClip, controlOuterClip, ClippedInset } from "./ClippedInset";
import { ControllerButton, DPadIcon } from "./InputBindingIcons";
import { settingsRowHeight } from "./SettingRow";
import { displayFont } from "./styles";
import { SmallControlRasterFrame } from "./RasterFrame";
import { useUiRenderMode } from "./UiRenderMode";
import { dynamicTypeScale, useFontScale } from "./FontScale";

const bindings: Array<{
  action: string;
  keyboard: string;
  keyboardDirection?: "left" | "right" | "up" | "down";
  controller: ReactNode;
}> = [
  {
    action: "Left",
    keyboard: "Left arrow",
    keyboardDirection: "left",
    controller: <DPadIcon direction="left" />,
  },
  {
    action: "Right",
    keyboard: "Right arrow",
    keyboardDirection: "right",
    controller: <DPadIcon direction="right" />,
  },
  {
    action: "Up",
    keyboard: "Up arrow",
    keyboardDirection: "up",
    controller: <DPadIcon direction="up" />,
  },
  {
    action: "Down",
    keyboard: "Down arrow",
    keyboardDirection: "down",
    controller: <DPadIcon direction="down" />,
  },
  {
    action: "Move Piece",
    keyboard: "Space",
    controller: <ControllerButton label="A" color="green" />,
  },
  {
    action: "Pause",
    keyboard: "Esc",
    controller: <ControllerButton label="menu" color="gray" />,
  },
  {
    action: "Restart",
    keyboard: "R",
    controller: <ControllerButton label="Y" color="yellow" />,
  },
];

export function InputSettings() {
  const { fontScale } = useFontScale();
  const inputWidth = 839;
  const columns = fontScale === 1 ? "310px 310px 1fr" : "260px 340px 1fr";

  return (
    <div
      aria-label="Input bindings"
      role="table"
      style={{
        position: "relative",
        height: 971,
        overflowX: "hidden",
        overflowY: "auto",
        overscrollBehavior: "contain",
        scrollbarColor: "#4b86d2 #061126",
        scrollbarWidth: "thin",
        touchAction: "pan-y",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div
        role="row"
        style={{
          position: "sticky",
          zIndex: 4,
          top: 0,
          width: inputWidth,
          height: 100 * dynamicTypeScale(fontScale, "control"),
          display: "grid",
          gridTemplateColumns: columns,
          alignItems: "center",
          borderBottom: "2px solid rgba(43,74,123,.3)",
          background: "linear-gradient(180deg, #041126 82%, rgba(4,17,38,.96))",
          boxShadow: "0 8px 14px rgba(0,4,15,.35)",
        }}
      >
        <ColumnHeading>Action</ColumnHeading>
        <ColumnHeading>Keyboard</ColumnHeading>
        <ColumnHeading>Controller</ColumnHeading>
      </div>
      {bindings.map((binding) => (
        <div
          key={binding.action}
          role="row"
          style={{
            boxSizing: "border-box",
            width: inputWidth,
            height: settingsRowHeight * fontScale,
            display: "grid",
            gridTemplateColumns: columns,
            alignItems: "center",
            borderBottom: "2px solid rgba(43,74,123,.25)",
          }}
        >
          <InputLabel>{binding.action}</InputLabel>
          <div role="cell" style={{ display: "grid", placeItems: "center" }}>
            <KeyCap value={binding.keyboard} direction={binding.keyboardDirection} />
          </div>
          <div role="cell" style={{ display: "grid", placeItems: "center" }}>
            {binding.controller}
          </div>
        </div>
      ))}
    </div>
  );
}

function ColumnHeading({ children }: { children: ReactNode }) {
  const { fontScale } = useFontScale();

  return (
    <div
      role="columnheader"
      style={{
        color: "#f4f5fa",
        fontFamily: displayFont,
        fontSize: 47 * (1 + (fontScale - 1) * 0.2),
        lineHeight: 1,
        letterSpacing: "1.2px",
        textAlign: "center",
        textShadow: "2px 4px 0 #182b4d, 0 5px 7px #000",
      }}
    >
      {children}
    </div>
  );
}

function KeyCap({
  value,
  direction,
}: {
  value: string;
  direction?: "left" | "right" | "up" | "down";
}) {
  const { mode } = useUiRenderMode();
  const { fontScale } = useFontScale();
  const usingPng = mode === "png";
  const controlScale = dynamicTypeScale(fontScale, "control");

  return (
    <div
      aria-label={`${value} key`}
      role="img"
      style={{
        position: "relative",
        boxSizing: "border-box",
        width: 205 * controlScale,
        height: 75 * controlScale,
        display: "grid",
        placeItems: "center",
        clipPath: controlOuterClip,
        padding: 3,
        color: "#f6f6fa",
        background: usingPng
          ? "transparent"
          : "linear-gradient(110deg, #55f1ff, #7ba3ff 54%, #ff48c6)",
        filter: "drop-shadow(0 0 7px rgba(42,103,255,.46))",
        fontFamily: displayFont,
        fontSize: (value.length > 2 ? 49 : 60) * fontScale,
        lineHeight: 1,
        letterSpacing: value.length > 2 ? "1px" : 0,
        textShadow: "2px 4px 0 #19284a, 0 4px 7px #000",
      }}
    >
      {usingPng ? (
        <SmallControlRasterFrame />
      ) : (
        <ClippedInset
          inset={3}
          clipPath={controlInnerClip}
          background="linear-gradient(180deg, #050b1c, #020611)"
          boxShadow="inset 0 0 22px #000"
        />
      )}
      <span style={{ position: "relative", zIndex: 1 }}>
        {direction ? <KeyboardArrow direction={direction} /> : value}
      </span>
    </div>
  );
}

function KeyboardArrow({ direction }: { direction: "left" | "right" | "up" | "down" }) {
  const { fontScale } = useFontScale();
  const props = {
    "aria-hidden": true,
    color: "currentColor",
    size: 65 * dynamicTypeScale(fontScale, "control"),
    weight: "bold" as const,
    style: {
      display: "block",
      filter: "drop-shadow(2px 4px 0 #19284a) drop-shadow(0 4px 5px #000)",
    },
  };

  if (direction === "left") return <ArrowLeftIcon {...props} />;
  if (direction === "right") return <ArrowRightIcon {...props} />;
  if (direction === "up") return <ArrowUpIcon {...props} />;
  return <ArrowDownIcon {...props} />;
}

function InputLabel({ children }: { children: ReactNode }) {
  const { fontScale } = useFontScale();

  return (
    <div
      role="rowheader"
      style={{
        minWidth: 0,
        paddingLeft: 18,
        color: "#f5f5f8",
        fontFamily: displayFont,
        fontSize: 54 * fontScale,
        lineHeight: 0.92,
        letterSpacing: "1.3px",
        textTransform: "uppercase",
        textShadow: "2px 4px 0 #182b4d, 0 5px 7px #000",
      }}
    >
      {children}
    </div>
  );
}
