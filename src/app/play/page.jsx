"use client";

import { useRouter } from "next/navigation";
import { useGame } from "@/lib/game-context";
import { SKY, SKY_PAGE_BG, SkyScenery } from "@/styles/sky-theme";

var GAME_CARDS = [
  {
    id: "keyboard",
    icon: "⌨️",
    title: "משחק מקלדת",
    description: "מקשיבים לאות ומוצאים אותה במקלדת.",
    accent: SKY.rose,
    accentSoft: "rgba(242,112,156,0.14)",
    href: "/play/levels",
  },
  {
    id: "match",
    icon: "🃏",
    title: "התאמת קלפים",
    description: "הופכים קלפים ומגלים זוגות.",
    accent: SKY.lilac,
    accentSoft: "rgba(155,125,232,0.14)",
    href: "/play/match",
  },
  {
    id: "wheel",
    icon: "🎡",
    title: "גלגל הרגשות",
    description: "מסובבים, מגלים רגש ובוחרים תמונה.",
    accent: SKY.butter,
    accentSoft: "rgba(255,185,56,0.16)",
    href: "/play/wheel",
  },
  {
    id: "coloring",
    icon: "🎨",
    title: "צביעת סיפורים",
    description: "בוחרים ציור, צובעים וממשיכים מאיפה שעצרתם.",
    accent: SKY.mint,
    accentSoft: "rgba(63,191,140,0.14)",
    href: "/play/coloring",
  },
  {
    id: "gan-sheli",
    icon: "🧒",
    title: "גן שלי",
    description: "ספירה, צורות, מיון, סדרות ועוד.",
    accent: SKY.peach,
    accentSoft: "rgba(255,155,131,0.16)",
    href: "/play/gan-sheli",
  },
  {
    id: "alefbet",
    icon: "🔤",
    title: "ללמוד את האלף בית",
    description: "לומדים אות אחרי אות, תמונה אחרי תמונה.",
    accent: SKY.skyblue,
    accentSoft: "rgba(79,168,232,0.14)",
    href: "/play/alefbet",
  },
];

export default function PlayPage() {
  var game = useGame();
  var router = useRouter();

  var greeting = game.sync.isAuthenticated && game.activeProfile
    ? "בוקר טוב, " + game.activeProfile.name + "!"
    : "בוחרים משחק ומתחילים לגלות";

  return (
    <div style={{ ...SKY_PAGE_BG, justifyContent: "flex-start", paddingTop: "clamp(1.6rem, 4vw, 2.6rem)" }}>
      <SkyScenery mode="home" />

      <div style={{ width: "100%", maxWidth: 1120, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 1rem 2.5rem", boxSizing: "border-box" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.45rem",
          padding: "0.45rem 1rem", borderRadius: 999,
          background: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.9)",
          boxShadow: SKY.chipShadow, marginBottom: "0.9rem",
          fontFamily: "'Rubik', sans-serif", color: SKY.inkSoft, fontSize: "0.92rem",
        }}>
          <span aria-hidden="true">☀️</span>
          {greeting}
        </div>

        <h1 style={{
          fontSize: "clamp(2.5rem, 7vw, 4.2rem)", fontFamily: "'Suez One', serif",
          color: SKY.ink, margin: "0 0 0.4rem", textAlign: "center", letterSpacing: "-0.02em",
          textShadow: "0 2px 0 rgba(255,255,255,0.55)",
        }}>
          ציידת האותיות
        </h1>
        <p style={{
          margin: "0 0 1.6rem", maxWidth: 620, textAlign: "center",
          fontFamily: "'Rubik', sans-serif", fontSize: "clamp(1rem, 1.8vw, 1.1rem)",
          lineHeight: 1.7, color: SKY.inkSoft, padding: "0 0.5rem",
        }}>
          עולם קטן של משחקי אותיות ורגשות — לאן נעוף היום?
        </p>

        {game.sync.isAuthenticated && game.activeProfile ? (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.55rem",
            background: "rgba(255,255,255,0.9)", borderRadius: 999, padding: "0.55rem 1.1rem",
            marginBottom: "1.6rem", border: "1px solid rgba(255,255,255,0.95)",
            boxShadow: SKY.chipShadow, color: SKY.ink, fontFamily: "'Rubik', sans-serif",
          }}>
            <span style={{ fontSize: "1.3rem" }}>{game.activeProfile.avatar}</span>
            <span>משחקת עכשיו: <strong>{game.activeProfile.name}</strong></span>
          </div>
        ) : (
          <div style={{ marginBottom: "0.4rem" }} />
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "0.9rem", width: "100%", maxWidth: 880 }}>
          {GAME_CARDS.map(function(card) {
            return (
              <button key={card.id} className="sky-card" onClick={function() { router.push(card.href); }} style={{
                display: "flex", alignItems: "center", gap: "0.85rem",
                textAlign: "right", background: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(255,255,255,0.95)",
                borderRadius: 26, padding: "0.8rem 0.9rem", cursor: "pointer", width: "100%",
                boxShadow: SKY.cardShadow, boxSizing: "border-box",
                transition: "transform 0.16s ease, box-shadow 0.16s ease",
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
                  background: card.accentSoft,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.8rem",
                }}>
                  <span aria-hidden="true">{card.icon}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ fontFamily: "'Suez One', serif", fontSize: "1.12rem", color: SKY.ink, margin: "0 0 0.15rem" }}>
                    {card.title}
                  </h2>
                  <p style={{
                    fontFamily: "'Rubik', sans-serif", fontSize: "0.84rem", color: SKY.inkSoft,
                    margin: 0, lineHeight: 1.5,
                  }}>
                    {card.description}
                  </p>
                </div>
                <div aria-hidden="true" style={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  background: card.accent, color: "white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.15rem", fontWeight: 700,
                  boxShadow: "0 6px 14px " + card.accentSoft.replace("0.14", "0.45").replace("0.16", "0.45"),
                }}>
                  ←
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <style>{
        ".sky-card:hover { transform: translateY(-3px); box-shadow: 0 22px 38px rgba(63,114,175,0.26); }" +
        ".sky-card:active { transform: scale(0.97); }"
      }</style>
    </div>
  );
}
