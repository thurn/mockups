import type { CSSProperties } from 'react';

export const impactFont = "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif";
export const frameClip = 'polygon(5.2% 0, 18% 0, 19.8% 2.4%, 80.2% 2.4%, 82% 0, 94.8% 0, 100% 6.3%, 100% 38%, 98.2% 40.2%, 98.2% 59.8%, 100% 62%, 100% 93.7%, 94.8% 100%, 82% 100%, 80.2% 97.6%, 19.8% 97.6%, 18% 100%, 5.2% 100%, 0 93.7%, 0 62%, 1.8% 59.8%, 1.8% 40.2%, 0 38%, 0 6.3%)';
export const buttonClip = 'polygon(2.4% 0, 97.6% 0, 100% 21%, 100% 79%, 97.6% 100%, 2.4% 100%, 0 79%, 0 21%)';
export const actionClip = 'polygon(8% 0, 92% 0, 100% 22%, 100% 78%, 92% 100%, 8% 100%, 0 78%, 0 22%)';

export const textGradient: CSSProperties = {
  color: 'transparent',
  background: 'linear-gradient(172deg, #fff 7%, #aef5ff 25%, #34beff 43%, #e9eeff 49%, #9882ff 67%, #fb45d2 86%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  WebkitTextStroke: '1px rgb(226 249 255 / 88%)',
};

export function mergeStyles(...styles: Array<CSSProperties | false | undefined>): CSSProperties {
  return Object.assign({}, ...styles.filter(Boolean));
}
