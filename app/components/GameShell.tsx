import type { ReactNode } from 'react';
import { useViewport } from './useViewport';

export function GameShell({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  const { mobile, short } = useViewport();

  return (
    <main style={{ boxSizing: 'border-box', minHeight: '100svh', overflow: 'hidden', position: 'relative', display: 'grid', gridTemplateRows: compact ? 'minmax(0, 1fr)' : undefined, placeItems: 'center', padding: mobile ? 14 : short ? '14px clamp(18px, 3.5vw, 54px)' : 'clamp(18px, 3.5vw, 54px)', isolation: 'isolate', background: 'radial-gradient(circle at 18% 22%, rgb(15 111 255 / 18%), transparent 30%), radial-gradient(circle at 84% 76%, rgb(255 13 100 / 18%), transparent 31%), linear-gradient(128deg, #010713 0%, #03020c 50%, #090013 100%)' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: -2, pointerEvents: 'none', opacity: 0.36, backgroundImage: 'linear-gradient(rgb(57 167 255 / 8%) 1px, transparent 1px), linear-gradient(90deg, rgb(57 167 255 / 8%) 1px, transparent 1px)', backgroundSize: '72px 72px', transform: 'perspective(640px) rotateX(61deg) scale(1.8) translateY(34%)', transformOrigin: '50% 100%', maskImage: 'linear-gradient(to top, #000, transparent 76%)' }} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none', background: 'linear-gradient(90deg, rgb(0 234 255 / 16%), transparent 12% 88%, rgb(255 33 189 / 16%)), radial-gradient(ellipse at center, transparent 44%, rgb(0 0 0 / 72%) 100%)' }} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: '-30%', zIndex: -1, opacity: 0.55, background: 'conic-gradient(from 210deg at 50% 50%, transparent, rgb(0 234 255 / 10%), transparent 38%, rgb(255 33 189 / 11%), transparent 72%)' }} />
      {children}
    </main>
  );
}
