"use client";

import type { ReactNode } from "react";
import { VisuallyHidden } from "react-aria";

export function ScreenReaderOnly({ children, id }: { children: ReactNode; id?: string }) {
  return <VisuallyHidden id={id}>{children}</VisuallyHidden>;
}
