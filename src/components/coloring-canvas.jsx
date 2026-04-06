"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  COLORING_ARTWORKS,
  COLORING_PALETTE,
  countFilledRegions,
  getArtworkViewport,
  isArtworkComplete,
} from "@/lib/coloring-data";
import {
  clearColoringProgress,
  loadColoringProgress,
  saveColoringProgress,
} from "@/lib/coloring-storage";

function playCrayonSound() {
  try {
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    var ctx = new Ctx();
    var buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.11), ctx.sampleRate);
    var channel = buffer.getChannelData(0);
    for (var index = 0; index < channel.length; index += 1) {
      channel[index] = (Math.random() * 2 - 1) * Math.pow(1 - index / channel.length, 1.65) * 0.09;
    }
    var source = ctx.createBufferSource();
    var gain = ctx.createGain();
    source.buffer = buffer;
    gain.gain.value = 0.55;
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  } catch (_error) {}
}

function useOrientationGate() {
  var _s = useState({ isPhone: false, isPortrait: false }); var viewportState = _s[0]; var setViewportState = _s[1];
  var PHONE_PORTRAIT_QUERY = "(max-width: 900px) and (pointer: coarse)";
  var PHONE_LANDSCAPE_QUERY = "(max-height: 500px) and (pointer: coarse)";
  var PORTRAIT_QUERY = "(orientation: portrait)";

  useEffect(function() {
    function syncViewportState() {
      if (typeof window === "undefined") return;
      var isPortrait = window.matchMedia(PORTRAIT_QUERY).matches;
      setViewportState({
        isPhone: isPortrait
          ? window.matchMedia(PHONE_PORTRAIT_QUERY).matches
          : window.matchMedia(PHONE_LANDSCAPE_QUERY).matches,
        isPortrait: isPortrait,
      });
    }

    syncViewportState();
    var phonePortraitMedia = window.matchMedia(PHONE_PORTRAIT_QUERY);
    var phoneLandscapeMedia = window.matchMedia(PHONE_LANDSCAPE_QUERY);
    var portraitMedia = window.matchMedia(PORTRAIT_QUERY);
    phonePortraitMedia.addEventListener("change", syncViewportState);
    phoneLandscapeMedia.addEventListener("change", syncViewportState);
    portraitMedia.addEventListener("change", syncViewportState);
    window.addEventListener("resize", syncViewportState);
    window.addEventListener("orientationchange", syncViewportState);

    return function() {
      phonePortraitMedia.removeEventListener("change", syncViewportState);
      phoneLandscapeMedia.removeEventListener("change", syncViewportState);
      portraitMedia.removeEventListener("change", syncViewportState);
      window.removeEventListener("resize", syncViewportState);
      window.removeEventListener("orientationchange", syncViewportState);
    };
  }, []);

  async function requestLandscape() {
    try {
      var root = document.documentElement;
      if (root.requestFullscreen && !document.fullscreenElement) {
        await root.requestFullscreen();
      }
    } catch (_error) {}

    try {
      if (screen.orientation && typeof screen.orientation.lock === "function") {
        await screen.orientation.lock("landscape");
      }
    } catch (_error) {}
  }

  return {
    showOverlay: viewportState.isPhone && viewportState.isPortrait,
    isPhone: viewportState.isPhone,
    isPortrait: viewportState.isPortrait,
    requestLandscape: requestLandscape,
  };
}

function ModeBadge() {
  return (
    <div style={{
      borderRadius: 999,
      padding: "0.55rem 0.8rem",
      background: "rgba(245,158,11,0.14)",
      color: "#b45309",
      fontFamily: "'Secular One', sans-serif",
      fontSize: "0.85rem",
    }}>
      צביעה חופשית
    </div>
  );
}

function ActionButton(props) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      disabled={props.disabled}
      style={{
        borderRadius: 999,
        border: props.tone === "warn"
          ? "1px solid " + (props.disabled ? "rgba(203,213,225,0.55)" : "rgba(248,113,113,0.35)")
          : "1px solid " + (props.disabled ? "rgba(203,213,225,0.55)" : "rgba(147,197,253,0.4)"),
        background: props.tone === "warn"
          ? (props.disabled ? "#f8fafc" : "#fff1f2")
          : (props.disabled ? "#f8fafc" : "#eff6ff"),
        color: props.tone === "warn"
          ? (props.disabled ? "#94a3b8" : "#be123c")
          : (props.disabled ? "#94a3b8" : "#2563eb"),
        cursor: props.disabled ? "not-allowed" : "pointer",
        fontFamily: "'Secular One', sans-serif",
        fontSize: "0.9rem",
        padding: "0.85rem 1rem",
        minWidth: 116,
      }}
    >
      {props.children}
    </button>
  );
}

