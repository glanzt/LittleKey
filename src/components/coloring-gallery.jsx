"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  COLORING_ARTWORKS,
  COLORING_PALETTE,
  getArtworkDifficultyMeta,
  getArtworkDifficultyScore,
  getArtworkViewport,
} from "@/lib/coloring-data";
import {
  clearAllColoringProgress,
  getCompletedColoringIds,
  hasAnyColoringProgress,
  loadColoringProgress,
} from "@/lib/coloring-storage";

function ArtworkCard(props) {
  var artwork = props.artwork;
  var completed = props.completed;
  var filled = loadColoringProgress(artwork.id);
  var hasProgress = Object.keys(filled).length > 0;
  var viewport = getArtworkViewport(artwork);
  var difficulty = getArtworkDifficultyMeta(artwork);

  return (
    <Link href={"/play/coloring/" + artwork.id} style={{ textDecoration: "none" }}>
      <div style={{
        position: "relative",
        borderRadius: 28,
        padding: "1rem",
        background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.94))",
        border: completed ? "2px solid rgba(34,197,94,0.38)" : "1px solid rgba(184,199,218,0.35)",
        boxShadow: "0 24px 42px rgba(111, 131, 157, 0.12)",
        color: "#0f172a",
        display: "block",
        minHeight: 260,
      }}>
        {completed ? (
          <div style={{
            position: "absolute",
            top: 12,
            left: 12,
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "#22c55e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontFamily: "'Secular One', sans-serif",
            fontSize: "1rem",
          }}>✓</div>
        ) : null}

        <div style={{
          borderRadius: 22,
          background: "linear-gradient(180deg, #ffffff, #eef4fb)",
          border: "1px solid rgba(191,219,254,0.45)",
          padding: 12,
          marginBottom: "0.95rem",
        }}>
          <svg viewBox={viewport.viewBox} preserveAspectRatio="xMidYMid meet" style={{ display: "block", width: "100%", aspectRatio: "1 / 1" }}>
            <rect x={viewport.minX} y={viewport.minY} width={viewport.width} height={viewport.height} fill="#f8fafc" rx="10" />
            {artwork.paths.map(function(path) {
              var fillColorId = filled[path.id];
              var fillColor = COLORING_PALETTE.find(function(color) { return color.id === fillColorId; });
              return (
                <path
                  key={path.id}
                  d={path.d}
                  fill={fillColor ? fillColor.hex : "rgba(29,41,61,0.06)"}
                  stroke={fillColor ? fillColor.hex : "#1e3a5f"}
                  strokeWidth={fillColor ? "1" : "2.6"}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        </div>

        <div style={{ fontFamily: "'Secular One', sans-serif", fontSize: "1.1rem", color: "#1f2937", marginBottom: "0.45rem" }}>
          {artwork.title}
        </div>

        <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginBottom: "0.55rem" }}>
          <span style={{
            borderRadius: 999,
            padding: "0.35rem 0.7rem",
            background: "rgba(103,112,181,0.12)",
            color: "#4c5ca9",
            fontFamily: "'Rubik', sans-serif",
            fontSize: "0.82rem",
            fontWeight: 700,
          }}>
            {difficulty.label}
          </span>
          <span style={{
            borderRadius: 999,
            padding: "0.35rem 0.7rem",
            background: "rgba(59,130,246,0.1)",
            color: "#2563eb",
            fontFamily: "'Rubik', sans-serif",
            fontSize: "0.82rem",
            fontWeight: 700,
          }}>
            {difficulty.score} צבעים
          </span>
        </div>

        <div style={{
          fontFamily: "'Rubik', sans-serif",
          fontSize: "0.9rem",
          color: hasProgress ? "#0f766e" : "rgba(71,85,105,0.86)",
          lineHeight: 1.6,
        }}>
          {completed ? "סיימת את הציור הזה. אפשר לחזור ולצבוע שוב." : hasProgress ? "יש כאן התקדמות שמחכה לך." : "פותחים ציור חדש ומתחילים לצבוע."}
        </div>
      </div>
    </Link>
  );
}

