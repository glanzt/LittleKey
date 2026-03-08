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
    description: "שומעים אות ולוחצים על המקש המתאים במקלדת.",
    accent: "#E74C3C",
    accentSoft: "rgba(231,76,60,0.12)",
  },
  {
    id: "match",
    icon: "🃏",
    title: "התאמת קלפים",
    description: "הופכים קלפים ומחפשים זוגות של אותיות בעברית.",
    accent: "#7C5CFC",
    accentSoft: "rgba(124,92,252,0.12)",
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

  return (
    <div style={{ ...PAGE_BG, justifyContent: "flex-start", paddingTop: "clamp(2rem, 5vw, 3rem)", fontFamily: "'Secular One', 'Rubik', sans-serif" }}>
      <FloatingLettersBackground />

      <div style={{ width: "100%", maxWidth: 1120, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 1rem 2rem", boxSizing: "border-box" }}>
        <h1 style={{ fontSize: "clamp(2.6rem, 5.8vw, 4.5rem)", fontFamily: "'Suez One', serif", color: "#111319", margin: "0 0 0.5rem", textAlign: "center", letterSpacing: "-0.04em" }}>
          ציידת האותיות
        </h1>
        <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.2rem)", color: "rgba(20,23,32,0.48)", fontFamily: "'Rubik', sans-serif", margin: "0 0 0.8rem", textAlign: "center", maxWidth: 700 }}>
          בחרי את המשחק שמתאים עכשיו: תרגול מקלדת קולי או משחק התאמת קלפים עם אותיות בעברית.
        </p>

        {game.sync.isAuthenticated && game.activeProfile ? (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.55rem",
            background: "rgba(17,19,25,0.06)", borderRadius: 999, padding: "0.45rem 1rem", marginBottom: "2rem",
            color: "#111319", fontFamily: "'Rubik', sans-serif",
          }}>
            <span style={{ fontSize: "1.3rem" }}>{game.activeProfile.avatar}</span>
            <span>משחקת עכשיו: <strong>{game.activeProfile.name}</strong></span>
          </div>
        ) : (
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <a href="/auth/signin?callbackUrl=%2Fplay" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              padding: "0.75rem 1.6rem", fontSize: "1rem", fontFamily: "'Secular One', sans-serif",
              background: "white", color: "#111319", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 999,
              textDecoration: "none", boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}>התחברות לשמירת התקדמות</a>
            <div style={{ marginTop: "0.7rem" }}>
              <a href="/auth/register?callbackUrl=%2Fplay" style={{ fontSize: "0.9rem", color: "rgba(17,19,25,0.5)", fontFamily: "'Rubik', sans-serif", textDecoration: "underline" }}>
                אין לך חשבון? הרשמה
              </a>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.2rem", width: "100%", maxWidth: 900 }}>
          {GAME_CARDS.map(function(card) {
            var actionText = card.id === "keyboard"
              ? (game.sync.isAuthenticated ? "לבחירת שלבים" : "התחילי לשחק")
              : "למשחק הקלפים";

            var handleClick = card.id === "keyboard" ? handleKeyboardGame : handleMatchGame;

            return (
              <button key={card.id} onClick={handleClick} style={{
                textAlign: "right", background: "rgba(255,255,255,0.9)", border: "1px solid rgba(17,19,25,0.07)",
                borderRadius: 28, padding: "1.35rem", cursor: "pointer", width: "100%",
                boxShadow: "0 12px 34px rgba(17,19,25,0.08)", transition: "transform 0.18s ease, box-shadow 0.18s ease",
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 18, background: card.accentSoft,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.9rem", marginBottom: "1rem",
                }}>
                  {card.icon}
                </div>
                <h2 style={{ fontFamily: "'Secular One', sans-serif", fontSize: "1.35rem", color: "#111319", margin: "0 0 0.45rem" }}>
                  {card.title}
                </h2>
                <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: "0.96rem", color: "rgba(17,19,25,0.55)", margin: "0 0 1.2rem", minHeight: 48, lineHeight: 1.5 }}>
                  {card.description}
                </p>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "0.4rem",
                  color: card.accent, fontFamily: "'Secular One', sans-serif", fontSize: "0.95rem",
                }}>
                  <span>{actionText}</span>
                  <span>←</span>
                </div>
              </button>
            );
          })}
        </div>

        <button onClick={function() { router.push("/play/settings"); }} style={{
          marginTop: "1.6rem", padding: "0.8rem 1.4rem", borderRadius: 999,
          border: "1px solid rgba(17,19,25,0.08)", background: "white", cursor: "pointer", fontSize: "1rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)", zIndex: 2, fontFamily: "'Secular One', sans-serif", color: "#111319",
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
