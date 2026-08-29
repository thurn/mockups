import { displayFont } from "./styles";

const tabs = ["Gameplay", "Graphics", "Sound", "Input"];

export function SettingsTabs() {
  return (
    <nav aria-label="Settings categories" style={{ height: 129, display: "grid", gridTemplateColumns: "264px 214px 207px 201px", alignItems: "end" }}>
      {tabs.map((tab) => {
        const active = tab === "Gameplay";
        return (
          <button
            key={tab}
            type="button"
            aria-current={active ? "page" : undefined}
            style={{
              position: "relative",
              boxSizing: "border-box",
              height: active ? 130 : 127,
              marginTop: active ? 0 : 3,
              border: active ? "3px solid transparent" : "2px solid #39567b",
              borderBottom: active ? "3px solid #f14dd7" : "2px solid #39567b",
              padding: "0 4px",
              clipPath: "polygon(8% 0, 92% 0, 100% 14%, 100% 100%, 0 100%, 0 14%)",
              color: "#f7f7fb",
              background: active
                ? "linear-gradient(180deg, #06152d, #030b1c) padding-box, linear-gradient(104deg, #6cf4ff 3%, #6caaff 40%, #ff4dd7 88%) border-box"
                : "linear-gradient(180deg, #071328, #020817)",
              boxShadow: active ? "inset 0 0 0 6px #061024, inset 0 0 28px rgba(20,98,226,.42), 0 0 15px rgba(35,133,255,.75)" : "inset 0 0 0 4px #020716",
              fontFamily: "'Barlow Condensed', Impact, sans-serif",
              fontWeight: 700,
              fontSize: active ? 55 : 51,
              lineHeight: 1,
              letterSpacing: "1px",
              textShadow: "2px 4px 0 #182b50, 0 5px 7px #000",
              cursor: "default",
            }}
          >
            {tab}
          </button>
        );
      })}
    </nav>
  );
}
