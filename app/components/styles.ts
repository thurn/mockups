import type { CSSProperties } from "react";

export const displayFont =
  "'Bebas Neue', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif";
export const impactFont = displayFont;
export const frameClip =
  "polygon(4.5% 0, 14.7% 0, 17% 1.9%, 83% 1.9%, 85.3% 0, 95.5% 0, 100% 3.2%, 100% 18.7%, 98.1% 20%, 98.1% 98.6%, 96.5% 100%, 3.5% 100%, 1.9% 98.6%, 1.9% 20%, 0 18.7%, 0 3.2%)";
export const frameOuterInset = 21;
export const frameBorderThickness = 8;
export const frameOuterBottom = 111;
export const frameInteriorBounds = {
  top: frameOuterInset + frameBorderThickness,
  right: frameOuterInset + frameBorderThickness,
  bottom: frameOuterBottom + frameBorderThickness,
  left: frameOuterInset + frameBorderThickness,
} as const;
export const frameMetalGradient =
  "linear-gradient(110deg, #f4ffff 0%, #53dcff 4%, #0874ef 12%, #09234c 18%, #19ddff 32%, #e9fbff 50%, #806cff 64%, #ff39c9 83%, #ffd4f4 96%, #ff5ec2 100%)";
export const frameBezelGradient =
  "linear-gradient(112deg, #05091a, #173361 21%, #06102b 36% 64%, #3f174a 83%, #130715)";
export const buttonClip =
  "polygon(2.4% 0, 97.6% 0, 100% 21%, 100% 79%, 97.6% 100%, 2.4% 100%, 0 79%, 0 21%)";
export const actionClip =
  "polygon(8% 0, 92% 0, 100% 22%, 100% 78%, 92% 100%, 8% 100%, 0 78%, 0 22%)";

export const textGradient: CSSProperties = {
  color: "transparent",
  background:
    "linear-gradient(172deg, #fff 7%, #aef5ff 25%, #34beff 43%, #e9eeff 49%, #9882ff 67%, #fb45d2 86%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  WebkitTextStroke: "1px rgb(226 249 255 / 88%)",
};

export function mergeStyles(...styles: Array<CSSProperties | false | undefined>): CSSProperties {
  return Object.assign({}, ...styles.filter(Boolean));
}
