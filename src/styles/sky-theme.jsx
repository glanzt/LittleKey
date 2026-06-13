"use client";

/*
 * "בוקר בשמיים" (Sky Morning) design direction — approved 2026-06-10.
 * Storybook sky: gradient daylight, breathing sun, drifting clouds, soft hills.
 * Palette + scenery are shared by the play home screen and game screens.
 */

export var SKY = {
  ink: "#2E3A59",
  inkSoft: "rgba(46,58,89,0.6)",
  inkFaint: "rgba(46,58,89,0.4)",
  peach: "#FF9B83",
  butter: "#FFB938",
  skyblue: "#4FA8E8",
  mint: "#3FBF8C",
  lilac: "#9B7DE8",
  rose: "#F2709C",
  cardShadow: "0 16px 30px rgba(63,114,175,0.20)",
  chipShadow: "0 10px 22px rgba(79,134,198,0.18)",
};

export var SKY_PAGE_BG = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #8ECDF6 0%, #BDE4FB 34%, #FFF3CF 78%, #FFE9B8 100%)",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "'Rubik', sans-serif",
  color: SKY.ink,
  direction: "rtl",
  boxSizing: "border-box",
};

var CLOUD_BASE = {
  position: "absolute",
  width: 120,
  height: 38,
  background: "#fff",
  borderRadius: 999,
  filter: "drop-shadow(0 8px 14px rgba(79,134,198,0.18))",
  pointerEvents: "none",
  zIndex: 0,
};

/*
 * mode "home"  — full scenery: sun + clouds + hills.
 * mode "game"  — no sun (it fights the top corner controls), dimmer clouds.
 */
export function SkyScenery(props) {
  var mode = props.mode || "home";
  var inGame = mode === "game";

  return (
    <>
      {!inGame ? (
        <div aria-hidden="true" style={{
          position: "absolute", top: 76, left: 18, width: 76, height: 76,
          borderRadius: "50%", zIndex: 0, pointerEvents: "none",
          background: "radial-gradient(circle at 35% 35%, #FFE082, #FFB938)",
          boxShadow: "0 0 0 13px rgba(255,200,80,0.25), 0 0 0 27px rgba(255,200,80,0.12), 0 0 54px rgba(255,185,56,0.55)",
          animation: "skySunBreathe 5s ease-in-out infinite",
        }} />
      ) : null}

      <div aria-hidden="true" style={{ ...CLOUD_BASE, top: "14%", opacity: inGame ? 0.5 : 0.95, animation: "skyDrift1 34s linear infinite" }}>
        <div style={{ position: "absolute", width: 52, height: 52, top: -26, right: 18, background: "#fff", borderRadius: "50%" }} />
        <div style={{ position: "absolute", width: 38, height: 38, top: -17, left: 16, background: "#fff", borderRadius: "50%" }} />
      </div>
      <div aria-hidden="true" style={{ ...CLOUD_BASE, top: "32%", opacity: inGame ? 0.4 : 0.8, transform: "scale(0.7)", animation: "skyDrift2 46s linear infinite" }}>
        <div style={{ position: "absolute", width: 52, height: 52, top: -26, right: 18, background: "#fff", borderRadius: "50%" }} />
        <div style={{ position: "absolute", width: 38, height: 38, top: -17, left: 16, background: "#fff", borderRadius: "50%" }} />
      </div>
      <div aria-hidden="true" style={{ ...CLOUD_BASE, top: "7%", opacity: inGame ? 0.4 : 0.7, transform: "scale(0.5)", animation: "skyDrift1 58s linear infinite reverse" }}>
        <div style={{ position: "absolute", width: 52, height: 52, top: -26, right: 18, background: "#fff", borderRadius: "50%" }} />
        <div style={{ position: "absolute", width: 38, height: 38, top: -17, left: 16, background: "#fff", borderRadius: "50%" }} />
      </div>

      <div aria-hidden="true" style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 120,
        zIndex: 0, pointerEvents: "none", opacity: 0.8,
        background: [
          "radial-gradient(120% 140px at 20% 100%, #BCE39B 0 62%, transparent 63%)",
          "radial-gradient(130% 160px at 85% 100%, #A8DB87 0 60%, transparent 61%)",
        ].join(", "),
      }} />

      <style>{
        "@keyframes skySunBreathe { 0%,100%{ transform: scale(1) } 50%{ transform: scale(1.05) } }" +
        "@keyframes skyDrift1 { from{ right: -140px } to{ right: 110% } }" +
        "@keyframes skyDrift2 { from{ right: 110% } to{ right: -140px } }"
      }</style>
    </>
  );
}
