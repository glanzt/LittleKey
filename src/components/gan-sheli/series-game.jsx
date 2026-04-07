"use client";

import { useEffect, useState } from "react";
import VisualShapeIcon from "./visual-shape-icon";

export default function SeriesGame({ config, onCorrect, onIncorrect }) {
  const [answered, setAnswered] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  useEffect(() => {
    setAnswered(false);
    setSelectedOptionId(null);
  }, [config]);

  const handleAnswer = (optionId) => {
    if (answered) return;
    setAnswered(true);
    if (optionId === config.correctOptionId) onCorrect();
    else onIncorrect();
  };

  const selectedOption = config.options.find(option => option.id === selectedOptionId) ?? null;

  const renderSlot = (item, index) => {
    if (item) {
      return (
        <div key={`item-${index}`} className="series-slot filled" aria-hidden="true">
          <VisualShapeIcon item={item} />
        </div>
      );
    }

    const canPlaceHere = config.subType === 'dragToSlot' && !!selectedOption && !answered;

    return (
      <button
        key={`missing-${index}`}
        className={`series-slot missing ${canPlaceHere ? 'active-drop' : ''}`}
        disabled={!canPlaceHere}
        onClick={() => {
          if (selectedOption) handleAnswer(selectedOption.id);
        }}
      >
        {selectedOption ? <VisualShapeIcon item={selectedOption} /> : <span className="series-question">?</span>}
      </button>
    );
  };

  return (
    <div className="game-area series-game">
      <div className="series-sequence-row">
        {config.sequence.map((item, index) => renderSlot(item, index))}
      </div>

      <div className="series-options-row">
        {config.options.map(option => {
          const isSelected = selectedOptionId === option.id;

          return (
            <button
              key={option.id}
              className={`visual-item series-option ${isSelected ? 'active-pick' : ''}`}
              disabled={answered}
              onClick={() => {
                if (config.subType === 'tapChoice') {
                  handleAnswer(option.id);
                  return;
                }

                setSelectedOptionId(option.id);
              }}
            >
              <VisualShapeIcon item={option} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
