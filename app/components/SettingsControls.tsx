import type { CSSProperties, ReactNode } from "react";
import { impactFont, mergeStyles } from "./styles";
import { useInteraction } from "./useInteraction";
import { useViewport } from "./useViewport";

type ControlProps = {
  label: string;
  first?: boolean;
};

export function SelectControl({
  label,
  options,
  value,
  onChange,
  first = false,
}: ControlProps & { options: string[]; value: string; onChange: (value: string) => void }) {
  const { state, handlers } = useInteraction();
  const { mobile } = useViewport();

  return (
    <SettingRow first={first} label={<SettingName>{label}</SettingName>}>
      <span
        style={mergeStyles(cellStyle, {
          position: "relative",
          padding: mobile ? "7px 10px" : "7px 18px",
        })}
      >
        <select
          {...handlers}
          aria-label={label}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          style={{
            boxSizing: "border-box",
            width: "100%",
            height: "100%",
            minHeight: 42,
            appearance: "none",
            border: "2px solid transparent",
            borderRadius: 2,
            padding: mobile ? "0 32px 0 10px" : "0 48px 0 20px",
            color: "#eff5ff",
            background:
              "linear-gradient(180deg, #07142e, #020718) padding-box, linear-gradient(105deg, #57ecff, #b6d8ff 48%, #ff43cf) border-box",
            boxShadow: "inset 0 0 17px rgb(0 0 0 / 75%), 0 0 10px rgb(89 114 255 / 34%)",
            fontFamily: impactFont,
            fontSize: mobile ? "clamp(1rem, 4.6vw, 1.35rem)" : "clamp(1.25rem, 3.4vh, 2rem)",
            textShadow: "2px 3px 0 #19325d, 0 3px 4px #000",
            cursor: "pointer",
            outline: 0,
            filter:
              state.hovered || state.focused
                ? "brightness(1.18) drop-shadow(0 0 5px rgb(66 222 255 / 70%))"
                : undefined,
          }}
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            right: mobile ? 19 : 34,
            width: 0,
            height: 0,
            borderInline: "8px solid transparent",
            borderTop: "10px solid #e8f1ff",
            pointerEvents: "none",
            filter: "drop-shadow(0 2px 2px #000)",
          }}
        />
      </span>
    </SettingRow>
  );
}

export function ToggleControl({
  checked,
  label,
  onChange,
  withInfo = false,
}: ControlProps & { checked: boolean; onChange: (checked: boolean) => void; withInfo?: boolean }) {
  const { state, handlers } = useInteraction();
  const { mobile } = useViewport();

  return (
    <SettingRow
      label={
        <SettingName withInfo={withInfo}>
          {label}
          {withInfo && <InfoBadge />}
        </SettingName>
      }
    >
      <label
        {...handlers}
        style={mergeStyles(cellStyle, {
          padding: mobile ? "7px 10px" : "7px 18px",
          cursor: "pointer",
        })}
      >
        <input
          aria-label={label}
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          type="checkbox"
          style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
        />
        <span
          aria-hidden="true"
          style={{
            position: "relative",
            boxSizing: "border-box",
            width: "clamp(38px, 5.8vh, 50px)",
            aspectRatio: "1",
            border: `3px solid ${state.focused || state.hovered ? "#fff" : "#459bff"}`,
            borderRadius: 5,
            background: "#061126",
            boxShadow: "inset 0 0 12px #000, 0 0 9px rgb(48 130 255 / 70%)",
            filter:
              state.focused || state.hovered
                ? "brightness(1.22) drop-shadow(0 0 7px #00eaff)"
                : undefined,
            transform: state.pressed ? "scale(0.92)" : undefined,
          }}
        >
          {checked && (
            <span
              style={{
                position: "absolute",
                left: "23%",
                top: "4%",
                width: "38%",
                height: "65%",
                boxSizing: "border-box",
                border: "solid #6ff6ff",
                borderWidth: "0 5px 5px 0",
                transform: "rotate(42deg)",
                filter: "drop-shadow(0 0 5px #21c9ff)",
              }}
            />
          )}
        </span>
      </label>
    </SettingRow>
  );
}

