import {
  frameBorderThickness,
  frameClip,
  frameMetalGradient,
  frameOuterBottom,
  frameOuterInset,
} from "./styles";

export function ConceptFrame() {
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <FrameLayer inset={frameOuterInset} thickness={frameBorderThickness} opacity={1} />
    </div>
  );
}

function FrameLayer({
  inset,
  thickness,
  opacity,
  bottom,
}: {
  inset: number;
  thickness: number;
  opacity: number;
  bottom?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: inset,
        left: inset,
        right: inset,
        bottom: bottom ?? frameOuterBottom + inset - frameOuterInset,
        padding: thickness,
        boxSizing: "border-box",
        clipPath: frameClip,
        background: frameMetalGradient,
        opacity,
        filter:
          inset === frameOuterInset
            ? "drop-shadow(0 0 10px rgba(54,157,255,.7)) drop-shadow(0 0 9px rgba(255,42,192,.38))"
            : undefined,
      }}
    >
      <div style={{ width: "100%", height: "100%", clipPath: frameClip, background: "#020713" }} />
    </div>
  );
}
