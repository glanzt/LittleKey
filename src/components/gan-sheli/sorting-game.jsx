"use client";

import { useState, useEffect, useMemo } from "react";

export default function SortingGame({ config, onCorrect, onIncorrect }) {
  const [answered, setAnswered] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortedIds, setSortedIds] = useState([]);
  const [dragPos, setDragPos] = useState(null);
  const plateFirst = useMemo(() => Math.random() < 0.5, [config]);

  useEffect(() => {
    setAnswered(false);
    setCurrentIdx(0);
    setSelectedIds([]);
    setSortedIds([]);
  }, [config]);

  if (config.subType === 'yesNo') {
    const obj = config.objects[0];
    return (
      <div className="game-area sorting-yesno">
        <div className="center-object">
          <span className="big-emoji">{obj.emoji}</span>
          <span className="object-label">{obj.label}</span>
        </div>
        <div className="yesno-row">
          <button
            className="yesno-btn yes"
            disabled={answered}
            onClick={() => {
              setAnswered(true);
              obj.edible ? onCorrect() : onIncorrect();
            }}
          >
            כן
          </button>
          <button
            className="yesno-btn no"
            disabled={answered}
            onClick={() => {
              setAnswered(true);
              !obj.edible ? onCorrect() : onIncorrect();
            }}
          >
            לא
          </button>
        </div>
      </div>
    );
  }

  if (config.subType === 'dragSort') {
    const remaining = config.objects.filter(o => !sortedIds.includes(o.id));
    const current = remaining[0];

    if (!current) {
      if (!answered) { setAnswered(true); onCorrect(); }
      return <div className="game-area"><div className="center-object"><span className="big-emoji">&#10003;</span></div></div>;
    }

    const handleSort = (zone) => {
      if (zone === 'plate') {
        current.edible ? setSortedIds(prev => [...prev, current.id]) : onIncorrect();
      } else {
        !current.edible ? setSortedIds(prev => [...prev, current.id]) : onIncorrect();
      }
    };

    const handleDragStart = (e) => {
      e.preventDefault();
      const emoji = current.emoji;
      setDragPos({ x: e.clientX, y: e.clientY, emoji });

      const onMove = (ev) => {
        ev.preventDefault();
        setDragPos({ x: ev.clientX, y: ev.clientY, emoji });
      };

      const onUp = (ev) => {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        setDragPos(null);
        const els = document.elementsFromPoint(ev.clientX, ev.clientY);
        const zone = els.find(el => el.classList.contains('sort-zone'));
        if (zone?.classList.contains('plate')) handleSort('plate');
        else if (zone?.classList.contains('bin')) handleSort('bin');
      };

      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    };

    const plateBtn = (
      <button className="sort-zone plate" onClick={() => handleSort('plate')}>
        <span className="zone-emoji">🍽️</span>
        <span>צלחת</span>
      </button>
    );
    const binBtn = (
      <button className="sort-zone bin" onClick={() => handleSort('bin')}>
        <span className="zone-emoji">🗄️</span>
        <span>מגירה</span>
      </button>
    );

    return (
      <div className="game-area sorting-drag">
        <div className="sort-zones">
          {plateFirst ? plateBtn : binBtn}

          <div
            className="sort-center draggable-source"
            onPointerDown={handleDragStart}
          >
            <span className="big-emoji">{current.emoji}</span>
            <span className="object-label">{current.label}</span>
          </div>

          {plateFirst ? binBtn : plateBtn}
        </div>
        {dragPos && (
          <div className="drag-float" style={{ left: dragPos.x, top: dragPos.y }}>
            {dragPos.emoji}
          </div>
        )}
      </div>
    );
  }

  if (config.subType === 'multiSelect') {
    const edibleIds = config.objects.filter(o => o.edible).map(o => o.id);
    const allSelected = edibleIds.every(id => selectedIds.includes(id)) &&
                        selectedIds.every(id => edibleIds.includes(id));

    return (
      <div className="game-area">
        <div className="objects-row">
          {config.objects.map(obj => (
            <button
              key={obj.id}
              className={`game-object tappable ${selectedIds.includes(obj.id) ? (obj.edible ? 'selected' : 'wrong-select') : ''}`}
              disabled={answered}
              onClick={() => {
                if (!obj.edible) {
                  onIncorrect();
                  return;
                }
                setSelectedIds(prev =>
                  prev.includes(obj.id) ? prev.filter(x => x !== obj.id) : [...prev, obj.id]
                );
              }}
            >
              {obj.emoji}
              <span className="object-small-label">{obj.label}</span>
              {selectedIds.includes(obj.id) && obj.edible && <span className="check-mark">&#10003;</span>}
            </button>
          ))}
        </div>
        {selectedIds.length > 0 && !answered && (
          <button
            className="done-btn"
            onClick={() => {
              setAnswered(true);
              if (selectedIds.length === edibleIds.length &&
                  edibleIds.every(id => selectedIds.includes(id))) {
                onCorrect();
              } else {
                onIncorrect();
              }
            }}
          >
            סיימתי!
          </button>
        )}
      </div>
    );
  }

  return null;
}
