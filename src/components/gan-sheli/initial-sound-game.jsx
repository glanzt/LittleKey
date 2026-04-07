"use client";

import { useEffect, useMemo, useState } from "react";

function shuffleItems(items) {
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [nextItems[index], nextItems[swapIndex]] = [nextItems[swapIndex], nextItems[index]];
  }

  return nextItems;
}

export default function InitialSoundGame({ config, onCorrect }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [softMissId, setSoftMissId] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  const shuffledItems = useMemo(() => shuffleItems(config.items), [config]);

  const correctIds = useMemo(
    () => config.items.filter((item) => item.startsWithTarget).map((item) => item.id),
    [config.items],
  );

  useEffect(() => {
    setSelectedIds([]);
    setSoftMissId(null);
    setIsLocked(false);
  }, [config]);

  const handleTap = (itemId, startsWithTarget) => {
    if (isLocked) return;

    if (!startsWithTarget) {
      setSoftMissId(itemId);
      window.setTimeout(() => {
        setSoftMissId((current) => (current === itemId ? null : current));
      }, 500);
      return;
    }

    if (selectedIds.includes(itemId)) {
      return;
    }

    const nextSelectedIds = [...selectedIds, itemId];
    const foundAll = correctIds.every((id) => nextSelectedIds.includes(id));

    setSelectedIds(nextSelectedIds);

    if (foundAll) {
      setIsLocked(true);
      window.setTimeout(() => {
        onCorrect();
      }, 350);
    }
  };

  return (
    <div className="game-area initial-sound-game">
      <div className="initial-sound-badge" aria-label={`הצליל הנלמד הוא ${config.targetLetter}`}>
        <span className="initial-sound-badge-label">הצליל</span>
        <span className="initial-sound-badge-letter">{config.targetLetter}</span>
      </div>

      <div className={`initial-sound-grid count-${shuffledItems.length}`}>
        {shuffledItems.map((item) => (
          <button
            key={item.id}
            className={[
              'game-object',
              'tappable',
              'initial-sound-card',
              selectedIds.includes(item.id) ? 'selected' : '',
              softMissId === item.id ? 'soft-miss' : '',
            ].filter(Boolean).join(' ')}
            onClick={() => handleTap(item.id, item.startsWithTarget)}
            disabled={isLocked}
          >
            <span className="initial-sound-emoji" role="img" aria-label={item.label}>
              {item.emoji}
            </span>
            <span className="object-small-label initial-sound-label">{item.label}</span>
            {selectedIds.includes(item.id) && <span className="check-mark">&#10003;</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
