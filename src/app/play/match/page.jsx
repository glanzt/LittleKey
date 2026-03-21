"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGame } from "@/lib/game-context";
import { PAGE_BG, playCardFlip, playError, playFeelingSound, playPerfect, playSuccess } from "@/lib/game-constants";
import { BuildLoopHud, ThemePickerOverlay } from "@/components/build-loop";
import { FloatingLettersBackground } from "@/styles/shared";
import { useBuildLoop } from "@/lib/build-loop";
import { MATCH_PAIR_COUNT, MATCH_ROW_LAYOUT, createMatchDeck } from "@/lib/match-game";

export default function MatchGamePage() {
  var game = useGame();
  var _vw = useState(typeof window === "undefined" ? 1200 : window.innerWidth); var viewportWidth = _vw[0]; var setViewportWidth = _vw[1];
  var buildLoop = useBuildLoop("match", game.activeProfile ? game.activeProfile.id : null);
  var themeReadyRef = useRef(false);

  var _rd = useState(1); var round = _rd[0]; var setRound = _rd[1];
  var _cd = useState(function() { return createMatchDeck(MATCH_PAIR_COUNT); }); var cards = _cd[0]; var setCards = _cd[1];
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
  }, []);

  useEffect(function() {
    function handleResize() {
      setViewportWidth(window.innerWidth);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return function() { window.removeEventListener("resize", handleResize); };
  }, []);

  useEffect(function() {
    var timer = setInterval(function() {
      setNowTick(Date.now());
    }, 100);
    return function() { clearInterval(timer); };
  }, []);

  useEffect(function() {
    if (!buildLoop.hasTheme || themeReadyRef.current) return;
    themeReadyRef.current = true;
    resetRound(1);
  }, [buildLoop.hasTheme]);

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
    setCards(createMatchDeck(MATCH_PAIR_COUNT));
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
        return { id: card.id, matchKey: card.matchKey, label: card.label, imageSrc: card.imageSrc, audioName: card.audioName, revealed: true, matched: card.matched };
      });
    });
  }

  function hideCards(cardIds) {
    setCards(function(prev) {
      return prev.map(function(card) {
        if (cardIds.indexOf(card.id) === -1) return card;
        return { id: card.id, matchKey: card.matchKey, label: card.label, imageSrc: card.imageSrc, audioName: card.audioName, revealed: false, matched: false };
      });
    });
  }

  function matchCards(cardIds) {
    setCards(function(prev) {
      return prev.map(function(card) {
        if (cardIds.indexOf(card.id) === -1) return card;
        return { id: card.id, matchKey: card.matchKey, label: card.label, imageSrc: card.imageSrc, audioName: card.audioName, revealed: true, matched: true };
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

    if (firstCard && firstCard.matchKey === card.matchKey) {
      var nextMatches = matches + 1;
      setTimeout(function() {
        matchCards(chosenIds);
        setOpenIds([]);
        setMatches(nextMatches);
        setIsBusy(false);
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
          playFeelingSound(card.audioName || card.label);
          buildLoop.registerSuccess();
          setRoundComplete(true);
        } else {
          playSuccess();
          playFeelingSound(card.audioName || card.label);
          buildLoop.registerSuccess();
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

  var displayDuration = completedRoundDuration != null ? completedRoundDuration : (nowTick - roundStartedAtRef.current);
  var isPhone = viewportWidth <= 700;
  var boardGap = isPhone ? 8 : 14;
  var phoneColumns = 3;
  var rowLayout = isPhone ? [2, 3, 3, 3, 3, 2] : MATCH_ROW_LAYOUT;
  var rows = useMemo(function() {
    var slices = [];
    var start = 0;
    rowLayout.forEach(function(count) {
      slices.push(cards.slice(start, start + count));
      start += count;
    });
    return slices;
  }, [cards, rowLayout]);

  function getCardSize(rowLength) {
    if (!isPhone) {
      return {
        width: "clamp(5rem, 12vw, 8.5rem)",
        height: "clamp(6.2rem, 15vw, 10rem)",
      };
    }

    return {
      width: "calc((100% - " + ((phoneColumns - 1) * boardGap) + "px) / " + phoneColumns + ")",
      height: rowLength === 2 ? "7.5rem" : "7.2rem",
    };
  }

  return (
    <div style={{ ...PAGE_BG, justifyContent: "flex-start", paddingTop: isPhone ? "1rem" : "1.5rem", paddingBottom: "2rem", paddingLeft: isPhone ? "0.6rem" : PAGE_BG.padding, paddingRight: isPhone ? "0.6rem" : PAGE_BG.padding }}>
      <FloatingLettersBackground />

      <div style={{ width: "100%", maxWidth: isPhone ? "100%" : 1080, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Suez One', serif", fontSize: isPhone ? "clamp(1.5rem, 7vw, 2rem)" : "clamp(2rem, 5vw, 3.2rem)", color: "#111319", margin: "0 0 0.4rem", textAlign: "center", lineHeight: 1.05 }}>
          משחק התאמת קלפים
        </h1>
        {buildLoop.hasTheme ? (
          <BuildLoopHud
            theme={buildLoop.theme}
            progress={buildLoop.progress}
            builtParts={buildLoop.builtParts}
            justUnlockedPartId={buildLoop.justUnlockedPartId}
            showNudge={buildLoop.showNudge}
            isPhone={isPhone}
            maxWidth={840}
            margin="0 auto 0.9rem"
          />
        ) : null}
        <div style={{ display: "flex", gap: isPhone ? "0.45rem" : "0.8rem", flexWrap: "nowrap", justifyContent: "center", marginBottom: isPhone ? "0.8rem" : "1.4rem", width: "100%", maxWidth: isPhone ? "100%" : "none" }}>
          {[
            { label: "זמן", value: formatStopwatch(displayDuration), color: "#7C5CFC" },
            { label: "זוגות שנמצאו", value: matches + " / " + MATCH_PAIR_COUNT, color: "#27AE60" },
            { label: "ניסיונות", value: moves, color: "#E67E22" },
          ].map(function(stat) {
            return (
              <div key={stat.label} style={{
                minWidth: 0, flex: 1, padding: isPhone ? "0.45rem 0.4rem" : "0.85rem 1rem", borderRadius: isPhone ? 14 : 18,
                background: "white", boxShadow: "0 6px 24px rgba(17,19,25,0.08)",
                textAlign: "center", border: "1px solid rgba(17,19,25,0.06)",
              }}>
                <div style={{ fontFamily: "'Rubik', sans-serif", fontSize: isPhone ? "0.68rem" : "0.8rem", color: "rgba(17,19,25,0.45)", whiteSpace: isPhone ? "nowrap" : "normal" }}>{stat.label}</div>
                <div style={{ fontFamily: "'Secular One', sans-serif", fontSize: isPhone ? "1.12rem" : "1.5rem", color: stat.color, whiteSpace: "nowrap" }}>{stat.value}</div>
              </div>
            );
          })}
        </div>

        <div style={{
          width: "100%", maxWidth: isPhone ? "100%" : 980, padding: isPhone ? "0.75rem 0.35rem 0.6rem" : "1.4rem 1rem 1.2rem",
          borderRadius: isPhone ? 26 : 32, background: "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(250,246,240,0.92))",
          boxShadow: "0 16px 50px rgba(17,19,25,0.08)", border: "1px solid rgba(17,19,25,0.06)",
        }}>
          {rows.map(function(rowCards, rowIndex) {
            return (
              <div key={rowIndex} style={{
                display: "flex", justifyContent: "center", gap: boardGap,
                marginBottom: rowIndex === rows.length - 1 ? 0 : (isPhone ? boardGap : "clamp(0.6rem, 1.8vw, 1rem)"),
                flexWrap: "nowrap", width: "100%",
              }}>
                {rowCards.map(function(card, index) {
                  var cardNumber = rowLayout.slice(0, rowIndex).reduce(function(sum, count) { return sum + count; }, 0) + index + 1;
                  var isFaceUp = card.revealed || card.matched;
                  var rotation = isPhone ? 0 : ((cardNumber % 5) - 2) * 1.3;
                  var cardSize = getCardSize(rowCards.length);

                  return (
                    <div
                      key={card.id}
                      style={{
                        width: cardSize.width,
                        height: cardSize.height,
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
                          borderRadius: isPhone ? 18 : 22,
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
                            borderRadius: isPhone ? 18 : 22,
                            border: isPhone ? "3px solid #30224D" : "4px solid #30224D",
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
                              fontSize: isPhone ? "1.45rem" : "clamp(1.4rem, 2.4vw, 1.9rem)",
                              color: "rgba(48,34,77,0.9)",
                            }}>
                              ?
                            </span>
                            <span style={{
                              position: "absolute", bottom: isPhone ? 6 : 10, left: isPhone ? 10 : 14,
                              fontFamily: "'Rubik', sans-serif", fontSize: isPhone ? "0.72rem" : "0.9rem", color: "rgba(48,34,77,0.28)",
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
                            borderRadius: isPhone ? 18 : 22,
                            border: card.matched
                              ? (isPhone ? "3px solid #D4A62A" : "4px solid #D4A62A")
                              : (isPhone ? "3px solid #E2B53B" : "4px solid #E2B53B"),
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
                              position: "relative",
                              zIndex: 2,
                              width: "92%",
                              height: "92%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}>
                              <img
                                src={card.imageSrc}
                                alt={card.label}
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "100%",
                                  objectFit: "contain",
                                  width: "100%",
                                  height: "100%",
                                  filter: card.matched ? "drop-shadow(0 4px 10px rgba(30,142,82,0.18))" : "none",
                                }}
                              />
                            </span>
                            <div style={{
                              position: "absolute",
                              inset: isPhone ? 2 : 3,
                              borderRadius: isPhone ? 14 : 18,
                              border: card.matched
                                ? (isPhone ? "2px solid rgba(255,242,179,0.95)" : "3px solid rgba(255,242,179,0.95)")
                                : (isPhone ? "2px solid rgba(255,239,168,0.92)" : "3px solid rgba(255,239,168,0.92)"),
                              boxShadow: card.matched
                                ? "inset 0 0 0 1px rgba(255,255,255,0.75), 0 0 18px rgba(212,166,42,0.32)"
                                : "inset 0 0 0 1px rgba(255,255,255,0.7), 0 0 16px rgba(226,181,59,0.22)",
                              pointerEvents: "none",
                            }} />
                            <div style={{
                              position: "absolute",
                              inset: 0,
                              background: card.matched
                                ? "radial-gradient(circle at top, rgba(255,255,255,0.55), transparent 58%)"
                                : "radial-gradient(circle at top, rgba(255,255,255,0.4), transparent 58%)",
                            }} />
                            <div style={{
                              position: "absolute",
                              top: isPhone ? 4 : 6,
                              left: isPhone ? 8 : 10,
                              right: isPhone ? 8 : 10,
                              height: "26%",
                              borderRadius: 999,
                              background: "linear-gradient(180deg, rgba(255,255,255,0.52), rgba(255,255,255,0))",
                              pointerEvents: "none",
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

        <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: isPhone ? "0.78rem" : "0.92rem", color: "rgba(17,19,25,0.45)", margin: "0.8rem 0 0", textAlign: "center", maxWidth: 520, padding: isPhone ? "0 0.5rem" : 0 }}>
          הופכים קלפי רגשות ובכל משחק מקבלים ערבוב חדש של תמונות.
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

      {!buildLoop.hasTheme ? (
        <ThemePickerOverlay themes={buildLoop.themes} onChoose={buildLoop.chooseTheme} isPhone={isPhone} />
      ) : null}
    </div>
  );
}
