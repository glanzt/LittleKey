"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PAGE_BG, BACK_BUTTON_STYLE, playError, playPerfect } from "@/lib/game-constants";
import { FloatingLettersBackground } from "@/styles/shared";
import { FEELING_ITEMS, shuffleArray } from "@/lib/match-game";

var WHEEL_COLORS = ["#FF8A5B", "#FFD166", "#7C5CFC", "#2DCE89", "#3FA7D6", "#F26CA7", "#FFB703", "#8E7DF2", "#00B894", "#FF6B6B"];
var SPIN_DURATION_MS = 4200;

export default function WheelGamePage() {
  var router = useRouter();
  var _vw = useState(typeof window === "undefined" ? 1200 : window.innerWidth); var viewportWidth = _vw[0]; var setViewportWidth = _vw[1];
  var _wr = useState(0); var wheelRotation = _wr[0]; var setWheelRotation = _wr[1];
  var _sp = useState(false); var isSpinning = _sp[0]; var setIsSpinning = _sp[1];
  var _sf = useState(null); var selectedFeeling = _sf[0]; var setSelectedFeeling = _sf[1];
  var _ao = useState(function() { return shuffleArray(FEELING_ITEMS); }); var answerOptions = _ao[0]; var setAnswerOptions = _ao[1];
  var _cg = useState(null); var chosenGuess = _cg[0]; var setChosenGuess = _cg[1];
  var _fb = useState(null); var feedback = _fb[0]; var setFeedback = _fb[1];
  var _rc = useState(0); var roundsPlayed = _rc[0]; var setRoundsPlayed = _rc[1];
  var spinTimerRef = useRef(null);

  useEffect(function() {
    function handleResize() {
      setViewportWidth(window.innerWidth);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return function() {
      window.removeEventListener("resize", handleResize);
      if (spinTimerRef.current) clearTimeout(spinTimerRef.current);
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

  function handleSpin() {
    if (isSpinning) return;

    var chosenIndex = Math.floor(Math.random() * FEELING_ITEMS.length);
    var chosenFeeling = FEELING_ITEMS[chosenIndex];

    if (spinTimerRef.current) clearTimeout(spinTimerRef.current);

    setIsSpinning(true);
    setSelectedFeeling(null);
    setChosenGuess(null);
    setFeedback(null);

    setWheelRotation(function(prev) {
      var currentNormalized = ((prev % 360) + 360) % 360;
      var desiredNormalized = (360 - ((chosenIndex * segmentAngle) % 360)) % 360;
      var delta = (desiredNormalized - currentNormalized + 360) % 360;
      var fullTurns = 5 + Math.floor(Math.random() * 3);
      return prev + (fullTurns * 360) + delta;
    });

    spinTimerRef.current = setTimeout(function() {
      setRoundsPlayed(function(prev) { return prev + 1; });
      setSelectedFeeling(chosenFeeling);
      setAnswerOptions(shuffleArray(FEELING_ITEMS));
      setIsSpinning(false);
    }, SPIN_DURATION_MS + 80);
  }

  function handleGuess(feeling) {
    if (!selectedFeeling || isSolved) return;

    setChosenGuess(feeling.id);

    if (feeling.id === selectedFeeling.id) {
      playPerfect();
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
                transition: isSpinning ? "transform " + SPIN_DURATION_MS + "ms cubic-bezier(0.14, 0.78, 0.18, 1)" : "none",
                overflow: "hidden",
              }}>
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
              disabled={isSpinning}
              style={{
                border: "none",
                borderRadius: 999,
                padding: isPhone ? "0.85rem 1.5rem" : "0.95rem 1.9rem",
                fontFamily: "'Secular One', sans-serif",
                fontSize: isPhone ? "1rem" : "1.08rem",
                color: "white",
                cursor: isSpinning ? "wait" : "pointer",
                background: isSpinning ? "#BCA9F6" : "linear-gradient(135deg, #7C5CFC, #F39C12)",
                boxShadow: isSpinning ? "none" : "0 10px 22px rgba(124,92,252,0.28)",
                minWidth: isPhone ? 180 : 220,
              }}
            >
              {isSpinning ? "הגלגל מסתובב..." : selectedFeeling ? "סובבי שוב" : "סובבי את הגלגל"}
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
                var isCorrectAnswer = selectedFeeling && option.id === selectedFeeling.id;
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
    </div>
  );
}
