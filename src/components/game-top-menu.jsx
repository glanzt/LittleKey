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
    background: "white",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 999,
    padding: "0.35rem 0.85rem",
    cursor: "pointer",
    fontSize: "0.82rem",
    fontFamily: "'Secular One', sans-serif",
    color: "#111319",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
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
      padding: "0 1.2rem",
      background: "rgba(250,250,250,0.92)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(0,0,0,0.06)",
      boxSizing: "border-box",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button onClick={onProfiles} style={{ ...menuBtn, display: "flex", alignItems: "center", gap: "0.4rem", maxWidth: 200 }}>
          {user && user.image ? (
            <img
              src={user.image}
              alt={userLabel}
              style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <div style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "rgba(17,19,25,0.1)",
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
        background: "#111319",
        border: "none",
        borderRadius: 999,
        padding: "0.35rem 1rem",
        cursor: "pointer",
        fontSize: "0.82rem",
        fontFamily: "'Secular One', sans-serif",
        color: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      }}>התנתקות</button>
    </div>
  );
}
