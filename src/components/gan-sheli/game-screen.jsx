"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import CountingGame from "./counting-game";
import ShapesGame from "./shapes-game";
import SortingGame from "./sorting-game";
import SilhouetteGame from "./silhouette-game";
import OddOneOutGame from "./odd-one-out-game";
import VisualOddOneOutGame from "./visual-odd-one-out-game";
import SeriesGame from "./series-game";
import InitialSoundGame from "./initial-sound-game";

const TYPE_LABELS = {
  counting: 'ספירה ובחירה',
  shapes: 'זיהוי צורות',
  sorting: 'מיון: אכיל / לא אכיל',
  silhouette: 'התאמת צללית',
  oddOneOut: 'יוצא דופן',
  visualOddOneOut: 'מצא את השונה',
  series: 'השלמת סדרה',
  initialSound: 'צליל פותח',
};

export default function GameScreen({
  level, levelNumber, feedbackState, onCorrect, onIncorrect, onNext, onDismiss, onBack, totalLevels,
}) {
  const audioRef = useRef(null);
  const [countdown, setCountdown] = useState(3);

  const getAudioPath = useCallback((clipKind) => {
    const stageId = String(level.id).padStart(3, "0");
    return `/audio/gan-sheli/${stageId}-${clipKind}.mp3`;
  }, [level.id]);

  const stopVoiceover = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speakText = useCallback((text) => {
    if (!('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'he-IL';
    const voice = window.speechSynthesis.getVoices().find((item) => item.lang.startsWith('he'));
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  const playClip = useCallback((clipKind, fallbackText) => {
    stopVoiceover();

    const audio = new Audio(getAudioPath(clipKind));
    audioRef.current = audio;
    audio.onerror = () => {
      if (audioRef.current === audio) {
        speakText(fallbackText);
      }
    };
    audio.play().catch(() => {
      if (audioRef.current === audio) {
        speakText(fallbackText);
      }
    });
  }, [getAudioPath, speakText, stopVoiceover]);

  const playAudio = useCallback(() => {
    playClip('voiceover', level.voiceover);
  }, [level.voiceover, playClip]);

  const playTitle = useCallback(() => {
    playClip('title', level.name);
  }, [level.name, playClip]);

  useEffect(() => {
    const timer = setTimeout(playTitle, 400);
    return () => {
      clearTimeout(timer);
      stopVoiceover();
    };
  }, [level.id, playTitle, stopVoiceover]);

  useEffect(() => {
    if (feedbackState === 'none') {
      setCountdown(3);
      return;
    }

    if (feedbackState === 'correct') {
      playClip('success', level.correctFeedback);
      setCountdown(3);

      const intervalId = window.setInterval(() => {
        setCountdown(prev => Math.max(prev - 1, 1));
      }, 1000);

      const timeoutId = window.setTimeout(() => {
        onNext();
      }, 3000);

      return () => {
        window.clearInterval(intervalId);
        window.clearTimeout(timeoutId);
      };
    }

    playClip('failure', level.incorrectFeedback);
    setCountdown(3);
  }, [feedbackState, level.correctFeedback, level.id, level.incorrectFeedback, onNext, playClip]);

  const renderGame = () => {
    const props = { onCorrect, onIncorrect };
    switch (level.config.type) {
      case 'counting': return <CountingGame config={level.config} {...props} />;
      case 'shapes': return <ShapesGame config={level.config} {...props} />;
      case 'sorting': return <SortingGame config={level.config} {...props} />;
      case 'silhouette': return <SilhouetteGame config={level.config} {...props} />;
      case 'oddOneOut': return <OddOneOutGame config={level.config} {...props} />;
      case 'visualOddOneOut': return <VisualOddOneOutGame config={level.config} {...props} />;
      case 'series': return <SeriesGame config={level.config} {...props} />;
      case 'initialSound': return <InitialSoundGame config={level.config} {...props} />;
    }
  };

  return (
    <div className="game-screen">
      <div className="game-top-bar">
        <button className="icon-btn" onClick={onBack}>חזרה</button>
        <div className="level-info">
          <span className="level-number">שלב {levelNumber} / {totalLevels}</span>
          <span className="level-type">{TYPE_LABELS[level.gameType]}</span>
        </div>
        <button className="icon-btn audio-btn" onClick={playAudio}>🔊</button>
      </div>

      <div className="game-instruction">{level.instruction}</div>

      <div className="game-content" key={`${level.id}-${feedbackState}`}>
        {renderGame()}
      </div>

      {feedbackState !== 'none' && (
        <div className={`feedback-overlay ${feedbackState}`}>
          <div className="feedback-card">
            {feedbackState === 'correct' && <div className="feedback-stars">&#9733; &#9733; &#9733;</div>}
            <p className="feedback-text">
              {feedbackState === 'correct' ? level.correctFeedback : level.incorrectFeedback}
            </p>
            {feedbackState === 'correct' ? (
              <button className="feedback-btn success" onClick={onNext}>
                הלאה בעוד {countdown}
              </button>
            ) : (
              <button className="feedback-btn retry" onClick={onDismiss}>ננסה שוב!</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
