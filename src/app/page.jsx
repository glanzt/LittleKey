"use client";

import GameTopMenu from "@/components/game-top-menu";
import { TOP_BAR_HEIGHT } from "@/lib/game-constants";
import { FLOATING_LETTERS, FloatingLettersBackground } from "@/styles/shared";

const HERO_EMOTIONS = [
  { emoji: "😊", top: "6%", right: "42%" },
  { emoji: "😄", top: "20%", right: "18%" },
  { emoji: "😮", top: "47%", right: "8%" },
  { emoji: "🙂", top: "72%", right: "20%" },
  { emoji: "😢", top: "70%", right: "63%" },
  { emoji: "😠", top: "22%", right: "67%" },
];

const HERO_SPARKLES = [
  { top: "12%", right: "12%" },
  { top: "24%", right: "80%" },
  { top: "64%", right: "86%" },
  { top: "79%", right: "14%" },
  { top: "84%", right: "73%" },
];

const S = {
  page: {
    minHeight: "100vh",
    paddingTop: TOP_BAR_HEIGHT,
    background: "linear-gradient(180deg, #fff8f5 0%, #fff8ec 38%, #f3fbff 100%)",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box",
    direction: "rtl",
    fontFamily: '"Rubik", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  bgGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage: [
      "linear-gradient(rgba(112,102,140,0.06) 1px, transparent 1px)",
      "linear-gradient(90deg, rgba(112,102,140,0.06) 1px, transparent 1px)",
    ].join(", "),
    backgroundSize: "80px 80px",
    pointerEvents: "none",
    zIndex: 0,
  },

  skyGlow: {
    position: "absolute",
    inset: "-18% -10% auto",
    height: "45vh",
    background: "radial-gradient(circle at 50% 40%, rgba(255,238,187,0.7) 0%, rgba(255,210,194,0.3) 42%, rgba(255,255,255,0) 74%)",
    pointerEvents: "none",
    zIndex: 0,
  },

  rainbowArc: {
    position: "absolute",
    top: 110,
    left: "50%",
    transform: "translateX(-50%)",
    width: "min(940px, 92vw)",
    height: "min(440px, 46vw)",
    borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
    background: "conic-gradient(from 180deg at 50% 100%, #ff9f88 0deg 28deg, #ffd86f 28deg 54deg, #8fdc8c 54deg 82deg, #7fd7ff 82deg 110deg, #b79cff 110deg 138deg, #ffacd3 138deg 180deg)",
    opacity: 0.22,
    filter: "blur(2px)",
    pointerEvents: "none",
    zIndex: 0,
    clipPath: "inset(0 0 45% 0)",
  },

  nav: {
    width: "100%",
    maxWidth: 1200,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 1.4rem 0.8rem",
    boxSizing: "border-box",
    zIndex: 10,
  },

  navLogo: {
    fontFamily: '"Suez One", serif',
    fontSize: "1.35rem",
    color: "#111319",
    textDecoration: "none",
    background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,247,243,0.88))",
    border: "1px solid rgba(255,178,154,0.28)",
    borderRadius: 999,
    padding: "0.55rem 1rem",
    boxShadow: "0 16px 36px rgba(255,166,133,0.14)",
  },

  navCta: {
    background: "linear-gradient(135deg, #ff9f88, #ffbf6d)",
    color: "#fff",
    textDecoration: "none",
    fontSize: "0.92rem",
    fontWeight: 500,
    padding: "0.72rem 1.35rem",
    borderRadius: 999,
    boxShadow: "0 16px 30px rgba(255,159,136,0.28)",
  },

  heroArea: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
    paddingTop: "clamp(1.2rem, 4vw, 2.8rem)",
    paddingBottom: "1rem",
  },

  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    padding: "0.52rem 1rem",
    borderRadius: 999,
    background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,247,241,0.86))",
    border: "1px solid rgba(255,190,144,0.34)",
    boxShadow: "0 14px 28px rgba(255,187,132,0.18)",
    color: "#6b6478",
    fontSize: "0.94rem",
    marginBottom: "1rem",
  },

  title: {
    margin: 0,
    fontSize: "clamp(2.8rem, 6vw, 4.8rem)",
    lineHeight: 1.02,
    letterSpacing: "-0.04em",
    fontWeight: 700,
    color: "#232032",
    textAlign: "center",
    textWrap: "balance",
    textShadow: "0 4px 18px rgba(255,255,255,0.35)",
  },

  subtitle: {
    marginTop: "1rem",
    color: "rgba(70,64,92,0.72)",
    fontSize: "clamp(1rem, 1.7vw, 1.14rem)",
    lineHeight: 1.72,
    maxWidth: 640,
    textAlign: "center",
    padding: "0 1rem",
  },

  actions: {
    marginTop: "1.5rem",
    display: "flex",
    justifyContent: "center",
    gap: "0.85rem",
    flexWrap: "wrap",
  },

  btnBase: {
    minWidth: 172,
    height: 50,
    borderRadius: 999,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.05rem",
    fontWeight: 500,
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
  },

  btnPrimary: {
    background: "linear-gradient(135deg, #ff9e87, #ffbf6b)",
    color: "#fff",
    boxShadow: "0 16px 30px rgba(255,162,132,0.3)",
  },

  btnSecondary: {
    background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(246,247,255,0.9))",
    color: "#5b5572",
    border: "1px solid rgba(188,182,220,0.34)",
    boxShadow: "0 12px 24px rgba(126,119,175,0.12)",
  },

  stage: {
    position: "relative",
    width: "100%",
    flex: 1,
    minHeight: 460,
    marginTop: "1.8rem",
    overflow: "hidden",
  },

  cloudBase: {
    position: "absolute",
    width: 210,
    height: 80,
    borderRadius: 999,
    background: "rgba(255,255,255,0.72)",
    boxShadow: "0 22px 48px rgba(255,194,165,0.16)",
    pointerEvents: "none",
    zIndex: 1,
  },

  cloudLeft: {
    top: "20%",
    left: "10%",
  },

  cloudRight: {
    top: "28%",
    right: "9%",
  },

  cloudPuff: {
    position: "absolute",
    background: "rgba(255,255,255,0.9)",
    borderRadius: "50%",
  },

  wheelGlow: {
    position: "absolute",
    left: "50%",
    top: "56%",
    transform: "translate(-50%, -50%)",
    width: "min(760px, 84vw)",
    height: 320,
    background: "radial-gradient(circle, rgba(255,243,173,0.5) 0%, rgba(255,191,183,0.2) 36%, rgba(131,217,255,0.18) 58%, rgba(255,255,255,0) 76%)",
    filter: "blur(16px)",
    zIndex: 1,
  },

  wheelShell: {
    position: "absolute",
    left: "50%",
    top: "58%",
    transform: "translate(-50%, -50%)",
    width: "min(470px, 72vw)",
    height: "min(470px, 72vw)",
    borderRadius: "50%",
    background: "linear-gradient(180deg, #ffb38e, #ff8a7b)",
    boxShadow: "0 30px 70px rgba(255,168,137,0.3), 0 0 0 10px rgba(255,242,220,0.75) inset",
    zIndex: 2,
  },

  wheelFace: {
    position: "absolute",
    left: "50%",
    top: "58%",
    transform: "translate(-50%, -50%)",
    width: "min(390px, 60vw)",
    height: "min(390px, 60vw)",
    borderRadius: "50%",
    background: "conic-gradient(from 220deg, #f88787 0deg 45deg, #f6a4cc 45deg 90deg, #b28dff 90deg 135deg, #ff9ab1 135deg 180deg, #6fc8ff 180deg 225deg, #9ad864 225deg 270deg, #f9d46a 270deg 315deg, #ffad64 315deg 360deg)",
    border: "12px solid rgba(255,241,218,0.88)",
    boxShadow: "0 16px 40px rgba(210,104,90,0.18)",
    zIndex: 3,
  },

  wheelCore: {
    position: "absolute",
    left: "50%",
    top: "58%",
    transform: "translate(-50%, -50%)",
    width: "min(112px, 18vw)",
    height: "min(112px, 18vw)",
    borderRadius: "50%",
    background: "linear-gradient(180deg, #ffe66b, #ffbd59)",
    border: "8px solid rgba(255,246,212,0.92)",
    boxShadow: "0 14px 26px rgba(255,182,83,0.28)",
    zIndex: 5,
  },

  wheelArrow: {
    position: "absolute",
    left: "50%",
    top: "58%",
    transform: "translate(-50%, -50%)",
    width: 0,
    height: 0,
    borderLeft: "16px solid transparent",
    borderRight: "16px solid transparent",
    borderBottom: "70px solid #ffbc57",
    filter: "drop-shadow(0 6px 10px rgba(183,103,56,0.22))",
    zIndex: 6,
  },

  wheelHub: {
    position: "absolute",
    left: "50%",
    top: "58%",
    transform: "translate(-50%, -50%)",
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#ff7f73",
    border: "4px solid rgba(255,241,215,0.9)",
    zIndex: 7,
  },

  emotionBubble: {
    position: "absolute",
    width: 76,
    height: 76,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.6rem",
    background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,243,233,0.94))",
    boxShadow: "0 16px 28px rgba(212,123,99,0.18)",
    border: "4px solid rgba(255,246,226,0.95)",
    zIndex: 6,
  },

  sparkle: {
    position: "absolute",
    width: 16,
    height: 16,
    transform: "rotate(45deg)",
    background: "linear-gradient(180deg, #fff6cf, #fffef5)",
    borderRadius: 4,
    boxShadow: "0 0 16px rgba(255,240,163,0.8)",
    zIndex: 1,
  },

  keyboardToy: {
    position: "absolute",
    left: "10%",
    bottom: "7%",
    width: 180,
    height: 104,
    borderRadius: 28,
    background: "linear-gradient(180deg, #f7f0ff, #c7d7ff)",
    boxShadow: "0 18px 36px rgba(102,115,192,0.22)",
    transform: "rotate(-11deg)",
    zIndex: 4,
    padding: 14,
    boxSizing: "border-box",
  },

  keyboardKeys: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 8,
  },

  keyBase: {
    height: 26,
    borderRadius: 10,
    boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
  },

  cardsCluster: {
    position: "absolute",
    right: "12%",
    bottom: "10%",
    width: 220,
    height: 130,
    zIndex: 4,
  },

  toyCard: {
    position: "absolute",
    width: 80,
    height: 102,
    borderRadius: 20,
    border: "4px solid rgba(255,255,255,0.92)",
    boxShadow: "0 16px 30px rgba(255,160,145,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.1rem",
  },

  lettersMark: {
    position: "relative",
    fontFamily: '"Suez One", serif',
    fontSize: "clamp(4.4rem, 15vw, 7.6rem)",
    lineHeight: 1,
    color: "#fff6f0",
    textShadow: "0 8px 24px rgba(173,81,70,0.3)",
    userSelect: "none",
    transform: "translateY(-4px)",
  },

  lettersPlate: {
    position: "absolute",
    left: "50%",
    top: "58%",
    transform: "translate(-50%, -50%)",
    width: "min(220px, 34vw)",
    height: "min(146px, 22vw)",
    borderRadius: 28,
    background: "linear-gradient(135deg, rgba(255,255,255,0.45), rgba(255,243,220,0.28))",
    border: "1px solid rgba(255,255,255,0.62)",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 4,
  },

  floatingLetter: {
    position: "absolute",
    fontFamily: '"Suez One", serif',
    pointerEvents: "none",
    userSelect: "none",
    zIndex: 0,
  },
};

