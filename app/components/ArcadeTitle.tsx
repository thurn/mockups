import type { CSSProperties } from 'react';
import { impactFont, mergeStyles, textGradient } from './styles';
import { useViewport } from './useViewport';

export function ArcadeTitle({ settings = false }: { settings?: boolean }) {
  const { mobile, short } = useViewport();
  const titleSize = settings ? mobile ? 'clamp(3.25rem, 18vw, 4.5rem)' : 'clamp(4rem, 11.5vh, 7rem)' : mobile ? 'clamp(2.7rem, 13vw, 5rem)' : short ? 'clamp(3.3rem, 8.6vh, 5rem)' : 'clamp(3rem, 7.2vw, 6.2rem)';

  return (
    <header style={{ position: 'relative', isolation: 'isolate', width: settings ? mobile ? '100%' : '88%' : 'min(100%, 720px)', margin: 0, textAlign: 'center', transform: settings ? 'skewX(-4deg)' : 'translateY(clamp(4px, 0.8vh, 8px)) skewX(-4deg)', flex: settings ? '0 0 clamp(88px, 16vh, 130px)' : undefined, display: settings ? 'grid' : undefined, placeItems: settings ? 'center' : undefined }}>
      <TitleBar side="left" settings={settings} />
      <TitleBar side="right" settings={settings} />
      {settings ? (
        <h1 style={mergeStyles(textGradient, { position: 'relative', zIndex: 1, margin: 0, overflow: 'visible', padding: '0 0.14em 0.08em 0.04em', fontFamily: impactFont, fontSize: titleSize, fontStyle: 'italic', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.025em', filter: 'drop-shadow(3px 5px 0 #061b54) drop-shadow(-2px -2px 0 #510958) drop-shadow(0 9px 8px rgb(0 0 0 / 78%))' })}>Settings</h1>
      ) : (
        <h1 style={{ position: 'relative', zIndex: 1, margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: impactFont, fontSize: titleSize, fontStyle: 'italic', fontWeight: 900, lineHeight: 0.78, letterSpacing: '-0.025em', textTransform: 'uppercase' }}>
          <span style={logoTextStyle}>CHESS CHESS</span>
          <span style={mergeStyles(logoTextStyle, { fontSize: '0.98em', backgroundImage: 'linear-gradient(172deg, #fff 4%, #b7edff 24%, #368fff 43%, #e8e4ff 50%, #a876ff 67%, #ff45bd 88%)' })}>REVOLUTION</span>
        </h1>
      )}
    </header>
  );
}

const logoTextStyle: CSSProperties = mergeStyles(textGradient, { position: 'relative', display: 'block', overflow: 'visible', paddingRight: '0.22em', paddingLeft: '0.04em', marginRight: '-0.22em', marginLeft: '-0.04em', filter: 'drop-shadow(3px 5px 0 #061b54) drop-shadow(-2px -2px 0 #510958) drop-shadow(0 9px 8px rgb(0 0 0 / 78%))' });

function TitleBar({ side, settings }: { side: 'left' | 'right'; settings: boolean }) {
  const left = side === 'left';
  return <div aria-hidden="true" style={{ position: 'absolute', top: '50%', zIndex: 0, width: settings ? '54%' : '68%', height: settings ? 'clamp(32px, 6vh, 52px)' : 'clamp(26px, 5vw, 48px)', transform: 'translateY(-50%)', opacity: settings ? undefined : 0.9, pointerEvents: 'none', left: left ? 0 : undefined, right: left ? undefined : 0, clipPath: left ? 'polygon(0 0, 100% 0, 93% 100%, 0 100%)' : 'polygon(7% 0, 100% 0, 100% 100%, 0 100%)', background: left ? 'repeating-linear-gradient(132deg, #155cff 0 15px, transparent 15px 28px)' : 'repeating-linear-gradient(132deg, #ff126d 0 15px, transparent 15px 28px)', filter: left ? 'drop-shadow(0 0 9px rgb(21 92 255 / 78%))' : 'drop-shadow(0 0 9px rgb(255 18 109 / 78%))' }} />;
}
