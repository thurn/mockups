import { actionClip, impactFont, mergeStyles, textGradient } from './styles';
import { useInteraction } from './useInteraction';
import { useViewport } from './useViewport';

export function ReturnButton({ onClick }: { onClick: () => void }) {
  const { state, handlers } = useInteraction();
  const { mobile } = useViewport();
  const highlighted = state.hovered || state.focused;

  return (
    <button {...handlers} onClick={onClick} type="button" style={{ boxSizing: 'border-box', position: 'relative', zIndex: 4, flex: '0 0 clamp(56px, 9vh, 76px)', width: mobile ? 'min(62%, 310px)' : 'min(48%, 360px)', border: '3px solid transparent', margin: 'clamp(7px, 1.5vh, 13px) auto 0', padding: 0, clipPath: actionClip, color: 'transparent', background: 'linear-gradient(105deg, #dffbff, #61ddff 24%, #aca1ff 54%, #ff62d5 82%, #fff) border-box', cursor: 'pointer', outline: 0, filter: highlighted ? 'brightness(1.16) drop-shadow(0 0 11px rgb(103 222 255 / 74%))' : 'drop-shadow(0 9px 9px rgb(0 0 0 / 72%)) drop-shadow(0 0 7px rgb(147 77 255 / 55%))', transform: state.pressed ? 'translateY(2px) scale(0.98)' : highlighted ? 'scale(1.015)' : undefined, font: 'inherit' }}>
      <span aria-hidden="true" style={{ position: 'absolute', inset: 4, clipPath: actionClip, background: 'linear-gradient(180deg, #0c1a36, #020612)', boxShadow: 'inset 0 0 0 4px #020511, inset 0 0 20px #000' }} />
      <span style={mergeStyles(textGradient, { position: 'relative', display: 'inline-block', paddingRight: '0.18em', transform: 'skewX(-7deg)', fontFamily: impactFont, fontSize: 'clamp(2.1rem, 5.8vh, 3.6rem)', fontStyle: 'italic', lineHeight: 1, WebkitTextStroke: '0.8px #fff', filter: 'drop-shadow(2px 4px 0 #173a74) drop-shadow(0 5px 4px #000)' })}>Return</span>
    </button>
  );
}
