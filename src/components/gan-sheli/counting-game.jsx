"use client";

import { useEffect, useState } from "react";

const SWIMMING_EMOJIS = ['🐟', '🐠', '🐡', '🐳', '🐋', '🦈', '🐙', '🦑'];

function getCountingObjects(config) {
  switch (config.subType) {
    case 'howMany':
    case 'tapCount':
      return config.objects;
    case 'whichGroup':
      return config.groups ? [...config.groups.left, ...config.groups.right] : config.objects;
    case 'quantityMatch':
      return config.groups.flatMap(group => group.items);
  }
}

function getGroupColumns(count) {
  if (count <= 3) return count;
  if (count === 4) return 2;
  if (count <= 6) return 3;
  if (count === 9) return 3;
  return 4;
}

function getGroupGridStyle(count) {
  return {
    gridTemplateColumns: `repeat(${getGroupColumns(count)}, minmax(40px, 1fr))`,
  };
}

function getGroupDragPreview(group) {
  const firstEmoji = group.items[0]?.emoji ?? '';
  return `${firstEmoji} ${group.items.length}`;
}

export default function CountingGame({ config, onCorrect, onIncorrect }) {
  const [selected, setSelected] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [dragPos, setDragPos] = useState(null);

  useEffect(() => {
    setSelected([]);
    setAnswered(false);
    setSelectedGroupId(null);
    setSelectedNumber(null);
    setDragPos(null);
  }, [config]);

  const hasSwimming = getCountingObjects(config).some(o => SWIMMING_EMOJIS.includes(o.emoji));

  if (config.subType === 'howMany') {
    return (
      <div className={`game-area ${hasSwimming ? 'aquarium' : ''}`}>
        <div className="objects-row">
          {config.objects.map((obj, i) => (
            <div
              key={obj.id}
              className={`game-object ${hasSwimming ? 'swimming' : ''}`}
              style={hasSwimming ? { animationDelay: `${i * 0.4}s` } : undefined}
            >
              {obj.emoji}
            </div>
          ))}
        </div>
        <div className="options-row">
          {config.options.map(num => (
            <button
              key={num}
              className="option-btn number-btn"
              disabled={answered}
              onClick={() => {
                setAnswered(true);
                num === config.correctCount ? onCorrect() : onIncorrect();
              }}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (config.subType === 'tapCount') {
    const target = config.tapTarget;
    const done = selected.length === target;
    return (
      <div className={`game-area ${hasSwimming ? 'aquarium' : ''}`}>
        <div className="objects-row">
          {config.objects.map((obj, i) => (
            <button
              key={obj.id}
              className={`game-object tappable ${selected.includes(obj.id) ? 'selected' : ''} ${hasSwimming ? 'swimming' : ''}`}
              disabled={answered}
              style={hasSwimming ? { animationDelay: `${i * 0.4}s` } : undefined}
              onClick={() => {
                if (selected.includes(obj.id)) {
                  setSelected(s => s.filter(x => x !== obj.id));
                } else if (selected.length < target) {
                  const next = [...selected, obj.id];
                  setSelected(next);
                }
              }}
            >
              {obj.emoji}
              {selected.includes(obj.id) && <span className="check-mark">&#10003;</span>}
            </button>
          ))}
        </div>
        {done && !answered && (
          <button className="done-btn" onClick={() => { setAnswered(true); onCorrect(); }}>
            סיימתי!
          </button>
        )}
      </div>
    );
  }

  if (config.subType === 'whichGroup' && config.groups) {
    return (
      <div className="game-area">
        <div className="groups-row">
          <button
            className="group-area"
            disabled={answered}
            onClick={() => {
              setAnswered(true);
              config.groups.right.length === config.correctCount ? onCorrect() : onIncorrect();
            }}
          >
            {config.groups.right.map(obj => (
              <span key={obj.id} className="group-item">{obj.emoji}</span>
            ))}
          </button>
          <div className="group-divider" />
          <button
            className="group-area"
            disabled={answered}
            onClick={() => {
              setAnswered(true);
              config.groups.left.length === config.correctCount ? onCorrect() : onIncorrect();
            }}
          >
            {config.groups.left.map(obj => (
              <span key={obj.id} className="group-item">{obj.emoji}</span>
            ))}
          </button>
        </div>
      </div>
    );
  }

  if (config.subType === 'quantityMatch') {
    const evaluatePair = (groupId, number) => {
      if (answered) return;
      setAnswered(true);
      if (groupId === config.correctGroupId && number === config.correctCount) {
        onCorrect();
      } else {
        onIncorrect();
      }
    };

    const handleNumberTap = (number) => {
      if (answered) return;

      if (config.interaction === 'tapNumber') {
        setAnswered(true);
        if (number === config.correctCount) {
          onCorrect();
        } else {
          onIncorrect();
        }
        return;
      }

      if (config.interaction === 'tapGroupThenNumber') {
        if (!selectedGroupId) return;
        evaluatePair(selectedGroupId, number);
        return;
      }

      if (config.interaction === 'dragNumberToGroup') {
        if (selectedGroupId) {
          evaluatePair(selectedGroupId, number);
        } else {
          setSelectedNumber(prev => prev === number ? null : number);
        }
        return;
      }

      if (config.interaction === 'dragGroupToNumber') {
        if (selectedGroupId) {
          evaluatePair(selectedGroupId, number);
        } else {
          setSelectedNumber(prev => prev === number ? null : number);
        }
      }
    };

    const handleGroupTap = (groupId) => {
      if (answered) return;

      if (config.interaction === 'tapGroupThenNumber') {
        setSelectedGroupId(prev => prev === groupId ? null : groupId);
        return;
      }

      if (config.interaction === 'dragNumberToGroup') {
        if (selectedNumber !== null) {
          evaluatePair(groupId, selectedNumber);
        } else {
          setSelectedGroupId(prev => prev === groupId ? null : groupId);
        }
        return;
      }

      if (config.interaction === 'dragGroupToNumber') {
        if (selectedNumber !== null) {
          evaluatePair(groupId, selectedNumber);
        } else {
          setSelectedGroupId(prev => prev === groupId ? null : groupId);
        }
      }
    };

    const startNumberDrag = (e, number) => {
      if (config.interaction !== 'dragNumberToGroup' || answered) return;

      e.preventDefault();
      setSelectedNumber(number);
      setDragPos({ x: e.clientX, y: e.clientY, content: String(number) });

      const onMove = (ev) => {
        ev.preventDefault();
        setDragPos({ x: ev.clientX, y: ev.clientY, content: String(number) });
      };

      const onUp = (ev) => {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        setDragPos(null);

        const els = document.elementsFromPoint(ev.clientX, ev.clientY);
        const target = els.find(el => el.classList.contains('quantity-group-card'));
        const groupId = target?.getAttribute('data-group-id');
        if (groupId) {
          evaluatePair(groupId, number);
        }
      };

      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    };

    const startGroupDrag = (e, group) => {
      if (config.interaction !== 'dragGroupToNumber' || answered) return;

      e.preventDefault();
      setSelectedGroupId(group.id);
      setDragPos({ x: e.clientX, y: e.clientY, content: getGroupDragPreview(group) });

      const onMove = (ev) => {
        ev.preventDefault();
        setDragPos({ x: ev.clientX, y: ev.clientY, content: getGroupDragPreview(group) });
      };

      const onUp = (ev) => {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        setDragPos(null);

        const els = document.elementsFromPoint(ev.clientX, ev.clientY);
        const target = els.find(el => el.classList.contains('quantity-number-btn'));
        const numberValue = target?.getAttribute('data-number');
        if (numberValue) {
          evaluatePair(group.id, Number(numberValue));
        }
      };

      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    };

    const showGroupTargets = config.interaction === 'dragNumberToGroup' && selectedNumber !== null;
    const showNumberTargets = config.interaction === 'dragGroupToNumber' && selectedGroupId !== null;

    return (
      <div className="game-area quantity-match">
        <div className={`quantity-groups-row groups-${config.groups.length}`}>
          {config.groups.map(group => (
            <button
              key={group.id}
              type="button"
              data-group-id={group.id}
              className={`quantity-group-card ${selectedGroupId === group.id ? 'active-pick' : ''} ${showGroupTargets ? 'drop-ready' : ''}`}
              onClick={() => handleGroupTap(group.id)}
              onPointerDown={(e) => startGroupDrag(e, group)}
            >
              <div className="quantity-items-grid" style={getGroupGridStyle(group.items.length)}>
                {group.items.map(item => (
                  <span key={item.id} className="quantity-item">
                    {item.emoji}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        <div className="quantity-number-row">
          {config.options.map(number => (
            <button
              key={number}
              type="button"
              data-number={number}
              className={`option-btn number-btn quantity-number-btn ${selectedNumber === number ? 'active-pick' : ''} ${showNumberTargets ? 'drop-ready' : ''}`}
              disabled={answered}
              onClick={() => handleNumberTap(number)}
              onPointerDown={(e) => startNumberDrag(e, number)}
            >
              {number}
            </button>
          ))}
        </div>

        {dragPos && (
          <div className="drag-float quantity-drag-float" style={{ left: dragPos.x, top: dragPos.y }}>
            {dragPos.content}
          </div>
        )}
      </div>
    );
  }

  return null;
}
