import { ClippedInset, tabInnerClip, tabOuterClip } from "./ClippedInset";

const tabs = ["Gameplay", "Graphics", "Sound", "Input"];

export type SettingsTab = (typeof tabs)[number];

export function SettingsTabs({ activeTab, onSelect }: { activeTab: SettingsTab; onSelect: (tab: SettingsTab) => void }) {
  return (
    <nav aria-label="Settings categories" style={{ height: 129, display: "grid", gridTemplateColumns: "264px 212px 205px 200px", gap: 2, alignItems: "end" }}>
      {tabs.map((tab) => {
        const active = tab === activeTab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onSelect(tab)}
            aria-current={active ? "page" : undefined}
            style={{
              position: "relative",
              boxSizing: "border-box",
              height: active ? 130 : 127,
              marginTop: active ? 0 : 3,
              border: 0,
              padding: 0,
              clipPath: tabOuterClip,
              color: "#f7f7fb",
              background: active
                ? "linear-gradient(112deg, #72f5ff 0%, #53afff 44%, #9a83ff 68%, #ff4ed3 100%)"
                : "linear-gradient(110deg, #45678e, #253f67 52%, #75517d)",
              filter: active ? "drop-shadow(0 0 10px rgba(35,133,255,.86))" : undefined,
              fontFamily: "'Barlow Condensed', Impact, sans-serif",
              fontWeight: 700,
              fontSize: active ? 55 : 51,
              lineHeight: 1,
              letterSpacing: "1px",
              textShadow: "2px 4px 0 #182b50, 0 5px 7px #000",
              cursor: "pointer",
            }}
          >
            <ClippedInset
              inset={active ? 4 : 2}
              clipPath={tabInnerClip}
              background={active ? "linear-gradient(180deg, #071831, #030b1d)" : "linear-gradient(180deg, #071328, #020817)"}
              boxShadow={active ? "inset 0 0 34px rgba(20,98,226,.52), inset 0 -3px 0 #f14dd7" : "inset 0 0 0 3px #020716"}
            />
            <span style={{ position: "relative", zIndex: 1 }}>{tab}</span>
          </button>
        );
      })}
    </nav>
  );
}
