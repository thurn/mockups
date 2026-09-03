"use client";

import { useRef, type ReactNode } from "react";
import { mergeProps, useFocusable, useFocusRing, useKeyboard } from "react-aria";

export function ShortcutCapture({
  children,
  onKey,
}: {
  children: ReactNode;
  onKey: (key: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { focusableProps } = useFocusable({ autoFocus: true }, ref);
  const { focusProps, isFocusVisible } = useFocusRing();
  const { keyboardProps } = useKeyboard({
    onKeyDown(event) {
      // Tab reaches Cancel/Reset. Other keys, including Escape, can be bound
      // while this capture field is focused.
      if (event.key === "Tab" || ["Shift", "Control", "Alt", "Meta"].includes(event.key)) {
        event.continuePropagation();
        return;
      }
      event.preventDefault();
      if (!event.repeat) onKey(event.key);
    },
  });
  return (
    <div
      {...mergeProps(focusableProps, focusProps, keyboardProps)}
      ref={ref}
      role="group"
      aria-label="Keyboard shortcut capture"
      style={{ outline: isFocusVisible ? "3px solid #fff400" : "none", outlineOffset: 10 }}
    >
      {children}
    </div>
  );
}
