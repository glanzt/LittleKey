"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/lib/game-context";
import { PAGE_BG, AVATAR_OPTIONS } from "@/lib/game-constants";
import { FloatingLettersBackground } from "@/styles/shared";

export default function ProfilesPage() {
  var game = useGame();
  var router = useRouter();
  var profiles = game.profilesHook.profiles;
  var loading = game.profilesHook.loading;
  var user = game.sync.user;

  var _sf = useState(false); var showForm = _sf[0]; var setShowForm = _sf[1];
  var _nm = useState(""); var newName = _nm[0]; var setNewName = _nm[1];
  var _av = useState("🧒"); var newAvatar = _av[0]; var setNewAvatar = _av[1];
  var _cr = useState(false); var creating = _cr[0]; var setCreating = _cr[1];
  var _cd = useState(null); var confirmDeleteId = _cd[0]; var setConfirmDeleteId = _cd[1];
  var hasFetched = useRef(false);

  useEffect(function() {
    if (!hasFetched.current) {
      hasFetched.current = true;
      game.profilesHook.fetchProfiles();
    }
  }, []);

  function handleSelect(profile) {
    game.setActiveProfile(profile);
    router.push("/play");
  }

  function handleCreate() {
    if (!newName.trim() || creating) return;
    setCreating(true);
    game.profilesHook.createProfile(newName.trim(), newAvatar).then(function(profile) {
      setCreating(false);
      if (profile) {
        setShowForm(false);
        setNewName("");
        setNewAvatar("🧒");
        handleSelect(profile);
      }
    });
  }

  function handleDelete(id) {
    game.profilesHook.deleteProfile(id).then(function() {
      setConfirmDeleteId(null);
    });
  }

  return (
    <div style={{ ...PAGE_BG, fontFamily: "'Secular One', 'Rubik', sans-serif" }}>
      <FloatingLettersBackground />

      <h1 style={{ fontFamily: "'Suez One', serif", fontSize: "clamp(2rem, 7vw, 3rem)", color: "#111319", margin: "0 0 0.3rem", textAlign: "center", zIndex: 2 }}>
        מי משחק?
      </h1>
      <p style={{ fontSize: "1rem", color: "rgba(20,23,32,0.45)", marginBottom: "2rem", fontFamily: "'Rubik', sans-serif", zIndex: 2 }}>
        {user?.name || user?.email}
      </p>

      {loading ? (
        <div style={{ fontSize: "1.2rem", color: "#aaa", padding: "2rem" }}>טוען...</div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.2rem", justifyContent: "center", maxWidth: 600, marginBottom: "2rem", zIndex: 2 }}>
          {profiles.map(function(profile) {
            return (
              <div key={profile.id} style={{ position: "relative" }}>
                <button
                  onClick={function() { handleSelect(profile); }}
                  style={{
                    width: 130, minHeight: 140, borderRadius: 24,
                    border: "3px solid transparent", background: "white",
                    cursor: "pointer", display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: "0.5rem",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.2s ease", padding: "1rem 0.5rem",
                  }}
                  onMouseEnter={function(e) { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.borderColor = "#7C5CFC"; }}
                  onMouseLeave={function(e) { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "transparent"; }}
                >
                  <span style={{ fontSize: "3rem" }}>{profile.avatar}</span>
                  <span style={{ fontSize: "1.1rem", color: "#2C3E50", fontFamily: "'Secular One', sans-serif", maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {profile.name}
                  </span>
                </button>
                {confirmDeleteId === profile.id ? (
                  <div style={{ position: "absolute", top: -8, right: -8, display: "flex", gap: 4 }}>
                    <button onClick={function() { handleDelete(profile.id); }} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: "#E74C3C", color: "white", fontSize: "0.7rem", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>✓</button>
                    <button onClick={function() { setConfirmDeleteId(null); }} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: "#ccc", color: "white", fontSize: "0.7rem", cursor: "pointer" }}>✕</button>
                  </div>
                ) : (
                  <button
                    onClick={function(e) { e.stopPropagation(); setConfirmDeleteId(profile.id); }}
                    style={{
                      position: "absolute", top: -6, right: -6, width: 24, height: 24,
                      borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.1)",
                      color: "#999", fontSize: "0.65rem", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      opacity: 0.5, transition: "opacity 0.2s"
                    }}
                    onMouseEnter={function(e) { e.currentTarget.style.opacity = "1"; }}
                    onMouseLeave={function(e) { e.currentTarget.style.opacity = "0.5"; }}
                  >✕</button>
                )}
              </div>
            );
          })}

          <button
            onClick={function() { setShowForm(true); }}
            style={{
              width: 130, minHeight: 140, borderRadius: 24,
              border: "3px dashed rgba(124,92,252,0.3)", background: "rgba(255,255,255,0.5)",
              cursor: "pointer", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "0.5rem",
              transition: "all 0.2s ease", padding: "1rem 0.5rem",
            }}
            onMouseEnter={function(e) { e.currentTarget.style.background = "rgba(255,255,255,0.8)"; e.currentTarget.style.borderColor = "#7C5CFC"; }}
            onMouseLeave={function(e) { e.currentTarget.style.background = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(124,92,252,0.3)"; }}
          >
            <span style={{ fontSize: "2.5rem", color: "#7C5CFC" }}>+</span>
            <span style={{ fontSize: "0.95rem", color: "#7C5CFC", fontFamily: "'Secular One', sans-serif" }}>פרופיל חדש</span>
          </button>
        </div>
      )}

      {showForm ? (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 200, padding: "1rem"
        }} onClick={function(e) { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div style={{
            background: "white", borderRadius: 28, padding: "2rem",
            maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            animation: "popIn 0.3s ease both"
          }}>
            <h2 style={{ fontFamily: "'Suez One', serif", fontSize: "1.6rem", color: "#2C3E50", margin: "0 0 1.5rem", textAlign: "center" }}>
              פרופיל חדש
            </h2>

            <div style={{ marginBottom: "1.2rem" }}>
              <label style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.4rem", display: "block", fontFamily: "'Secular One'" }}>שם</label>
              <input
                value={newName}
                onChange={function(e) { setNewName(e.target.value); }}
                onKeyDown={function(e) { if (e.key === "Enter") handleCreate(); }}
                placeholder="הכניסו שם..."
                maxLength={30}
                autoFocus
                style={{
                  width: "100%", padding: "0.9rem 1rem", fontSize: "1.1rem",
                  border: "2px solid #e0e0e0", borderRadius: 14, outline: "none",
                  fontFamily: "'Rubik', sans-serif", direction: "rtl",
                  boxSizing: "border-box", transition: "border-color 0.2s"
                }}
                onFocus={function(e) { e.target.style.borderColor = "#7C5CFC"; }}
                onBlur={function(e) { e.target.style.borderColor = "#e0e0e0"; }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.4rem", display: "block", fontFamily: "'Secular One'" }}>אוואטר</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {AVATAR_OPTIONS.map(function(av) {
                  return (
                    <button key={av} onClick={function() { setNewAvatar(av); }} style={{
                      width: 46, height: 46, borderRadius: 12, border: "none",
                      background: newAvatar === av ? "linear-gradient(135deg, #7C5CFC, #9B7DFF)" : "#f5f5f5",
                      fontSize: "1.5rem", cursor: "pointer", transition: "all 0.2s",
                      transform: newAvatar === av ? "scale(1.15)" : "scale(1)",
                      boxShadow: newAvatar === av ? "0 4px 12px rgba(124,92,252,0.3)" : "none"
                    }}>{av}</button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.8rem" }}>
              <button onClick={handleCreate} disabled={!newName.trim() || creating} style={{
                flex: 1, padding: "0.9rem", fontSize: "1.1rem",
                fontFamily: "'Secular One'", border: "none", borderRadius: 16,
                cursor: newName.trim() && !creating ? "pointer" : "not-allowed",
                background: newName.trim() && !creating ? "linear-gradient(135deg, #7C5CFC, #5B3FD4)" : "#e0e0e0",
                color: "white", boxShadow: newName.trim() ? "0 4px 16px rgba(124,92,252,0.3)" : "none"
              }}>{creating ? "יוצר..." : "צרי פרופיל"}</button>
              <button onClick={function() { setShowForm(false); }} style={{
                padding: "0.9rem 1.5rem", fontSize: "1.1rem",
                fontFamily: "'Secular One'", border: "2px solid #e0e0e0",
                borderRadius: 16, cursor: "pointer", background: "white", color: "#999"
              }}>ביטול</button>
            </div>
          </div>
          <style>{"@keyframes popIn { 0%{ transform: scale(0.8); opacity: 0 } 100%{ transform: scale(1); opacity: 1 } }"}</style>
        </div>
      ) : null}
    </div>
  );
}
