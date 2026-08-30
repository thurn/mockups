"use client";

import { useState, type KeyboardEvent } from "react";

export function useInteraction() {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [pressCount, setPressCount] = useState(0);

  const beginPress = () => {
    setPressed(true);
    setPressCount((count) => count + 1);
  };

  return {
    state: { hovered, focused, pressed, pressCount },
    handlers: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => {
        setHovered(false);
        setPressed(false);
      },
      onFocus: () => setFocused(true),
      onBlur: () => {
        setFocused(false);
        setPressed(false);
      },
      onPointerDown: beginPress,
      onPointerUp: () => setPressed(false),
      onPointerCancel: () => setPressed(false),
      onKeyDown: (event: KeyboardEvent) => {
        if (!event.repeat && (event.key === "Enter" || event.key === " ")) beginPress();
      },
      onKeyUp: (event: KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") setPressed(false);
      },
    },
  };
}
