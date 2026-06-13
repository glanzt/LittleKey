"use client";

import { useState, useEffect, useRef, useMemo } from "react";

/* ── Confetti ── */
export function Confetti(props) {
  var active = props.active;
  var keyRef = useRef(0);
  var _rk = useState(0); var renderKey = _rk[0]; var setRenderKey = _rk[1];

  useEffect(function() {
    if (active) {
      keyRef.current += 1;
      setRenderKey(keyRef.current);
    }
  }, [active]);

  if (!active) return null;

  var particles = [];
  for (var i = 0; i < 35; i++) {
    particles.push({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.4,
      dur: 1.2 + Math.random() * 1,
      color: ["#FFB938","#FF9B83","#4FA8E8","#3FBF8C","#9B7DE8","#F2709C","#FFE082","#FFFFFF"][i % 8],
      size: 6 + Math.random() * 8,
      drift: -30 + Math.random() * 60
    });
  }

  var animName = "cfall" + renderKey;

  return (
    <div key={renderKey} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100 }}>
      {particles.map(function(p) {
        return (
          <div key={p.id} style={{
            position: "absolute",
            left: p.x + "%",
            top: "-5%",
            width: p.size,
            height: p.size * 1.4,
            backgroundColor: p.color,
            borderRadius: p.id % 2 === 0 ? "50%" : "2px",
            animation: animName + " " + p.dur + "s ease-in " + p.delay + "s forwards",
          }} />
        );
      })}
      <style>{
        "@keyframes " + animName + " { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }"
      }</style>
    </div>
  );
}

/* ── Progress Tracker ── */
export function ProgressTracker(props) {
  var letterResults = props.letterResults;
  var compact = !!props.compact;
  var tileSize = compact ? 64 : 100;
  var tileRadius = compact ? 16 : 24;
  var tileGap = compact ? 6 : 10;
  var pendingFontSize = compact ? "2rem" : "3rem";
  var doneFontSize = compact ? "1.8rem" : "2.5rem";
  var currentScale = compact ? "scale(1.06)" : "scale(1.15)";
  var currentBorder = compact ? "2px solid #FFB938" : "3px solid #FFB938";
  var currentShadow = compact ? "0 0 10px rgba(255,185,56,0.35)" : "0 0 12px rgba(255,185,56,0.45)";
  return (
    <div style={{ display: "flex", gap: tileGap, flexWrap: "wrap", justifyContent: "center", padding: compact ? "0.25rem" : "0.5rem", maxWidth: "100%" }}>
      {letterResults.map(function(r, i) {
        var cur = r.status === "current";
        var perf = r.status === "perfect";
        var werr = r.status === "withErrors";
        var helped = r.status === "helpedPerfect" || r.status === "helpedWithErrors";
        var done = perf || werr || helped;

        var bg = "rgba(255,255,255,0.55)";
        var col = "rgba(46,58,89,0.35)";
        var bor = "2px solid transparent";
        var shd = "none";
        var sc = "scale(1)";
        var icon = r.letter;

        if (cur) {
          bg = "white"; col = "#4FA8E8"; bor = currentBorder;
          shd = currentShadow; sc = currentScale;
        } else if (perf) {
          bg = "linear-gradient(135deg,#3FBF8C,#5BD4A4)"; col = "white";
          icon = "\u2713"; shd = "0 2px 8px rgba(63,191,140,0.35)";
        } else if (werr) {
          bg = "linear-gradient(135deg,#FFB938,#FFA726)"; col = "white";
          icon = "\u2713"; shd = "0 2px 8px rgba(255,185,56,0.4)";
        } else if (helped) {
          bg = "linear-gradient(135deg,#4FA8E8,#7CC4F5)"; col = "white";
          icon = "\u2713"; shd = "0 2px 8px rgba(79,168,232,0.4)";
        }

        return (
          <div key={i} style={{
            width: tileSize, height: tileSize, borderRadius: tileRadius,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: done ? doneFontSize : pendingFontSize,
            fontFamily: done ? "inherit" : "'Suez One', serif",
            fontWeight: cur ? "bold" : "normal",
            background: bg, color: col, border: bor, boxShadow: shd,
            transform: sc,
            transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            animation: cur ? "pulseDot 2s ease-in-out infinite" : (done ? "popIn 0.4s ease both" : "none"),
          }}>
            {icon}
          </div>
        );
      })}
      <style>{
        "@keyframes pulseDot { 0%,100%{ box-shadow: 0 0 12px rgba(255,185,56,0.4) } 50%{ box-shadow: 0 0 20px rgba(255,185,56,0.65) } }" +
        "@keyframes popIn { 0%{ transform: scale(0.5); opacity: 0 } 100%{ transform: scale(1); opacity: 1 } }"
      }</style>
    </div>
  );
}

/* ── Flipping Hint Card ── */
export function FlippingHintCard(props) {
  var letter = props.letter;
  var onUseHelp = props.onUseHelp;
  var flipped = props.flipped;
  var setFlipped = props.setFlipped;

  function handleClick() {
    if (!flipped) {
      onUseHelp();
    }
    setFlipped(!flipped);
  }

  var imgSrc = "/letters/" + encodeURIComponent(letter) + ".jpg";

  return (
    <div style={{ perspective: 800, width: "clamp(6rem, 25vw, 12rem)", height: "clamp(6rem, 25vw, 12rem)" }}>
      <div onClick={handleClick} style={{
        width: "100%", height: "100%", position: "relative",
        transformStyle: "preserve-3d",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        cursor: "pointer"
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
          borderRadius: 18, background: "linear-gradient(135deg, #9B7DE8, #B79BF5)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: "0.3rem", color: "white",
          boxShadow: "0 10px 22px rgba(155,125,232,0.4)"
        }}>
          <span style={{ fontSize: "clamp(2rem, 8vw, 3.5rem)" }}>⌨️</span>
          <span style={{ fontSize: "clamp(0.9rem, 3vw, 1.3rem)", fontFamily: "'Secular One', sans-serif" }}>רמז</span>
        </div>
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          borderRadius: 18, overflow: "hidden",
          boxShadow: "0 3px 14px rgba(0,0,0,0.18)",
          background: "white"
        }}>
          <img src={imgSrc} alt={letter} style={{
            width: "100%", height: "100%", objectFit: "cover"
          }} />
        </div>
      </div>
    </div>
  );
}