export default function Home() {
  return (
    <main style={S.page}>
      <div style={S.bgGrid} aria-hidden="true" />
      <FloatingLettersBackground />
      <div style={S.skyGlow} aria-hidden="true" />
      <div style={S.rainbowArc} aria-hidden="true" />

      <GameTopMenu />

      <div style={S.heroArea}>
        <div style={S.heroBadge}>
          <span>אותיות, רגשות ומשחקים קטנים</span>
        </div>
        <h1 style={S.title}>
          לשחק, לגלות
          <br />
          וללמוד בעברית.
        </h1>

        <p style={S.subtitle}>
          משחקי אותיות ורגשות שעוזרים לילדים ללמוד
          <br />
          דרך הצלחה, סקרנות והנאה.
        </p>

        <div style={S.stage} aria-hidden="true">
          <div style={{ ...S.cloudBase, ...S.cloudLeft }}>
            <div style={{ ...S.cloudPuff, width: 76, height: 76, top: -20, left: 18 }} />
            <div style={{ ...S.cloudPuff, width: 94, height: 94, top: -30, left: 64 }} />
            <div style={{ ...S.cloudPuff, width: 70, height: 70, top: -12, left: 126 }} />
          </div>
          <div style={{ ...S.cloudBase, ...S.cloudRight }}>
            <div style={{ ...S.cloudPuff, width: 72, height: 72, top: -18, left: 12 }} />
            <div style={{ ...S.cloudPuff, width: 92, height: 92, top: -28, left: 58 }} />
            <div style={{ ...S.cloudPuff, width: 64, height: 64, top: -8, left: 132 }} />
          </div>
          <div style={S.wheelGlow} />
          <div style={S.wheelShell} />
          <div style={S.wheelFace} />
          <div style={S.lettersPlate}>
            <div style={S.lettersMark}>אבג</div>
          </div>
          {HERO_EMOTIONS.map(function(item, index) {
            return (
              <div key={index} style={{ ...S.emotionBubble, top: item.top, right: item.right }}>
                {item.emoji}
              </div>
            );
          })}
          {HERO_SPARKLES.map(function(item, index) {
            return <div key={index} style={{ ...S.sparkle, top: item.top, right: item.right }} />;
          })}
          <div style={S.wheelArrow} />
          <div style={S.wheelHub} />
          <div style={S.keyboardToy}>
            <div style={S.keyboardKeys}>
              {["#ff8f66", "#f7c95b", "#8cd0ff", "#b79cff", "#ff94b2", "#ffd166", "#8fdc8c", "#6ec5ff", "#ffa76a", "#ff93d0"].map(function(color, index) {
                return <div key={index} style={{ ...S.keyBase, background: color }} />;
              })}
            </div>
          </div>
          <div style={S.cardsCluster}>
            <div style={{ ...S.toyCard, right: 0, bottom: 4, background: "linear-gradient(180deg, #ffd2e8, #ff9cb5)", transform: "rotate(8deg)" }}>😄</div>
            <div style={{ ...S.toyCard, right: 64, bottom: 10, background: "linear-gradient(180deg, #c5e3ff, #84b9ff)", transform: "rotate(-3deg)" }}>🙂</div>
            <div style={{ ...S.toyCard, right: 124, bottom: 16, background: "linear-gradient(180deg, #ffe394, #ffc867)", transform: "rotate(-14deg)" }}>⭐</div>
          </div>
        </div>
      </div>

      {FLOATING_LETTERS.map((fl, i) => (
        <span
          key={i}
          style={{
            ...S.floatingLetter,
            left: fl.x,
            top: fl.y,
            fontSize: fl.size,
            transform: `rotate(${fl.rot}deg)`,
            opacity: fl.opacity,
          }}
          aria-hidden="true"
        >
          {fl.char}
        </span>
      ))}
    </main>
  );
}
