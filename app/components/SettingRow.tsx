import type { ReactNode, HTMLAttributes } from "react";
import { displayFont } from "./styles";
import { useFontScale } from "./FontScale";

export const settingsRowHeight = 159;

export function SettingRow({
  label,
  labelId,
  labelProps,
  children,
  first = false,
  rowHeight,
}: {
  label: ReactNode;
  labelId?: string;
  labelProps?: HTMLAttributes<HTMLDivElement>;
  children: ReactNode;
  first?: boolean;
  rowHeight?: number;
}) {
  const { fontScale } = useFontScale();
  const usesLargeLayout = fontScale > 1;
  const resolvedRowHeight = rowHeight ?? settingsRowHeight;

  return (
    <div
      style={{
        boxSizing: "border-box",
        minHeight: usesLargeLayout ? resolvedRowHeight * fontScale : resolvedRowHeight,
        display: "grid",
        gridTemplateColumns: usesLargeLayout ? "1fr" : "422px 1fr",
        gridTemplateRows: usesLargeLayout ? "auto auto" : undefined,
        alignItems: "center",
        gap: usesLargeLayout ? 18 : undefined,
        padding: usesLargeLayout ? "24px 18px 28px" : undefined,
        borderTop: first ? 0 : "2px solid rgba(43,74,123,.25)",
      }}
    >
      <div
        id={labelId}
        {...labelProps}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          minWidth: 0,
          height: usesLargeLayout ? "auto" : "100%",
          paddingLeft: usesLargeLayout ? 0 : 18,
          color: "#f5f5f8",
          fontFamily: displayFont,
          fontSize: 61 * fontScale,
          lineHeight: 0.92,
          letterSpacing: "1.3px",
          textTransform: "uppercase",
          textShadow: "2px 4px 0 #182b4d, 0 5px 7px #000",
          transform: usesLargeLayout ? "none" : "scaleX(1.045)",
          transformOrigin: "left center",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
