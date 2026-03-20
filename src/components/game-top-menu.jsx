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
    background: "rgba(255,255,255,0.84)",
    border: "1px solid rgba(17,19,25,0.06)",
    borderRadius: 999,
    padding: "0.42rem 0.95rem",
    cursor: "pointer",
    fontSize: "0.84rem",
    fontFamily: "'Secular One', sans-serif",
    color: "#111319",
    boxShadow: "0 8px 20px rgba(17,19,25,0.05)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
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
      background: "linear-gradient(180deg, rgba(255,253,248,0.9), rgba(255,249,243,0.82))",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      borderBottom: "1px solid rgba(17,19,25,0.05)",
      boxShadow: "0 8px 24px rgba(17,19,25,0.04)",
      boxSizing: "border-box",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
        <button onClick={onProfiles} style={{ ...menuBtn, display: "flex", alignItems: "center", gap: "0.45rem", maxWidth: 220, background: "rgba(255,255,255,0.94)" }}>
          {user && user.image ? (
            <img
              src={user.image}
              alt={userLabel}
              style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <div style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(124,92,252,0.16), rgba(243,156,18,0.18))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.72rem",
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
        background: "linear-gradient(135deg, #111319, #363b46)",
        border: "none",
        borderRadius: 999,
        padding: "0.42rem 1rem",
        cursor: "pointer",
        fontSize: "0.84rem",
        fontFamily: "'Secular One', sans-serif",
        color: "white",
        boxShadow: "0 10px 20px rgba(17,19,25,0.14)",
      }}>התנתקות</button>
    </div>
  );
}
