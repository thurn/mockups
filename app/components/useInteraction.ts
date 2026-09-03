"use client";

import { useEffect, useRef, useState } from "react";
import { mergeProps, useFocusRing, useHover } from "react-aria";

// Visual feedback only. Each control's React Aria hook owns its input behavior.
export function useInteraction({ isDisabled = false, isPressed = false, within = false } = {}) {
  const { hoverProps, isHovered } = useHover({ isDisabled });
  const { focusProps, isFocusVisible } = useFocusRing({ within });
  const [pressed, setPressed] = useState(false);
  const [releaseCount, setReleaseCount] = useState(0);

  const wasPressed = useRef(isPressed);
  useEffect(() => {
    if (wasPressed.current && !isPressed) setReleaseCount((count) => count + 1);
    wasPressed.current = isPressed;
  }, [isPressed]);

  return {
    state: { hovered: isHovered, focused: isFocusVisible, pressed, releaseCount },
    handlers: mergeProps(hoverProps, focusProps),
    pressProps: {
      onPressChange: setPressed,
      onPress: () => setReleaseCount((count) => count + 1),
    },
  };
}
