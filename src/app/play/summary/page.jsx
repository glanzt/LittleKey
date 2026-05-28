"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/lib/game-context";
import { GameBackgroundMusic } from "@/components/game-background-music";
import { PAGE_BG, TTC_OUTLIER_MS } from "@/lib/game-constants";
import { FloatingLettersBackground } from "@/styles/shared";

export default function SummaryPage() {
  var game = useGame();
  var router = useRouter();

  var session = game.isGuestGame ? game.lastGameSession : (game.sessions.length > 0 ? game.sessions[game.sessions.length - 1] : null);

  // Guard: no session data → redirect
  useEffect(function() {
    if (!session) {
      router.replace(game.sync.isAuthenticated ? "/play/levels" : "/play");
    }
  }, [session]);

  if (!session) return null;

  var res = session.letterResults || game.letterResults || [];
  var perfectCount = res.filter(function(r) { return r.status === "perfect"; }).length;
  var withErrorsCount = res.filter(function(r) { return r.status === "withErrors"; }).length;
  var helpedCount = res.filter(function(r) { return r.status === "helpedPerfect" || r.status === "helpedWithErrors"; }).length;

  var ca = session.attempts.filter(function(a) { return a.isCorrect; });
  var validCa = ca.filter(function(a) { return a.ttc < TTC_OUTLIER_MS; });
  var fastest = validCa.length > 0 ? validCa.reduce(function(a, b) { return a.ttc < b.ttc ? a : b; }) : null;
  var slowest = validCa.length > 0 ? validCa.reduce(function(a, b) { return a.ttc > b.ttc ? a : b; }) : null;

  var independentAttempts = session.attempts.filter(function(a) {
    var letterRes = res.find(function(r) { return r.letter === a.letter && (r.status === "helpedPerfect" || r.status === "helpedWithErrors"); });
    return !letterRes;
  });
  var independentCorrect = independentAttempts.filter(function(a) { return a.isCorrect; });
  var realAccuracy = independentAttempts.length > 0 ? Math.round((independentCorrect.length / independentAttempts.length) * 100) : 0;
  var validIndependent = independentCorrect.filter(function(a) { return a.ttc < TTC_OUTLIER_MS; });
  var realAvgTtc = validIndependent.length > 0 ? Math.round(validIndependent.reduce(function(s, a) { return s + a.ttc; }, 0) / validIndependent.length) : 0;

  var isGuest = game.isGuestGame;
  var currentGameLevel = game.currentGameLevel;

  function handlePlayAgain() {
    if (isGuest) {
      game.startGame(null, true);
    } else if (currentGameLevel != null) {
      var nextLevel = currentGameLevel + 1;
      if (nextLevel <= 1000) {
        game.startGame(nextLevel);
      } else {
        router.push("/play/levels");
      }
    } else {
      game.startGame();
    }
  }

  return (
    <div style={PAGE_BG}>
      <GameBackgroundMusic />
      <FloatingLettersBackground />
      {currentGameLevel != null ? (
        <div style={{
          background: "#111319", borderRadius: 30, padding: "0.4rem 1.5rem",
          marginBottom: "0.5rem", boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
          fontSize: "1.1rem", color: "white", fontWeight: "600", fontFamily: "'Secular One', sans-serif", zIndex: 2,
        }}>
          שלב {currentGameLevel}
        </div>
      ) : null}
      <h1 style={{ fontFamily: "'Suez One', serif", fontSize: "clamp(1.8rem, 6vw, 2.8rem)", color: "#111319", marginBottom: "1.5rem", zIndex: 2 }}>סיכום משחק</h1>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: "1.5rem", maxWidth: 450, zIndex: 2 }}>
        {res.map(function(r, i) {
          var isHelped = r.status === "helpedPerfect" || r.status === "helpedWithErrors";
          var bg = r.status === "perfect" ? "linear-gradient(135deg, #27AE60, #2ECC71)" :
                   r.status === "withErrors" ? "linear-gradient(135deg, #F39C12, #E67E22)" :
                   isHelped ? "linear-gradient(135deg, #3498DB, #2980B9)" : "rgba(0,0,0,0.06)";
          var statusIcon = r.status === "perfect" ? "⭐" : r.status === "withErrors" ? "✓" : isHelped ? "👤" : "";
          return (
            <div key={i} style={{
              width: 44, height: 44, borderRadius: 12,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              background: bg,
              color: r.status === "pending" ? "#ccc" : "white",
              fontFamily: "'Suez One', serif", fontSize: "1.1rem",
              boxShadow: r.status !== "pending" ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
              animation: "popIn 0.3s ease " + (i * 0.08) + "s both"
            }}>
              <span>{r.letter}</span>
              <span style={{ fontSize: "0.5rem", marginTop: -2 }}>
                {statusIcon}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.8rem", maxWidth: 420, width: "100%", marginBottom: "1.5rem", zIndex: 2 }}>
        {[
          { label: "מושלם!", value: perfectCount, icon: "⭐", color: "#27AE60" },
          { label: "עם טעויות", value: withErrorsCount, icon: "💪", color: "#F39C12" },
          { label: "עם עזרה", value: helpedCount, icon: "👤", color: "#3498DB" },
          { label: "דיוק (עצמאי)", value: realAccuracy + "%", icon: "🎯", color: "#7C5CFC" },
          { label: "זמן ממוצע", value: realAvgTtc > 0 ? (realAvgTtc / 1000).toFixed(1) + "s" : "-", icon: "⏱️", color: "#E74C3C" }
        ].map(function(stat, i) {
          return (
            <div key={i} style={{
              background: "white", borderRadius: 20, padding: "1.2rem",
              textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              animation: "popIn 0.4s ease " + (0.3 + i * 0.1) + "s both"
            }}>
              <div style={{ fontSize: "1.5rem" }}>{stat.icon}</div>
              <div style={{ fontSize: "1.8rem", fontWeight: "700", color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: "0.85rem", color: "#999" }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      {fastest ? (
        <div style={{ background: "white", borderRadius: 16, padding: "1rem 2rem", maxWidth: 400, width: "100%", marginBottom: "1rem", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", fontSize: "1rem", zIndex: 2 }}>
          <span>🚀 מהירה: <strong>{fastest.letter}</strong> ({(fastest.ttc / 1000).toFixed(1)}s)</span>
          <span>🐢 איטית: <strong>{slowest.letter}</strong> ({(slowest.ttc / 1000).toFixed(1)}s)</span>
        </div>
      ) : null}

      {!isGuest && currentGameLevel != null ? (
        <button onClick={handlePlayAgain} style={{
          marginTop: "1.5rem", zIndex: 2,
          width: 90, height: 90, borderRadius: "50%",
          background: "linear-gradient(135deg, #27AE60, #2ECC71)", border: "none",
          cursor: "pointer", boxShadow: "0 6px 24px rgba(39,174,96,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2.5rem", color: "white",
          transition: "transform 0.2s, box-shadow 0.2s",
          animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.3s both",
        }}>➜</button>
      ) : null}

      <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", justifyContent: "center", marginTop: "1rem", zIndex: 2 }}>
        {isGuest ? (
          <button onClick={handlePlayAgain} style={{ padding: "0.85rem 2.5rem", fontSize: "1.2rem", fontFamily: "'Secular One'", background: "#111319", color: "white", border: "none", borderRadius: "999px", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.18)" }}>
            שחקי שוב!
          </button>
        ) : null}
        {!isGuest && currentGameLevel != null ? (
          <button onClick={function() { router.push("/play/levels"); }} style={{ padding: "0.7rem 1.8rem", fontSize: "0.95rem", fontFamily: "'Secular One'", background: "white", color: "#111319", border: "1px solid rgba(0,0,0,0.12)", borderRadius: "999px", cursor: "pointer" }}>שלבים</button>
        ) : null}
        <button onClick={function() { router.push("/play"); }} style={{ padding: "0.7rem 1.8rem", fontSize: "0.95rem", fontFamily: "'Secular One'", background: "white", color: "#666", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "999px", cursor: "pointer" }}>
          {isGuest ? "מסך ראשי" : "בית"}
        </button>
      </div>

      <style>{
        "@keyframes popIn { 0%{ transform: scale(0.5); opacity: 0 } 100%{ transform: scale(1); opacity: 1 } }"
      }</style>
    </div>
  );
}
