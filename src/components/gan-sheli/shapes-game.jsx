"use client";

import { useState, useEffect } from "react";

const SHAPE_CSS = {
  circle: { borderRadius: '50%', background: '#FF9F43' },
  square: { borderRadius: '8px', background: '#e74c3c' },
  triangle: { borderRadius: '4px', background: '#2ecc71', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' },
  star: { background: '#f1c40f', clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' },
  heart: { background: '#e74c3c', clipPath: 'polygon(50% 85%, 15% 55%, 0% 35%, 5% 15%, 20% 5%, 35% 5%, 50% 20%, 65% 5%, 80% 5%, 95% 15%, 100% 35%, 85% 55%)' },
};

export default function ShapesGame({ config, onCorrect, onIncorrect }) {
  const [answered, setAnswered] = useState(false);
  const [matched, setMatched] = useState([]);
  const [dragPos, setDragPos] = useState(null);

  useEffect(() => {
    setAnswered(false);
    setMatched([]);
  }, [config]);

  if (config.subType === 'findShape') {
    return (
      <div className="game-area">
        <div className="objects-row">
          {config.shapes.map(s => (
            <button
              key={s.id}
              className="shape-card"
              disabled={answered}
              onClick={() => {
                setAnswered(true);
                s.id === config.correctId ? onCorrect() : onIncorrect();
              }}
            >
              <div className="shape-visual" style={{ ...SHAPE_CSS[s.shape || ''], width: 100, height: 100 }} />
              <span className="shape-label">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (config.subType === 'whatShape') {
    return (
      <div className="game-area">
        <div className="center-object">
          <span className="big-emoji">{config.shapes[0].emoji}</span>
          <span className="object-label">{config.shapes[0].label}</span>
        </div>
        <div className="options-row">
          {config.shapeOptions.map(opt => (
            <button
              key={opt.id}
              className="option-btn shape-option"
              disabled={answered}
              onClick={() => {
                setAnswered(true);
                opt.id === config.correctId ? onCorrect() : onIncorrect();
              }}
            >
              <div
                className="shape-visual small"
                style={{ ...SHAPE_CSS[opt.id] || {}, width: 60, height: 60 }}
              />
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (config.subType === 'dragShape' && config.outlines && config.draggables) {
    const allMatched = matched.length === config.outlines.length;

    const handleMatch = (draggableId, targetOutlineId) => {
      const shapeName = draggableId.replace('d-', '');
      const expectedOutlineId = `o-${shapeName}`;

      if (targetOutlineId && targetOutlineId !== expectedOutlineId) {
        onIncorrect();
        return;
      }

      if (config.outlines.some(o => o.id === expectedOutlineId) && !matched.includes(expectedOutlineId)) {
        setMatched(prev => [...prev, expectedOutlineId]);
        if (matched.length + 1 === config.outlines.length) {
          setTimeout(() => onCorrect(), 300);
        }
      }
    };

    const handleDragStart = (e, d) => {
      e.preventDefault();
      const shape = d.shape || '';
      setDragPos({ x: e.clientX, y: e.clientY, shape, label: d.label });

      const onMove = (ev) => {
        ev.preventDefault();
        setDragPos(prev => prev ? { ...prev, x: ev.clientX, y: ev.clientY } : null);
      };

      const onUp = (ev) => {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        setDragPos(null);

        const els = document.elementsFromPoint(ev.clientX, ev.clientY);
        const target = els.find(el => el.classList.contains('drag-target'));
        if (target) {
          const outlineId = target.getAttribute('data-id');
          if (outlineId) handleMatch(d.id, outlineId);
        } else {
          handleMatch(d.id);
        }
      };

      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    };

    return (
      <div className="game-area">
        <div className="drag-targets-row">
          {config.outlines.map(o => (
            <div
              key={o.id}
              data-id={o.id}
              className={`drag-target ${matched.includes(o.id) ? 'filled' : ''}`}
            >
              {matched.includes(o.id) ? o.emoji : o.label}
            </div>
          ))}
        </div>
        <div className="draggables-row">
          {config.draggables
            .filter(d => !matched.includes(`o-${d.id.replace('d-', '')}`))
            .map(d => (
              <button
                key={d.id}
                className="draggable-item draggable-source"
                disabled={allMatched}
                onClick={() => handleMatch(d.id)}
                onPointerDown={(e) => handleDragStart(e, d)}
              >
                <div
                  className="shape-visual"
                  style={{ ...SHAPE_CSS[d.shape || ''], width: 80, height: 80 }}
                />
                <span>{d.label}</span>
              </button>
            ))}
        </div>
        {dragPos && (
          <div className="drag-float" style={{ left: dragPos.x, top: dragPos.y }}>
            <div className="shape-visual" style={{ ...SHAPE_CSS[dragPos.shape], width: 60, height: 60 }} />
          </div>
        )}
      </div>
    );
  }

  return null;
}
