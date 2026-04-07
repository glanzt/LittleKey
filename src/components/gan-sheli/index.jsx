"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { levels } from "@/lib/gan-sheli-levels";
import { applyLevelOrder, createDifficultyAwareOrder, isValidLevelOrder } from "@/lib/gan-sheli-level-order";
import GameScreen from "./game-screen";
import LevelMap from "./level-map";
import "./gan-sheli.css";

var STORAGE_KEY = "gan-sheli-progress";
var LEVEL_ORDER_STORAGE_KEY = "gan-sheli-level-order";

function loadProgress() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function saveProgress(completed) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
}

function loadLevelOrder() {
  try {
    var raw = localStorage.getItem(LEVEL_ORDER_STORAGE_KEY);
    if (!raw) return createDifficultyAwareOrder(levels);
    var parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && isValidLevelOrder(parsed, levels)) return parsed;
    return createDifficultyAwareOrder(levels);
  } catch (e) {
    return createDifficultyAwareOrder(levels);
  }
}

function saveLevelOrder(levelOrder) {
  localStorage.setItem(LEVEL_ORDER_STORAGE_KEY, JSON.stringify(levelOrder));
}

export default function GanSheli() {
  var router = useRouter();
  var _scr = useState("title"); var screen = _scr[0]; var setScreen = _scr[1];
  var _cli = useState(0); var currentLevelIndex = _cli[0]; var setCurrentLevelIndex = _cli[1];
  var _comp = useState(loadProgress); var completedLevels = _comp[0]; var setCompletedLevels = _comp[1];
  var _lo = useState(loadLevelOrder); var levelOrder = _lo[0]; var setLevelOrder = _lo[1];
  var _fb = useState("none"); var feedbackState = _fb[0]; var setFeedbackState = _fb[1];

  useEffect(function() { saveProgress(completedLevels); }, [completedLevels]);
  useEffect(function() { saveLevelOrder(levelOrder); }, [levelOrder]);

  var orderedLevels = useMemo(function() { return applyLevelOrder(levels, levelOrder); }, [levelOrder]);
  var currentLevel = orderedLevels[currentLevelIndex];
  var nextUnlockedIndex = completedLevels.length;

  var startGame = useCallback(function() {
    setCurrentLevelIndex(nextUnlockedIndex < orderedLevels.length ? nextUnlockedIndex : 0);
    setScreen("game");
    setFeedbackState("none");
  }, [nextUnlockedIndex, orderedLevels.length]);

  var goToMap = useCallback(function() { setScreen("map"); }, []);

  var playLevel = useCallback(function(index) {
    setCurrentLevelIndex(index);
    setScreen("game");
    setFeedbackState("none");
  }, []);

  var onCorrect = useCallback(function() {
    setFeedbackState("correct");
    var levelId = orderedLevels[currentLevelIndex].id;
    setCompletedLevels(function(prev) {
      if (prev.includes(levelId)) return prev;
      return prev.concat([levelId]);
    });
  }, [currentLevelIndex, orderedLevels]);

  var onIncorrect = useCallback(function() {
    setFeedbackState("incorrect");
  }, []);

  var dismissFeedback = useCallback(function() {
    setFeedbackState("none");
  }, []);

  var nextLevel = useCallback(function() {
    setFeedbackState("none");
    var next = currentLevelIndex + 1;
    if (next >= orderedLevels.length) {
      setScreen("finale");
    } else {
      setCurrentLevelIndex(next);
    }
  }, [currentLevelIndex, orderedLevels.length]);

  var resetProgress = useCallback(function() {
    setCompletedLevels([]);
    setLevelOrder(createDifficultyAwareOrder(levels));
    setCurrentLevelIndex(0);
    setScreen("title");
  }, []);

  function goBack() {
    router.push("/play");
  }

  if (screen === "title") {
    return (
      <div className="gan-sheli-app">
        <div className="screen title-screen">
          <button className="gs-back-home" onClick={goBack}>חזרה לתפריט</button>
          <h1 className="title">גן שלי</h1>
          <p className="subtitle">{orderedLevels.length} משחקים ללמוד וליהנות</p>
          <div className="title-buttons">
            <button className="primary-btn" onClick={startGame}>
              {completedLevels.length > 0 ? "המשך לשחק" : "בוא נתחיל!"}
            </button>
            <button className="secondary-btn" onClick={goToMap}>מפת השלבים</button>
          </div>
          {completedLevels.length > 0 && (
            <p className="progress-hint">השלמת {completedLevels.length} מתוך {orderedLevels.length} שלבים</p>
          )}
        </div>
      </div>
    );
  }

  if (screen === "map") {
    return (
      <div className="gan-sheli-app">
        <LevelMap
          levels={orderedLevels}
          completedLevels={completedLevels}
          nextUnlockedIndex={Math.min(nextUnlockedIndex, orderedLevels.length - 1)}
          onPlay={playLevel}
          onBack={function() { setScreen("title"); }}
        />
      </div>
    );
  }

  if (screen === "game") {
    return (
      <div className="gan-sheli-app">
        <GameScreen
          level={currentLevel}
          levelNumber={currentLevelIndex + 1}
          feedbackState={feedbackState}
          onCorrect={onCorrect}
          onIncorrect={onIncorrect}
          onNext={nextLevel}
          onDismiss={dismissFeedback}
          onBack={goToMap}
          totalLevels={orderedLevels.length}
        />
      </div>
    );
  }

  if (screen === "finale") {
    return (
      <div className="gan-sheli-app">
        <div className="screen finale-screen">
          <div className="finale-stars">&#9733; &#9733; &#9733; &#9733; &#9733;</div>
          <h1 className="finale-title">כל הכבוד!</h1>
          <p className="finale-text">סיימת את כל {orderedLevels.length} השלבים!</p>
          <p className="finale-text">אתה אלוף אמיתי!</p>
          <div className="title-buttons">
            <button className="primary-btn" onClick={goToMap}>חזרה למפה</button>
            <button className="secondary-btn" onClick={resetProgress}>התחל מחדש</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
