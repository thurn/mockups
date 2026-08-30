"use client";

import { useRef, useState, type FocusEvent, type KeyboardEvent } from "react";

const defaultPressKeys = ["Enter", " "];

export function useInteraction({
  pressKeys = defaultPressKeys,
}: { pressKeys?: readonly string[] } = {}) {
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
      onFocus: (event: FocusEvent<HTMLElement>) =>
        setFocused(event.currentTarget.matches(":focus-visible")),
      onBlur: () => {
        setFocused(false);
        cancelPress();
      },
      onPointerDown: () => {
        setFocused(false);
        beginPress();
      },
      onPointerUp: releasePress,
      onPointerCancel: cancelPress,
      onKeyDown: (event: KeyboardEvent) => {
        if (event.key !== "Tab" && !event.metaKey && !event.ctrlKey && !event.altKey)
          setFocused(true);
        if (!event.repeat && pressKeys.includes(event.key)) beginPress();
      },
      onKeyUp: (event: KeyboardEvent) => {
        if (pressKeys.includes(event.key)) releasePress();
      },
    },
  };
}
