import type { ReactNode } from "react";
import { displayFont } from "./styles";

export const settingsRowHeight = 159;

export function SettingRow({
  label,
  labelId,
  children,
  first = false,
  rowHeight,
}: {
  label: ReactNode;
  labelId?: string;
  children: ReactNode;
  first?: boolean;
  rowHeight?: number;
}) {
  return (
    <div
      style={{
        boxSizing: "border-box",
        height: rowHeight ?? settingsRowHeight,
        display: "grid",
        gridTemplateColumns: "422px 1fr",
        alignItems: "center",
        borderTop: first ? 0 : "2px solid rgba(43,74,123,.25)",
      }}
    >
      <div
        id={labelId}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          minWidth: 0,
          height: "100%",
          paddingLeft: 18,
          color: "#f5f5f8",
          fontFamily: displayFont,
          fontSize: 61,
          lineHeight: 0.92,
          letterSpacing: "1.3px",
          textTransform: "uppercase",
          textShadow: "2px 4px 0 #182b4d, 0 5px 7px #000",
          transform: "scaleX(1.045)",
          transformOrigin: "left center",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
