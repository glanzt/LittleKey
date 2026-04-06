"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  COLORING_ARTWORKS,
  COLORING_PALETTE,
  getArtworkDifficultyScore,
  getArtworkViewport,
} from "@/lib/coloring-data";
import {
  clearAllColoringProgress,
  getCompletedColoringIds,
  hasAnyColoringProgress,
  loadColoringProgress,
} from "@/lib/coloring-storage";

function usePhonePortraitDetector() {
  var _s = useState(false); var show = _s[0]; var setShow = _s[1];

  useEffect(function() {
    function check() {
      var isPhone = window.matchMedia("(max-width: 900px) and (pointer: coarse)").matches;
      var isPortrait = window.matchMedia("(orientation: portrait)").matches;
      setShow(isPhone && isPortrait);
    }
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return function() {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  return show;
}

function ArtworkCard(props) {
  var artwork = props.artwork;
  var completed = props.completed;
  var filled = loadColoringProgress(artwork.id);
  var hasProgress = Object.keys(filled).length > 0;
  var viewport = getArtworkViewport(artwork);

  return (
    <Link href={"/play/coloring/" + artwork.id} style={{ textDecoration: "none" }}>
      <div style={{
        position: "relative",
        borderRadius: 22,
        padding: "0.75rem",
        background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.94))",
        border: completed ? "2px solid rgba(34,197,94,0.38)" : "1px solid rgba(184,199,218,0.35)",
        boxShadow: "0 24px 42px rgba(111, 131, 157, 0.12)",
        color: "#0f172a",
        display: "block",
        minHeight: 200,
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
          borderRadius: 16,
          background: "linear-gradient(180deg, #ffffff, #eef4fb)",
          border: "1px solid rgba(191,219,254,0.45)",
          padding: 8,
          marginBottom: "0.65rem",
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

        <div style={{ fontFamily: "'Secular One', sans-serif", fontSize: "0.95rem", color: "#1f2937", marginBottom: "0.35rem" }}>
          {artwork.title}
        </div>

        {(completed || hasProgress) ? (
          <div style={{
            fontFamily: "'Rubik', sans-serif",
            fontSize: "0.8rem",
            color: hasProgress ? "#0f766e" : "rgba(71,85,105,0.86)",
            lineHeight: 1.5,
          }}>
            {completed ? "סיימת את הציור הזה. אפשר לחזור ולצבוע שוב." : "יש כאן התקדמות שמחכה לך."}
          </div>
        ) : null}
      </div>
    </Link>
  );
}

export default function ColoringGallery() {
  var showRotatePrompt = usePhonePortraitDetector();
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
          borderRadius: 24,
          background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,250,244,0.88))",
          border: "1px solid rgba(255,194,149,0.26)",
          boxShadow: "0 12px 32px rgba(116, 90, 70, 0.08)",
          padding: "1rem 1.5rem",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}>
          <Link href="/play" style={{
            position: "absolute",
            right: "1rem",
            borderRadius: 999,
            textDecoration: "none",
            padding: "0.5rem 0.9rem",
            background: "rgba(255,255,255,0.88)",
            color: "#4c5ca9",
            fontFamily: "'Secular One', sans-serif",
            fontSize: "0.85rem",
            border: "1px solid rgba(103,112,181,0.2)",
          }}>
            חזרה לתפריט
          </Link>
          <h1 style={{
            margin: 0,
            fontFamily: "'Suez One', serif",
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            color: "#2b2540",
            lineHeight: 1.1,
            textAlign: "center",
          }}>
            דפי צביעה
          </h1>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
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

      {showRotatePrompt ? (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(8,30,69,0.86)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1100,
          padding: "1.25rem",
        }}>
          <div style={{
            width: "min(100%, 420px)",
            borderRadius: 28,
            background: "white",
            padding: "1.5rem",
            textAlign: "center",
            boxShadow: "0 24px 70px rgba(0,0,0,0.3)",
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📱</div>
            <div style={{ fontFamily: "'Suez One', serif", fontSize: "1.8rem", color: "#1f2937", marginBottom: "0.65rem" }}>
              הכי נוח לצבוע לרוחב
            </div>
            <p style={{ fontFamily: "'Rubik', sans-serif", color: "#475569", lineHeight: 1.7, margin: "0 0 1rem" }}>
              סובבו את המכשיר למצב רוחב כדי לקבל יותר מקום לציור.
            </p>
            <button onClick={function() {
              try {
                var root = document.documentElement;
                if (root.requestFullscreen && !document.fullscreenElement) root.requestFullscreen();
              } catch (_e) {}
              try {
                if (screen.orientation && typeof screen.orientation.lock === "function") screen.orientation.lock("landscape");
              } catch (_e) {}
            }} style={{
              borderRadius: 999,
              border: "none",
              background: "#4c5ca9",
              color: "white",
              cursor: "pointer",
              fontFamily: "'Secular One', sans-serif",
              fontSize: "1rem",
              padding: "0.9rem 1.2rem",
              width: "100%",
            }}>
              נסו לעבור למסך רוחב
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
