"use client";

import { useState } from "react";
import { useGame } from "@/lib/game-context";
import { PAGE_BG, LEVELS_PER_PAGE, TOTAL_LEVELS } from "@/lib/game-constants";
import { FloatingLettersBackground } from "@/styles/shared";

export default function LevelsPage() {
  var game = useGame();
  var levelProgress = game.levelProgress;
  var sessionLength = game.settings.sessionLength || 5;

  var currentLevel = levelProgress && levelProgress.currentLevel ? levelProgress.currentLevel : 1;
  var completedCount = levelProgress && levelProgress.levels ? Object.keys(levelProgress.levels).length : 0;
  var levels = levelProgress && levelProgress.levels ? levelProgress.levels : {};

  var totalPages = Math.ceil(TOTAL_LEVELS / LEVELS_PER_PAGE);
  var initialPage = Math.ceil(currentLevel / LEVELS_PER_PAGE);
  var _pg = useState(initialPage); var page = _pg[0]; var setPage = _pg[1];

  var startLevel = (page - 1) * LEVELS_PER_PAGE + 1;
  var endLevel = Math.min(page * LEVELS_PER_PAGE, TOTAL_LEVELS);
  var pageLevels = [];
  for (var i = startLevel; i <= endLevel; i++) pageLevels.push(i);

  function tileStyle(lvl) {
    var isCompleted = levels[lvl] && levels[lvl].completed;
    var isCurrent = lvl === currentLevel;
    var isLocked = lvl > currentLevel;
    var bg = isCurrent ? "#4FA8E8" : isCompleted ? "#3FBF8C" : "rgba(255,255,255,0.62)";
    var color = (isCurrent || isCompleted) ? "white" : "rgba(46,58,89,0.4)";
    return {
      width: 104, height: 104, borderRadius: 24,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: bg, color: color,
      border: "1px solid rgba(255,255,255,0.8)",
      fontFamily: "'Secular One', sans-serif", fontSize: "2rem", fontWeight: 700,
      cursor: isLocked ? "default" : "pointer",
      boxShadow: isCurrent ? "0 10px 22px rgba(79,168,232,0.4)" : isCompleted ? "0 8px 18px rgba(63,191,140,0.28)" : "0 6px 14px rgba(79,134,198,0.12)",
      transition: "transform 0.15s",
      position: "relative",
    };
  }

  function starsFor(lvl) {
    var info = levels[lvl];
    if (!info || !info.stars) return null;
    var s = info.stars;
    return "⭐".repeat(Math.min(s, 3));
  }

  return (
    <div style={{ ...PAGE_BG, justifyContent: "flex-start", fontFamily: "'Secular One', 'Rubik', sans-serif", paddingTop: "1.5rem" }}>
      <FloatingLettersBackground />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: 1050, marginBottom: "0.8rem", zIndex: 2 }}>
        <a href="/" style={{
          fontFamily: "'Suez One', serif", fontSize: "1.2rem", color: "#2E3A59",
          textDecoration: "none", letterSpacing: "-0.02em",
        }}>ציידת האותיות</a>
        <div />
      </div>

      <h1 style={{ fontFamily: "'Suez One', serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", color: "#2E3A59", margin: "0 0 0.3rem", textAlign: "center", zIndex: 2, textShadow: "0 2px 0 rgba(255,255,255,0.5)" }}>
        שלבים
      </h1>
      <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: "0.9rem", color: "rgba(46,58,89,0.55)", margin: "0 0 1.2rem", textAlign: "center", zIndex: 2 }}>
        עמוד {page} מתוך {totalPages}
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 104px)",
        gap: 14,
        justifyContent: "center",
        width: "100%", maxWidth: 900,
        marginBottom: "1.2rem", zIndex: 2,
        direction: "ltr",
      }}>
        {pageLevels.map(function(lvl) {
          var isLocked = lvl > currentLevel;
          var stars = starsFor(lvl);
          return (
            <button
              key={lvl}
              onClick={isLocked ? undefined : function() { game.startGame(lvl); }}
              disabled={isLocked}
              style={tileStyle(lvl)}
            >
              {isLocked ? (
                <span style={{ fontSize: "2rem", opacity: 0.5 }}>🔒</span>
              ) : (
                <>
                  <span>{lvl}</span>
                  {stars ? <span style={{ fontSize: "0.8rem", marginTop: -2, letterSpacing: -1 }}>{stars}</span> : null}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", zIndex: 2 }}>
        <button
          onClick={function() { setPage(function(p) { return Math.min(totalPages, p + 1); }); }}
          disabled={page >= totalPages}
          style={{
            width: 44, height: 44, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.08)",
            background: "white", cursor: page >= totalPages ? "default" : "pointer",
            fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center",
            opacity: page >= totalPages ? 0.3 : 1, boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >→</button>
        <span style={{ fontFamily: "'Secular One', sans-serif", fontSize: "1.1rem", color: "#2E3A59", minWidth: 60, textAlign: "center" }}>
          {totalPages} / {page}
        </span>
        <button
          onClick={function() { setPage(function(p) { return Math.max(1, p - 1); }); }}
          disabled={page <= 1}
          style={{
            width: 44, height: 44, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.08)",
            background: "white", cursor: page <= 1 ? "default" : "pointer",
            fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center",
            opacity: page <= 1 ? 0.3 : 1, boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >←</button>
      </div>

      <div style={{ width: "100%", maxWidth: 500, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: "0.95rem", color: "rgba(46,58,89,0.62)", margin: "0 0 0.6rem", textAlign: "center" }}>
          בכל שלב תקבלו {sessionLength} אותיות רנדומליות. ההתקדמות נשמרת לפי הפרופיל המחובר.
        </p>
        <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: "0.85rem", color: "rgba(46,58,89,0.45)", margin: "0 0 1rem", textAlign: "center" }}>
          שלבים שהושלמו: {completedCount}
        </p>
      </div>

      <button onClick={function() { game.startGame(currentLevel); }} style={{
        padding: "0.85rem 3rem", fontSize: "clamp(1.1rem, 3.5vw, 1.4rem)", fontFamily: "'Secular One', sans-serif",
        background: "linear-gradient(135deg, #4FA8E8, #6FC0F5)", color: "white",
        border: "none", borderRadius: "999px", cursor: "pointer",
        boxShadow: "0 12px 26px rgba(79,168,232,0.4)",
        marginBottom: "2rem", width: "100%", maxWidth: 420, zIndex: 2,
      }}>שחקי עכשיו!</button>
    </div>
  );
}
