"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/lib/game-context";
import { PAGE_BG, BACK_BUTTON_STYLE, HEBREW_LETTERS } from "@/lib/game-constants";
import { FloatingLettersBackground } from "@/styles/shared";

export default function SettingsPage() {
  var game = useGame();
  var router = useRouter();
  var settings = game.settings;

  var _sl = useState(function() { return new Set(settings.letterSet); });
  var selectedLetters = _sl[0]; var setSelectedLetters = _sl[1];

  function updateSetting(key, value) {
    game.setSettings(function(prev) {
      var next = {};
      Object.keys(prev).forEach(function(k) { next[k] = prev[k]; });
      next[key] = value;
      return next;
    });
  }

  function toggleLetter(letter) {
    setSelectedLetters(function(prev) {
      var next = new Set(prev);
      if (next.has(letter)) {
        if (next.size > 1) next.delete(letter);
      } else {
        next.add(letter);
      }
      return next;
    });
  }

  function save() {
    game.setSettings(function(prev) {
      var next = {};
      Object.keys(prev).forEach(function(k) { next[k] = prev[k]; });
      next.letterSet = Array.from(selectedLetters);
      return next;
    });
    router.push("/play");
  }

  return (
    <div style={{ ...PAGE_BG, justifyContent: "flex-start", paddingTop: "1.5rem" }}>
      <FloatingLettersBackground />

      <button onClick={function() { router.push("/play"); }} style={BACK_BUTTON_STYLE}>← חזרה</button>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2rem", width: "100%", maxWidth: 600, zIndex: 2 }}>
        <h1 style={{ fontFamily: "'Secular One'", fontSize: "1.5rem", color: "#111319", margin: 0 }}>הגדרות</h1>
      </div>

      <div style={{ background: "white", borderRadius: 16, padding: "1.2rem", marginBottom: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", zIndex: 2, width: "100%", maxWidth: 600, boxSizing: "border-box" }}>
        <h3 style={{ margin: "0 0 0.8rem", fontFamily: "'Secular One'", fontSize: "1rem", color: "#111319" }}>אורך סשן</h3>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {[5, 10, 15].map(function(n) {
            return <button key={n} onClick={function() { updateSetting("sessionLength", n); }} style={{ flex: 1, padding: "0.7rem", borderRadius: 12, border: "none", cursor: "pointer", fontFamily: "'Secular One'", fontSize: "1.1rem", background: settings.sessionLength === n ? "#7C5CFC" : "#f0f0f0", color: settings.sessionLength === n ? "white" : "#666" }}>{n} שאלות</button>;
          })}
        </div>
      </div>

      <div style={{ background: "white", borderRadius: 16, padding: "1.2rem", marginBottom: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", zIndex: 2, width: "100%", maxWidth: 600, boxSizing: "border-box" }}>
        <h3 style={{ margin: "0 0 0.8rem", fontFamily: "'Secular One'", fontSize: "1rem", color: "#111319" }}>קול</h3>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {[{ id: "male", label: "👦 קול גבר" }, { id: "female", label: "👧 קול אישה" }, { id: "kid", label: "🧒 קול ילד" }].map(function(v) {
            return <button key={v.id} onClick={function() { updateSetting("voiceGender", v.id); }} style={{ flex: 1, padding: "0.7rem", borderRadius: 12, border: "none", cursor: "pointer", fontFamily: "'Secular One'", fontSize: "1rem", background: settings.voiceGender === v.id ? "#7C5CFC" : "#f0f0f0", color: settings.voiceGender === v.id ? "white" : "#666" }}>{v.label}</button>;
          })}
        </div>
      </div>

      <div style={{ background: "white", borderRadius: 16, padding: "1.2rem", marginBottom: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", zIndex: 2, width: "100%", maxWidth: 600, boxSizing: "border-box" }}>
        <h3 style={{ margin: "0 0 0.8rem", fontFamily: "'Secular One'", fontSize: "1rem", color: "#111319" }}>רמת עזרה</h3>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {[{ id: "beginner", label: "מתחילים (עם רמזים)" }, { id: "advanced", label: "מתקדמים (בלי רמזים)" }].map(function(h) {
            return <button key={h.id} onClick={function() { updateSetting("helpLevel", h.id); }} style={{ flex: 1, padding: "0.7rem", borderRadius: 12, border: "none", cursor: "pointer", fontFamily: "'Secular One'", fontSize: "0.85rem", background: settings.helpLevel === h.id ? "#7C5CFC" : "#f0f0f0", color: settings.helpLevel === h.id ? "white" : "#666" }}>{h.label}</button>;
          })}
        </div>
      </div>

      <div style={{ background: "white", borderRadius: 16, padding: "1.2rem", marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", zIndex: 2, width: "100%", maxWidth: 600, boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
          <h3 style={{ margin: 0, fontFamily: "'Secular One'", fontSize: "1rem", color: "#111319" }}>בחירת אותיות ({selectedLetters.size})</h3>
          <div style={{ display: "flex", gap: "0.3rem" }}>
            <button onClick={function() { setSelectedLetters(new Set(HEBREW_LETTERS)); }} style={{ padding: "0.3rem 0.8rem", borderRadius: 8, border: "1px solid #ddd", background: "white", cursor: "pointer", fontSize: "0.75rem", color: "#666" }}>הכל</button>
            <button onClick={function() { setSelectedLetters(new Set(HEBREW_LETTERS.slice(0, 5))); }} style={{ padding: "0.3rem 0.8rem", borderRadius: 8, border: "1px solid #ddd", background: "white", cursor: "pointer", fontSize: "0.75rem", color: "#666" }}>5 ראשונות</button>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {HEBREW_LETTERS.map(function(l) {
            return <button key={l} onClick={function() { toggleLetter(l); }} style={{ width: 42, height: 42, borderRadius: 10, border: "none", cursor: "pointer", fontSize: "1.3rem", fontFamily: "'Suez One', serif", background: selectedLetters.has(l) ? "#7C5CFC" : "#f0f0f0", color: selectedLetters.has(l) ? "white" : "#999", transition: "all 0.2s" }}>{l}</button>;
          })}
        </div>
      </div>

      <button onClick={save} style={{ width: "100%", maxWidth: 600, padding: "0.85rem", fontSize: "1.2rem", fontFamily: "'Secular One'", background: "#111319", color: "white", border: "none", borderRadius: "999px", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.18)", zIndex: 2 }}>שמור הגדרות</button>
    </div>
  );
}
