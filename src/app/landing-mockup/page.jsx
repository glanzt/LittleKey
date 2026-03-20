"use client";

import Link from "next/link";

const FLOATING_LETTERS = [
  { char: "א", x: "5%",  y: "10%", size: "5rem",   rot: -12, opacity: 0.18 },
  { char: "ב", x: "88%", y: "7%",  size: "4.2rem", rot: 8,   opacity: 0.15 },
  { char: "ג", x: "12%", y: "75%", size: "5.5rem", rot: 15,  opacity: 0.14 },
  { char: "ד", x: "91%", y: "70%", size: "4.5rem", rot: -20, opacity: 0.16 },
  { char: "ה", x: "2%",  y: "42%", size: "3.8rem", rot: 5,   opacity: 0.13 },
  { char: "ו", x: "94%", y: "38%", size: "4.8rem", rot: -8,  opacity: 0.14 },
  { char: "ז", x: "20%", y: "88%", size: "3.6rem", rot: 22,  opacity: 0.12 },
  { char: "ח", x: "76%", y: "86%", size: "5rem",   rot: -15, opacity: 0.15 },
  { char: "ט", x: "8%",  y: "28%", size: "3.4rem", rot: -6,  opacity: 0.11 },
  { char: "י", x: "84%", y: "22%", size: "3rem",   rot: 12,  opacity: 0.13 },
  { char: "כ", x: "28%", y: "4%",  size: "3.6rem", rot: -18, opacity: 0.1  },
  { char: "ל", x: "68%", y: "3%",  size: "4.2rem", rot: 10,  opacity: 0.12 },
  { char: "מ", x: "48%", y: "90%", size: "4.5rem", rot: -5,  opacity: 0.13 },
  { char: "ש", x: "36%", y: "93%", size: "3.4rem", rot: 18,  opacity: 0.1  },
  { char: "ת", x: "60%", y: "91%", size: "4rem",   rot: -10, opacity: 0.12 },
];

const S = {
  page: {
    height: "100vh",
    background: "#fafafa",
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
      "linear-gradient(rgba(14,14,18,0.045) 1px, transparent 1px)",
      "linear-gradient(90deg, rgba(14,14,18,0.045) 1px, transparent 1px)",
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
    padding: "0.8rem 2rem",
    boxSizing: "border-box",
    zIndex: 10,
  },

  navLogo: {
    fontFamily: '"Suez One", serif',
    fontSize: "1.35rem",
    color: "#111319",
    textDecoration: "none",
  },

  navCta: {
    background: "#111319",
    color: "#fff",
    textDecoration: "none",
    fontSize: "0.92rem",
    fontWeight: 500,
    padding: "0.5rem 1.1rem",
    borderRadius: 8,
  },

  heroArea: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
    paddingTop: "clamp(1rem, 3vw, 2.5rem)",
  },

  title: {
    margin: 0,
    fontSize: "clamp(2.6rem, 5.8vw, 4.5rem)",
    lineHeight: 1.06,
    letterSpacing: "-0.04em",
    fontWeight: 700,
    color: "#111319",
    textAlign: "center",
  },

  subtitle: {
    marginTop: "0.8rem",
    color: "rgba(20,23,32,0.5)",
    fontSize: "clamp(0.95rem, 1.6vw, 1.12rem)",
    lineHeight: 1.55,
    maxWidth: 580,
    textAlign: "center",
    padding: "0 1rem",
  },

  actions: {
    marginTop: "1.2rem",
    display: "flex",
    justifyContent: "center",
    gap: "0.75rem",
    flexWrap: "wrap",
  },

  btnBase: {
    minWidth: 160,
    height: 46,
    borderRadius: 999,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.06rem",
    fontWeight: 500,
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
  },

  btnPrimary: {
    background: "#111319",
    color: "#fff",
    boxShadow: "0 8px 22px rgba(17,19,25,0.22)",
  },

  btnSecondary: {
    background: "#fff",
    color: "#1a1f2b",
    border: "1px solid rgba(16,19,28,0.1)",
    boxShadow: "0 2px 8px rgba(17,20,28,0.04)",
  },

  stage: {
    position: "relative",
    width: "100%",
    flex: 1,
    minHeight: 0,
    marginTop: "1.5rem",
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
    background: "repeating-conic-gradient(from 214deg at 52% 58%, rgba(248,193,66,0.5) 0deg 0.36deg, transparent 0.36deg 1.02deg)",
    opacity: 0.85,
    WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.95) 60%, transparent 85%)",
    maskImage: "linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.95) 60%, transparent 85%)",
    mixBlendMode: "multiply",
  },

  beamRight: {
    background: "repeating-conic-gradient(from -34deg at 48% 58%, rgba(49,210,190,0.55) 0deg 0.34deg, transparent 0.34deg 1deg)",
    opacity: 0.82,
    WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.96) 60%, transparent 85%)",
    maskImage: "linear-gradient(to left, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.96) 60%, transparent 85%)",
    mixBlendMode: "multiply",
  },

  colorCore: {
    position: "absolute",
    left: "50%",
    top: "42%",
    transform: "translate(-50%, -50%)",
    width: "min(500px, 75vw)",
    height: 300,
    borderRadius: 24,
    background: "linear-gradient(96deg, rgba(250,126,109,0.5) 0%, rgba(245,207,73,0.55) 34%, rgba(114,132,245,0.4) 61%, rgba(73,223,201,0.5) 100%)",
    filter: "blur(20px)",
    opacity: 0.9,
  },

  centerPanel: {
    position: "absolute",
    left: "50%",
    top: "42%",
    transform: "translate(-50%, -50%)",
    width: "min(360px, 56vw)",
    height: 260,
    borderRadius: 18,
    background: "rgba(250,252,255,0.3)",
    border: "1px solid rgba(255,255,255,0.6)",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    boxShadow: "0 12px 30px rgba(17,20,28,0.06), 0 -1px 0 rgba(255,255,255,0.45) inset",
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
    fontSize: "clamp(5rem, 18vw, 9.5rem)",
    lineHeight: 0.88,
    letterSpacing: "0.03em",
    background: "linear-gradient(178deg, #f5f5f5 0%, #d7d9de 32%, #8e9199 60%, #1d2129 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    zIndex: 3,
    userSelect: "none",
  },

  floatingLetter: {
    position: "absolute",
    fontFamily: '"Suez One", serif',
    color: "rgba(17,19,25,0.06)",
    pointerEvents: "none",
    userSelect: "none",
    zIndex: 0,
  },
};

export default function LandingMockupPage() {
  return (
    <main style={S.page}>
      <div style={S.bgGrid} aria-hidden="true" />

      <nav style={S.nav}>
        <Link href="/" style={S.navLogo}>
          ציידת האותיות
        </Link>
        <Link href="/auth/register" style={S.navCta}>הרשמה</Link>
      </nav>

      <div style={S.heroArea}>
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
          <Link href="/" style={{ ...S.btnBase, ...S.btnPrimary }}>
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
