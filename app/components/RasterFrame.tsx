import type { CSSProperties } from "react";

const generatedAssetRoot = "/generated-ui";

function NineSliceFrame({
  source,
  slice,
  width,
}: {
  source: string;
  slice: [number, number, number, number];
  width: [number, number, number, number];
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        zIndex: 0,
        inset: 0,
        boxSizing: "border-box",
        display: "block",
        borderStyle: "solid",
        borderWidth: `${width[0]}px ${width[1]}px ${width[2]}px ${width[3]}px`,
        borderImageSource: `url(${generatedAssetRoot}/${source})`,
        borderImageSlice: `${slice[0]} ${slice[1]} ${slice[2]} ${slice[3]} fill`,
        borderImageWidth: `${width[0]}px ${width[1]}px ${width[2]}px ${width[3]}px`,
        borderImageRepeat: "stretch",
        pointerEvents: "none",
      }}
    />
  );
}

export function ActionRasterFrame() {
  return (
    <NineSliceFrame
      source="action-button-frame.png"
      slice={[48, 52, 48, 52]}
      width={[24, 26, 24, 26]}
    />
  );
}

export function SmallControlRasterFrame() {
  return (
    <NineSliceFrame
      source="small-control-frame.png"
      slice={[30, 30, 30, 30]}
      width={[15, 15, 15, 15]}
    />
  );
}

export const fixedRasterImageStyle: CSSProperties = {
  position: "absolute",
  zIndex: 0,
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "fill",
  pointerEvents: "none",
};
