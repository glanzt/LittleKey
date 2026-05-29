"use client";

import { useEffect, useMemo, useState } from "react";

function shuffle(items) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

// Single-correct 1-of-4 card. Works for both 'picture' (emoji + label) and
// 'word' (label only) question types. Picking the correct option calls
// onCorrect; a wrong pick flashes red and calls onIncorrect without advancing.
export default function QuestionCard({ question, locked, onCorrect, onIncorrect }) {
  const options = useMemo(() => shuffle(question.options), [question]);
  const [wrongId, setWrongId] = useState(null);
  const [correctId, setCorrectId] = useState(null);

  useEffect(() => {
    setWrongId(null);
    setCorrectId(null);
  }, [question]);

  const handlePick = (option) => {
    if (locked || correctId) return;

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
