"use client";

import { useCallback, useState, type ReactNode } from "react";
import { ArrowDownIcon } from "@phosphor-icons/react/dist/csr/ArrowDown";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/csr/ArrowLeft";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { ArrowUpIcon } from "@phosphor-icons/react/dist/csr/ArrowUp";
import { motion } from "framer-motion";
import { controlInnerClip, controlOuterClip, ClippedInset } from "./ClippedInset";
import { ControllerButton, DPadIcon } from "./InputBindingIcons";
import { settingsRowHeight } from "./SettingRow";
import { displayFont } from "./styles";
import { SmallControlRasterFrame } from "./RasterFrame";
import { useUiRenderMode } from "./UiRenderMode";
import { dynamicTypeScale, useFontScale } from "./FontScale";
import { useArcadeNavigation } from "./ArcadeRouteTransition";
import { ShortcutCapture } from "./ShortcutCapture";
import { ArcadeModal } from "./ArcadeModal";
import { useArcadeButton } from "./useArcadeButton";
import { keyboardFocusFilter, keyboardFocusGradient } from "./ControlInteraction";

type Binding = {
  action: string;
  keyboard: string;
  keyboardDirection?: "left" | "right" | "up" | "down";
  controller: ReactNode;
};

const defaultBindings: Binding[] = [
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
  const { reduceMotion } = useArcadeNavigation();
  const [bindings, setBindings] = useState(defaultBindings);
  const [editingAction, setEditingAction] = useState<string | null>(null);
  const [conflictAction, setConflictAction] = useState<string | null>(null);
  const inputWidth = 839;
  const columns = fontScale === 1 ? "310px 310px 1fr" : "260px 340px 1fr";
  const editingBinding = bindings.find((binding) => binding.action === editingAction);

  const closeShortcutDialog = useCallback(() => {
    setEditingAction(null);
    setConflictAction(null);
  }, []);

  const captureShortcut = (key: string) => {
    if (!editingAction) return;
    const nextShortcut = formatShortcut(key);
    const conflict = bindings.find(
      (binding) => binding.action !== editingAction && binding.keyboard === nextShortcut,
    );
    if (conflict) {
      setConflictAction(conflict.action);
      return;
    }

    setBindings((current) =>
      current.map((binding) =>
        binding.action === editingAction
          ? {
              ...binding,
              keyboard: nextShortcut,
              keyboardDirection: shortcutDirection(nextShortcut),
            }
          : binding,
      ),
    );
    closeShortcutDialog();
  };

  const resetEditingShortcut = () => {
    const defaultBinding = defaultBindings.find((binding) => binding.action === editingAction);
    if (!defaultBinding) return;
    setBindings((current) =>
      current.map((binding) =>
        binding.action === editingAction
          ? {
              ...binding,
              keyboard: defaultBinding.keyboard,
              keyboardDirection: defaultBinding.keyboardDirection,
            }
          : binding,
      ),
    );
    closeShortcutDialog();
  };

  return (
    <>
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
              <KeyCap
                action={binding.action}
                value={binding.keyboard}
                direction={binding.keyboardDirection}
                onClick={() => {
                  setConflictAction(null);
                  setEditingAction(binding.action);
                }}
              />
            </div>
            <div role="cell" style={{ display: "grid", placeItems: "center" }}>
              {binding.controller}
            </div>
          </div>
        ))}
      </div>
      <ArcadeModal
        open={Boolean(editingBinding)}
        title="Change Shortcut"
        cancelLabel="Cancel"
        confirmLabel="Reset"
        closeOnEscape={false}
        autoFocusActions={false}
        reduceMotion={reduceMotion}
        onClose={closeShortcutDialog}
        onConfirm={resetEditingShortcut}
      >
        <ShortcutCapture onKey={captureShortcut}>
          <span style={{ display: "block", color: "#ffffff" }}>
            Press a key for {editingBinding?.action}
          </span>
          <span
            aria-label={conflictAction ? undefined : "Waiting for input"}
            aria-live="polite"
            style={{
              display: "block",
              minHeight: 42,
              marginTop: 24,
              color: conflictAction ? "#ff5576" : "#67efff",
              fontSize: 40,
              letterSpacing: 1.5,
              textShadow: conflictAction
                ? "0 0 12px rgba(255,45,101,.72)"
                : "0 0 12px rgba(45,221,255,.72)",
            }}
          >
            {conflictAction ? (
              `Already used by ${conflictAction}`
            ) : (
              <motion.span
                aria-hidden="true"
                animate={reduceMotion ? undefined : { opacity: [1, 1, 0.08, 0.08, 1] }}
                transition={{ duration: 1.05, ease: "linear", repeat: Infinity }}
                style={{
                  display: "inline-block",
                  width: 34,
                  height: 5,
                  marginBottom: 5,
                  background: "#67efff",
                  boxShadow: "0 0 10px rgba(45,221,255,.9)",
                }}
              />
            )}
          </span>
        </ShortcutCapture>
      </ArcadeModal>
    </>
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
  action,
  value,
  direction,
  onClick,
}: {
  action: string;
  value: string;
  direction?: "left" | "right" | "up" | "down";
  onClick: () => void;
}) {
  const { mode } = useUiRenderMode();
  const { fontScale } = useFontScale();
  const usingPng = mode === "png";
  const controlScale = dynamicTypeScale(fontScale, "control");
  const compact = value.length === 1 && !direction;
  const { state, buttonProps, ref } = useArcadeButton({
    onPress: onClick,
    "aria-label": `Change ${action} keyboard shortcut. Current key: ${value}`,
  });
  const highlighted = state.hovered || state.focused;

  return (
    <button
      {...buttonProps}
      ref={ref}
      style={{
        position: "relative",
        boxSizing: "border-box",
        width: (compact ? 120 : 205) * controlScale,
        height: 75 * controlScale,
        display: "grid",
        placeItems: "center",
        clipPath: controlOuterClip,
        padding: 3,
        border: 0,
        outline: 0,
        color: "#f6f6fa",
        background: usingPng
          ? "transparent"
          : state.focused
            ? keyboardFocusGradient
            : highlighted
              ? "linear-gradient(110deg, #c1ffff, #b7c9ff 54%, #ff79dd)"
              : "linear-gradient(110deg, #55f1ff, #7ba3ff 54%, #ff48c6)",
        filter: state.focused
          ? keyboardFocusFilter
          : highlighted
            ? "brightness(1.12) drop-shadow(0 0 13px rgba(83,226,255,.78))"
            : "drop-shadow(0 0 7px rgba(42,103,255,.46))",
        fontFamily: displayFont,
        fontSize: (value.length > 2 ? 49 : 60) * fontScale,
        lineHeight: 1,
        letterSpacing: value.length > 2 ? "1px" : 0,
        textShadow: "2px 4px 0 #19284a, 0 4px 7px #000",
        cursor: "pointer",
        transform: state.pressed ? "scale(.955)" : "scale(1)",
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
          boxShadow="inset 0 0 22px #000"
        />
      )}
      <span style={{ position: "relative", zIndex: 1 }}>
        {direction ? <KeyboardArrow direction={direction} /> : value}
      </span>
    </button>
  );
}

function shortcutDirection(value: string): Binding["keyboardDirection"] {
  if (value === "Left arrow") return "left";
  if (value === "Right arrow") return "right";
  if (value === "Up arrow") return "up";
  if (value === "Down arrow") return "down";
  return undefined;
}

function formatShortcut(key: string) {
  const labels: Record<string, string> = {
    ArrowLeft: "Left arrow",
    ArrowRight: "Right arrow",
    ArrowUp: "Up arrow",
    ArrowDown: "Down arrow",
    " ": "Space",
    Escape: "Esc",
    Enter: "Enter",
    Backspace: "Backspace",
    Delete: "Delete",
    Tab: "Tab",
  };

  return labels[key] ?? (key.length === 1 ? key.toLocaleUpperCase() : key);
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

function InputLabel({ children }: { children: string }) {
  const { fontScale } = useFontScale();
  const labelScale = children.length >= 7 ? dynamicTypeScale(fontScale, "control") : fontScale;

  return (
    <div
      role="rowheader"
      style={{
        minWidth: 0,
        paddingLeft: 18,
        color: "#f5f5f8",
        fontFamily: displayFont,
        fontSize: 54 * labelScale,
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
