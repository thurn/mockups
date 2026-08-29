import { frameClip, frameMetalGradient } from "./styles";

export function ConceptFrame() {
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <FrameLayer inset={21} thickness={8} opacity={1} />
      <FrameLayer inset={30} thickness={3} opacity={0.82} />
      <FrameLayer inset={39} thickness={3} opacity={0.54} />
      <div style={{ position: "absolute", top: 55, bottom: 121, left: 50, right: 50, clipPath: frameClip, border: "2px solid rgba(80,121,201,.45)", boxShadow: "inset 0 0 18px #000, 0 0 7px rgba(60,126,255,.22)" }} />
    </div>
  );
}

function FrameLayer({ inset, thickness, opacity }: { inset: number; thickness: number; opacity: number }) {
  return (
    <div
      style={{
        position: "absolute",
        top: inset,
        left: inset,
        right: inset,
        bottom: 111 + inset - 21,
        padding: thickness,
        boxSizing: "border-box",
        clipPath: frameClip,
        background: frameMetalGradient,
        opacity,
        filter: inset === 21 ? "drop-shadow(0 0 10px rgba(54,157,255,.7)) drop-shadow(0 0 9px rgba(255,42,192,.38))" : undefined,
      }}
    >
      <div style={{ width: "100%", height: "100%", clipPath: frameClip, background: "#020713" }} />
    </div>
  );
}
