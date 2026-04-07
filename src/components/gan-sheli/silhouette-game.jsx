"use client";

import { useState, useEffect } from "react";

export default function SilhouetteGame({ config, onCorrect, onIncorrect }) {
  const [answered, setAnswered] = useState(false);
  const [revealed, setRevealed] = useState([]);

  useEffect(() => {
    setAnswered(false);
    setRevealed([]);
  }, [config]);

  if (config.subType === 'tapMatch') {
    const shadow = config.silhouettes[0];
    const isRevealed = revealed.includes(shadow.id);
    return (
      <div className="game-area silhouette-tap">
        <div className="silhouette-display">
          <div className={`silhouette-card ${isRevealed ? 'revealed' : ''}`}>
            <span className="silhouette-emoji">{shadow.emoji}</span>
          </div>
        </div>
        <div className="options-row">
          {config.options.map(opt => (
            <button
              key={opt.id}
              className="option-btn silhouette-option"
              disabled={answered}
              onClick={() => {
                const correctId = config.matches[shadow.id];
                if (opt.id === correctId) {
                  setRevealed([shadow.id]);
                  setAnswered(true);
                  onCorrect();
                } else {
                  onIncorrect();
                }
              }}
            >
              <span className="option-emoji">{opt.emoji}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (config.subType === 'dragMatch') {
    const allRevealed = config.silhouettes.every(s => revealed.includes(s.id));
    const [activePick, setActivePick] = useState(null);
    const [dragPos, setDragPos] = useState(null);

    const handleMatch = (optionId, shadowId) => {
      const correctId = config.matches[shadowId];
      if (optionId === correctId) {
        setRevealed(prev => [...prev, shadowId]);
        setActivePick(null);
        if (revealed.length + 1 === config.silhouettes.length) {
          setTimeout(() => onCorrect(), 300);
        }
      } else {
        setActivePick(null);
        onIncorrect();
      }
    };

    const handleDragStart = (e, opt) => {
      e.preventDefault();
      setDragPos({ x: e.clientX, y: e.clientY, emoji: opt.emoji, optId: opt.id });

      const onMove = (ev) => {
        ev.preventDefault();
        setDragPos(prev => prev ? { ...prev, x: ev.clientX, y: ev.clientY } : null);
      };

      const onUp = (ev) => {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        setDragPos(null);

        const els = document.elementsFromPoint(ev.clientX, ev.clientY);
        const target = els.find(el => el.classList.contains('silhouette-card'));
        if (target) {
          const shadowId = target.getAttribute('data-id');
          if (shadowId && !revealed.includes(shadowId)) {
            handleMatch(opt.id, shadowId);
          }
        }
      };

      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    };

    return (
      <div className="game-area silhouette-drag">
        <div className="silhouette-targets">
          {config.silhouettes.map(shadow => (
            <button
              key={shadow.id}
              data-id={shadow.id}
              className={`silhouette-card target ${revealed.includes(shadow.id) ? 'revealed' : ''} ${activePick ? 'highlight-target' : ''}`}
              disabled={revealed.includes(shadow.id)}
              onClick={() => {
                if (!activePick) return;
                handleMatch(activePick, shadow.id);
              }}
            >
              <span className="silhouette-emoji">{shadow.emoji}</span>
              {revealed.includes(shadow.id) && <span className="silhouette-label">{shadow.label}</span>}
            </button>
          ))}
        </div>
        <div className="options-row">
          {config.options
            .filter(opt => !Object.entries(config.matches)
              .some(([sid, oid]) => oid === opt.id && revealed.includes(sid)))
            .map(opt => (
              <button
                key={opt.id}
                className={`option-btn silhouette-option draggable-source ${activePick === opt.id ? 'active-pick' : ''}`}
                onClick={() => setActivePick(activePick === opt.id ? null : opt.id)}
                onPointerDown={(e) => handleDragStart(e, opt)}
              >
                <span className="option-emoji">{opt.emoji}</span>
                <span>{opt.label}</span>
              </button>
            ))}
        </div>
        {dragPos && (
          <div className="drag-float" style={{ left: dragPos.x, top: dragPos.y }}>
            {dragPos.emoji}
          </div>
        )}
      </div>
    );
  }

  return null;
}
