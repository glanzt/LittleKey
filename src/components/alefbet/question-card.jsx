"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function shuffle(items) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

const INSTRUCTION_KEY = "__instruction__";

// Single-correct 1-of-4 card for both 'picture' (emoji + label) and 'word'
// (label only) questions. When a question appears it narrates the instruction
// and then reads each option aloud slowly, highlighting the option currently
// being spoken. Tapping an option (or answering) stops the narration.
export default function QuestionCard({ question, instruction, replaySignal, locked, onCorrect, onIncorrect }) {
  const options = useMemo(() => shuffle(question.options), [question]);
  const [wrongId, setWrongId] = useState(null);
  const [correctId, setCorrectId] = useState(null);
  const [readingKey, setReadingKey] = useState(null);
  const stopNarrationRef = useRef(null);

  useEffect(() => {
    setWrongId(null);
    setCorrectId(null);
  }, [question]);

  // Narrate the instruction, then read each option aloud (slow) with highlight.
  useEffect(() => {
    let cancelled = false;
    let timer = null;
    const synth =
      typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;

    function pickVoice() {
      if (!synth) return null;
      const voices = synth.getVoices() || [];
      return voices.find((v) => v.lang && v.lang.indexOf("he") === 0) || null;
    }

    function speakOne(text) {
      return new Promise((resolve) => {
        if (cancelled) return resolve();
        if (!synth) {
          // No speech support: still pause so the highlight is visible.
          timer = window.setTimeout(resolve, 900);
          return undefined;
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "he-IL";
        utterance.rate = 0.6;
        const voice = pickVoice();
        if (voice) utterance.voice = voice;

        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          if (timer) window.clearTimeout(timer);
          resolve();
        };
        utterance.onend = finish;
        utterance.onerror = finish;
        // Fallback in case onend never fires (flaky TTS engines).
        timer = window.setTimeout(finish, 700 + text.length * 320);
        synth.cancel();
        synth.speak(utterance);
        return undefined;
      });
    }

    function gap(ms) {
      return new Promise((resolve) => {
        if (cancelled) return resolve();
        timer = window.setTimeout(resolve, ms);
        return undefined;
      });
    }

    async function run() {
      setReadingKey(INSTRUCTION_KEY);
      await speakOne(instruction);
      await gap(250);
      for (let i = 0; i < options.length; i += 1) {
        if (cancelled) break;
        setReadingKey(options[i].label + "#" + i);
        // eslint-disable-next-line no-await-in-loop
        await speakOne(options[i].label);
        // eslint-disable-next-line no-await-in-loop
        await gap(220);
      }
      if (!cancelled) setReadingKey(null);
    }

    stopNarrationRef.current = () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      if (synth) synth.cancel();
      setReadingKey(null);
    };

    run();

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      if (synth) synth.cancel();
    };
  }, [question, instruction, replaySignal, options]);

  const handlePick = (option) => {
    if (locked || correctId) return;
    if (stopNarrationRef.current) stopNarrationRef.current();

    if (option.correct) {
      setCorrectId(option.label);
      window.setTimeout(() => onCorrect(), 320);
      return;
    }

    setWrongId(option.label);
    window.setTimeout(() => {
      setWrongId((current) => (current === option.label ? null : current));
    }, 500);
    onIncorrect();
  };

  const isWord = question.type === "word";

  return (
    <div className="ab-content">
      <div className="ab-options-grid">
        {options.map((option, index) => {
          const classNames = ["ab-option"];
          if (isWord) classNames.push("word-only");
          if (readingKey === option.label + "#" + index) classNames.push("reading");
          if (correctId === option.label) classNames.push("correct");
          if (wrongId === option.label) classNames.push("wrong");

          return (
            <button
              key={`${option.label}-${index}`}
              className={classNames.join(" ")}
              onClick={() => handlePick(option)}
              disabled={locked || !!correctId}
              aria-label={option.label}
            >
              {!isWord && (
                <span className="ab-option-emoji" role="img" aria-hidden="true">
                  {option.emoji}
                </span>
              )}
              <span className="ab-option-label">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
