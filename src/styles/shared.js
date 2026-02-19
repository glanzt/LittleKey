export const FLOATING_LETTERS = [
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

export const shared = {
  page: {
    minHeight: "100vh",
    background: "#fafafa",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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

  floatingLetter: {
    position: "absolute",
    fontFamily: '"Suez One", serif',
    color: "rgba(17,19,25,0.06)",
    pointerEvents: "none",
    userSelect: "none",
    zIndex: 0,
  },

  card: {
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderRadius: 20,
    border: "1px solid rgba(17,18,23,0.07)",
    padding: "2rem",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 1px 0 rgba(255,255,255,0.7) inset, 0 12px 40px rgba(17,20,28,0.08)",
    boxSizing: "border-box",
    zIndex: 2,
  },

  title: {
    fontFamily: '"Suez One", serif',
    fontSize: "clamp(1.8rem, 5vw, 2.4rem)",
    color: "#111319",
    margin: "0 0 0.3rem",
    textAlign: "center",
  },

  subtitle: {
    color: "rgba(20,23,32,0.45)",
    fontSize: "0.95rem",
    marginBottom: "1.8rem",
    textAlign: "center",
  },

  googleBtn: {
    width: "100%",
    padding: "0.85rem",
    borderRadius: 12,
    border: "1px solid rgba(16,19,28,0.1)",
    background: "#fff",
    cursor: "pointer",
    fontSize: "1rem",
    fontFamily: "'Rubik', sans-serif",
    fontWeight: 500,
    color: "#1a1f2b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.6rem",
    boxShadow: "0 2px 8px rgba(17,20,28,0.04)",
    transition: "background 0.15s, box-shadow 0.15s",
  },

  divider: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    margin: "1.4rem 0",
    color: "rgba(20,23,32,0.25)",
    fontSize: "0.82rem",
  },

  dividerLine: {
    flex: 1,
    height: 1,
    background: "rgba(17,18,23,0.07)",
  },

  input: {
    width: "100%",
    padding: "0.82rem 1rem",
    borderRadius: 10,
    border: "1px solid rgba(16,19,28,0.12)",
    fontSize: "0.95rem",
    marginBottom: "0.7rem",
    fontFamily: "'Rubik', sans-serif",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s",
    background: "#fff",
  },

  submitBtn: {
    width: "100%",
    padding: "0.85rem",
    borderRadius: 12,
    border: "none",
    background: "#111319",
    color: "#fff",
    fontSize: "1.05rem",
    fontFamily: "'Rubik', sans-serif",
    fontWeight: 500,
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(17,19,25,0.2)",
    transition: "opacity 0.15s, transform 0.15s",
    marginTop: "0.3rem",
  },

  error: {
    background: "rgba(220,38,38,0.06)",
    border: "1px solid rgba(220,38,38,0.15)",
    borderRadius: 10,
    padding: "0.6rem 1rem",
    marginBottom: "0.8rem",
    color: "#dc2626",
    fontSize: "0.88rem",
    textAlign: "center",
  },

  footerText: {
    textAlign: "center",
    marginTop: "1.2rem",
    fontSize: "0.88rem",
    color: "rgba(20,23,32,0.4)",
  },

  footerLink: {
    color: "#111319",
    textDecoration: "none",
    fontWeight: 600,
  },

  backLink: {
    marginTop: "1.2rem",
    background: "none",
    border: "none",
    color: "rgba(20,23,32,0.35)",
    cursor: "pointer",
    fontSize: "0.88rem",
    fontFamily: "'Rubik', sans-serif",
    textDecoration: "underline",
    zIndex: 2,
  },
};

export const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export function FloatingLettersBackground() {
  return (
    <>
      <div style={shared.bgGrid} aria-hidden="true" />
      {FLOATING_LETTERS.map((fl, i) => (
        <span
          key={i}
          style={{
            ...shared.floatingLetter,
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
    </>
  );
}
