import { displayFont } from "./styles";
import { dynamicTypeScale, useFontScale } from "./FontScale";

export type DPadDirection = "left" | "right" | "up" | "down";

const dPadCells: Array<{ direction: DPadDirection | "center"; left: number; top: number }> = [
  { direction: "up", left: 29, top: 0 },
  { direction: "left", left: 0, top: 29 },
  { direction: "center", left: 29, top: 29 },
  { direction: "right", left: 58, top: 29 },
  { direction: "down", left: 29, top: 58 },
];

export function DPadIcon({ direction }: { direction: DPadDirection }) {
  const { fontScale } = useFontScale();
  const controlScale = dynamicTypeScale(fontScale, "control");

  return (
    <div
      aria-label={`D-pad ${direction}`}
      role="img"
      style={{
        position: "relative",
        width: 87,
        height: 87,
        filter: "drop-shadow(0 5px 4px #000)",
        transform: `scale(${controlScale})`,
        transformOrigin: "center",
      }}
    >
      {dPadCells.map((cell) => {
        const active = cell.direction === direction;
        return (
          <span
            key={cell.direction}
            style={{
              position: "absolute",
              left: cell.left,
              top: cell.top,
              boxSizing: "border-box",
              width: 29,
              height: 29,
              border: `2px solid ${active ? "#a8ffff" : "#78808c"}`,
              borderRadius: 5,
              background: active
                ? "linear-gradient(145deg, #40f7ff, #05bfd8)"
                : "linear-gradient(145deg, #202a36, #080d15)",
              boxShadow: active
                ? "inset 0 0 7px rgba(255,255,255,.65), 0 0 8px #13ddff"
                : "inset 0 0 7px #000, 0 0 0 2px rgba(0,0,0,.75)",
            }}
          />
        );
      })}
    </div>
  );
}

export function ControllerButton({
  label,
  color,
}: {
  label: "A" | "Y" | "menu";
  color: "green" | "yellow" | "gray";
}) {
  const { fontScale } = useFontScale();
  const controlScale = dynamicTypeScale(fontScale, "control");
  const palette = {
    green: {
      border: "#a7ff35",
      background: "radial-gradient(circle, #65bd14 0 55%, #237000 58% 100%)",
      shadow: "#72e71c",
    },
    yellow: {
      border: "#fff5a6",
      background: "radial-gradient(circle, #ffca15 0 55%, #c27a00 58% 100%)",
      shadow: "#ffb000",
    },
    gray: {
      border: "#777b80",
      background: "radial-gradient(circle, #34373b 0 55%, #121416 58% 100%)",
      shadow: "#08090b",
    },
  }[color];

  return (
    <div
      aria-label={label === "menu" ? "Menu button" : `${label} button`}
      role="img"
      style={{
        boxSizing: "border-box",
        width: 78 * controlScale,
        height: 78 * controlScale,
        display: "grid",
        placeItems: "center",
        border: `3px solid ${palette.border}`,
        borderRadius: "50%",
        color: "#f8f8f5",
        background: palette.background,
        boxShadow: `inset 0 0 0 5px rgba(0,0,0,.28), 0 0 13px ${palette.shadow}, 0 5px 6px #000`,
        fontFamily: displayFont,
        fontSize: (label === "menu" ? 54 : 57) * controlScale,
        lineHeight: 1,
        textShadow: "1px 3px 0 #20242a",
      }}
    >
      {label === "menu" ? "≡" : label}
    </div>
  );
}
