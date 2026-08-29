import type { ReactNode } from "react";
import { controlInnerClip, controlOuterClip, ClippedInset } from "./ClippedInset";
import { ControllerButton, DPadIcon } from "./InputBindingIcons";
import { settingsRowHeight } from "./SettingRow";
import { displayFont } from "./styles";

const bindings: Array<{
  action: string;
  keyboard: string;
  controller: ReactNode;
}> = [
  { action: "Left", keyboard: "←", controller: <DPadIcon direction="left" /> },
  { action: "Right", keyboard: "→", controller: <DPadIcon direction="right" /> },
  { action: "Up", keyboard: "↑", controller: <DPadIcon direction="up" /> },
  { action: "Down", keyboard: "↓", controller: <DPadIcon direction="down" /> },
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
          height: 100,
          display: "grid",
          gridTemplateColumns: "310px 310px 1fr",
          alignItems: "center",
          borderBottom: "2px solid rgba(43,74,123,.3)",
          background: "linear-gradient(180deg, #041126 82%, rgba(4,17,38,.96))",
          boxShadow: "0 8px 14px rgba(0,4,15,.35)",
        }}
      >
        <span />
        <ColumnHeading>Keyboard</ColumnHeading>
        <ColumnHeading>Controller</ColumnHeading>
      </div>
      {bindings.map((binding) => (
        <div
          key={binding.action}
          role="row"
          style={{
            boxSizing: "border-box",
            height: settingsRowHeight,
            display: "grid",
            gridTemplateColumns: "310px 310px 1fr",
            alignItems: "center",
            borderBottom: "2px solid rgba(43,74,123,.25)",
          }}
        >
          <div role="rowheader" style={labelStyle}>
            {binding.action}
          </div>
          <div role="cell" style={{ display: "grid", placeItems: "center" }}>
            <KeyCap value={binding.keyboard} />
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
  return (
    <div
      role="columnheader"
      style={{
        color: "#f4f5fa",
        fontFamily: displayFont,
        fontSize: 47,
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

function KeyCap({ value }: { value: string }) {
  return (
    <div
      aria-label={`${value} key`}
      role="img"
      style={{
        position: "relative",
        boxSizing: "border-box",
        width: 205,
        height: 75,
        display: "grid",
        placeItems: "center",
        clipPath: controlOuterClip,
        padding: 3,
        color: "#f6f6fa",
        background: "linear-gradient(110deg, #55f1ff, #7ba3ff 54%, #ff48c6)",
        filter: "drop-shadow(0 0 7px rgba(42,103,255,.46))",
        fontFamily: displayFont,
        fontSize: value.length > 2 ? 49 : 60,
        lineHeight: 1,
        letterSpacing: value.length > 2 ? "1px" : 0,
        textShadow: "2px 4px 0 #19284a, 0 4px 7px #000",
      }}
    >
      <ClippedInset
        inset={3}
        clipPath={controlInnerClip}
        background="linear-gradient(180deg, #050b1c, #020611)"
        boxShadow="inset 0 0 22px #000"
      />
      <span style={{ position: "relative", zIndex: 1 }}>{value}</span>
    </div>
  );
}

const labelStyle = {
  minWidth: 0,
  paddingLeft: 18,
  color: "#f5f5f8",
  fontFamily: displayFont,
  fontSize: 54,
  lineHeight: 0.92,
  letterSpacing: "1.3px",
  textTransform: "uppercase" as const,
  textShadow: "2px 4px 0 #182b4d, 0 5px 7px #000",
};
