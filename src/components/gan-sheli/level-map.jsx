"use client";

const TYPE_COLORS = {
  counting: '#FF9F43',
  shapes: '#6C5CE7',
  sorting: '#00B894',
  silhouette: '#0984E3',
  oddOneOut: '#E17055',
  visualOddOneOut: '#00CEC9',
  series: '#9B59B6',
  initialSound: '#F368E0',
};

const TYPE_LABELS = {
  counting: 'ספירה',
  shapes: 'צורות',
  sorting: 'מיון',
  silhouette: 'צלליות',
  oddOneOut: 'יוצא דופן',
  visualOddOneOut: 'מצא את השונה',
  series: 'סדרות',
  initialSound: 'צליל פותח',
};

export default function LevelMap({ levels, completedLevels, nextUnlockedIndex, onPlay, onBack }) {
  return (
    <div className="map-screen">
      <div className="map-header">
        <button className="back-btn" onClick={onBack}>חזרה</button>
        <h2>מפת המשחק</h2>
        <span className="progress-text">{completedLevels.length} / {levels.length}</span>
      </div>
      <div className="map-grid">
        {levels.map((level, index) => {
          const completed = completedLevels.includes(level.id);
          const unlocked = completed || index <= nextUnlockedIndex;
          const current = !completed && index === nextUnlockedIndex;
          const starCount = completed ? 3 : current ? 2 : 0;

          return (
            <button
              key={level.id}
              className={`map-node ${completed ? 'completed' : ''} ${current ? 'current' : ''} ${!unlocked ? 'locked' : ''}`}
              style={{ '--node-color': TYPE_COLORS[level.gameType] }}
              disabled={!unlocked}
              onClick={() => onPlay(index)}
              title={TYPE_LABELS[level.gameType]}
              aria-label={`שלב ${index + 1}, ${TYPE_LABELS[level.gameType]}${completed ? ', הושלם' : current ? ', פתוח עכשיו' : !unlocked ? ', נעול' : ''}`}
            >
              {!completed && !current && !unlocked ? (
                <span className="map-node-disk">
                  <span className="map-lock-badge" aria-hidden="true">
                    <span className="map-lock-body">
                      <span className="map-lock-hole" />
                    </span>
                    <span className="map-lock-shackle" />
                  </span>
                </span>
              ) : (
                <>
                  <span className="map-node-disk">
                    <span className="map-node-number">{index + 1}</span>
                  </span>
                  <span className="map-node-stars" aria-hidden="true">
                    {[0, 1, 2].map((starIndex) => (
                      <span
                        key={starIndex}
                        className={`map-node-star ${starIndex < starCount ? 'filled' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
