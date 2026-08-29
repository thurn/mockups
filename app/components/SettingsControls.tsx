import type { ReactNode } from "react";
import { displayFont } from "./styles";

type BaseProps = { label: ReactNode; first?: boolean };

export function SelectControl({ label, options, value, onChange, first = false }: BaseProps & { options: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <SettingRow first={first} label={label}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", height: "100%" }}>
        <select
          aria-label={String(label)}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          style={{
            boxSizing: "border-box",
            width: 397,
            height: 107,
            appearance: "none",
            border: "3px solid transparent",
            borderRadius: 2,
            padding: "0 74px 0 36px",
            outline: 0,
            color: "#f5f6fb",
            background: "linear-gradient(180deg, #050b1c, #020611) padding-box, linear-gradient(106deg, #5df5ff, #a5cbff 48%, #ff4bc9) border-box",
            boxShadow: "inset 0 0 24px #000, 0 0 12px rgba(42,103,255,.26)",
            fontFamily: "'Barlow Condensed', Impact, sans-serif",
            fontWeight: 700,
            fontSize: 60,
            lineHeight: 1,
            textShadow: "2px 4px 0 #19284a, 0 4px 7px #000",
            cursor: "pointer",
          }}
        >
          {options.map((option) => <option key={option}>{option}</option>)}
        </select>
        <span aria-hidden="true" style={{ position: "absolute", right: 31, width: 0, height: 0, borderLeft: "15px solid transparent", borderRight: "15px solid transparent", borderTop: "18px solid #f4f5fa", filter: "drop-shadow(0 3px 2px #000)", pointerEvents: "none" }} />
      </div>
    </SettingRow>
  );
}

export function ToggleControl({ checked, label, ariaLabel, onChange, withInfo = false }: BaseProps & { checked: boolean; ariaLabel?: string; onChange: (checked: boolean) => void; withInfo?: boolean }) {
  return (
    <SettingRow label={<>{label}{withInfo && <InfoBadge />}</>}>
      <label style={{ display: "flex", alignItems: "center", height: "100%", cursor: "pointer" }}>
        <input suppressHydrationWarning aria-label={ariaLabel ?? String(label)} checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" style={{ position: "absolute", width: 1, height: 1, opacity: 0 }} />
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
      <button type="button" style={{ boxSizing: "border-box", width: 362, height: 114, marginLeft: 15, border: "4px solid #ff355e", clipPath: "polygon(5% 0, 95% 0, 100% 15%, 100% 85%, 95% 100%, 5% 100%, 0 85%, 0 15%)", color: "#ff3553", background: "radial-gradient(ellipse at 50% 45%, #200511, #07030c 67%, #020208)", boxShadow: "inset 0 0 22px #000, 0 0 15px rgba(255,20,78,.5)", fontFamily: "'Barlow Condensed', Impact, sans-serif", fontWeight: 700, fontSize: 67, textShadow: "0 0 11px rgba(255,25,76,.55)", cursor: "pointer" }}>
        Erase
      </button>
    </SettingRow>
  );
}

function SettingRow({ label, children, first = false, last = false }: BaseProps & { children: ReactNode; last?: boolean }) {
  return (
    <div style={{ boxSizing: "border-box", height: last ? 168 : 159, display: "grid", gridTemplateColumns: "421px 1fr", alignItems: "center", borderTop: first ? 0 : "2px solid rgba(43,74,123,.25)" }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", minWidth: 0, height: "100%", paddingLeft: 18, color: "#f5f5f8", fontFamily: displayFont, fontSize: 61, lineHeight: 0.92, letterSpacing: "1.3px", textTransform: "uppercase", textShadow: "2px 4px 0 #182b4d, 0 5px 7px #000" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function CheckMark() {
  return <span style={{ position: "absolute", left: 21, top: 12, width: 25, height: 43, border: "solid #61f1ff", borderWidth: "0 8px 8px 0", transform: "rotate(40deg)", filter: "drop-shadow(0 0 7px #128dff)" }} />;
}

function InfoBadge() {
  return (
    <span aria-label="Crash reports help diagnose errors" title="Crash reports help diagnose errors" style={{ position: "absolute", left: 193, bottom: 19, boxSizing: "border-box", width: 58, height: 58, display: "grid", placeItems: "center", border: "3px solid #55b8ff", borderRadius: "50%", color: "#bcf4ff", fontFamily: "Georgia, serif", fontSize: 39, fontStyle: "normal", fontWeight: 700, lineHeight: 1, textTransform: "lowercase", boxShadow: "0 0 11px #155eff, inset 0 0 10px rgba(13,76,180,.8)" }}>
      i
    </span>
  );
}