function MiniCrayon(props) {
  var color = props.color;
  var selected = props.selected;
  var _h = useState(false); var hovered = _h[0]; var setHovered = _h[1];
  var tx = selected ? -14 : hovered ? -8 : 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        cursor: "pointer",
        transform: "translateX(" + tx + "px)",
        transition: "transform 0.22s ease-out",
        padding: "3px 0",
      }}
      onMouseEnter={function() { setHovered(true); }}
      onMouseLeave={function() { setHovered(false); }}
      onClick={props.onClick}
      role="button"
      aria-pressed={selected}
      tabIndex={0}
      onKeyDown={function(e) {
        if (e.key === "Enter" || e.key === " ") props.onClick();
      }}
    >
      <svg
        width="120"
        height="32"
        viewBox="0 0 120 32"
        fill="none"
        style={{ display: "block", filter: selected ? "drop-shadow(0 2px 6px rgba(0,0,0,0.25))" : "drop-shadow(0 1px 2px rgba(0,0,0,0.1))" }}
      >
        <path d="M14 4 L6 16 L14 28" fill={color.dark} />
        <rect x="14" y="4" width="78" height="24" rx="2" fill={color.hex} />
        <rect x="14" y="4" width="78" height="12" rx="2" fill={color.light} />
        <rect x="14" y="4" width="78" height="24" rx="2" fill={color.hex} fillOpacity="0.45" />
        <rect x="92" y="2" width="26" height="28" rx="4" fill="#e8e8e8" stroke="#d0d0d0" strokeWidth="0.5" />
        <circle cx="105" cy="16" r="10" fill="white" stroke={selected ? color.dark : "#333"} strokeWidth={selected ? "2" : "1"} />
        <text x="105" y="16" textAnchor="middle" dominantBaseline="central" fontFamily="Heebo, sans-serif" fontWeight="700" fontSize="11" fill="#081e45">
          {props.num}
        </text>
      </svg>
    </div>
  );
}

