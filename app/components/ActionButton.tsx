"use client";

import type { ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { ArcadeButtonEffect } from "./ArcadeButtonEffect";
import { actionInnerClip, actionOuterClip, ClippedInset } from "./ClippedInset";
import { useInteraction } from "./useInteraction";
import {
  ControlInteraction,
  keyboardFocusFilter,
  keyboardFocusGradient,
} from "./ControlInteraction";

export function ActionButton({
  children,
  disabled = false,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const { state, handlers } = useInteraction();
  const reduceMotion = useReducedMotion();
  const highlighted = state.hovered || state.focused;

  return (
    <span
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "block",
        overflow: "visible",
      }}
    >
      <button
        {...handlers}
        disabled={disabled}
        onClick={disabled ? undefined : onClick}
        type="button"
        style={{
          position: "relative",
          boxSizing: "border-box",
          width: "100%",
          height: "100%",
          display: "grid",
          placeItems: "center",
          border: 0,
          padding: 0,
          clipPath: actionOuterClip,
          color: "transparent",
          outline: 0,
          background: state.focused
            ? keyboardFocusGradient
            : highlighted
              ? "linear-gradient(110deg, #fff, #70d7ff 22%, #c0b6ff 56%, #ff73da 90%)"
              : "linear-gradient(110deg, #b9fbff, #3bb9ff 22%, #a49cff 56%, #ff4bd1 90%)",
          filter: state.focused
            ? keyboardFocusFilter
            : state.pressed
              ? "brightness(.82) drop-shadow(0 0 8px rgba(58,154,255,.65))"
              : highlighted
                ? "brightness(1.12) drop-shadow(0 0 16px rgba(118,182,255,.88))"
                : "drop-shadow(0 0 10px rgba(58,154,255,.65))",
          cursor: disabled ? "default" : "pointer",
          transform: `scale(${state.pressed && !reduceMotion ? 0.955 : 1})`,
          transition:
            "transform 90ms cubic-bezier(.2,.8,.2,1), filter 140ms ease, background 140ms ease",
          font: "inherit",
        }}
      >
        <ClippedInset
          inset={6}
          clipPath={actionInnerClip}
          background="linear-gradient(180deg, #071027, #020613)"
          boxShadow="inset 0 0 0 4px #071127, inset 0 0 27px #000"
        />
        <span
          style={{
            position: "relative",
            zIndex: 1,
            display: "inline-block",
            paddingRight: ".12em",
            color: "transparent",
            background:
              "linear-gradient(174deg, #fff 5%, #dff8ff 31%, #52baff 49%, #f8faff 57%, #806eff 77%, #ff6dda 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            WebkitTextStroke: "1px #f7ffff",
            fontFamily: "'Barlow Condensed', Impact, sans-serif",
            fontSize: 91,
            fontStyle: "italic",
            fontWeight: 800,
            lineHeight: 0.9,
            letterSpacing: "-2px",
            transform: "translateY(-1px) skewX(-5deg)",
            filter: "drop-shadow(3px 5px 0 #122964) drop-shadow(0 7px 5px #000)",
          }}
        >
          {children}
        </span>
        <ControlInteraction active={highlighted} clipPath={actionInnerClip} inset={6} />
      </button>
      <ArcadeButtonEffect burstId={state.releaseCount} />
    </span>
  );
}
