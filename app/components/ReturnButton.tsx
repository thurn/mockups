import { actionInnerClip, actionOuterClip, ClippedInset } from "./ClippedInset";

export function ReturnButton() {
  return (
    <button type="button" style={{ position: "absolute", zIndex: 8, left: 328, top: 1358, boxSizing: "border-box", width: 368, height: 120, display: "grid", placeItems: "center", border: 0, padding: 0, clipPath: actionOuterClip, color: "transparent", background: "linear-gradient(110deg, #b9fbff, #3bb9ff 22%, #a49cff 56%, #ff4bd1 90%)", filter: "drop-shadow(0 0 10px rgba(58,154,255,.65))", cursor: "pointer" }}>
      <ClippedInset inset={6} clipPath={actionInnerClip} background="linear-gradient(180deg, #071027, #020613)" boxShadow="inset 0 0 0 4px #071127, inset 0 0 27px #000" />
      <span style={{ position: "relative", zIndex: 1, display: "inline-block", color: "transparent", background: "linear-gradient(174deg, #fff 5%, #dff8ff 31%, #52baff 49%, #f8faff 57%, #806eff 77%, #ff6dda 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", WebkitTextStroke: "1px #f7ffff", fontFamily: "'Barlow Condensed', Impact, sans-serif", fontSize: 91, fontStyle: "italic", fontWeight: 800, lineHeight: 0.9, letterSpacing: "-2px", transform: "translateY(-1px) skewX(-5deg)", filter: "drop-shadow(3px 5px 0 #122964) drop-shadow(0 7px 5px #000)" }}>
        RETURN
      </span>
    </button>
  );
}
