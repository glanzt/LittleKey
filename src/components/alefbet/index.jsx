"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LETTERS } from "@/lib/alefbet-letters";
import LetterRail from "./letter-rail";
import QuestionCard from "./question-card";
import "./alefbet.css";

var STORAGE_KEY = "alefbet-progress";

var PRAISE = ["יופי!", "כל הכבוד!", "מצוין!", "נהדר!", "אלוף!"];

function loadProgress() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    var parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveProgress(completed) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  } catch (e) {
    /* ignore */
  }
}

function instructionFor(question, letter) {
  if (question.type === "word") return "איזו מילה מתחילה באות " + letter + "?";
  return "איזה ציור מתחיל באות " + letter + "?";
}

export default function Alefbet() {
  var router = useRouter();
  var _scr = useState("title"); var screen = _scr[0]; var setScreen = _scr[1];
  var _li = useState(0); var currentLetterIndex = _li[0]; var setCurrentLetterIndex = _li[1];
  var _qi = useState(0); var currentQuestionIndex = _qi[0]; var setCurrentQuestionIndex = _qi[1];
  var _comp = useState(loadProgress); var completedLetters = _comp[0]; var setCompletedLetters = _comp[1];
  var _fb = useState("none"); var feedbackState = _fb[0]; var setFeedbackState = _fb[1];
  var _praise = useState(PRAISE[0]); var praise = _praise[0]; var setPraise = _praise[1];
  var _replay = useState(0); var replaySignal = _replay[0]; var setReplaySignal = _replay[1];

  var praiseRef = useRef(PRAISE[0]);

  useEffect(function () { saveProgress(completedLetters); }, [completedLetters]);

  var playableIndices = useMemo(function () {
    return LETTERS.reduce(function (acc, entry, index) {
      if (entry.questions) acc.push(index);
      return acc;
    }, []);
  }, []);

  var isUnlocked = useCallback(function (index) {
    if (index === 0) return true;
    var prev = LETTERS[index - 1];
    return completedLetters.includes(prev.letter);
  }, [completedLetters]);

  var allComplete = useMemo(function () {
    return playableIndices.every(function (index) {
      return completedLetters.includes(LETTERS[index].letter);
    });
  }, [playableIndices, completedLetters]);

  var currentLetter = LETTERS[currentLetterIndex];
  var questions = currentLetter && currentLetter.questions ? currentLetter.questions : [];
  var currentQuestion = questions[currentQuestionIndex];

  var firstIncompletePlayable = useCallback(function () {
    for (var i = 0; i < playableIndices.length; i += 1) {
      var idx = playableIndices[i];
      if (!completedLetters.includes(LETTERS[idx].letter)) return idx;
    }
    return playableIndices[0] || 0;
  }, [playableIndices, completedLetters]);

  var nextPlayableAfter = useCallback(function (afterIndex) {
    for (var i = 0; i < playableIndices.length; i += 1) {
      if (playableIndices[i] > afterIndex) return playableIndices[i];
    }
    return -1;
  }, [playableIndices]);

  var startGame = useCallback(function () {
    if (allComplete) {
      setScreen("finale");
      return;
    }
    setCurrentLetterIndex(firstIncompletePlayable());
    setCurrentQuestionIndex(0);
    setFeedbackState("none");
    setScreen("play");
  }, [allComplete, firstIncompletePlayable]);

  var selectLetter = useCallback(function (index) {
    setCurrentLetterIndex(index);
    setCurrentQuestionIndex(0);
    setFeedbackState("none");
    setScreen("play");
  }, []);

  var onCorrect = useCallback(function () {
    praiseRef.current = PRAISE[Math.floor(Math.random() * PRAISE.length)];
    setPraise(praiseRef.current);
    setFeedbackState("correct");
  }, []);

  var onIncorrect = useCallback(function () {
    setFeedbackState("incorrect");
  }, []);

  var dismissFeedback = useCallback(function () {
    setFeedbackState("none");
  }, []);

  var advance = useCallback(function () {
    setFeedbackState("none");
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      return;
    }
    // Letter finished.
    setCompletedLetters(function (prev) {
      if (prev.includes(currentLetter.letter)) return prev;
      return prev.concat([currentLetter.letter]);
    });
    setScreen("letterDone");
  }, [currentQuestionIndex, questions.length, currentLetter]);

  var continueAfterLetter = useCallback(function () {
    var next = nextPlayableAfter(currentLetterIndex);
    if (next === -1) {
      setScreen("finale");
      return;
    }
    setCurrentLetterIndex(next);
    setCurrentQuestionIndex(0);
    setFeedbackState("none");
    setScreen("play");
  }, [currentLetterIndex, nextPlayableAfter]);

  var resetProgress = useCallback(function () {
    setCompletedLetters([]);
    setCurrentLetterIndex(0);
    setCurrentQuestionIndex(0);
    setFeedbackState("none");
    setScreen("title");
  }, []);

  function goBack() {
    router.push("/play");
  }

  // Auto-advance shortly after a correct answer so young kids keep flowing.
  useEffect(function () {
    if (feedbackState !== "correct") return undefined;
    var timeout = window.setTimeout(function () { advance(); }, 1500);
    return function () { window.clearTimeout(timeout); };
  }, [feedbackState, advance]);

  var replayNarration = useCallback(function () {
    setReplaySignal(function (n) { return n + 1; });
  }, []);

  if (screen === "title") {
    var doneCount = completedLetters.filter(function (l) {
      return playableIndices.some(function (idx) { return LETTERS[idx].letter === l; });
    }).length;

    return (
      <div className="alefbet-app">
        <div className="ab-screen ab-title-screen">
          <button className="ab-back-home" onClick={goBack}>חזרה לתפריט</button>
          <h1 className="ab-title">ללמוד את האלף בית</h1>
          <p className="ab-subtitle">לומדים אות אחרי אות, עם תמונות ומילים</p>
          <div className="ab-title-letters" aria-hidden="true">
            {LETTERS.map(function (entry) { return <span key={entry.letter}>{entry.letter}</span>; })}
          </div>
          <button className="ab-primary-btn" onClick={startGame}>
            {doneCount > 0 ? "המשך ללמוד" : "בואו נתחיל!"}
          </button>
          {doneCount > 0 && (
            <p className="ab-progress-hint">למדת {doneCount} מתוך {playableIndices.length} אותיות</p>
          )}
        </div>
      </div>
    );
  }

  if (screen === "letterDone") {
    var hasNext = nextPlayableAfter(currentLetterIndex) !== -1;
    return (
      <div className="alefbet-app">
        <div className="ab-screen ab-letterdone">
          <button className="ab-back-home" onClick={goBack}>חזרה לתפריט</button>
          <div className="ab-letterdone-stars">&#9733; &#9733; &#9733;</div>
          <div className="ab-letterdone-letter">{currentLetter.letter}</div>
          <h2 className="ab-finale-title">כל הכבוד!</h2>
          <p className="ab-finale-text">סיימת את האות {currentLetter.name}</p>
          <button className="ab-primary-btn" onClick={hasNext ? continueAfterLetter : function () { setScreen("finale"); }}>
            {hasNext ? "לאות הבאה" : "סיימנו!"}
          </button>
          <button className="ab-secondary-btn" onClick={function () { setScreen("title"); }}>חזרה להתחלה</button>
        </div>
      </div>
    );
  }

  if (screen === "finale") {
    return (
      <div className="alefbet-app">
        <div className="ab-screen ab-title-screen">
          <button className="ab-back-home" onClick={goBack}>חזרה לתפריט</button>
          <div className="ab-finale-stars">&#9733; &#9733; &#9733; &#9733; &#9733;</div>
          <h1 className="ab-finale-title">איזה אלוף!</h1>
          <p className="ab-finale-text">סיימת את כל האותיות שלמדנו!</p>
          <button className="ab-primary-btn" onClick={function () { setScreen("title"); }}>חזרה להתחלה</button>
          <button className="ab-secondary-btn" onClick={resetProgress}>להתחיל מחדש</button>
        </div>
      </div>
    );
  }

  // screen === "play"
  if (!currentQuestion) return null;

  return (
    <div className="alefbet-app">
      <div className="ab-play">
        <div className="ab-top-bar">
          <button className="ab-icon-btn" onClick={goBack}>חזרה</button>
          <div className="ab-progress-label">
            <span className="ab-progress-letter">אות {currentLetter.letter}</span>
            <span className="ab-progress-step">שאלה {currentQuestionIndex + 1} / {questions.length}</span>
          </div>
          <button
            className="ab-icon-btn ab-audio-btn"
            onClick={replayNarration}
            aria-label="השמע שוב"
          >
            🔊
          </button>
        </div>

        <LetterRail
          letters={LETTERS}
          currentIndex={currentLetterIndex}
          completedLetters={completedLetters}
          isUnlocked={isUnlocked}
          onSelect={selectLetter}
        />

        <div className="ab-instruction">
          {currentQuestion.type === "word" ? "איזו מילה מתחילה באות " : "איזה ציור מתחיל באות "}
          <span className="ab-target">{currentLetter.letter}</span>
          {" ?"}
        </div>

        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          instruction={instructionFor(currentQuestion, currentLetter.letter)}
          replaySignal={replaySignal}
          locked={feedbackState === "correct"}
          onCorrect={onCorrect}
          onIncorrect={onIncorrect}
        />

        {feedbackState !== "none" && (
          <div className={`ab-feedback-overlay ${feedbackState}`}>
            <div className="ab-feedback-card">
              {feedbackState === "correct" && <div className="ab-feedback-stars">&#9733; &#9733; &#9733;</div>}
              <p className="ab-feedback-text">
                {feedbackState === "correct" ? praise : "כמעט! ננסה שוב."}
              </p>
              {feedbackState === "correct" ? (
                <button className="ab-feedback-btn success" onClick={advance}>הלאה</button>
              ) : (
                <button className="ab-feedback-btn retry" onClick={dismissFeedback}>ננסה שוב!</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
