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
      color: ["#FFD700","#FF6B9D","#00D4AA","#7C5CFC","#FF8C42","#45E3FF","#FF4757","#2ED573"][i % 8],
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
  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", padding: "0.5rem", maxWidth: "100%" }}>
      {letterResults.map(function(r, i) {
        var cur = r.status === "current";
        var perf = r.status === "perfect";
        var werr = r.status === "withErrors";
        var helped = r.status === "helpedPerfect" || r.status === "helpedWithErrors";
        var done = perf || werr || helped;

        var bg = "rgba(0,0,0,0.06)";
        var col = "#ccc";
        var bor = "2px solid transparent";
        var shd = "none";
        var sc = "scale(1)";
        var icon = r.letter;

        if (cur) {
          bg = "white"; col = "#E74C3C"; bor = "3px solid #E74C3C";
          shd = "0 0 12px rgba(231,76,60,0.3)"; sc = "scale(1.15)";
        } else if (perf) {
          bg = "linear-gradient(135deg,#27AE60,#2ECC71)"; col = "white";
          icon = "\u2713"; shd = "0 2px 8px rgba(39,174,96,0.3)";
        } else if (werr) {
          bg = "linear-gradient(135deg,#F39C12,#E67E22)"; col = "white";
          icon = "\u2713"; shd = "0 2px 8px rgba(243,156,18,0.3)";
        } else if (helped) {
          bg = "linear-gradient(135deg,#3498DB,#2980B9)"; col = "white";
          icon = "\u2713"; shd = "0 2px 8px rgba(52,152,219,0.3)";
        }

        return (
          <div key={i} style={{
            width: 100, height: 100, borderRadius: 24,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: done ? "2.5rem" : "3rem",
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
        "@keyframes pulseDot { 0%,100%{ box-shadow: 0 0 12px rgba(231,76,60,0.3) } 50%{ box-shadow: 0 0 20px rgba(231,76,60,0.5) } }" +
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
          borderRadius: 18, background: "linear-gradient(135deg, #7C5CFC, #9B7DFF)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: "0.3rem", color: "white",
          boxShadow: "0 3px 14px rgba(124,92,252,0.35)"
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
