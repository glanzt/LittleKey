"use client";

import { useEffect, useRef } from "react";

export default function LetterRail({ letters, currentIndex, completedLetters, isUnlocked, onSelect }) {
  const railRef = useRef(null);
  const currentChipRef = useRef(null);

  useEffect(() => {
    const chip = currentChipRef.current;
    if (chip && chip.scrollIntoView) {
      chip.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [currentIndex]);

  return (
    <div className="ab-rail" ref={railRef} role="tablist" aria-label="אותיות האלף בית">
      {letters.map((entry, index) => {
        const completed = completedLetters.includes(entry.letter);
        const current = index === currentIndex;
        const unlocked = isUnlocked(index);
        const playable = unlocked && !!entry.questions;

        const classNames = ["ab-rail-chip"];
        if (completed) classNames.push("completed");
        else if (current) classNames.push("current");
        else if (unlocked) classNames.push("unlocked");
        if (!playable && !completed) classNames.push("locked");

        return (
          <button
            key={entry.letter}
            ref={current ? currentChipRef : null}
            className={classNames.join(" ")}
            disabled={!playable}
            onClick={() => playable && onSelect(index)}
            role="tab"
            aria-selected={current}
            aria-label={`אות ${entry.name}${completed ? ", הושלמה" : current ? ", נלמדת עכשיו" : !playable ? ", נעולה" : ""}`}
            title={entry.name}
          >
            {entry.letter}
            {completed && <span className="ab-chip-check" aria-hidden="true">&#10003;</span>}
            {!playable && !completed && <span className="ab-chip-lock" aria-hidden="true">🔒</span>}
          </button>
        );
      })}
    </div>
  );
}
