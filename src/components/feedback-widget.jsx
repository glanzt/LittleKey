"use client";

import { useState } from "react";

export default function FeedbackWidget() {
  var _o = useState(false); var open = _o[0]; var setOpen = _o[1];
  var _r = useState(0); var rating = _r[0]; var setRating = _r[1];
  var _h = useState(0); var hover = _h[0]; var setHover = _h[1];
  var _m = useState(""); var message = _m[0]; var setMessage = _m[1];
  var _st = useState("idle"); var status = _st[0]; var setStatus = _st[1];

  function handleSubmit() {
    if (!message.trim()) return;
    setStatus("sending");
    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message, rating: rating || null }),
    }).then(function(res) {
      if (res.ok) {
        setStatus("sent");
        setTimeout(function() { setOpen(false); setStatus("idle"); setMessage(""); setRating(0); }, 2000);
      } else { setStatus("error"); }
    }).catch(function() { setStatus("error"); });
  }

  return (
    <>
      <button onClick={function() { setOpen(true); }} style={{
        position: "fixed", bottom: "1.5rem", left: "1.5rem", zIndex: 900,
        width: 48, height: 48, borderRadius: "50%",
        background: "linear-gradient(135deg, #7C5CFC, #A78BFA)", border: "none",
        cursor: "pointer", boxShadow: "0 4px 16px rgba(124,92,252,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.3rem", transition: "transform 0.2s",
      }} title="משוב">💬</button>

      {open ? (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
        }} onClick={function() { if (status !== "sending") { setOpen(false); } }}>
          <div style={{
            position: "absolute", bottom: "5rem", left: "1.5rem",
            background: "white", borderRadius: 20, padding: "1.8rem",
            boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
            width: 320, maxWidth: "calc(100vw - 3rem)",
            direction: "rtl", textAlign: "center",
            animation: "feedbackPop 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }} onClick={function(e) { e.stopPropagation(); }}>
            {status === "sent" ? (
              <div>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎉</div>
                <p style={{ fontFamily: "'Secular One', sans-serif", fontSize: "1.1rem", color: "#27AE60", margin: 0 }}>תודה על המשוב!</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
                  <span style={{ fontSize: "1.4rem" }}>📝</span>
                  <h3 style={{ fontFamily: "'Secular One', sans-serif", fontSize: "1.1rem", color: "#111319", margin: 0 }}>משוב</h3>
                </div>
                <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: "0.85rem", color: "#888", margin: "0 0 1rem", lineHeight: 1.5 }}>
                  איך הייתה החוויה? נשמח לשמוע ממך
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: "0.3rem", marginBottom: "1rem" }}>
                  {[1, 2, 3, 4, 5].map(function(s) {
                    var filled = s <= (hover || rating);
                    return (
                      <button key={s}
                        onMouseEnter={function() { setHover(s); }}
                        onMouseLeave={function() { setHover(0); }}
                        onClick={function() { setRating(s === rating ? 0 : s); }}
                        style={{
                          background: "none", border: "none", cursor: "pointer",
                          fontSize: "1.8rem", padding: "0 0.1rem",
                          transition: "transform 0.15s",
                          transform: filled ? "scale(1.15)" : "scale(1)",
                          filter: filled ? "none" : "grayscale(1) opacity(0.3)",
                        }}
                      >⭐</button>
                    );
                  })}
                </div>
                <textarea
                  value={message}
                  onChange={function(e) { setMessage(e.target.value); }}
                  placeholder="כתבו את המשוב שלכם כאן..."
                  rows={3}
                  style={{
                    width: "100%", boxSizing: "border-box", borderRadius: 12,
                    border: "1px solid rgba(0,0,0,0.1)", padding: "0.8rem",
                    fontFamily: "'Rubik', sans-serif", fontSize: "0.9rem",
                    resize: "vertical", direction: "rtl", outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={function(e) { e.target.style.borderColor = "#7C5CFC"; }}
                  onBlur={function(e) { e.target.style.borderColor = "rgba(0,0,0,0.1)"; }}
                />
                {status === "error" ? (
                  <p style={{ fontFamily: "'Rubik', sans-serif", fontSize: "0.8rem", color: "#E74C3C", margin: "0.5rem 0 0" }}>שגיאה בשליחה, נסו שוב</p>
                ) : null}
                <button onClick={handleSubmit} disabled={!message.trim() || status === "sending"} style={{
                  marginTop: "0.8rem", width: "100%", padding: "0.7rem",
                  fontFamily: "'Secular One', sans-serif", fontSize: "1rem",
                  background: !message.trim() ? "#ccc" : "#111319", color: "white",
                  border: "none", borderRadius: 999, cursor: !message.trim() ? "default" : "pointer",
                  boxShadow: message.trim() ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
                  transition: "background 0.2s",
                }}>{status === "sending" ? "שולח..." : "שליחה"}</button>
              </>
            )}
          </div>
        </div>
      ) : null}

      <style>{
        "@keyframes feedbackPop { 0%{ transform: scale(0.8) translateY(20px); opacity: 0 } 100%{ transform: scale(1) translateY(0); opacity: 1 } }"
      }</style>
    </>
  );
}
