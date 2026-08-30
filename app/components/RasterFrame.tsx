import type { CSSProperties } from "react";
import Image from "next/image";

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

export function SettingsTabRasterFrame({ active }: { active: boolean }) {
  return (
    <span style={{ position: "absolute", zIndex: 0, inset: -12, pointerEvents: "none" }}>
      <NineSliceFrame
        source={active ? "settings-tab-active.png" : "settings-tab-inactive.png"}
        slice={[60, 84, 36, 84]}
        width={[30, 42, 18, 42]}
      />
    </span>
  );
}

const rasterPartStyle: CSSProperties = {
  position: "absolute",
  zIndex: 0,
  pointerEvents: "none",
};

export function CheckboxRasterParts({ checked }: { checked: boolean }) {
  return (
    <span aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 1 }}>
      <Image
        alt=""
        src={`${generatedAssetRoot}/checkbox-unchecked.png`}
        width={202}
        height={202}
        unoptimized
        style={{ ...rasterPartStyle, left: -12, top: -12, width: 101, height: 101 }}
      />
      {checked && (
        <Image
          alt=""
          src={`${generatedAssetRoot}/checkbox-check.png`}
          width={202}
          height={202}
          unoptimized
          style={{ ...rasterPartStyle, left: -12, top: -12, width: 101, height: 101 }}
        />
      )}
    </span>
  );
}

export function VolumeSliderRasterParts({ value }: { value: number }) {
  return (
    <span aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <Image
        alt=""
        src={`${generatedAssetRoot}/volume-slider-track.png`}
        width={616}
        height={176}
        unoptimized
        style={{ ...rasterPartStyle, left: -12, top: -12, width: 308, height: 88 }}
      />
      <span
        style={{
          position: "absolute",
          zIndex: 1,
          left: 3,
          top: 22,
          width: (278 * value) / 100,
          height: 20,
          borderRadius: 4,
          boxShadow: "0 0 8px rgba(45,132,255,.8)",
        }}
      >
        <Image
          alt=""
          src={`${generatedAssetRoot}/volume-slider-fill.png`}
          width={556}
          height={40}
          unoptimized
          style={{ ...rasterPartStyle, inset: 0, width: "100%", height: 20 }}
        />
      </span>
      <Image
        alt=""
        src={`${generatedAssetRoot}/volume-slider-ticks.png`}
        width={568}
        height={20}
        unoptimized
        style={{ ...rasterPartStyle, left: 0, top: 49, width: 284, height: 10 }}
      />
      <Image
        alt=""
        src={`${generatedAssetRoot}/volume-slider-handle.png`}
        width={136}
        height={176}
        unoptimized
        style={{
          ...rasterPartStyle,
          zIndex: 2,
          left: `calc(${value}% - 33px)`,
          top: -12,
          width: 68,
          height: 88,
        }}
      />
    </span>
  );
}

export function ActionLabelRaster({ label }: { label: string }) {
  const filename = label.toLowerCase();
  return (
    <Image
      aria-hidden="true"
      alt=""
      src={`${generatedAssetRoot}/action-label-${filename}.png`}
      width={960}
      height={292}
      unoptimized
      style={{
        position: "absolute",
        zIndex: 1,
        left: "50%",
        top: "50%",
        width: 480,
        height: 146,
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
      }}
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
