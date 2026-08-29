import type { ReactNode } from "react";
import { displayFont } from "./styles";
import { actionInnerClip, actionOuterClip, ClippedInset, controlInnerClip, controlOuterClip } from "./ClippedInset";

type BaseProps = { label: ReactNode; first?: boolean; offsetY?: number; rowHeight?: number };

export function SelectControl({ label, options, value, onChange, first = false, offsetY = 0 }: BaseProps & { options: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <SettingRow first={first} label={label} rowHeight={158}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", height: "100%", transform: `translateY(${offsetY}px)` }}>
        <div
          aria-hidden="true"
          style={{
            position: "relative",
            boxSizing: "border-box",
            width: 396,
            height: 106,
            display: "flex",
            alignItems: "center",
            clipPath: controlOuterClip,
            padding: "0 74px 0 39px",
            color: "#f5f6fb",
            background: "linear-gradient(106deg, #5df5ff, #a5cbff 48%, #ff4bc9)",
            filter: "drop-shadow(0 0 6px rgba(42,103,255,.38))",
            fontFamily: "'Barlow Condensed', Impact, sans-serif",
            fontWeight: 700,
            fontSize: 60,
            lineHeight: 1,
            textShadow: "2px 4px 0 #19284a, 0 4px 7px #000",
            pointerEvents: "none",
          }}
        >
          <ClippedInset inset={3} clipPath={controlInnerClip} background="linear-gradient(180deg, #050b1c, #020611)" boxShadow="inset 0 0 24px #000" />
          <span style={{ position: "relative", zIndex: 1 }}>{value}</span>
        </div>
        <select
          aria-label={String(label)}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            zIndex: 3,
            width: 396,
            height: 106,
            appearance: "none",
            border: 0,
            padding: 0,
            outline: 0,
            opacity: 0,
            cursor: "pointer",
            transform: "translateY(-50%)",
          }}
        >
          {options.map((option) => <option key={option}>{option}</option>)}
        </select>
        <span aria-hidden="true" style={{ position: "absolute", right: 45, width: 0, height: 0, borderLeft: "15px solid transparent", borderRight: "15px solid transparent", borderTop: "18px solid #f4f5fa", filter: "drop-shadow(0 3px 2px #000)", pointerEvents: "none" }} />
      </div>
    </SettingRow>
  );
}

export function ToggleControl({ checked, label, ariaLabel, onChange, withInfo = false, rowHeight = 159, offsetY = 0 }: BaseProps & { checked: boolean; ariaLabel?: string; onChange: (checked: boolean) => void; withInfo?: boolean }) {
  return (
    <SettingRow label={<>{label}{withInfo && <InfoBadge />}</>} rowHeight={rowHeight}>
      <label style={{ position: "relative", display: "flex", alignItems: "center", width: 77, height: 77, marginLeft: 8, cursor: "pointer", transform: `translateY(${offsetY}px)` }}>
        <input suppressHydrationWarning aria-label={ariaLabel ?? String(label)} checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" style={{ position: "absolute", inset: 0, zIndex: 2, width: 77, height: 77, margin: 0, opacity: 0, cursor: "pointer" }} />
        <span aria-hidden="true" style={{ position: "relative", boxSizing: "border-box", width: 77, height: 77, border: "4px solid #4ba3ff", borderRadius: 11, background: "linear-gradient(180deg, #06142b, #02091a)", boxShadow: "inset 0 0 14px #000, 0 0 10px #166cff, 0 0 5px #6af6ff" }}>
          {checked && <CheckMark />}
        </span>
      </label>
    </SettingRow>
  );
}

export function EraseControl() {
  return (
    <SettingRow label="Erase Saved Data" last>
      <button type="button" style={{ position: "relative", boxSizing: "border-box", width: 362, height: 114, marginLeft: 21, display: "grid", placeItems: "center", border: 0, padding: 0, clipPath: actionOuterClip, color: "#ff3553", background: "#ff355e", filter: "drop-shadow(0 0 9px rgba(255,20,78,.55))", fontFamily: "'Barlow Condensed', Impact, sans-serif", fontWeight: 700, fontSize: 67, textShadow: "0 0 11px rgba(255,25,76,.55)", cursor: "pointer", transform: "translateY(-8px)" }}>
        <ClippedInset inset={4} clipPath={actionInnerClip} background="radial-gradient(ellipse at 50% 45%, #200511, #07030c 67%, #020208)" boxShadow="inset 0 0 22px #000" />
        <span style={{ position: "relative", zIndex: 1, lineHeight: 0.9, transform: "translateY(-1px)" }}>ERASE</span>
      </button>
    </SettingRow>
  );
}

function SettingRow({ label, children, first = false, last = false, rowHeight }: BaseProps & { children: ReactNode; last?: boolean }) {
  return (
    <div style={{ boxSizing: "border-box", height: rowHeight ?? (last ? 169 : 159), display: "grid", gridTemplateColumns: "422px 1fr", alignItems: "center", borderTop: first ? 0 : "2px solid rgba(43,74,123,.25)" }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", minWidth: 0, height: "100%", paddingLeft: 18, color: "#f5f5f8", fontFamily: displayFont, fontSize: 61, lineHeight: 0.92, letterSpacing: "1.3px", textTransform: "uppercase", textShadow: "2px 4px 0 #182b4d, 0 5px 7px #000", transform: "scaleX(1.045)", transformOrigin: "left center" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function CheckMark() {
  return <span style={{ position: "absolute", left: "50%", top: "50%", width: 50, height: 44, clipPath: "polygon(0 47%, 14% 32%, 35% 58%, 85% 0, 100% 14%, 35% 100%)", background: "#61f1ff", transform: "translate(-50%, -50%)", filter: "drop-shadow(0 0 7px #128dff)" }} />;
}

function InfoBadge() {
  return (
    <span aria-label="Crash reports help diagnose errors" title="Crash reports help diagnose errors" style={{ position: "absolute", left: 201, bottom: 25, boxSizing: "border-box", width: 58, height: 58, display: "grid", placeItems: "center", border: "3px solid #55b8ff", borderRadius: "50%", color: "#bcf4ff", fontFamily: "Georgia, serif", fontSize: 39, fontStyle: "normal", fontWeight: 700, lineHeight: 1, textTransform: "lowercase", boxShadow: "0 0 11px #155eff, inset 0 0 10px rgba(13,76,180,.8)", transform: "scaleX(.957)" }}>
      i
    </span>
  );
}
