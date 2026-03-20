"use client";

import Link from "next/link";
import { FLOATING_LETTERS, FloatingLettersBackground } from "@/styles/shared";

const S = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #fffdf8 0%, #fff8f2 52%, #f8fbff 100%)",
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
      "linear-gradient(rgba(14,14,18,0.038) 1px, transparent 1px)",
      "linear-gradient(90deg, rgba(14,14,18,0.038) 1px, transparent 1px)",
    ].join(", "),
    backgroundSize: "80px 80px",
    pointerEvents: "none",
    zIndex: 0,
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
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(17,19,25,0.06)",
    borderRadius: 999,
    padding: "0.5rem 1rem",
    boxShadow: "0 10px 30px rgba(17,19,25,0.06)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  },

  navCta: {
    background: "linear-gradient(135deg, #111319, #383d4b)",
    color: "#fff",
    textDecoration: "none",
    fontSize: "0.92rem",
    fontWeight: 500,
    padding: "0.68rem 1.25rem",
    borderRadius: 999,
    boxShadow: "0 12px 28px rgba(17,19,25,0.18)",
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
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(17,19,25,0.07)",
    boxShadow: "0 12px 30px rgba(17,19,25,0.06)",
    color: "#444b57",
    fontSize: "0.94rem",
    marginBottom: "1rem",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  },

  title: {
    margin: 0,
    fontSize: "clamp(2.8rem, 6vw, 4.8rem)",
    lineHeight: 1.02,
    letterSpacing: "-0.04em",
    fontWeight: 700,
    color: "#111319",
    textAlign: "center",
    textWrap: "balance",
  },

  subtitle: {
    marginTop: "1rem",
    color: "rgba(20,23,32,0.56)",
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
    background: "linear-gradient(135deg, #111319, #363b46)",
    color: "#fff",
    boxShadow: "0 14px 28px rgba(17,19,25,0.2)",
  },

  btnSecondary: {
    background: "rgba(255,255,255,0.8)",
    color: "#1a1f2b",
    border: "1px solid rgba(16,19,28,0.1)",
    boxShadow: "0 10px 22px rgba(17,20,28,0.05)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
  },

  stage: {
    position: "relative",
    width: "100%",
    flex: 1,
    minHeight: 0,
    marginTop: "1.8rem",
    overflow: "hidden",
  },

  beamBase: {
    position: "absolute",
    top: "-38%",
    bottom: "-26%",
    left: "-14%",
    right: "-14%",
    pointerEvents: "none",
  },

  beamLeft: {
    background: "repeating-conic-gradient(from 214deg at 52% 58%, rgba(248,193,66,0.42) 0deg 0.36deg, transparent 0.36deg 1.02deg)",
    opacity: 0.88,
    WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.95) 60%, transparent 85%)",
    maskImage: "linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.95) 60%, transparent 85%)",
    mixBlendMode: "multiply",
  },

  beamRight: {
    background: "repeating-conic-gradient(from -34deg at 48% 58%, rgba(84,214,207,0.5) 0deg 0.34deg, transparent 0.34deg 1deg)",
    opacity: 0.84,
    WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.96) 60%, transparent 85%)",
    maskImage: "linear-gradient(to left, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.96) 60%, transparent 85%)",
    mixBlendMode: "multiply",
  },

  colorCore: {
    position: "absolute",
    left: "50%",
    top: "42%",
    transform: "translate(-50%, -50%)",
    width: "min(580px, 82vw)",
    height: 340,
    borderRadius: 36,
    background: "linear-gradient(100deg, rgba(255,160,122,0.42) 0%, rgba(255,220,120,0.46) 32%, rgba(145,155,255,0.34) 62%, rgba(115,230,210,0.38) 100%)",
    filter: "blur(24px)",
    opacity: 0.96,
  },

  centerPanel: {
    position: "absolute",
    left: "50%",
    top: "42%",
    transform: "translate(-50%, -50%)",
    width: "min(390px, 60vw)",
    height: 276,
    borderRadius: 26,
    background: "linear-gradient(180deg, rgba(255,255,255,0.34), rgba(255,255,255,0.18))",
    border: "1px solid rgba(255,255,255,0.72)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    boxShadow: "0 16px 40px rgba(17,20,28,0.08), 0 -1px 0 rgba(255,255,255,0.55) inset",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  lettersMark: {
    position: "absolute",
    left: "50%",
    top: "42%",
    transform: "translate(-50%, -50%)",
    fontFamily: '"Suez One", serif',
    fontSize: "clamp(5.2rem, 18vw, 10rem)",
    lineHeight: 0.88,
    letterSpacing: "0.03em",
    background: "linear-gradient(180deg, #fffaf6 0%, #e3e2e6 30%, #9da1aa 58%, #242a34 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    zIndex: 3,
    userSelect: "none",
    textShadow: "0 14px 34px rgba(17,19,25,0.08)",
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

      <nav style={S.nav}>
        <span style={S.navLogo}>ציידת האותיות</span>
        <Link href="/auth/register" style={S.navCta}>הרשמה</Link>
      </nav>

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

        <div style={S.actions}>
          <Link href="/play" style={{ ...S.btnBase, ...S.btnPrimary }}>
            בואו נשחק
          </Link>
          <Link href="/auth/signin" style={{ ...S.btnBase, ...S.btnSecondary }}>
            התחברות
          </Link>
        </div>

        <div style={S.stage} aria-hidden="true">
          <div style={{ ...S.beamBase, ...S.beamLeft }} />
          <div style={{ ...S.beamBase, ...S.beamRight }} />
          <div style={S.colorCore} />
          <div style={S.centerPanel} />
          <div style={S.lettersMark}>אבג</div>
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
