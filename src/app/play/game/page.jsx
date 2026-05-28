"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/lib/game-context";
import { BACK_BUTTON_STYLE, NIKUD_MAP, KEY_TO_LETTER, SUCCESS_MSGS, speakLetter } from "@/lib/game-constants";
import { Confetti, ProgressTracker, FlippingHintCard } from "@/components/game-ui";
import { GameBackgroundMusic } from "@/components/game-background-music";
import { BuildLoopHud, ThemePickerOverlay } from "@/components/build-loop";
import { useBuildLoop } from "@/lib/build-loop";

export default function GamePage() {
  var game = useGame();
  var router = useRouter();
  var inputRef = useRef(null);
  var _vw = useState(typeof window === "undefined" ? 1200 : window.innerWidth); var viewportWidth = _vw[0]; var setViewportWidth = _vw[1];

  // Guard: if no active game, redirect
  useEffect(function() {
    if (game.sequence.length === 0) {
      router.replace(game.sync.isAuthenticated ? "/play/levels" : "/play");
    }
  }, [game.sequence.length]);

  if (game.sequence.length === 0) return null;

  useEffect(function() {
    function handleResize() {
      setViewportWidth(window.innerWidth);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return function() { window.removeEventListener("resize", handleResize); };
  }, []);

  var letter = game.sequence[game.currentIdx] || "א";
  var nikud = game.settings.nikud ? NIKUD_MAP[game.settings.nikudType] : null;
  var displayLetter = nikud ? letter + nikud : letter;
  var isCompact = viewportWidth <= 900;
  var isPhone = viewportWidth <= 700;
  var buildLoop = useBuildLoop("keyboard", game.activeProfile ? game.activeProfile.id : null);

  var successMsg = useMemo(function() {
    return SUCCESS_MSGS[Math.floor(Math.random() * SUCCESS_MSGS.length)];
  }, [game.showSuccess, letter]);

  var bgColor = game.showSuccess ? "#e8f8ef"
    : game.showError ? "#fef2f0"
    : "#fafafa";

  var backPath = game.isGuestGame ? "/play" : "/play/levels";

  useEffect(function() {
    if (!isPhone || !inputRef.current) return;
    if (game.showSuccess || game.showError) return;
    if (!buildLoop.hasTheme) return;
    var timer = setTimeout(function() {
      try { inputRef.current.focus(); } catch (e) { /* noop */ }
    }, 50);
    return function() { clearTimeout(timer); };
  }, [isPhone, game.currentIdx, game.showSuccess, game.showError, buildLoop.hasTheme]);

  useEffect(function() {
    game.setGameInputLocked(!buildLoop.hasTheme);
    return function() {
      game.setGameInputLocked(false);
    };
  }, [buildLoop.hasTheme]);

  function handlePhoneInput(e) {
    var raw = e.target.value || "";
    var pressedKey = raw.slice(-1);
    e.target.value = "";
    if (!pressedKey) return;
    game.processGameKeyPress(pressedKey);
    setTimeout(function() {
      if (inputRef.current) {
        try { inputRef.current.focus(); } catch (err) { /* noop */ }
      }
    }, 20);
  }

  var helpControls = !game.showSuccess && !game.showError ? (
    <div style={{
      position: isCompact ? "static" : "absolute",
      right: isCompact ? "auto" : "clamp(-15rem, -32vw, -8rem)",
      top: isCompact ? "auto" : "50%",
      transform: isCompact ? "none" : "translateY(-50%)",
      display: "flex",
      flexDirection: isCompact ? "row" : "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.8rem",
      marginTop: isCompact ? "1.2rem" : 0,
    }}>
      <FlippingHintCard letter={letter} onUseHelp={function() { game.setUsedHelp(true); }} flipped={game.hintFlipped} setFlipped={game.setHintFlipped} />
      {game.speakDone ? (
        <button onClick={game.speakCurrentLetter} style={{
          width: 52, height: 52, borderRadius: "50%", border: "none", cursor: "pointer",
          fontSize: "1.6rem", background: "white",
          boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s, box-shadow 0.2s, opacity 0.3s",
          flexShrink: 0,
        }} title="הקראת האות">🔊</button>
      ) : null}
    </div>
  ) : null;

  return (
    <div style={{
      minHeight: "100vh", background: bgColor,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Rubik', sans-serif", direction: "rtl", position: "relative",
      transition: "background 0.5s ease", overflow: "hidden",
      padding: isPhone ? "5.5rem 1rem 8.5rem" : undefined,
      boxSizing: "border-box",
    }}>
      <GameBackgroundMusic />
      <link href="https://fonts.googleapis.com/css2?family=Secular+One&family=Rubik:wght@400;600;700&family=Suez+One&display=swap" rel="stylesheet" />

      <Confetti active={game.showSuccess} />

      <button onClick={function() { router.push(backPath); }} style={BACK_BUTTON_STYLE}>← חזרה</button>

      {game.currentGameLevel != null ? (
        <div style={{
          position: "absolute", top: "1.5rem", right: "1.5rem",
          background: "rgba(124,92,252,0.15)", borderRadius: 20,
          padding: "0.3rem 1rem", fontSize: "0.85rem", color: "#7C5CFC",
          fontWeight: "600", fontFamily: "'Secular One', sans-serif", zIndex: 10
        }}>
          שלב {game.currentGameLevel}
        </div>
      ) : null}

      <div style={{ position: isCompact ? "static" : "absolute", top: "1.5rem", width: "90%", display: "flex", justifyContent: "center", marginBottom: isCompact ? "0.75rem" : 0 }}>
        <ProgressTracker letterResults={game.letterResults} compact={isPhone} />
      </div>

      {buildLoop.hasTheme ? (
        <div style={{ width: "100%", maxWidth: 760, marginTop: isCompact ? "0.4rem" : "2.2rem", marginBottom: isCompact ? "0.6rem" : "0.8rem" }}>
          <BuildLoopHud
            theme={buildLoop.theme}
            builtParts={buildLoop.builtParts}
            isPhone={isPhone}
            maxWidth={760}
            margin="0 auto"
          />
        </div>
      ) : null}

      {/* Wrong key floating indicator */}
      {game.showError && game.lastPressedKey && KEY_TO_LETTER[game.lastPressedKey] ? (
        <div style={{ position: "absolute", top: "28%", animation: "wrongKeyFloat 1.2s ease-out forwards" }}>
          <div style={{ fontSize: "3.5rem", fontFamily: "'Suez One', serif", color: "#E74C3C", opacity: 0.7, position: "relative" }}>
            {game.lastPressedKey}
            <div style={{ position: "absolute", top: "50%", left: "-10%", width: "120%", height: 4, background: "#E74C3C", borderRadius: 2, transform: "rotate(-45deg) translateY(-50%)" }} />
          </div>
        </div>
      ) : null}

      {/* Main letter */}
      <div style={{
        position: "relative", marginTop: isCompact ? "0.5rem" : "2rem",
        animation: game.showSuccess ? "successBounce 0.6s cubic-bezier(0.34,1.56,0.64,1)" : (game.showError ? "shakeAnim 0.5s ease" : "letterAppear 0.5s cubic-bezier(0.34,1.56,0.64,1)")
      }}>
        {game.showSuccess ? <div style={{ position: "absolute", inset: -40, borderRadius: "50%", background: "radial-gradient(circle, rgba(39,174,96,0.2) 0%, transparent 70%)", animation: "glowPulse 0.8s ease-in-out infinite" }} /> : null}
        {game.showError ? <div style={{ position: "absolute", inset: -30, borderRadius: "50%", background: "radial-gradient(circle, rgba(231,76,60,0.15) 0%, transparent 70%)", animation: "errorFlash 0.5s ease-out" }} /> : null}

        <div style={{
          fontSize: "clamp(8rem, 35vw, 18rem)", fontFamily: "'Suez One', serif",
          color: game.showSuccess ? "#27AE60" : game.showError ? "#E74C3C" : "#2C3E50",
          lineHeight: 1, textAlign: "center", transition: "color 0.3s",
          filter: game.showSuccess ? "drop-shadow(0 0 40px rgba(39,174,96,0.4))" : game.showError ? "drop-shadow(0 0 20px rgba(231,76,60,0.2))" : "none"
        }}>
          {displayLetter}
        </div>

        {!isCompact ? helpControls : null}
      </div>

      {isCompact ? helpControls : null}

      {!game.showSuccess && !game.showError ? (
        <p style={{ fontSize: "clamp(1.1rem, 3.5vw, 1.5rem)", color: "#888", marginTop: "1.2rem", fontFamily: "'Secular One', sans-serif", textAlign: "center" }}>
          לחצי על האות: <strong style={{ color: "#E74C3C", fontSize: "130%" }}>{letter}</strong>
        </p>
      ) : null}

      {game.currentErrors > 0 && !game.showSuccess ? (
        <div style={{ display: "flex", gap: 8, marginTop: "1rem" }}>
          {[0, 1, 2].map(function(i) {
            return <div key={i} style={{
              width: 14, height: 14, borderRadius: "50%",
              background: i < game.currentErrors ? "#E74C3C" : "rgba(0,0,0,0.08)",
              transition: "all 0.3s",
              transform: i < game.currentErrors ? "scale(1.3)" : "scale(1)",
              boxShadow: i < game.currentErrors ? "0 0 8px rgba(231,76,60,0.4)" : "none"
            }} />;
          })}
        </div>
      ) : null}

      {game.showSuccess ? (
        <div style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)", color: "#27AE60", fontFamily: "'Secular One', sans-serif", marginTop: "1rem", animation: "successBounce 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}>
          {successMsg}
        </div>
      ) : null}

      {game.showError ? (
        <div style={{
          fontSize: "clamp(1.2rem, 4vw, 1.8rem)", color: "#E74C3C",
          fontFamily: "'Secular One', sans-serif", animation: "errorSlideIn 0.3s ease",
          background: "rgba(255,255,255,0.95)", padding: "0.8rem 2rem",
          borderRadius: 20, boxShadow: "0 4px 20px rgba(231,76,60,0.15)",
          marginTop: "1rem", border: "2px solid rgba(231,76,60,0.2)"
        }}>
          {game.errorMsg}
        </div>
      ) : null}

      <style>{
        "@keyframes letterAppear { 0%{ transform: scale(0.3) rotate(-10deg); opacity: 0 } 100%{ transform: scale(1) rotate(0); opacity: 1 } }" +
        "@keyframes successBounce { 0%{ transform: scale(1) } 30%{ transform: scale(1.2) } 60%{ transform: scale(0.95) } 100%{ transform: scale(1) } }" +
        "@keyframes shakeAnim { 0%,100%{ transform: translateX(0) } 15%{ transform: translateX(-12px) } 30%{ transform: translateX(10px) } 45%{ transform: translateX(-8px) } 60%{ transform: translateX(6px) } }" +
        "@keyframes errorSlideIn { 0%{ transform: translateY(20px) scale(0.9); opacity: 0 } 100%{ transform: translateY(0) scale(1); opacity: 1 } }" +
        "@keyframes glowPulse { 0%,100%{ opacity: 0.5; transform: scale(1) } 50%{ opacity: 1; transform: scale(1.1) } }" +
        "@keyframes errorFlash { 0%{ opacity: 1; transform: scale(0.8) } 100%{ opacity: 0; transform: scale(1.5) } }" +
        "@keyframes wrongKeyFloat { 0%{ transform: translateY(0) scale(1); opacity: 0.8 } 100%{ transform: translateY(-80px) scale(0.4); opacity: 0 } }" +
        "@keyframes langWarnPop { 0%{ transform: translate(-50%,-50%) scale(0.8); opacity: 0 } 100%{ transform: translate(-50%,-50%) scale(1); opacity: 1 } }"
      }</style>

      {game.showLangWarning ? (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
        }}>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            background: "white", borderRadius: 24, padding: "2rem 2.5rem",
            textAlign: "center", direction: "rtl",
            boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
            maxWidth: 340, width: "90%",
            animation: "langWarnPop 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.8rem" }}>⌨️</div>
            <h2 style={{ fontFamily: "'Secular One', sans-serif", fontSize: "1.3rem", color: "#111319", margin: "0 0 0.6rem" }}>המקלדת על אנגלית!</h2>
            <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: "0.95rem", color: "#666", margin: "0 0 1.5rem", lineHeight: 1.5 }}>
              שנו את שפת המקלדת לעברית ונסו שוב
            </p>
            <button onClick={function() { game.setShowLangWarning(false); }} style={{
              padding: "0.7rem 2.5rem", fontSize: "1rem", fontFamily: "'Secular One', sans-serif",
              background: "#111319", color: "white", border: "none", borderRadius: 999,
              cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}>הבנתי</button>
          </div>
        </div>
      ) : null}

      {isPhone ? (
        <div style={{
          position: "fixed", left: "50%", bottom: "1rem", transform: "translateX(-50%)",
          width: "min(92vw, 430px)", zIndex: 110,
          background: "rgba(255,255,255,0.96)", border: "1px solid rgba(17,19,25,0.08)",
          borderRadius: 24, boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
          padding: "0.85rem", boxSizing: "border-box",
        }}>
          <div style={{ fontFamily: "'Secular One', sans-serif", fontSize: "0.95rem", color: "#111319", marginBottom: "0.45rem", textAlign: "center" }}>
            הקישי כאן כדי לפתוח את המקלדת בטלפון
          </div>
          <input
            ref={inputRef}
            type="text"
            inputMode="text"
            enterKeyHint="done"
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            dir="rtl"
            onInput={handlePhoneInput}
            placeholder="הקלידי את האות כאן"
            style={{
              width: "100%", height: 52, borderRadius: 16, border: "2px solid rgba(124,92,252,0.24)",
              padding: "0 1rem", boxSizing: "border-box", fontSize: 18, textAlign: "center",
              fontFamily: "'Secular One', sans-serif", outline: "none", background: "#fff",
            }}
          />
        </div>
      ) : null}

      {!buildLoop.hasTheme ? (
        <ThemePickerOverlay themes={buildLoop.themes} onChoose={buildLoop.chooseTheme} isPhone={isPhone} />
      ) : null}
    </div>
  );
}
