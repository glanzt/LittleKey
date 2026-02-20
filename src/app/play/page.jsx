"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/lib/game-context";
import { PAGE_BG } from "@/lib/game-constants";
import { FloatingLettersBackground } from "@/styles/shared";

export default function PlayPage() {
  var game = useGame();
  var router = useRouter();

  // Auth users go straight to levels
  useEffect(function() {
    if (game.sync.isAuthenticated) {
      router.replace("/play/levels");
    }
  }, [game.sync.isAuthenticated]);

  if (game.sync.isAuthenticated) return null;

  return <HomeScreen onPlay={function() { game.startGame(null, true); }} />;
}

function HomeScreen(props) {
  var onPlay = props.onPlay;
  var _sp = useState(false); var showPlayPrompt = _sp[0]; var setShowPlayPrompt = _sp[1];
  var router = useRouter();

  return (
    <div style={{ ...PAGE_BG, fontFamily: "'Secular One', 'Rubik', sans-serif" }}>
      <FloatingLettersBackground />

      <h1 style={{ fontSize: "clamp(2.6rem, 5.8vw, 4.5rem)", fontFamily: "'Suez One', serif", color: "#111319", margin: "0 0 0.5rem", textAlign: "center", zIndex: 2, letterSpacing: "-0.04em" }}>ציידת האותיות</h1>
      <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.3rem)", color: "rgba(20,23,32,0.45)", fontFamily: "'Rubik', sans-serif", marginBottom: "2.5rem", zIndex: 2, textAlign: "center" }}>ללמוד את המקלדת דרך משחק קולי</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", zIndex: 2, width: "100%", maxWidth: 380 }}>
        <button onClick={function() { setShowPlayPrompt(true); }} style={{
          padding: "0.85rem 2.8rem", fontSize: "clamp(1.1rem, 3.5vw, 1.4rem)", fontFamily: "'Secular One', sans-serif",
          background: "#111319", color: "white",
          border: "none", borderRadius: "999px", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
          width: "100%", transition: "transform 0.2s, box-shadow 0.2s",
        }}>שחקי עכשיו!</button>

        <a href="/auth/signin?callbackUrl=%2Fplay" style={{
          padding: "0.75rem 2.8rem", fontSize: "clamp(0.95rem, 3vw, 1.15rem)", fontFamily: "'Secular One', sans-serif",
          background: "white", color: "#111319",
          border: "1px solid rgba(0,0,0,0.12)", borderRadius: "999px", cursor: "pointer",
          textDecoration: "none", textAlign: "center",
          width: "100%", boxSizing: "border-box",
        }}>התחברות</a>

        <a href="/auth/register?callbackUrl=%2Fplay" style={{
          fontSize: "0.9rem", color: "rgba(17,19,25,0.5)", fontFamily: "'Rubik', sans-serif",
          textDecoration: "underline", cursor: "pointer",
        }}>אין לך חשבון? הרשמה</a>
      </div>

      <button onClick={function() { router.push("/play/settings"); }} style={{
        position: "absolute", bottom: "2rem", right: "2rem", width: 48, height: 48, borderRadius: "50%",
        border: "1px solid rgba(0,0,0,0.08)", background: "white", cursor: "pointer", fontSize: "1.2rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)", zIndex: 2,
      }}>⚙️</button>

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
              התחברו כדי לשמור את הציונים, לעקוב אחרי ההתקדמות ולהמשיך מאיפה שעצרתם
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
              <button onClick={function() { setShowPlayPrompt(false); onPlay(); }} style={{
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