function MarkerPalette(props) {
  var compact = props.compact;

  return (
    <div style={{
      width: compact ? 108 : 160,
      flexShrink: 0,
      alignSelf: "flex-start",
      position: compact ? "static" : "sticky",
      top: compact ? "auto" : 90,
    }}>
      <div style={{
        background: "white",
        borderRadius: compact ? "0 14px 14px 0" : "0 20px 20px 0",
        padding: compact ? "0.3rem 0.3rem 0.3rem 0.15rem" : "0.7rem 0.5rem 0.7rem 0.3rem",
        boxShadow: "0 12px 32px rgba(15,23,42,0.09)",
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: compact ? 0 : "2px",
          maxHeight: compact ? "calc(100vh - 16px)" : "min(calc(100vh - 220px), 560px)",
          overflowY: "auto",
          overflowX: "hidden",
          padding: compact ? "1px 0" : "2px 0",
        }}>
          {props.colors.map(function(color) {
            return compact ? (
              <div key={color.id} style={{ transform: "scale(0.72)", transformOrigin: "right center", marginTop: -4, marginBottom: -4 }}>
                <MiniCrayon
                  color={color}
                  num={color.id}
                  selected={props.selectedColor === color.id}
                  onClick={function() { props.onSelect(color.id); }}
                />
              </div>
            ) : (
              <MiniCrayon
                key={color.id}
                color={color}
                num={color.id}
                selected={props.selectedColor === color.id}
                onClick={function() { props.onSelect(color.id); }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ColoringCanvas(props) {
  var artworkId = props.artworkId;
  var router = useRouter();
  var orientationGate = useOrientationGate();
  var isPhoneLandscape = orientationGate.isPhone && !orientationGate.isPortrait;
  var artwork = useMemo(function() {
    return COLORING_ARTWORKS.find(function(entry) { return entry.id === artworkId; }) || null;
  }, [artworkId]);
  var viewport = artwork ? getArtworkViewport(artwork) : { viewBox: "0 0 500 500", minX: 0, minY: 0, width: 500, height: 500 };
  var usedColorIds = useMemo(function() {
    if (!artwork) return [];
    return COLORING_PALETTE.map(function(color) { return color.id; });
  }, [artwork]);
  var _sc = useState(usedColorIds[0] || 1); var selectedColor = _sc[0]; var setSelectedColor = _sc[1];
  var _fi = useState(function() { return artwork ? loadColoringProgress(artwork.id) : {}; }); var filled = _fi[0]; var setFilled = _fi[1];
  var _ph = useState([]); var paintHistory = _ph[0]; var setPaintHistory = _ph[1];
  var _dc = useState(false); var showComplete = _dc[0]; var setShowComplete = _dc[1];
  var errorTimerRef = useRef(null);

  useEffect(function() {
    if (!artwork) return;
    var saved = loadColoringProgress(artwork.id);
    setFilled(saved);
    setPaintHistory([]);
    setShowComplete(isArtworkComplete(artwork.paths, saved));
    setSelectedColor(function(previous) {
      return usedColorIds.indexOf(previous) >= 0 ? previous : (usedColorIds[0] || 1);
    });
  }, [artwork, usedColorIds]);

  useEffect(function() {
    return function() {
      clearTimeout(errorTimerRef.current);
    };
  }, []);

  useEffect(function() {
    if (usedColorIds.length === 0) return;
    if (usedColorIds.indexOf(selectedColor) === -1) {
      setSelectedColor(usedColorIds[0]);
    }
  }, [selectedColor, usedColorIds]);

  var filledRegionCount = artwork ? countFilledRegions(artwork.paths, filled) : 0;
  var isFullyDone = artwork ? isArtworkComplete(artwork.paths, filled) : false;
  var visibleArtworks = useMemo(function() {
    return COLORING_ARTWORKS;
  }, []);

  useEffect(function() {
    if (isFullyDone) setShowComplete(true);
  }, [isFullyDone]);

  if (!artwork) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", direction: "rtl" }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Suez One', serif", color: "#1f2937" }}>לא מצאנו את הציור הזה</h2>
          <Link href="/play/coloring" style={{ color: "#4c5ca9", fontFamily: "'Secular One', sans-serif" }}>חזרה לגלריה</Link>
        </div>
      </div>
    );
  }

  function updateProgress(nextFilled, nextHistory) {
    setFilled(nextFilled);
    setPaintHistory(nextHistory || paintHistory);
    setShowComplete(isArtworkComplete(artwork.paths, nextFilled));
    saveColoringProgress(artwork.id, nextFilled);
  }

  function handleFill(pathId) {
    var path = artwork.paths.find(function(entry) { return entry.id === pathId; });
    if (!path) return;

    var nextColorId = selectedColor;
    if (filled[path.id] === nextColorId) return;
    playCrayonSound();
    var nextFilled = Object.assign({}, filled, { [path.id]: nextColorId });
    var nextHistory = paintHistory.concat([{ pathId: pathId, previousColorId: filled[path.id], nextColorId: nextColorId }]);
    updateProgress(nextFilled, nextHistory);
  }

  function handleUndo() {
    var lastStep = paintHistory[paintHistory.length - 1];
    if (!lastStep) return;
    var nextFilled = Object.assign({}, filled);
    if (lastStep.previousColorId == null) delete nextFilled[lastStep.pathId];
    else nextFilled[lastStep.pathId] = lastStep.previousColorId;
    updateProgress(nextFilled, paintHistory.slice(0, -1));
  }

  function handleReset() {
    if (filledRegionCount === 0) return;
    if (!window.confirm("לאפס את הציור הנוכחי?")) return;
    clearColoringProgress(artwork.id);
    updateProgress({}, []);
    setSelectedColor(usedColorIds[0] || 1);
  }

  function handleReplay() {
    clearColoringProgress(artwork.id);
    updateProgress({}, []);
    setShowComplete(false);
    setSelectedColor(usedColorIds[0] || 1);
  }

  function goToRandomArtwork() {
    var pool = visibleArtworks.filter(function(entry) { return entry.id !== artwork.id; });
    var next = pool[Math.floor(Math.random() * pool.length)] || artwork;
    router.push("/play/coloring/" + next.id);
  }

  var svgBlock = (
    <svg viewBox={viewport.viewBox} preserveAspectRatio="xMidYMid meet" style={{ display: "block", width: "100%", maxHeight: isPhoneLandscape ? "calc(100vh - 16px)" : "75vh" }}>
      <rect x={viewport.minX} y={viewport.minY} width={viewport.width} height={viewport.height} fill="white" />
      {artwork.paths.map(function(path) {
        var fillColorId = filled[path.id];
        var fillColor = COLORING_PALETTE.find(function(entry) { return entry.id === (fillColorId || path.colorId); });
        return (
          <g key={path.id}>
            <path
              d={path.d}
              fill={fillColorId ? fillColor.hex : "white"}
              stroke="#111827"
              strokeWidth="1.15"
              strokeLinejoin="round"
              strokeLinecap="round"
              style={{
                cursor: "pointer",
                transition: "fill 0.18s ease, stroke 0.18s ease, opacity 0.18s ease",
              }}
              onClick={function() { handleFill(path.id); }}
            />
          </g>
        );
      })}
    </svg>
  );

  var paletteBlock = (
    <MarkerPalette
      colors={COLORING_PALETTE.filter(function(entry) { return usedColorIds.indexOf(entry.id) >= 0; })}
      selectedColor={selectedColor}
      onSelect={setSelectedColor}
      compact={isPhoneLandscape}
    />
  );

  return (
    <div style={{
      minHeight: "100vh",
      direction: "rtl",
      background: isPhoneLandscape ? "#f8fbff" : "linear-gradient(180deg, #fdf7f0 0%, #f8fbff 42%, #eef7ff 100%)",
      padding: isPhoneLandscape ? "4px" : "clamp(1rem, 2vw, 1.5rem)",
      boxSizing: "border-box",
      position: "relative",
    }}>
      <div style={{ maxWidth: isPhoneLandscape ? "none" : 1280, margin: "0 auto" }}>

        {isPhoneLandscape ? null : (
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.85rem",
            flexWrap: "wrap",
            marginBottom: "1rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", flexWrap: "wrap" }}>
              <Link href="/play/coloring" style={{
                borderRadius: 999,
                textDecoration: "none",
                padding: "0.8rem 1rem",
                background: "rgba(255,255,255,0.88)",
                color: "#4c5ca9",
                fontFamily: "'Secular One', sans-serif",
                border: "1px solid rgba(103,112,181,0.2)",
              }}>
                חזרה לגלריה
              </Link>
              <ModeBadge />
            </div>

            <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
              <ActionButton onClick={handleUndo} disabled={paintHistory.length === 0}>בטל</ActionButton>
              <ActionButton onClick={handleReset} disabled={filledRegionCount === 0} tone="warn">איפוס</ActionButton>
            </div>
          </div>
        )}

        <div style={{
          borderRadius: isPhoneLandscape ? 16 : 34,
          background: isPhoneLandscape ? "white" : "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(248,250,252,0.9))",
          border: isPhoneLandscape ? "none" : "1px solid rgba(191,219,254,0.32)",
          boxShadow: isPhoneLandscape ? "none" : "0 28px 58px rgba(95, 116, 141, 0.12)",
          padding: isPhoneLandscape ? "4px" : "clamp(1rem, 3vw, 1.5rem)",
        }}>
          {isPhoneLandscape ? null : (
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap", marginBottom: "1rem" }}>
              <div style={{ maxWidth: 720 }}>
                <h1 style={{
                  margin: "0 0 0.45rem",
                  fontFamily: "'Suez One', serif",
                  fontSize: "clamp(2rem, 4.6vw, 3.2rem)",
                  color: "#2b2540",
                  lineHeight: 1.08,
                }}>
                  {artwork.title}
                </h1>
                <p style={{
                  margin: 0,
                  fontFamily: "'Rubik', sans-serif",
                  color: "rgba(71,85,105,0.9)",
                  lineHeight: 1.7,
                }}>
                  בחרו כל צבע ולחצו על אזור בציור. כל ההתקדמות נשמרת בדפדפן של המכשיר הזה.
                </p>
              </div>

              <div style={{ minWidth: 220 }}>
                <div style={{
                  borderRadius: 24,
                  background: "rgba(255,255,255,0.84)",
                  border: "1px solid rgba(191,219,254,0.38)",
                  padding: "0.9rem 1rem",
                }}>
                  <div style={{ fontFamily: "'Secular One', sans-serif", color: "#4c5ca9", marginBottom: "0.45rem" }}>
                    התקדמות
                  </div>
                  <div style={{
                    height: 14,
                    borderRadius: 999,
                    background: "rgba(226,232,240,0.9)",
                    overflow: "hidden",
                    marginBottom: "0.55rem",
                  }}>
                    <div style={{
                      width: (artwork.paths.length > 0 ? (filledRegionCount / artwork.paths.length) * 100 : 0) + "%",
                      minWidth: filledRegionCount > 0 ? 14 : 0,
                      height: "100%",
                      borderRadius: 999,
                      background: "linear-gradient(90deg, #818cf8, #38bdf8)",
                      transition: "width 0.25s ease",
                    }} />
                  </div>
                  <div style={{ fontFamily: "'Rubik', sans-serif", color: "rgba(51,65,85,0.9)" }}>
                    {filledRegionCount} מתוך {artwork.paths.length} אזורים מלאים
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 0,
            height: isPhoneLandscape ? "calc(100vh - 16px)" : "auto",
          }}>
            {paletteBlock}
            <div style={{
              flex: "1 1 0%",
              minWidth: 0,
              borderRadius: isPhoneLandscape ? 12 : 30,
              padding: isPhoneLandscape ? "4px" : "clamp(0.85rem, 2vw, 1.2rem)",
              background: isPhoneLandscape ? "white" : "linear-gradient(180deg, #ffffff, #f8fbff)",
              border: isPhoneLandscape ? "1px solid rgba(191,219,254,0.2)" : "1px solid rgba(191,219,254,0.35)",
              overflow: "hidden",
              height: isPhoneLandscape ? "100%" : "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {svgBlock}
            </div>
          </div>
        </div>
      </div>

      {orientationGate.showOverlay ? (
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
            <div style={{ fontFamily: "'Suez One', serif", fontSize: "1.8rem", color: "#1f2937", marginBottom: "0.65rem" }}>
              הכי נוח לצבוע לרוחב
            </div>
            <p style={{ fontFamily: "'Rubik', sans-serif", color: "#475569", lineHeight: 1.7, margin: "0 0 1rem" }}>
              זיהינו טלפון במצב אנכי. סובבו את המכשיר או נסו לעבור למסך רוחב כדי לקבל יותר מקום לציור.
            </p>
            <button onClick={function() { void orientationGate.requestLandscape(); }} style={{
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

      {showComplete ? (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,23,42,0.5)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1200,
          padding: "1.25rem",
        }}>
          <div style={{
            width: "min(100%, 520px)",
            borderRadius: 32,
            background: "linear-gradient(180deg, #ffffff, #fff9eb)",
            padding: "1.4rem",
            boxShadow: "0 28px 62px rgba(15,23,42,0.28)",
          }}>
            <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", marginBottom: "0.7rem", fontSize: "1.6rem" }}>
              <span>⭐</span><span>⭐</span><span>⭐</span>
            </div>
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <div style={{ fontFamily: "'Suez One', serif", fontSize: "2rem", color: "#2b2540", marginBottom: "0.4rem" }}>
                סיימת את הציור
              </div>
              <p style={{ margin: 0, fontFamily: "'Rubik', sans-serif", color: "#475569", lineHeight: 1.7 }}>
                ההתקדמות נשמרה בדפדפן, כך שאפשר לחזור אליה גם אחר כך.
              </p>
            </div>

            <div style={{
              borderRadius: 24,
              background: "white",
              border: "1px solid rgba(251,191,36,0.3)",
              padding: "0.9rem",
              marginBottom: "1rem",
            }}>
              <svg viewBox={viewport.viewBox} preserveAspectRatio="xMidYMid meet" style={{ display: "block", width: "100%", maxHeight: 260 }}>
                <rect x={viewport.minX} y={viewport.minY} width={viewport.width} height={viewport.height} fill="white" />
                {artwork.paths.map(function(path) {
                  var fillColorId = filled[path.id] || path.colorId;
                  var fillColor = COLORING_PALETTE.find(function(entry) { return entry.id === fillColorId; });
                  return (
                    <path
                      key={path.id}
                      d={path.d}
                      fill={fillColor ? fillColor.hex : "white"}
                      stroke="#111827"
                      strokeWidth="1"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>
            </div>

            <div style={{ display: "grid", gap: "0.7rem", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
              <ActionButton onClick={handleReplay}>צבעו שוב</ActionButton>
              <ActionButton onClick={goToRandomArtwork}>ציור חדש</ActionButton>
              <Link href="/play/coloring" style={{ textDecoration: "none" }}>
                <div style={{
                  borderRadius: 999,
                  background: "#111827",
                  color: "white",
                  fontFamily: "'Secular One', sans-serif",
                  fontSize: "0.9rem",
                  padding: "0.92rem 1rem",
                  textAlign: "center",
                }}>
                  חזרה לגלריה
                </div>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
