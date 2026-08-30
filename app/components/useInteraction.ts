"use client";

import { useRef, useState, type KeyboardEvent } from "react";

export function useInteraction() {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [releaseCount, setReleaseCount] = useState(0);
  const pressActive = useRef(false);

  const beginPress = () => {
    pressActive.current = true;
    setPressed(true);
  };

  const releasePress = () => {
    if (pressActive.current) {
      pressActive.current = false;
      setReleaseCount((count) => count + 1);
    }
    setPressed(false);
  };

  const cancelPress = () => {
    pressActive.current = false;
    setPressed(false);
  };

  return {
    state: { hovered, focused, pressed, releaseCount },
    handlers: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => {
        setHovered(false);
        cancelPress();
      },
      onFocus: () => setFocused(true),
      onBlur: () => {
        setFocused(false);
        cancelPress();
      },
      onPointerDown: beginPress,
      onPointerUp: releasePress,
      onPointerCancel: cancelPress,
      onKeyDown: (event: KeyboardEvent) => {
        if (!event.repeat && (event.key === "Enter" || event.key === " ")) beginPress();
      },
      onKeyUp: (event: KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") releasePress();
      },
    },
  };
}
