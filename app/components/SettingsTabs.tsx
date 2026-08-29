import { impactFont } from './styles';
import { useViewport } from './useViewport';

const settingsTabs = ['Gameplay', 'Graphics', 'Sound', 'Input'];

export function SettingsTabs() {
  const { mobile } = useViewport();
  return (
    <nav aria-label="Settings categories" style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1.2fr repeat(3, 1fr)', gap: mobile ? 3 : 8, paddingInline: mobile ? 8 : 15 }}>
      {settingsTabs.map((tab) => {
        const active = tab === 'Gameplay';
        return <button aria-current={active ? 'page' : undefined} disabled key={tab} type="button" style={{ boxSizing: 'border-box', minWidth: 0, height: 'clamp(44px, 7vh, 58px)', border: `2px solid ${active ? '#74efff' : '#294d85'}`, borderBottom: 0, padding: mobile ? '0 5px' : '0 8px', clipPath: 'polygon(8% 0, 92% 0, 100% 18%, 100% 100%, 0 100%, 0 18%)', color: active ? '#fff' : '#c8d1e2', background: active ? 'linear-gradient(#07132b, #041026) padding-box, linear-gradient(100deg, #00eaff, #64dfff 42%, #ff21bd) border-box' : 'linear-gradient(180deg, #071127, #020717 78%)', boxShadow: active ? 'inset 0 0 0 4px #041026, inset 0 0 24px rgb(0 184 255 / 24%), 0 0 12px rgb(65 160 255 / 65%)' : 'inset 0 0 0 3px #020717, inset 0 0 0 5px rgb(61 115 194 / 18%)', fontFamily: impactFont, fontSize: mobile ? 'clamp(0.82rem, 3.6vw, 1.15rem)' : 'clamp(1.25rem, 3.3vh, 2rem)', letterSpacing: '0.02em', textShadow: '1px 2px 0 #102957, 0 3px 4px #000', opacity: 1, cursor: 'default' }}>{tab}</button>;
      })}
    </nav>
  );
}
