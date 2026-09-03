"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { mergeProps, useFocusRing, useLink, type AriaLinkOptions } from "react-aria";

export function AriaLink({
  children,
  style,
  ...props
}: AriaLinkOptions & { children: ReactNode; style?: CSSProperties }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { linkProps } = useLink(props, ref);
  const { focusProps, isFocusVisible } = useFocusRing();
  return (
    <a
      {...mergeProps(props, linkProps, focusProps)}
      ref={ref}
      style={{ ...style, outline: isFocusVisible ? "3px solid #fff400" : undefined }}
    >
      {children}
    </a>
  );
}
