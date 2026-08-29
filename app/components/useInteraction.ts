'use client';

import { useState } from 'react';

export function useInteraction() {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);

  return {
    state: { hovered, focused, pressed },
    handlers: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => { setHovered(false); setPressed(false); },
      onFocus: () => setFocused(true),
      onBlur: () => { setFocused(false); setPressed(false); },
      onPointerDown: () => setPressed(true),
      onPointerUp: () => setPressed(false),
    },
  };
}
