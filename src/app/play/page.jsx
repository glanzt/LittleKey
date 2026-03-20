"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/lib/game-context";
import { PAGE_BG } from "@/lib/game-constants";
import { FloatingLettersBackground } from "@/styles/shared";

var GAME_CARDS = [
  {
    id: "keyboard",
    icon: "⌨️",
    title: "משחק מקלדת",
    description: "מקשיבים לאות ומוצאים אותה על המקלדת צעד אחר צעד.",
    accent: "#E74C3C",
    accentSoft: "rgba(231,76,60,0.12)",
  },
  {
    id: "match",
    icon: "🃏",
    title: "התאמת קלפים",
    description: "הופכים קלפים, מגלים זוגות, ולומדים תוך כדי משחק.",
    accent: "#7C5CFC",
    accentSoft: "rgba(124,92,252,0.12)",
  },
  {
    id: "wheel",
    icon: "🎡",
    title: "גלגל הרגשות",
    description: "מסובבים, מגלים רגש, ובוחרים את התמונה המתאימה.",
    accent: "#F39C12",
    accentSoft: "rgba(243,156,18,0.14)",
  },
];

export default function PlayPage() {
  var game = useGame();
  var router = useRouter();
  var _sp = useState(false); var showPlayPrompt = _sp[0]; var setShowPlayPrompt = _sp[1];

  function handleKeyboardGame() {
    if (game.sync.isAuthenticated) {
      router.push("/play/levels");
      return;
    }
    setShowPlayPrompt(true);
  }

  function handleMatchGame() {
    router.push("/play/match");
  }

  function handleWheelGame() {
    router.push("/play/wheel");
  }

  return (
    <div style={{ ...PAGE_BG, justifyContent: "flex-start", paddingTop: "clamp(2rem, 5vw, 3rem)", fontFamily: "'Secular One', 'Rubik', sans-serif", background: "linear-gradient(180deg, #fffdf8 0%, #fff7f0 48%, #f8fbff 100%)" }}>
      <FloatingLettersBackground />

      <div style={{ width: "100%", maxWidth: 1120, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 1rem 2rem", boxSizing: "border-box" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.45rem",
          padding: "0.5rem 0.95rem", borderRadius: 999,
          background: "rgba(255,255,255,0.78)", border: "1px solid rgba(17,19,25,0.07)",
          boxShadow: "0 12px 28px rgba(17,19,25,0.06)", marginBottom: "0.9rem",
          fontFamily: "'Rubik', sans-serif", color: "rgba(17,19,25,0.66)", fontSize: "0.92rem",
        }}>
          בוחרים משחק, משחקים, ולומדים בקצב נעים
        </div>
        <h1 style={{ fontSize: "clamp(2.6rem, 5.8vw, 4.5rem)", fontFamily: "'Suez One', serif", color: "#111319", margin: "0 0 0.5rem", textAlign: "center", letterSpacing: "-0.04em" }}>
          ציידת האותיות
        </h1>
        <p style={{
          margin: "0 0 1.4rem", maxWidth: 640, textAlign: "center",
          fontFamily: "'Rubik', sans-serif", fontSize: "clamp(1rem, 1.8vw, 1.12rem)",
          lineHeight: 1.7, color: "rgba(17,19,25,0.58)", padding: "0 0.5rem",
        }}>
          עולם קטן של משחקי אותיות ורגשות, עם משימות ברורות, הצלחות קטנות,
          והרבה סקרנות בדרך.
        </p>

        {game.sync.isAuthenticated && game.activeProfile ? (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.55rem",
            background: "rgba(255,255,255,0.84)", borderRadius: 999, padding: "0.55rem 1.05rem", marginBottom: "2rem",
            border: "1px solid rgba(17,19,25,0.06)", boxShadow: "0 10px 24px rgba(17,19,25,0.05)",
            color: "#111319", fontFamily: "'Rubik', sans-serif",
          }}>
            <span style={{ fontSize: "1.3rem" }}>{game.activeProfile.avatar}</span>
            <span>משחקת עכשיו: <strong>{game.activeProfile.name}</strong></span>
          </div>
        ) : (
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <a href="/auth/signin?callbackUrl=%2Fplay" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              padding: "0.8rem 1.7rem", fontSize: "1rem", fontFamily: "'Secular One', sans-serif",
              background: "rgba(255,255,255,0.92)", color: "#111319", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 999,
              textDecoration: "none", boxShadow: "0 12px 26px rgba(17,19,25,0.06)",
            }}>התחברות לשמירת התקדמות</a>
            <div style={{ marginTop: "0.7rem" }}>
              <a href="/auth/register?callbackUrl=%2Fplay" style={{ fontSize: "0.9rem", color: "rgba(17,19,25,0.5)", fontFamily: "'Rubik', sans-serif", textDecoration: "underline" }}>
                אין לך חשבון? הרשמה
              </a>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.2rem", width: "100%", maxWidth: 940 }}>
          {GAME_CARDS.map(function(card) {
            var actionText = card.id === "keyboard"
              ? (game.sync.isAuthenticated ? "לבחירת שלבים" : "התחילי לשחק")
              : card.id === "match"
                ? "למשחק הקלפים"
                : "לגלגל ולנחש";

            var handleClick = card.id === "keyboard"
              ? handleKeyboardGame
              : card.id === "match"
                ? handleMatchGame
                : handleWheelGame;

            return (
              <button key={card.id} onClick={handleClick} style={{
                textAlign: "right", background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,252,247,0.94))", border: "1px solid rgba(17,19,25,0.07)",
                borderRadius: 32, padding: "1.45rem", cursor: "pointer", width: "100%",
                boxShadow: "0 18px 38px rgba(17,19,25,0.08)", transition: "transform 0.18s ease, box-shadow 0.18s ease",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: -28, left: -24, width: 120, height: 120,
                  borderRadius: "50%", background: card.accentSoft, filter: "blur(4px)", opacity: 0.9,
                }} />
                <div style={{
                  width: 78, height: 78, borderRadius: 24, background: "white",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.6rem", marginBottom: "1rem",
                  boxShadow: "0 12px 24px rgba(17,19,25,0.08)", position: "relative", zIndex: 1,
                  border: "1px solid rgba(17,19,25,0.05)",
                }}>
                  <div style={{
                    width: 62, height: 62, borderRadius: 20, background: card.accentSoft,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{card.icon}</div>
                </div>
                <h2 style={{ fontFamily: "'Secular One', sans-serif", fontSize: "1.4rem", color: "#111319", margin: "0 0 0.45rem", position: "relative", zIndex: 1 }}>
                  {card.title}
                </h2>
                <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: "0.98rem", color: "rgba(17,19,25,0.56)", margin: "0 0 1.25rem", minHeight: 56, lineHeight: 1.62, position: "relative", zIndex: 1 }}>
                  {card.description}
                </p>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "0.4rem",
                  color: card.accent, fontFamily: "'Secular One', sans-serif", fontSize: "0.98rem", position: "relative", zIndex: 1,
                }}>
                  <span>{actionText}</span>
                  <span>←</span>
                </div>
              </button>
            );
          })}
        </div>

        <button onClick={function() { router.push("/play/settings"); }} style={{
          marginTop: "1.75rem", padding: "0.85rem 1.5rem", borderRadius: 999,
          border: "1px solid rgba(17,19,25,0.08)", background: "rgba(255,255,255,0.9)", cursor: "pointer", fontSize: "1rem",
          boxShadow: "0 10px 24px rgba(17,19,25,0.05)", zIndex: 2, fontFamily: "'Secular One', sans-serif", color: "#111319",
        }}>הגדרות</button>
      </div>

      {showPlayPrompt ? (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
        }} onClick={function() { setShowPlayPrompt(false); }}>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            background: "white", borderRadius: 24, padding: "2.2rem 2rem",
            textAlign: "center", direction: "rtl",
            boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
            maxWidth: 380, width: "90%",
            animation: "playPromptPop 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }} onClick={function(e) { e.stopPropagation(); }}>
            <div style={{ fontSize: "2.8rem", marginBottom: "0.6rem" }}>💾</div>
            <h2 style={{ fontFamily: "'Secular One', sans-serif", fontSize: "1.25rem", color: "#111319", margin: "0 0 0.5rem" }}>רוצה לשמור את ההתקדמות?</h2>
            <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: "0.9rem", color: "#888", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
              התחברו כדי לשמור ציונים והתקדמות במשחק המקלדת
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
              <a href="/auth/signin?callbackUrl=%2Fplay" style={{
                padding: "0.75rem", fontSize: "1.05rem", fontFamily: "'Secular One', sans-serif",
                background: "#111319", color: "white", border: "none", borderRadius: 999,
                cursor: "pointer", textDecoration: "none", textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}>התחברות</a>
              <a href="/auth/register?callbackUrl=%2Fplay" style={{
                padding: "0.75rem", fontSize: "1.05rem", fontFamily: "'Secular One', sans-serif",
                background: "#7C5CFC", color: "white", border: "none", borderRadius: 999,
                cursor: "pointer", textDecoration: "none", textAlign: "center",
                boxShadow: "0 4px 12px rgba(124,92,252,0.3)",
              }}>הרשמה</a>
              <button onClick={function() { setShowPlayPrompt(false); game.startGame(null, true); }} style={{
                padding: "0.6rem", fontSize: "0.9rem", fontFamily: "'Rubik', sans-serif",
                background: "none", color: "#999", border: "none",
                cursor: "pointer", textDecoration: "underline",
              }}>רק לשחק בלי לשמור</button>
            </div>
          </div>
        </div>
      ) : null}

      <style>{
        "@keyframes playPromptPop { 0%{ transform: translate(-50%,-50%) scale(0.8); opacity: 0 } 100%{ transform: translate(-50%,-50%) scale(1); opacity: 1 } }"
      }</style>
    </div>
  );
}
