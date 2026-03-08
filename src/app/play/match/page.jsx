"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/lib/game-context";
import { PAGE_BG, BACK_BUTTON_STYLE, HEBREW_LETTERS, playCardFlip, playError, playPerfect, playSuccess, speakLetter } from "@/lib/game-constants";
import { FloatingLettersBackground } from "@/styles/shared";
import { MATCH_PAIR_COUNT, MATCH_ROW_LAYOUT, createMatchDeck } from "@/lib/match-game";

export default function MatchGamePage() {
  var game = useGame();
  var router = useRouter();
  var availableLetters = game.settings.letterSet && game.settings.letterSet.length > 0
    ? game.settings.letterSet
    : HEBREW_LETTERS;

  var _rd = useState(1); var round = _rd[0]; var setRound = _rd[1];
  var _cd = useState(function() { return createMatchDeck(availableLetters, MATCH_PAIR_COUNT); }); var cards = _cd[0]; var setCards = _cd[1];
  var _op = useState([]); var openIds = _op[0]; var setOpenIds = _op[1];
  var _mv = useState(0); var moves = _mv[0]; var setMoves = _mv[1];
  var _mt = useState(0); var matches = _mt[0]; var setMatches = _mt[1];
  var _bs = useState(false); var isBusy = _bs[0]; var setIsBusy = _bs[1];
  var _rc = useState(false); var roundComplete = _rc[0]; var setRoundComplete = _rc[1];
  var _nt = useState(Date.now()); var nowTick = _nt[0]; var setNowTick = _nt[1];
  var _crd = useState(null); var completedRoundDuration = _crd[0]; var setCompletedRoundDuration = _crd[1];
  var roundStartedAtRef = useRef(Date.now());

  useEffect(function() {
    resetRound(1);
  }, [availableLetters.join("|")]);

  useEffect(function() {
    var timer = setInterval(function() {
      setNowTick(Date.now());
    }, 100);
    return function() { clearInterval(timer); };
  }, []);

  function formatStopwatch(ms) {
    var totalMs = Math.max(0, ms || 0);
    var totalSeconds = Math.floor(totalMs / 1000);
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  }

  function resetRound(nextRound) {
    roundStartedAtRef.current = Date.now();
    setNowTick(Date.now());
    setCompletedRoundDuration(null);
    setRound(nextRound);
    setCards(createMatchDeck(availableLetters, MATCH_PAIR_COUNT));
    setOpenIds([]);
    setMoves(0);
    setMatches(0);
    setIsBusy(false);
    setRoundComplete(false);
  }

  function handlePlayAgain() {
    resetRound(round + 1);
  }

  function revealCard(cardId) {
    setCards(function(prev) {
      return prev.map(function(card) {
        if (card.id !== cardId) return card;
        return { id: card.id, letter: card.letter, revealed: true, matched: card.matched };
      });
    });
  }

  function hideCards(cardIds) {
    setCards(function(prev) {
      return prev.map(function(card) {
        if (cardIds.indexOf(card.id) === -1) return card;
        return { id: card.id, letter: card.letter, revealed: false, matched: false };
      });
    });
  }

  function matchCards(cardIds) {
    setCards(function(prev) {
      return prev.map(function(card) {
        if (cardIds.indexOf(card.id) === -1) return card;
        return { id: card.id, letter: card.letter, revealed: true, matched: true };
      });
    });
  }

  function handleCardClick(card) {
    if (isBusy || card.matched || card.revealed) return;

    playCardFlip();
    revealCard(card.id);

    if (openIds.length === 0) {
      setOpenIds([card.id]);
      return;
    }

    var firstId = openIds[0];
    var firstCard = cards.find(function(entry) { return entry.id === firstId; });
    var chosenIds = [firstId, card.id];
    var nextMoves = moves + 1;

    setMoves(nextMoves);
    setIsBusy(true);

    if (firstCard && firstCard.letter === card.letter) {
      var nextMatches = matches + 1;
      setTimeout(function() {
        matchCards(chosenIds);
        setOpenIds([]);
        setMatches(nextMatches);
        setIsBusy(false);
        speakLetter(card.letter);
        if (nextMatches >= MATCH_PAIR_COUNT) {
          var roundDuration = Date.now() - roundStartedAtRef.current;
          setCompletedRoundDuration(roundDuration);
          game.recordMatchSession(roundDuration, {
            totalQuestions: MATCH_PAIR_COUNT,
            completed: MATCH_PAIR_COUNT,
            moves: nextMoves,
            round: round,
          });
          playPerfect();
          setRoundComplete(true);
        } else {
          playSuccess();
        }
      }, 380);
      return;
    }

    playError();
    setTimeout(function() {
      playCardFlip();
      hideCards(chosenIds);
      setOpenIds([]);
      setIsBusy(false);
    }, 850);
  }

  var rows = useMemo(function() {
    var slices = [];
    var start = 0;
    MATCH_ROW_LAYOUT.forEach(function(count) {
      slices.push(cards.slice(start, start + count));
      start += count;
    });
    return slices;
  }, [cards]);
  var displayDuration = completedRoundDuration != null ? completedRoundDuration : (nowTick - roundStartedAtRef.current);

  return (
    <div style={{ ...PAGE_BG, justifyContent: "flex-start", paddingTop: "1.5rem", paddingBottom: "2rem" }}>
      <FloatingLettersBackground />

      <button onClick={function() { router.push("/play"); }} style={BACK_BUTTON_STYLE}>← חזרה</button>

      <div style={{ width: "100%", maxWidth: 1080, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Suez One', serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", color: "#111319", margin: "0 0 0.5rem", textAlign: "center" }}>
          משחק התאמת קלפים
        </h1>
        <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: "1rem", color: "rgba(17,19,25,0.55)", margin: "0 0 1.2rem", textAlign: "center", maxWidth: 560 }}>
          הפכי שני קלפים ומצאי את שתי האותיות הזהות. כשמוצאים את כל הזוגות, הלוח מתערבב לסיבוב חדש.
        </p>

        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "1.4rem" }}>
          {[
            { label: "זמן", value: formatStopwatch(displayDuration), color: "#7C5CFC" },
            { label: "זוגות שנמצאו", value: matches + " / " + MATCH_PAIR_COUNT, color: "#27AE60" },
            { label: "ניסיונות", value: moves, color: "#E67E22" },
          ].map(function(stat) {
            return (
              <div key={stat.label} style={{
                minWidth: 140, padding: "0.85rem 1rem", borderRadius: 18,
                background: "white", boxShadow: "0 6px 24px rgba(17,19,25,0.08)",
                textAlign: "center", border: "1px solid rgba(17,19,25,0.06)",
              }}>
                <div style={{ fontFamily: "'Rubik', sans-serif", fontSize: "0.8rem", color: "rgba(17,19,25,0.45)" }}>{stat.label}</div>
                <div style={{ fontFamily: "'Secular One', sans-serif", fontSize: "1.5rem", color: stat.color }}>{stat.value}</div>
              </div>
            );
          })}
        </div>

        <div style={{
          width: "100%", maxWidth: 980, padding: "1.4rem 1rem 1.2rem",
          borderRadius: 32, background: "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(250,246,240,0.92))",
          boxShadow: "0 16px 50px rgba(17,19,25,0.08)", border: "1px solid rgba(17,19,25,0.06)",
        }}>
          {rows.map(function(rowCards, rowIndex) {
            return (
              <div key={rowIndex} style={{
                display: "flex", justifyContent: "center", gap: "clamp(0.5rem, 1.8vw, 1rem)",
                marginBottom: rowIndex === rows.length - 1 ? 0 : "clamp(0.6rem, 1.8vw, 1rem)",
                flexWrap: "nowrap",
              }}>
                {rowCards.map(function(card, index) {
                  var cardNumber = MATCH_ROW_LAYOUT.slice(0, rowIndex).reduce(function(sum, count) { return sum + count; }, 0) + index + 1;
                  var isFaceUp = card.revealed || card.matched;
                  var rotation = ((cardNumber % 5) - 2) * 1.3;

                  return (
                    <div
                      key={card.id}
                      style={{
                        width: "clamp(5rem, 12vw, 8.5rem)",
                        height: "clamp(6.2rem, 15vw, 10rem)",
                        perspective: 1200,
                        transform: "rotate(" + rotation + "deg)" + (isFaceUp ? " translateY(-4px)" : ""),
                        transition: "transform 0.28s ease",
                      }}
                    >
                      <button
                        onClick={function() { handleCardClick(card); }}
                        disabled={isBusy || card.matched}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 22,
                          border: "none",
                          padding: 0,
                          background: "transparent",
                          cursor: isBusy || card.matched ? "default" : "pointer",
                          position: "relative",
                        }}
                      >
                        <div style={{
                          position: "relative",
                          width: "100%",
                          height: "100%",
                          transformStyle: "preserve-3d",
                          transition: "transform 0.65s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease",
                          transform: isFaceUp ? "rotateY(180deg)" : "rotateY(0deg)",
                          boxShadow: isFaceUp
                            ? "0 12px 24px rgba(48,34,77,0.14)"
                            : "0 8px 18px rgba(48,34,77,0.12)",
                        }}>
                          <div style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: 22,
                            border: "4px solid #30224D",
                            background: "linear-gradient(180deg, #FCFAF7 0%, #E9E0D9 100%)",
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                          }}>
                            <span style={{
                              fontFamily: "'Secular One', sans-serif",
                              fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)",
                              color: "rgba(48,34,77,0.9)",
                            }}>
                              ?
                            </span>
                            <span style={{
                              position: "absolute", bottom: 10, left: 14,
                              fontFamily: "'Rubik', sans-serif", fontSize: "0.9rem", color: "rgba(48,34,77,0.28)",
                            }}>
                              {cardNumber}
                            </span>
                            <div style={{
                              position: "absolute",
                              inset: 0,
                              background: "linear-gradient(135deg, rgba(255,255,255,0.38), transparent 44%, rgba(48,34,77,0.08) 100%)",
                            }} />
                          </div>

                          <div style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: 22,
                            border: "4px solid #30224D",
                            background: card.matched
                              ? "linear-gradient(180deg, #DFF7E5 0%, #BCECC9 100%)"
                              : "linear-gradient(180deg, #FFF9F0 0%, #F8EFE2 100%)",
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                          }}>
                            <span style={{
                              fontFamily: "'Suez One', serif",
                              fontSize: "clamp(2.3rem, 5vw, 3.6rem)",
                              color: card.matched ? "#1E8E52" : "#111319",
                              lineHeight: 1,
                            }}>
                              {card.letter}
                            </span>
                            <div style={{
                              position: "absolute",
                              inset: 0,
                              background: card.matched
                                ? "radial-gradient(circle at top, rgba(255,255,255,0.55), transparent 58%)"
                                : "radial-gradient(circle at top, rgba(255,255,255,0.4), transparent 58%)",
                            }} />
                          </div>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: "0.92rem", color: "rgba(17,19,25,0.45)", margin: "1rem 0 0", textAlign: "center", maxWidth: 520 }}>
          האותיות נבחרות מתוך ההגדרות שלכן כשיש בחירה מותאמת, ובכל סיבוב מתקבל ערבוב חדש.
        </p>
      </div>

      {roundComplete ? (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(17,19,25,0.34)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
        }}>
          <div style={{
            width: "100%", maxWidth: 380, borderRadius: 28, background: "white", textAlign: "center",
            padding: "2rem 1.6rem", boxShadow: "0 20px 60px rgba(17,19,25,0.2)",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.6rem" }}>🎉</div>
            <h2 style={{ fontFamily: "'Secular One', sans-serif", fontSize: "1.35rem", color: "#111319", margin: "0 0 0.5rem" }}>
              כל הזוגות נמצאו!
            </h2>
            <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: "0.95rem", color: "rgba(17,19,25,0.55)", margin: "0 0 1.25rem" }}>
              סיימת בזמן של {formatStopwatch(completedRoundDuration)}.
            </p>
            <button
              onClick={handlePlayAgain}
              style={{
                width: "100%",
                border: "none",
                borderRadius: 22,
                background: "linear-gradient(180deg, #6FA8FF 0%, #4B89F0 100%)",
                color: "white",
                cursor: "pointer",
                boxShadow: "0 12px 26px rgba(75,137,240,0.3)",
                padding: "0.9rem 1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.8rem",
                fontFamily: "'Secular One', sans-serif",
                fontSize: "1.15rem",
              }}
            >
              <span style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: "rgba(6,12,33,0.24)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
              }}>
                <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
                  <path
                    d="M28 12 L14 22 L28 32"
                    fill="none"
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18 22c5-8 14-12 24-10c13 2 22 13 22 26c0 15-12 26-27 26c-11 0-21-7-25-18"
                    fill="none"
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>שחק שוב</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