export function EraseControl() {
  const { state, handlers } = useInteraction();
  const { mobile } = useViewport();

  return (
    <SettingRow label={<SettingName>Erase Saved Data</SettingName>}>
      <span style={mergeStyles(cellStyle, { padding: mobile ? "7px 10px" : "7px 18px" })}>
        <button
          {...handlers}
          type="button"
          style={{
            boxSizing: "border-box",
            width: mobile ? "100%" : undefined,
            minWidth: mobile ? 0 : "clamp(118px, 18vw, 158px)",
            height: "clamp(42px, 6.2vh, 52px)",
            border: "3px solid #ff3153",
            padding: mobile ? "0 10px" : "0 20px",
            color: state.hovered || state.focused ? "#fff" : "#ff4565",
            clipPath: "polygon(8% 0, 92% 0, 100% 20%, 100% 80%, 92% 100%, 8% 100%, 0 80%, 0 20%)",
            background: "linear-gradient(180deg, #29101b, #100610)",
            boxShadow:
              "inset 0 0 0 4px #12050c, inset 0 0 0 6px #861528, 0 0 10px rgb(255 35 77 / 58%)",
            fontFamily: impactFont,
            fontSize: "clamp(1.25rem, 3.4vh, 2rem)",
            cursor: "pointer",
            outline: 0,
            filter:
              state.hovered || state.focused
                ? "brightness(1.25) drop-shadow(0 0 7px #ff244c)"
                : undefined,
            transform: state.pressed ? "translateY(2px) scale(0.96)" : undefined,
          }}
        >
          Erase
        </button>
      </span>
    </SettingRow>
  );
}

function SettingRow({
  first = false,
  label,
  children,
}: {
  first?: boolean;
  label: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        boxSizing: "border-box",
        minHeight: 0,
        display: "grid",
        gridTemplateColumns: "52% 48%",
        alignItems: "stretch",
        borderTop: first ? "1px solid rgb(59 106 173 / 72%)" : undefined,
        borderBottom: "1px solid rgb(59 106 173 / 72%)",
        color: "#f4f8ff",
      }}
    >
      {label}
      {children}
    </div>
  );
}

function SettingName({ children, withInfo = false }: { children: ReactNode; withInfo?: boolean }) {
  const { mobile } = useViewport();
  return (
    <span
      style={{
        position: withInfo ? "relative" : undefined,
        display: "flex",
        minWidth: 0,
        alignItems: "center",
        gap: 10,
        padding: withInfo
          ? mobile
            ? "0 38px 0 10px"
            : "0 54px 0 18px"
          : mobile
            ? "0 10px"
            : "0 18px",
        fontFamily: impactFont,
        fontSize: withInfo
          ? mobile
            ? "clamp(0.76rem, 3.1vw, 0.9rem)"
            : "clamp(1rem, 2.6vh, 1.5rem)"
          : mobile
            ? "clamp(0.9rem, 3.8vw, 1.25rem)"
            : "clamp(1.12rem, 3.05vh, 1.75rem)",
        lineHeight: withInfo && mobile ? 0.92 : 0.95,
        letterSpacing: "0.025em",
        textTransform: "uppercase",
        textShadow: "2px 3px 0 #1b3156, 0 3px 5px #000",
      }}
    >
      {children}
    </span>
  );
}

function InfoBadge() {
  const { mobile } = useViewport();
  return (
    <span
      aria-label="Crash reports help us diagnose unexpected errors"
      role="img"
      title="Crash reports help us diagnose unexpected errors"
      style={{
        position: "absolute",
        right: mobile ? 4 : 10,
        flex: "0 0 auto",
        boxSizing: "border-box",
        width: mobile ? 24 : "clamp(27px, 4.2vh, 37px)",
        aspectRatio: "1",
        display: "grid",
        placeItems: "center",
        border: "2px solid #75c9ff",
        borderRadius: "50%",
        color: "#fff",
        fontFamily: "Georgia, serif",
        fontSize: mobile ? 12 : "0.75em",
        fontStyle: "italic",
        textTransform: "none",
        boxShadow: "0 0 9px #286fff, inset 0 0 9px rgb(17 69 166 / 72%)",
      }}
    >
      i
    </span>
  );
}

const cellStyle: CSSProperties = {
  boxSizing: "border-box",
  minWidth: 0,
  display: "flex",
  alignItems: "center",
  borderLeft: "1px solid rgb(59 106 173 / 72%)",
};
