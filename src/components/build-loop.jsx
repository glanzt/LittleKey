"use client";

function getThemePalette(themeId) {
  if (themeId === "garden") {
    return {
      shell: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(244,252,235,0.92))",
      scene: "linear-gradient(180deg, #DFF5FF 0%, #F7FFE8 72%, #BCE79A 72%, #9AD46A 100%)",
      accent: "#5FAF41",
      slot: "#FFD76A",
    };
  }
  if (themeId === "space") {
    return {
      shell: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(242,240,255,0.94))",
      scene: "linear-gradient(180deg, #1E214E 0%, #2E2A73 62%, #503B88 100%)",
      accent: "#7C5CFC",
      slot: "#FFD76A",
    };
  }
  return {
    shell: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,247,238,0.93))",
    scene: "linear-gradient(180deg, #DFF4FF 0%, #F8F7EA 72%, #BCE29D 72%, #98CB74 100%)",
    accent: "#F2994A",
    slot: "#FFD76A",
  };
}

function renderPart(themeId, partId, isNew) {
  var common = {
    position: "absolute",
    transition: "transform 0.22s ease, opacity 0.22s ease",
    animation: isNew ? "buildLoopPartIn 220ms cubic-bezier(0.34,1.56,0.64,1) both" : "none",
  };

  if (themeId === "garden") {
    if (partId === "pot") return <div key={partId} style={{ ...common, bottom: 12, left: "50%", transform: "translateX(-50%)", width: 48, height: 28, borderRadius: "0 0 18px 18px", background: "#C98549", boxShadow: "inset 0 -6px 0 rgba(0,0,0,0.08)" }} />;
    if (partId === "sprout") return <div key={partId} style={{ ...common, bottom: 34, left: "50%", transform: "translateX(-50%)", fontSize: 24 }}>🌱</div>;
    if (partId === "flowerPink") return <div key={partId} style={{ ...common, bottom: 34, left: "38%", transform: "translateX(-50%)", fontSize: 24 }}>🌷</div>;
    if (partId === "flowerYellow") return <div key={partId} style={{ ...common, bottom: 38, left: "62%", transform: "translateX(-50%)", fontSize: 24 }}>🌼</div>;
    if (partId === "butterfly") return <div key={partId} style={{ ...common, top: 20, left: "68%", fontSize: 22 }}>🦋</div>;
    if (partId === "tree") return <div key={partId} style={{ ...common, bottom: 24, left: "10%", fontSize: 30 }}>🌳</div>;
    if (partId === "sun") return <div key={partId} style={{ ...common, top: 8, right: 10, fontSize: 24 }}>☀️</div>;
    if (partId === "rainbow") return <div key={partId} style={{ ...common, top: 6, left: 12, fontSize: 30 }}>🌈</div>;
  }

  if (themeId === "house") {
    if (partId === "walls") return <div key={partId} style={{ ...common, bottom: 20, left: "50%", transform: "translateX(-50%)", width: 88, height: 58, borderRadius: 14, background: "#FFE8C9", boxShadow: "inset 0 -8px 0 rgba(0,0,0,0.06)" }} />;
    if (partId === "roof") return <div key={partId} style={{ ...common, bottom: 70, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "52px solid transparent", borderRight: "52px solid transparent", borderBottom: "42px solid #F08553" }} />;
    if (partId === "door") return <div key={partId} style={{ ...common, bottom: 20, left: "50%", transform: "translateX(-50%)", width: 22, height: 36, borderRadius: "12px 12px 0 0", background: "#B87042" }} />;
    if (partId === "window") return <div key={partId} style={{ ...common, bottom: 42, left: "38%", width: 20, height: 20, borderRadius: 6, background: "#BFE8FF", border: "3px solid white", boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.06)" }} />;
    if (partId === "chimney") return <div key={partId} style={{ ...common, bottom: 90, left: "63%", width: 12, height: 24, borderRadius: 4, background: "#C96A56" }} />;
    if (partId === "smoke") return <div key={partId} style={{ ...common, top: 8, left: "62%", fontSize: 24 }}>☁️</div>;
    if (partId === "tree") return <div key={partId} style={{ ...common, bottom: 18, left: "12%", fontSize: 28 }}>🌳</div>;
    if (partId === "flower") return <div key={partId} style={{ ...common, bottom: 18, right: 12, fontSize: 22 }}>🌼</div>;
  }

  if (themeId === "space") {
    if (partId === "planet") return <div key={partId} style={{ ...common, top: 12, left: 12, fontSize: 30 }}>🪐</div>;
    if (partId === "rocketBody") return <div key={partId} style={{ ...common, bottom: 28, left: "50%", transform: "translateX(-50%)", width: 30, height: 58, borderRadius: "18px 18px 10px 10px", background: "linear-gradient(180deg, #FFFFFF, #D9E7FF)", boxShadow: "inset 0 -8px 0 rgba(0,0,0,0.06)" }} />;
    if (partId === "rocketWindow") return <div key={partId} style={{ ...common, bottom: 60, left: "50%", transform: "translateX(-50%)", width: 14, height: 14, borderRadius: "50%", background: "#7FD8FF", border: "3px solid white" }} />;
    if (partId === "rocketFinLeft") return <div key={partId} style={{ ...common, bottom: 28, left: "calc(50% - 18px)", width: 0, height: 0, borderTop: "12px solid transparent", borderBottom: "12px solid transparent", borderRight: "14px solid #FF7F6B" }} />;
    if (partId === "rocketFinRight") return <div key={partId} style={{ ...common, bottom: 28, left: "calc(50% + 18px)", width: 0, height: 0, borderTop: "12px solid transparent", borderBottom: "12px solid transparent", borderLeft: "14px solid #FF7F6B" }} />;
    if (partId === "flame") return <div key={partId} style={{ ...common, bottom: 8, left: "50%", transform: "translateX(-50%)", fontSize: 22 }}>🔥</div>;
    if (partId === "moon") return <div key={partId} style={{ ...common, top: 10, right: 16, fontSize: 22 }}>🌙</div>;
    if (partId === "star") return <div key={partId} style={{ ...common, top: 40, right: 44, fontSize: 20 }}>⭐</div>;
  }

  return null;
}

export function ThemePickerOverlay(props) {
  var themes = props.themes;
  var onChoose = props.onChoose;
  var isPhone = !!props.isPhone;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 1200,
      background: "rgba(255,249,243,0.9)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      direction: "rtl",
    }}>
      <div style={{
        width: "min(100%, 760px)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,247,241,0.96))",
        borderRadius: isPhone ? 28 : 34,
        border: "1px solid rgba(17,19,25,0.06)",
        boxShadow: "0 28px 60px rgba(17,19,25,0.14)",
        padding: isPhone ? "1.2rem 1rem" : "1.5rem 1.3rem",
        textAlign: "center",
      }}>
        <div style={{ fontFamily: "'Secular One', sans-serif", fontSize: isPhone ? "1.15rem" : "1.35rem", color: "#111319", marginBottom: "0.3rem" }}>
          בוחרים עולם
        </div>
        <div style={{ fontFamily: "'Rubik', sans-serif", fontSize: isPhone ? "0.92rem" : "1rem", color: "rgba(17,19,25,0.55)", marginBottom: "1rem" }}>
          בחרי מהר והתחילי לשחק
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isPhone ? "1fr" : "repeat(3, minmax(0, 1fr))",
          gap: "0.8rem",
        }}>
          {themes.slice(0, 3).map(function(theme) {
            return (
              <button
                key={theme.id}
                onClick={function() { onChoose(theme.id); }}
                style={{
                  border: "none",
                  cursor: "pointer",
                  borderRadius: 24,
                  background: getThemePalette(theme.id).shell,
                  boxShadow: "0 12px 28px rgba(17,19,25,0.08)",
                  padding: isPhone ? "1rem 0.8rem" : "1.2rem 0.9rem",
                }}
              >
                <div style={{ fontSize: isPhone ? "2.6rem" : "3rem", marginBottom: "0.35rem" }}>{theme.icon}</div>
                <div style={{ fontFamily: "'Secular One', sans-serif", fontSize: isPhone ? "1.1rem" : "1.2rem", color: "#111319" }}>
                  {theme.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function BuildLoopHud(props) {
  var theme = props.theme;
  var progress = props.progress;
  var builtParts = props.builtParts;
  var justUnlockedPartId = props.justUnlockedPartId;
  var showNudge = !!props.showNudge;
  var isPhone = !!props.isPhone;
  var palette = getThemePalette(theme.id);

  return (
    <div style={{
      width: "100%",
      maxWidth: props.maxWidth || 760,
      margin: props.margin || "0 auto 1rem",
      display: "grid",
      gridTemplateColumns: isPhone ? "1fr" : "minmax(180px, 240px) minmax(0, 1fr)",
      gap: "0.8rem",
      alignItems: "center",
      direction: "rtl",
    }}>
      <div style={{
        background: palette.shell,
        borderRadius: 26,
        border: "1px solid rgba(17,19,25,0.06)",
        boxShadow: "0 12px 28px rgba(17,19,25,0.08)",
        padding: "0.7rem",
      }}>
        <div style={{
          position: "relative",
          height: isPhone ? 110 : 120,
          borderRadius: 22,
          overflow: "hidden",
          background: palette.scene,
        }}>
          {theme.id === "space" ? (
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 18px 18px, rgba(255,255,255,0.95) 0 1.4px, transparent 1.6px), radial-gradient(circle at 62px 28px, rgba(255,255,255,0.8) 0 1.2px, transparent 1.4px), radial-gradient(circle at 132px 44px, rgba(255,255,255,0.75) 0 1.4px, transparent 1.6px), radial-gradient(circle at 166px 18px, rgba(255,255,255,0.9) 0 1.1px, transparent 1.3px)" }} />
          ) : null}
          {builtParts.map(function(partId) {
            return renderPart(theme.id, partId, justUnlockedPartId === partId);
          })}
        </div>
      </div>

      <div style={{
        background: palette.shell,
        borderRadius: 26,
        border: "1px solid rgba(17,19,25,0.06)",
        boxShadow: "0 12px 28px rgba(17,19,25,0.08)",
        padding: isPhone ? "0.8rem 0.9rem" : "0.9rem 1rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.8rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <span style={{ fontSize: "1.4rem" }}>{theme.icon}</span>
            <span style={{ fontFamily: "'Secular One', sans-serif", fontSize: isPhone ? "1rem" : "1.1rem", color: "#111319" }}>
              {theme.label}
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.35rem" }}>
            {[0, 1, 2].map(function(index) {
              var filled = index < progress;
              return (
                <div
                  key={index}
                  style={{
                    width: isPhone ? 18 : 20,
                    height: isPhone ? 18 : 20,
                    borderRadius: "50%",
                    background: filled ? palette.slot : "rgba(17,19,25,0.08)",
                    boxShadow: filled ? "0 0 0 4px rgba(255,215,106,0.18)" : "none",
                    transform: filled ? "scale(1.08)" : "scale(1)",
                    transition: "all 160ms ease",
                  }}
                />
              );
            })}
          </div>
        </div>

        <div style={{ fontFamily: "'Rubik', sans-serif", fontSize: isPhone ? "0.86rem" : "0.92rem", color: "rgba(17,19,25,0.54)", marginTop: "0.55rem" }}>
          {showNudge ? "רוצה להוסיף עוד?" : "עוד 3 הצלחות מוסיפות חלק חדש"}
        </div>
      </div>

      <style>{
        "@keyframes buildLoopPartIn { 0%{ transform: translateY(8px) scale(0.86); opacity: 0 } 100%{ transform: translateY(0) scale(1); opacity: 1 } }"
      }</style>
    </div>
  );
}