export default function ColoringGallery() {
  var _pv = useState(0); var progressVersion = _pv[0]; var setProgressVersion = _pv[1];

  useEffect(function() {
    function refresh() {
      setProgressVersion(function(version) { return version + 1; });
    }

    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return function() {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  var visibleArtworks = useMemo(function() {
    return COLORING_ARTWORKS
      .slice()
      .sort(function(left, right) {
        var scoreDiff = getArtworkDifficultyScore(left) - getArtworkDifficultyScore(right);
        return scoreDiff !== 0 ? scoreDiff : left.title.localeCompare(right.title, "he");
      });
  }, []);

  var completedIds = useMemo(function() {
    return getCompletedColoringIds(COLORING_ARTWORKS);
  }, [progressVersion]);

  var canResetAll = useMemo(function() {
    return hasAnyColoringProgress(COLORING_ARTWORKS);
  }, [progressVersion]);

  function handleResetAll() {
    if (!canResetAll) return;
    if (!window.confirm("למחוק את כל ההתקדמות של הציורים?")) return;
    clearAllColoringProgress(COLORING_ARTWORKS);
    setProgressVersion(function(version) { return version + 1; });
  }

  return (
    <div style={{
      minHeight: "100vh",
      direction: "rtl",
      background: "linear-gradient(180deg, #fdf7f0 0%, #f8fbff 42%, #eef7ff 100%)",
      padding: "clamp(1.4rem, 3vw, 2.1rem)",
      boxSizing: "border-box",
    }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{
          borderRadius: 34,
          background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,250,244,0.88))",
          border: "1px solid rgba(255,194,149,0.26)",
          boxShadow: "0 28px 58px rgba(116, 90, 70, 0.1)",
          padding: "clamp(1.2rem, 3vw, 2rem)",
          marginBottom: "1.25rem",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ maxWidth: 620 }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                borderRadius: 999,
                background: "rgba(103,112,181,0.12)",
                color: "#4c5ca9",
                padding: "0.5rem 0.8rem",
                fontFamily: "'Secular One', sans-serif",
                fontSize: "0.92rem",
                marginBottom: "0.9rem",
              }}>
                משחק צביעה חדש בתוך MAY
              </div>
              <h1 style={{
                margin: "0 0 0.55rem",
                fontFamily: "'Suez One', serif",
                fontSize: "clamp(2.2rem, 5vw, 4rem)",
                color: "#2b2540",
                lineHeight: 1.05,
              }}>
                צובעים סיפור
              </h1>
              <p style={{
                margin: 0,
                fontFamily: "'Rubik', sans-serif",
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "rgba(71,85,105,0.9)",
              }}>
                בוחרים ציור, ממשיכים מהמקום שבו עצרתם, וצובעים בחופשיות עם כל צבע שתרצו.
              </p>
            </div>

            <div style={{ display: "grid", gap: "0.75rem", minWidth: "min(100%, 300px)" }}>
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                <span style={{ borderRadius: 999, padding: "0.5rem 0.8rem", background: "#f0fdf4", color: "#15803d", fontFamily: "'Secular One', sans-serif" }}>
                  {visibleArtworks.length} ציורים זמינים
                </span>
                <span style={{ borderRadius: 999, padding: "0.5rem 0.8rem", background: "#eff6ff", color: "#2563eb", fontFamily: "'Secular One', sans-serif" }}>
                  {completedIds.size} הושלמו
                </span>
              </div>
              <button onClick={handleResetAll} disabled={!canResetAll} style={{
                borderRadius: 999,
                border: canResetAll ? "1px solid rgba(248,113,113,0.35)" : "1px solid rgba(203,213,225,0.55)",
                background: canResetAll ? "#fff1f2" : "#f8fafc",
                color: canResetAll ? "#be123c" : "#94a3b8",
                cursor: canResetAll ? "pointer" : "not-allowed",
                fontFamily: "'Secular One', sans-serif",
                fontSize: "0.92rem",
                padding: "0.85rem 1rem",
              }}>
                אפס את כל הציורים
              </button>
            </div>
          </div>

          <p style={{
            margin: "1.1rem 0 0",
            fontFamily: "'Rubik', sans-serif",
            color: "rgba(71,85,105,0.82)",
            lineHeight: 1.6,
          }}>
            כל הציורים פתוחים כברירת מחדל, ואפשר לבחור כל צבע לכל אזור.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
        }}>
          {visibleArtworks.map(function(artwork) {
            return (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                completed={completedIds.has(artwork.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
