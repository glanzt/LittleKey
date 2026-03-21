"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PAGE_BG, BACK_BUTTON_STYLE, getAudioCtx, playError, playFeelingSound, playPerfect } from "@/lib/game-constants";
import { useGame } from "@/lib/game-context";
import { BuildLoopHud, ThemePickerOverlay } from "@/components/build-loop";
import { FloatingLettersBackground } from "@/styles/shared";
import { useBuildLoop } from "@/lib/build-loop";
import { FEELING_ITEMS, shuffleArray } from "@/lib/match-game";

var WHEEL_COLORS = ["#FF8A5B", "#FFD166", "#7C5CFC", "#2DCE89", "#3FA7D6", "#F26CA7", "#FFB703", "#8E7DF2", "#00B894", "#FF6B6B"];
var SPIN_FRICTION = 0.98;
var SPIN_STOP_VELOCITY = 0.01;
var DRAG_SPIN_THRESHOLD = 0.045;
var SPIN_SOUND_MIN_DELAY = 45;
var SPIN_SOUND_MAX_DELAY = 230;

export default function WheelGamePage() {
  var game = useGame();
  var router = useRouter();
  var _vw = useState(typeof window === "undefined" ? 1200 : window.innerWidth); var viewportWidth = _vw[0]; var setViewportWidth = _vw[1];
  var buildLoop = useBuildLoop("wheel", game.activeProfile ? game.activeProfile.id : null);
  var _wr = useState(0); var wheelRotation = _wr[0]; var setWheelRotation = _wr[1];
  var _sp = useState(false); var isSpinning = _sp[0]; var setIsSpinning = _sp[1];
  var _dg = useState(false); var isDragging = _dg[0]; var setIsDragging = _dg[1];
  var _sf = useState(null); var selectedFeeling = _sf[0]; var setSelectedFeeling = _sf[1];
  var _ao = useState(function() {
    return shuffleArray(FEELING_ITEMS).map(function(item) {
      return { id: item.id, label: item.label, imageSrc: item.imageSrc, audioName: item.audioName, isCorrect: false };
    });
  }); var answerOptions = _ao[0]; var setAnswerOptions = _ao[1];
  var _cg = useState(null); var chosenGuess = _cg[0]; var setChosenGuess = _cg[1];
  var _fb = useState(null); var feedback = _fb[0]; var setFeedback = _fb[1];
  var _rc = useState(0); var roundsPlayed = _rc[0]; var setRoundsPlayed = _rc[1];
  var wheelSurfaceRef = useRef(null);
  var animationFrameRef = useRef(null);
  var wheelRotationRef = useRef(0);
  var spinSoundTimerRef = useRef(null);
  var spinSoundEnabledRef = useRef(false);
  var spinVelocityRef = useRef(0);
  var dragRef = useRef({ pointerId: null, lastAngle: 0, lastTime: 0, velocity: 0, moved: false });

  useEffect(function() {
    function handleResize() {
      setViewportWidth(window.innerWidth);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return function() {
      window.removeEventListener("resize", handleResize);
      stopSpinAnimation();
      stopSpinSound();
    };
  }, []);

  var isPhone = viewportWidth <= 760;
  var segmentAngle = 360 / FEELING_ITEMS.length;
  var wheelSize = isPhone ? 320 : 470;
  var badgeSize = isPhone ? 60 : 78;
  var badgeRadius = (wheelSize / 2) - (badgeSize / 2) - (isPhone ? 18 : 24);
  var isSolved = feedback && feedback.type === "success";

  var wheelItems = useMemo(function() {
    return FEELING_ITEMS.map(function(item, index) {
      return {
        id: item.id,
        label: item.label,
        imageSrc: item.imageSrc,
        angle: index * segmentAngle,
        color: WHEEL_COLORS[index % WHEEL_COLORS.length],
      };
    });
  }, [segmentAngle]);

  function normalizeRotation(rotation) {
    return ((rotation % 360) + 360) % 360;
  }

  function normalizeAngleDelta(delta) {
    if (delta > 180) return delta - 360;
    if (delta < -180) return delta + 360;
    return delta;
  }

  function setWheelRotationValue(nextRotation) {
    wheelRotationRef.current = nextRotation;
    setWheelRotation(nextRotation);
  }

  function clearGuessState() {
    setSelectedFeeling(null);
    setChosenGuess(null);
    setFeedback(null);
  }

  function getFeelingForRotation(rotation) {
    var normalized = normalizeRotation(rotation);
    var rawIndex = Math.round((((360 - normalized) % 360) / segmentAngle));
    var chosenIndex = ((rawIndex % FEELING_ITEMS.length) + FEELING_ITEMS.length) % FEELING_ITEMS.length;
    return FEELING_ITEMS[chosenIndex];
  }

  function commitSpinResult() {
    var chosenFeeling = getFeelingForRotation(wheelRotationRef.current);
    setRoundsPlayed(function(prev) { return prev + 1; });
    setSelectedFeeling(chosenFeeling);
    setAnswerOptions(shuffleArray(FEELING_ITEMS).map(function(item) {
      return {
        id: item.id,
        label: item.label,
        imageSrc: item.imageSrc,
        audioName: item.audioName,
        isCorrect: item.imageSrc === chosenFeeling.imageSrc,
      };
    }));
  }

  function stopSpinAnimation() {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }

  function getSpinSoundDelay() {
    var normalizedSpeed = Math.min(1, Math.abs(spinVelocityRef.current) / 3.8);
    return SPIN_SOUND_MAX_DELAY - ((SPIN_SOUND_MAX_DELAY - SPIN_SOUND_MIN_DELAY) * normalizedSpeed);
  }

  function playSpinTick() {
    var ctx = getAudioCtx();
    if (!ctx) return;
    ctx.resume();

    var normalizedSpeed = Math.min(1, Math.abs(spinVelocityRef.current) / 3.8);
    var startFreq = 230 + (normalizedSpeed * 220);
    var endFreq = 170 + (normalizedSpeed * 120);
    var peakGain = 0.015 + (normalizedSpeed * 0.02);
    var filterFreq = 1100 + (normalizedSpeed * 1200);

    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    var filter = ctx.createBiquadFilter();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.04);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(filterFreq, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(peakGain, ctx.currentTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.055);
  }

  function scheduleSpinSoundTick() {
    if (!spinSoundEnabledRef.current) return;
    if (spinSoundTimerRef.current) clearTimeout(spinSoundTimerRef.current);

    var delay = getSpinSoundDelay();
    spinSoundTimerRef.current = setTimeout(function() {
      spinSoundTimerRef.current = null;
      if (!spinSoundEnabledRef.current) return;
      playSpinTick();
      scheduleSpinSoundTick();
    }, delay);
  }

  function startSpinSound() {
    spinSoundEnabledRef.current = true;
    if (spinSoundTimerRef.current) return;
    playSpinTick();
    scheduleSpinSoundTick();
  }

  function stopSpinSound() {
    spinSoundEnabledRef.current = false;
    spinVelocityRef.current = 0;
    if (spinSoundTimerRef.current) {
      clearTimeout(spinSoundTimerRef.current);
      spinSoundTimerRef.current = null;
    }
  }

  function finishSpin() {
    stopSpinAnimation();
    stopSpinSound();
    setIsSpinning(false);
    commitSpinResult();
  }

  function startInertiaSpin(initialVelocity) {
    stopSpinAnimation();
    setIsSpinning(true);
    spinVelocityRef.current = Math.abs(initialVelocity);
    startSpinSound();

    var velocity = initialVelocity;
    var lastTime = performance.now();

    function step(now) {
      var elapsed = now - lastTime;
      lastTime = now;

      setWheelRotationValue(wheelRotationRef.current + (velocity * elapsed));
      velocity *= Math.pow(SPIN_FRICTION, elapsed / 16.67);
      spinVelocityRef.current = Math.abs(velocity);

      if (Math.abs(velocity) <= SPIN_STOP_VELOCITY) {
        finishSpin();
        return;
      }

      animationFrameRef.current = requestAnimationFrame(step);
    }

    animationFrameRef.current = requestAnimationFrame(step);
  }

  function getPointerAngle(event) {
    if (!wheelSurfaceRef.current) return 0;
    var rect = wheelSurfaceRef.current.getBoundingClientRect();
    var centerX = rect.left + (rect.width / 2);
    var centerY = rect.top + (rect.height / 2);
    return Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
  }

  function handleSpin() {
    if (isSpinning || isDragging) return;

    clearGuessState();
    startInertiaSpin(3 + (Math.random() * 1.3));
  }

  function handleWheelPointerDown(event) {
    if (isSpinning) return;

    clearGuessState();
    setIsDragging(true);
    spinVelocityRef.current = 0;

    dragRef.current = {
      pointerId: event.pointerId,
      lastAngle: getPointerAngle(event),
      lastTime: performance.now(),
      velocity: 0,
      moved: false,
    };

    if (event.currentTarget.setPointerCapture) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  }

  function handleWheelPointerMove(event) {
    if (!isDragging || dragRef.current.pointerId !== event.pointerId) return;

    var currentAngle = getPointerAngle(event);
    var delta = normalizeAngleDelta(currentAngle - dragRef.current.lastAngle);
    var now = performance.now();
    var elapsed = Math.max(1, now - dragRef.current.lastTime);

    dragRef.current.lastAngle = currentAngle;
    dragRef.current.lastTime = now;
    dragRef.current.velocity = delta / elapsed;
    dragRef.current.moved = dragRef.current.moved || Math.abs(delta) > 0.2;
    spinVelocityRef.current = Math.abs(dragRef.current.velocity * 1.6);

    if (dragRef.current.moved && !spinSoundEnabledRef.current) {
      startSpinSound();
    }

    setWheelRotationValue(wheelRotationRef.current + delta);
  }

  function handleWheelPointerUp(event) {
    if (!isDragging || dragRef.current.pointerId !== event.pointerId) return;

    if (event.currentTarget.releasePointerCapture) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setIsDragging(false);

    if (!dragRef.current.moved) {
      stopSpinSound();
      return;
    }

    if (Math.abs(dragRef.current.velocity) >= DRAG_SPIN_THRESHOLD) {
      startInertiaSpin(dragRef.current.velocity * 1.6);
      return;
    }

    finishSpin();
  }

  function handleWheelPointerCancel(event) {
    if (!isDragging || dragRef.current.pointerId !== event.pointerId) return;
    setIsDragging(false);
    stopSpinAnimation();
    stopSpinSound();
    if (dragRef.current.moved) {
      commitSpinResult();
    }
    setIsSpinning(false);
  }

  function handleGuess(feeling) {
    if (!selectedFeeling || isSolved) return;

    setChosenGuess(feeling.id);

    if (feeling.isCorrect) {
      playPerfect();
      playFeelingSound(selectedFeeling.audioName || selectedFeeling.label);
      buildLoop.registerSuccess();
      setFeedback({
        type: "success",
        text: "נכון מאוד! זו ההרגשה " + selectedFeeling.label + ".",
      });
      return;
    }

    playError();
    setFeedback({
      type: "error",
      text: "כמעט. נסי שוב עד שתמצאי את ההרגשה הנכונה.",
    });
  }

  return (
    <div style={{
      ...PAGE_BG,
      justifyContent: "flex-start",
      paddingTop: isPhone ? "1rem" : "1.5rem",
      paddingBottom: "2rem",
      paddingLeft: isPhone ? "0.8rem" : "1.2rem",
      paddingRight: isPhone ? "0.8rem" : "1.2rem",
    }}>
      <FloatingLettersBackground />

      <div style={{ width: "100%", maxWidth: 1180, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "100%", display: "flex", justifyContent: "flex-start", marginBottom: "0.8rem" }}>
          <button onClick={function() { router.push("/play"); }} style={{ ...BACK_BUTTON_STYLE, position: "static" }}>← חזרה</button>
        </div>

        <h1 style={{
          fontFamily: "'Suez One', serif",
          fontSize: isPhone ? "clamp(1.8rem, 8vw, 2.4rem)" : "clamp(2.4rem, 5vw, 3.5rem)",
          color: "#111319",
          margin: "0 0 0.4rem",
          textAlign: "center",
          lineHeight: 1.05,
        }}>
          גלגל הרגשות
        </h1>

        <p style={{
          fontFamily: "'Rubik', sans-serif",
          fontSize: isPhone ? "0.95rem" : "1.05rem",
          color: "rgba(17,19,25,0.6)",
          margin: "0 0 1rem",
          maxWidth: 720,
          textAlign: "center",
          lineHeight: 1.5,
        }}>
          סובבי את הגלגל, חכי שייעצר, ואז הסתכלי על התמונה הגדולה ובחרי איזה רגש מופיע בה.
        </p>

        <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "1.4rem" }}>
          <div style={{ background: "white", borderRadius: 999, padding: "0.55rem 1rem", boxShadow: "0 6px 20px rgba(17,19,25,0.08)", fontFamily: "'Secular One', sans-serif", color: "#111319" }}>
            רגשות בגלגל: {FEELING_ITEMS.length}
          </div>
          <div style={{ background: "white", borderRadius: 999, padding: "0.55rem 1rem", boxShadow: "0 6px 20px rgba(17,19,25,0.08)", fontFamily: "'Secular One', sans-serif", color: "#111319" }}>
            סיבובים: {roundsPlayed}
          </div>
        </div>

        {buildLoop.hasTheme ? (
          <BuildLoopHud
            theme={buildLoop.theme}
            progress={buildLoop.progress}
            builtParts={buildLoop.builtParts}
            justUnlockedPartId={buildLoop.justUnlockedPartId}
            showNudge={buildLoop.showNudge}
            isPhone={isPhone}
            maxWidth={920}
            margin="0 auto 1rem"
          />
        ) : null}

        <div style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: isPhone ? "1fr" : "minmax(0, 1.05fr) minmax(360px, 0.95fr)",
          gap: isPhone ? "1rem" : "1.3rem",
          alignItems: "start",
        }}>
          <div style={{
            position: "relative",
            background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(250,246,240,0.95))",
            borderRadius: isPhone ? 28 : 34,
            border: "1px solid rgba(17,19,25,0.06)",
            boxShadow: "0 18px 50px rgba(17,19,25,0.08)",
            padding: isPhone ? "1rem 0.7rem 1.1rem" : "1.4rem 1.2rem 1.3rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute",
              top: isPhone ? 10 : 14,
              width: 0,
              height: 0,
              borderLeft: (isPhone ? 14 : 16) + "px solid transparent",
              borderRight: (isPhone ? 14 : 16) + "px solid transparent",
              borderTop: (isPhone ? 24 : 28) + "px solid #111319",
              zIndex: 3,
              filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.16))",
            }} />

            <div style={{
              position: "relative",
              width: wheelSize,
              height: wheelSize,
              maxWidth: "100%",
              maxHeight: "100%",
              marginTop: isPhone ? "0.5rem" : "0.7rem",
              marginBottom: "1rem",
              touchAction: "none",
            }}>
              <div style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: isPhone ? "10px solid #2F2A45" : "14px solid #2F2A45",
                boxShadow: "0 18px 40px rgba(47,42,69,0.22), inset 0 0 0 4px rgba(255,255,255,0.3)",
                background: "conic-gradient(" + wheelItems.map(function(item, index) {
                  var start = index * segmentAngle;
                  var end = start + segmentAngle;
                  return item.color + " " + start + "deg " + end + "deg";
                }).join(", ") + ")",
                transform: "rotate(" + wheelRotation + "deg)",
                overflow: "hidden",
              }}
              ref={wheelSurfaceRef}
              onPointerDown={handleWheelPointerDown}
              onPointerMove={handleWheelPointerMove}
              onPointerUp={handleWheelPointerUp}
              onPointerCancel={handleWheelPointerCancel}
              >
                {wheelItems.map(function(item) {
                  return (
                    <div
                      key={item.id}
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: badgeSize,
                        height: badgeSize,
                        marginLeft: -(badgeSize / 2),
                        marginTop: -(badgeSize / 2),
                        transform: "rotate(" + item.angle + "deg) translate(0, -" + badgeRadius + "px) rotate(" + (-item.angle) + "deg)",
                        transformOrigin: "center center",
                      }}
                    >
                      <div style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.95)",
                        border: isPhone ? "3px solid rgba(47,42,69,0.9)" : "4px solid rgba(47,42,69,0.9)",
                        overflow: "hidden",
                        boxShadow: "0 8px 18px rgba(17,19,25,0.18)",
                      }}>
                        <img src={item.imageSrc} alt={item.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    </div>
                  );
                })}

                <div style={{
                  position: "absolute",
                  inset: isPhone ? "26%" : "29%",
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 30%, #FFF7A3, #E9D400 56%, #C8B100 100%)",
                  border: isPhone ? "6px solid rgba(255,255,255,0.8)" : "8px solid rgba(255,255,255,0.78)",
                  boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "1rem",
                }}>
                  <div style={{ fontFamily: "'Secular One', sans-serif", color: "#6A5B00", lineHeight: 1.05 }}>
                    <div style={{ fontSize: isPhone ? "1.4rem" : "1.8rem" }}>גלגל</div>
                    <div style={{ fontSize: isPhone ? "1rem" : "1.2rem" }}>הרגשות</div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSpin}
              disabled={isSpinning || isDragging}
              style={{
                border: "none",
                borderRadius: 999,
                padding: isPhone ? "0.85rem 1.5rem" : "0.95rem 1.9rem",
                fontFamily: "'Secular One', sans-serif",
                fontSize: isPhone ? "1rem" : "1.08rem",
                color: "white",
                cursor: isSpinning || isDragging ? "wait" : "pointer",
                background: isSpinning || isDragging ? "#BCA9F6" : "linear-gradient(135deg, #7C5CFC, #F39C12)",
                boxShadow: isSpinning || isDragging ? "none" : "0 10px 22px rgba(124,92,252,0.28)",
                minWidth: isPhone ? 180 : 220,
              }}
            >
              {isDragging ? "מסובבים..." : isSpinning ? "הגלגל מסתובב..." : selectedFeeling ? "סובבי שוב" : "סובבי את הגלגל"}
            </button>
          </div>

          <div style={{
            background: "rgba(255,255,255,0.94)",
            borderRadius: isPhone ? 28 : 34,
            border: "1px solid rgba(17,19,25,0.06)",
            boxShadow: "0 18px 50px rgba(17,19,25,0.08)",
            padding: isPhone ? "1rem 0.9rem 1.1rem" : "1.4rem 1.3rem",
          }}>
            <h2 style={{ margin: "0 0 0.8rem", fontFamily: "'Secular One', sans-serif", color: "#111319", fontSize: isPhone ? "1.15rem" : "1.3rem" }}>
              {selectedFeeling ? "איזו הרגשה זו?" : "חכי לתוצאה"}
            </h2>

            <div style={{
              background: selectedFeeling ? "linear-gradient(180deg, #FFFDF8, #F7F1E8)" : "linear-gradient(180deg, #F8F8FB, #F2F2F7)",
              borderRadius: 28,
              minHeight: isPhone ? 260 : 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(17,19,25,0.06)",
              marginBottom: "1rem",
              overflow: "hidden",
              position: "relative",
            }}>
              {selectedFeeling ? (
                <img
                  src={selectedFeeling.imageSrc}
                  alt={selectedFeeling.label}
                  style={{
                    width: "100%",
                    height: "100%",
                    maxHeight: isPhone ? 320 : 360,
                    objectFit: "contain",
                    padding: isPhone ? "1rem" : "1.2rem",
                  }}
                />
              ) : (
                <div style={{ textAlign: "center", padding: "1.4rem" }}>
                  <div style={{ fontSize: isPhone ? "2.4rem" : "3rem", marginBottom: "0.5rem" }}>🎯</div>
                  <div style={{ fontFamily: "'Secular One', sans-serif", fontSize: isPhone ? "1.05rem" : "1.2rem", color: "#111319", marginBottom: "0.35rem" }}>
                    עדיין אין רגש לנחש
                  </div>
                  <div style={{ fontFamily: "'Rubik', sans-serif", color: "rgba(17,19,25,0.55)", lineHeight: 1.5 }}>
                    סובבי את הגלגל, וכשהוא ייעצר תופיע כאן תמונה גדולה של רגש אחד.
                  </div>
                </div>
              )}
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: isPhone ? "repeat(2, minmax(0, 1fr))" : "repeat(2, minmax(0, 1fr))",
              gap: "0.65rem",
            }}>
              {answerOptions.map(function(option) {
                var isCorrectAnswer = !!option.isCorrect;
                var isPicked = chosenGuess === option.id;
                var isWrongPick = isPicked && !isCorrectAnswer;
                var isRevealedCorrect = isSolved && isCorrectAnswer;

                return (
                  <button
                    key={option.id}
                    onClick={function() { handleGuess(option); }}
                    disabled={!selectedFeeling || isSpinning || isSolved}
                    style={{
                      borderRadius: 18,
                      border: isRevealedCorrect
                        ? "2px solid #27AE60"
                        : isWrongPick
                          ? "2px solid #E74C3C"
                          : "1px solid rgba(17,19,25,0.08)",
                      background: isRevealedCorrect
                        ? "#EAF8EF"
                        : isWrongPick
                          ? "#FFF0F0"
                          : "white",
                      padding: isPhone ? "0.45rem" : "0.55rem",
                      cursor: !selectedFeeling || isSpinning || isSolved ? "default" : "pointer",
                      boxShadow: "0 4px 12px rgba(17,19,25,0.04)",
                      opacity: !selectedFeeling ? 0.55 : 1,
                      overflow: "hidden",
                    }}
                    aria-label={option.label}
                  >
                    <div style={{
                      borderRadius: 14,
                      overflow: "hidden",
                      background: "linear-gradient(180deg, #FFFDF8, #F7F1E8)",
                      aspectRatio: "1 / 1",
                    }}>
                      <img
                        src={option.imageSrc}
                        alt={option.label}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          padding: isPhone ? "0.3rem" : "0.45rem",
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            <div aria-live="polite" style={{
              marginTop: "0.9rem",
              minHeight: 58,
              borderRadius: 18,
              padding: "0.85rem 1rem",
              background: feedback
                ? (feedback.type === "success" ? "#EAF8EF" : "#FFF3E8")
                : "rgba(17,19,25,0.04)",
              color: feedback
                ? (feedback.type === "success" ? "#1E8449" : "#B55E00")
                : "rgba(17,19,25,0.56)",
              fontFamily: "'Rubik', sans-serif",
              lineHeight: 1.5,
              display: "flex",
              alignItems: "center",
            }}>
              {feedback ? feedback.text : "אחרי שהגלגל נעצר, בחרי את התמונה שמתאימה לרגש שמופיע בגדול."}
            </div>
          </div>
        </div>
      </div>

      {!buildLoop.hasTheme ? (
        <ThemePickerOverlay themes={buildLoop.themes} onChoose={buildLoop.chooseTheme} isPhone={isPhone} />
      ) : null}
    </div>
  );
}
