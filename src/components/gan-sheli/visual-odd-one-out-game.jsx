"use client";

import { useState, useEffect } from "react";
import VisualShapeIcon from "./visual-shape-icon";

export default function VisualOddOneOutGame({ config, onCorrect, onIncorrect }) {
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    setAnswered(false);
  }, [config]);

  return (
    <div className="game-area">
      <div className="visual-odd-out-row">
        {config.items.map((item, index) => (
          <button
            key={item.id}
            className="visual-item tappable"
            disabled={answered}
            onClick={() => {
              setAnswered(true);
              index === config.oddIndex ? onCorrect() : onIncorrect();
            }}
          >
            <VisualShapeIcon item={item} />
          </button>
        ))}
      </div>
    </div>
  );
}
