"use client";

import { TOP_BAR_HEIGHT } from "@/lib/game-constants";

export default function GameTopMenu(props) {
  var user = props.user;
  var onProfiles = props.onProfiles;
  var onHome = props.onHome;
  var onDashboard = props.onDashboard;
  var onSettings = props.onSettings;
  var onSignOut = props.onSignOut;

  var userLabel = user && (user.name || user.email) ? (user.name || user.email) : "פרופיל";
  var userInitial = userLabel && userLabel.length > 0 ? userLabel.charAt(0).toUpperCase() : "U";

  var menuBtn = {
    background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,245,240,0.88))",
    border: "1px solid rgba(255,194,162,0.28)",
    borderRadius: 999,
    padding: "0.46rem 1rem",
    cursor: "pointer",
    fontSize: "0.84rem",
    fontFamily: "'Secular One', sans-serif",
    color: "#5c5470",
    boxShadow: "0 10px 24px rgba(236,160,137,0.14)",
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: TOP_BAR_HEIGHT,
      zIndex: 250,
      display: "flex",
      alignItems: "center",
      direction: "rtl",
      padding: "0 1rem",
      background: "linear-gradient(180deg, rgba(255,249,243,0.96), rgba(255,244,238,0.86))",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(255,194,162,0.2)",
      boxShadow: "0 12px 26px rgba(236,160,137,0.12)",
      boxSizing: "border-box",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
        <button onClick={onProfiles} style={{ ...menuBtn, display: "flex", alignItems: "center", gap: "0.45rem", maxWidth: 220, background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,243,236,0.92))" }}>
          {user && user.image ? (
            <img
              src={user.image}
              alt={userLabel}
              style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", boxShadow: "0 4px 10px rgba(236,160,137,0.16)" }}
            />
          ) : (
            <div style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(255,176,146,0.42), rgba(180,191,255,0.42))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.74rem",
            }}>{userInitial}</div>
          )}
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userLabel}</span>
        </button>
        <button onClick={onHome} style={menuBtn}>בית</button>
        <button onClick={onDashboard} style={menuBtn}>התקדמות</button>
        <button onClick={onSettings} style={menuBtn}>הגדרות</button>
      </div>

      <div style={{ flex: 1 }} />

      <button onClick={onSignOut} style={{
        background: "linear-gradient(135deg, #ff9b83, #ffbf6d)",
        border: "none",
        borderRadius: 999,
        padding: "0.48rem 1.05rem",
        cursor: "pointer",
        fontSize: "0.84rem",
        fontFamily: "'Secular One', sans-serif",
        color: "white",
        boxShadow: "0 12px 24px rgba(255,165,132,0.24)",
      }}>התנתקות</button>
    </div>
  );
}
