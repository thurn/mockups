import type { CSSProperties } from "react";

export function ClippedInset({
  background,
  boxShadow,
  clipPath,
  inset,
}: {
  background: string;
  boxShadow?: string;
  clipPath: string;
  inset: number;
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        inset,
        zIndex: 0,
        display: "block",
        clipPath,
        background,
        boxShadow,
        pointerEvents: "none",
      }}
    />
  );
}

export const controlOuterClip =
  "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)";
export const controlInnerClip =
  "polygon(7px 0, calc(100% - 7px) 0, 100% 7px, 100% calc(100% - 7px), calc(100% - 7px) 100%, 7px 100%, 0 calc(100% - 7px), 0 7px)";
export const actionOuterClip =
  "polygon(18px 0, calc(100% - 18px) 0, 100% 17px, 100% calc(100% - 17px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 17px), 0 17px)";
export const actionInnerClip =
  "polygon(14px 0, calc(100% - 14px) 0, 100% 13px, 100% calc(100% - 13px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 13px), 0 13px)";
export const tabOuterClip =
  "polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%, 0 18px)";
export const tabInnerClip =
  "polygon(15px 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%, 0 15px)";

export const coverStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
};
