"use client";

import { useState, useEffect } from "react";

export default function OddOneOutGame({ config, onCorrect, onIncorrect }) {
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    setAnswered(false);
  }, [config]);

  return (
    <div className="game-area">
      <div className="objects-row">
        {config.objects.map(obj => (
          <button
            key={obj.id}
            className="game-object tappable"
            disabled={answered}
            onClick={() => {
              setAnswered(true);
              obj.id === config.oddId ? onCorrect() : onIncorrect();
            }}
          >
            {obj.emoji}
            <span className="object-small-label">{obj.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
