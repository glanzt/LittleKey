"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/lib/game-context";
import { PAGE_BG, BACK_BUTTON_STYLE, HEBREW_LETTERS } from "@/lib/game-constants";
import { FloatingLettersBackground } from "@/styles/shared";

export default function DashboardPage() {
  var game = useGame();
  var router = useRouter();
  var sessions = useMemo(function() {
    return game.sessions.slice().sort(function(a, b) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [game.sessions]);
  var letterStats = game.letterStats;
  var keyboardSessions = useMemo(function() {
    return sessions.filter(function(s) { return s.mode !== "match"; });
  }, [sessions]);
  var matchSessions = useMemo(function() {
    return sessions.filter(function(s) { return s.mode === "match" && s.duration > 0; });
  }, [sessions]);

  var _t = useState("overview"); var tab = _t[0]; var setTab = _t[1];
  var _cc = useState(false); var confirmClear = _cc[0]; var setConfirmClear = _cc[1];
  var recentSessions = sessions.slice().reverse().slice(0, 20);

  var hardestLetters = useMemo(function() {
    return Object.entries(letterStats).map(function(entry) {
      var l = entry[0]; var s = entry[1];
      return { letter: l, accuracy: s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : 0, avgTtc: s.correct > 0 ? Math.round(s.totalTtc / s.correct) : 0 };
    }).sort(function(a, b) { return a.accuracy - b.accuracy; }).slice(0, 5);
  }, [letterStats]);

  var allLetterData = useMemo(function() {
    return Object.entries(letterStats).map(function(entry) {
      var l = entry[0]; var s = entry[1];
      return {
        letter: l, attempts: s.attempts, correct: s.correct,
        accuracy: s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : 0,
        avgTtc: s.correct > 0 ? Math.round(s.totalTtc / s.correct) : 0,
        bestTtc: s.bestTtc === Infinity ? "-" : Math.round(s.bestTtc),
        lastPracticed: s.lastPracticed ? new Date(s.lastPracticed).toLocaleDateString("he-IL") : "-"
      };
    }).sort(function(a, b) { return HEBREW_LETTERS.indexOf(a.letter) - HEBREW_LETTERS.indexOf(b.letter); });
  }, [letterStats]);

  var accuracyOverTime = useMemo(function() {
    return keyboardSessions.slice(-15).map(function(s, i) {
      return { idx: i + 1, accuracy: s.accuracy, date: new Date(s.date).toLocaleDateString("he-IL", { day: "numeric", month: "numeric" }) };
    });
  }, [keyboardSessions]);

  var matchDurationOverTime = useMemo(function() {
    return matchSessions.slice(-15).map(function(s, i) {
      return {
        idx: i + 1,
        duration: s.duration,
        date: new Date(s.date).toLocaleDateString("he-IL", { day: "numeric", month: "numeric" })
      };
    });
  }, [matchSessions]);

  var matchTimingStats = useMemo(function() {
    if (matchSessions.length === 0) return null;
    var latest = matchSessions[matchSessions.length - 1];
    var best = matchSessions.reduce(function(min, s) { return Math.min(min, s.duration); }, Infinity);
    var avg = Math.round(matchSessions.reduce(function(sum, s) { return sum + s.duration; }, 0) / matchSessions.length);
    return { latest: latest.duration, best: best, avg: avg };
  }, [matchSessions]);

  function formatDuration(ms) {
    if (!ms || ms <= 0) return "-";
    return (ms / 1000).toFixed(1) + "s";
  }

  return (
    <div style={{ ...PAGE_BG, justifyContent: "flex-start", paddingTop: "1.5rem" }}>
      <FloatingLettersBackground />

      <button onClick={function() { router.push("/play"); }} style={BACK_BUTTON_STYLE}>← חזרה</button>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", width: "100%", maxWidth: 900, zIndex: 2 }}>
        <h1 style={{ fontFamily: "'Secular One'", fontSize: "1.5rem", color: "#2E3A59", margin: 0 }}>התקדמות</h1>
      </div>

      <div style={{ background: "#FFF3CD", border: "1px solid #FFEEBA", borderRadius: 12, padding: "0.8rem 1.2rem", marginBottom: "1.5rem", fontSize: "0.9rem", color: "#856404", zIndex: 2, width: "100%", maxWidth: 900, boxSizing: "border-box" }}>
        ⚠️ ודאו שהמקלדת מוגדרת על עברית
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", zIndex: 2 }}>
        {["overview", "letters", "sessions"].map(function(id) {
          var labels = { overview: "סקירה", letters: "אותיות", sessions: "סשנים" };
          return (
            <button key={id} onClick={function() { setTab(id); }} style={{
              padding: "0.6rem 1.5rem", borderRadius: 30, border: "none", cursor: "pointer",
              fontFamily: "'Secular One'", fontSize: "0.95rem",
              background: tab === id ? "#4FA8E8" : "white", color: tab === id ? "white" : "#666",
              boxShadow: tab === id ? "0 4px 12px rgba(124,92,252,0.3)" : "0 2px 8px rgba(0,0,0,0.05)"
            }}>{labels[id]}</button>
          );
        })}
      </div>

      {tab === "overview" ? (
        sessions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#999", background: "white", borderRadius: 20, zIndex: 2, width: "100%", maxWidth: 900 }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎮</div>
            <p style={{ fontSize: "1.2rem" }}>עדיין אין נתונים. שחקו משחק ראשון!</p>
          </div>
        ) : (
          <div style={{ zIndex: 2, width: "100%", maxWidth: 900 }}>
            {keyboardSessions.length > 0 ? (
              <>
                <div style={{ background: "white", borderRadius: 20, padding: "1.2rem 1.5rem", marginBottom: "1rem", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                  <h3 style={{ margin: "0 0 1rem", fontFamily: "'Secular One'", color: "#2C3E50", fontSize: "1rem" }}>⌨️ משחק המקלדת</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.8rem" }}>
                    {[
                      { label: "סשנים", value: keyboardSessions.length, color: "#4FA8E8" },
                      { label: "דיוק ממוצע", value: Math.round(keyboardSessions.reduce(function(s, x) { return s + x.accuracy; }, 0) / keyboardSessions.length) + "%", color: "#27AE60" },
                      { label: "זמן ממוצע", value: (keyboardSessions.reduce(function(s, x) { return s + x.avgTtc; }, 0) / keyboardSessions.length / 1000).toFixed(1) + "s", color: "#E74C3C" }
                    ].map(function(s, i) {
                      return (
                        <div key={i} style={{ background: "rgba(250,250,250,0.9)", borderRadius: 16, padding: "1rem", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}>
                          <div style={{ fontSize: "1.6rem", fontWeight: "700", color: s.color }}>{s.value}</div>
                          <div style={{ fontSize: "0.8rem", color: "#999" }}>{s.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : null}

            {accuracyOverTime.length > 1 ? (function() {
              var chartW = 300;
              var chartH = 100;
              var padL = 28;
              var padR = 14;
              var padT = 16;
              var padB = 20;
              var n = accuracyOverTime.length;
              var innerW = chartW - padL - padR;
              var innerH = chartH - padT - padB;

              var minAcc = accuracyOverTime.reduce(function(m, d) { return Math.min(m, d.accuracy); }, 100);
              var maxAcc = accuracyOverTime.reduce(function(m, d) { return Math.max(m, d.accuracy); }, 0);
              var yMin = Math.max(0, Math.floor((minAcc - 10) / 10) * 10);
              var yMax = Math.min(100, Math.ceil((maxAcc + 5) / 10) * 10);
              if (yMax - yMin < 20) { yMin = Math.max(0, yMax - 20); }
              var yRange = yMax - yMin;

              var gridLines = [];
              for (var g = yMin; g <= yMax; g += 10) gridLines.push(g);

              var points = accuracyOverTime.map(function(d, i) {
                var x = padL + (n > 1 ? (i / (n - 1)) * innerW : innerW / 2);
                var y = padT + innerH - ((d.accuracy - yMin) / yRange) * innerH;
                return { x: x, y: y, accuracy: d.accuracy, date: d.date };
              });
              var polyline = points.map(function(p) { return p.x + "," + p.y; }).join(" ");
              var areaPath = "M" + points[0].x + "," + (padT + innerH)
                + " " + points.map(function(p) { return "L" + p.x + "," + p.y; }).join(" ")
                + " L" + points[points.length - 1].x + "," + (padT + innerH) + " Z";
              return (
                <div style={{ background: "white", borderRadius: 20, padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                  <h3 style={{ margin: "0 0 0.8rem", fontFamily: "'Secular One'", color: "#2C3E50", fontSize: "1rem" }}>דיוק לאורך זמן</h3>
                  <svg viewBox={"0 0 " + chartW + " " + chartH} style={{ width: "100%", overflow: "visible" }} preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4FA8E8" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#4FA8E8" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    {gridLines.map(function(val) {
                      var gy = padT + innerH - ((val - yMin) / yRange) * innerH;
                      return (
                        <g key={val}>
                          <line x1={padL} y1={gy} x2={chartW - padR} y2={gy} stroke="#eee" strokeWidth="0.5" />
                          <text x={padL - 4} y={gy + 3} textAnchor="end" fontSize="6" fill="#bbb" fontFamily="'Rubik', sans-serif">{val}%</text>
                        </g>
                      );
                    })}
                    <path d={areaPath} fill="url(#lineGrad)" />
                    <polyline points={polyline} fill="none" stroke="#4FA8E8" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                    {points.map(function(p, i) {
                      return (
                        <g key={i}>
                          <circle cx={p.x} cy={p.y} r="3.5" fill="#4FA8E8" stroke="white" strokeWidth="1.5" />
                          <text x={p.x} y={p.y - 6} textAnchor="middle" fontSize="6.5" fill="#555" fontWeight="600" fontFamily="'Secular One', sans-serif">{p.accuracy}%</text>
                          <text x={p.x} y={padT + innerH + 10} textAnchor="middle" fontSize="6" fill="#bbb" fontFamily="'Rubik', sans-serif">{p.date}</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              );
            })() : null}

            {hardestLetters.length > 0 ? (
              <div style={{ background: "white", borderRadius: 20, padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                <h3 style={{ margin: "0 0 1rem", fontFamily: "'Secular One'", color: "#2C3E50", fontSize: "1rem" }}>🔥 אותיות לעבוד עליהן</h3>
                <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
                  {hardestLetters.map(function(l, i) {
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#FFF5F5", borderRadius: 12, padding: "0.6rem 1rem" }}>
                        <span style={{ fontSize: "1.8rem", fontFamily: "'Suez One', serif" }}>{l.letter}</span>
                        <div>
                          <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "#E74C3C" }}>{l.accuracy}%</div>
                          <div style={{ fontSize: "0.7rem", color: "#999" }}>{(l.avgTtc / 1000).toFixed(1)}s</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {matchTimingStats ? (
              <>
                <div style={{ background: "white", borderRadius: 20, padding: "1.2rem 1.5rem", marginBottom: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                  <h3 style={{ margin: "0 0 1rem", fontFamily: "'Secular One'", color: "#2C3E50", fontSize: "1rem" }}>🃏 התאמת קלפים</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.8rem" }}>
                    {[
                      { label: "זמן סיום אחרון", value: formatDuration(matchTimingStats.latest), color: "#4FA8E8" },
                      { label: "זמן סיום ממוצע", value: formatDuration(matchTimingStats.avg), color: "#E67E22" },
                      { label: "זמן סיום הכי מהיר", value: formatDuration(matchTimingStats.best), color: "#27AE60" }
                    ].map(function(s, i) {
                      return (
                        <div key={i} style={{ background: "rgba(250,250,250,0.9)", borderRadius: 16, padding: "1rem", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}>
                          <div style={{ fontSize: "1.6rem", fontWeight: "700", color: s.color }}>{s.value}</div>
                          <div style={{ fontSize: "0.8rem", color: "#999" }}>{s.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {matchDurationOverTime.length > 1 ? (function() {
                  var chartW = 300;
                  var chartH = 100;
                  var padL = 28;
                  var padR = 14;
                  var padT = 16;
                  var padB = 20;
                  var n = matchDurationOverTime.length;
                  var innerW = chartW - padL - padR;
                  var innerH = chartH - padT - padB;

                  var minMs = matchDurationOverTime.reduce(function(m, d) { return Math.min(m, d.duration); }, Infinity);
                  var maxMs = matchDurationOverTime.reduce(function(m, d) { return Math.max(m, d.duration); }, 0);
                  var yMin = Math.max(0, Math.floor((minMs - 2000) / 1000) * 1000);
                  var yMax = Math.ceil((maxMs + 1000) / 1000) * 1000;
                  if (yMax - yMin < 3000) yMax = yMin + 3000;
                  var yRange = yMax - yMin;

                  var gridLines = [];
                  for (var g = yMin; g <= yMax; g += 1000) gridLines.push(g);

                  var points = matchDurationOverTime.map(function(d, i) {
                    var x = padL + (n > 1 ? (i / (n - 1)) * innerW : innerW / 2);
                    var y = padT + innerH - ((d.duration - yMin) / yRange) * innerH;
                    return { x: x, y: y, duration: d.duration, date: d.date };
                  });
                  var polyline = points.map(function(p) { return p.x + "," + p.y; }).join(" ");
                  var areaPath = "M" + points[0].x + "," + (padT + innerH)
                    + " " + points.map(function(p) { return "L" + p.x + "," + p.y; }).join(" ")
                    + " L" + points[points.length - 1].x + "," + (padT + innerH) + " Z";

                  return (
                    <div style={{ background: "white", borderRadius: 20, padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                      <h3 style={{ margin: "0 0 0.8rem", fontFamily: "'Secular One'", color: "#2C3E50", fontSize: "1rem" }}>זמן סיום לאורך זמן</h3>
                      <svg viewBox={"0 0 " + chartW + " " + chartH} style={{ width: "100%", overflow: "visible" }} preserveAspectRatio="xMidYMid meet">
                        <defs>
                          <linearGradient id="matchLineGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#E67E22" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#E67E22" stopOpacity="0.02" />
                          </linearGradient>
                        </defs>
                        {gridLines.map(function(val) {
                          var gy = padT + innerH - ((val - yMin) / yRange) * innerH;
                          return (
                            <g key={val}>
                              <line x1={padL} y1={gy} x2={chartW - padR} y2={gy} stroke="#eee" strokeWidth="0.5" />
                              <text x={padL - 4} y={gy + 3} textAnchor="end" fontSize="6" fill="#bbb" fontFamily="'Rubik', sans-serif">{(val / 1000).toFixed(0)}s</text>
                            </g>
                          );
                        })}
                        <path d={areaPath} fill="url(#matchLineGrad)" />
                        <polyline points={polyline} fill="none" stroke="#E67E22" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                        {points.map(function(p, i) {
                          return (
                            <g key={i}>
                              <circle cx={p.x} cy={p.y} r="3.5" fill="#E67E22" stroke="white" strokeWidth="1.5" />
                              <text x={p.x} y={p.y - 6} textAnchor="middle" fontSize="6.5" fill="#555" fontWeight="600" fontFamily="'Secular One', sans-serif">{formatDuration(p.duration)}</text>
                              <text x={p.x} y={padT + innerH + 10} textAnchor="middle" fontSize="6" fill="#bbb" fontFamily="'Rubik', sans-serif">{p.date}</text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  );
                })() : null}
              </>
            ) : null}
          </div>
        )
      ) : null}

      {tab === "letters" ? (
        <div style={{ background: "white", borderRadius: 20, padding: "1rem", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", overflowX: "auto", zIndex: 2, width: "100%", maxWidth: 900, boxSizing: "border-box" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                {["אות", "ניסיונות", "נכון", "דיוק%", "זמן ממוצע", "שיא", "אחרון"].map(function(h) {
                  return <th key={h} style={{ padding: "0.7rem 0.5rem", textAlign: "center", color: "#999", fontWeight: "600" }}>{h}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {allLetterData.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "#ccc" }}>אין נתונים עדיין</td></tr>
              ) : allLetterData.map(function(l, i) {
                return (
                  <tr key={i} style={{ borderBottom: "1px solid #f5f5f5" }}>
                    <td style={{ textAlign: "center", fontSize: "1.4rem", fontFamily: "'Suez One', serif", padding: "0.5rem" }}>{l.letter}</td>
                    <td style={{ textAlign: "center" }}>{l.attempts}</td>
                    <td style={{ textAlign: "center" }}>{l.correct}</td>
                    <td style={{ textAlign: "center", fontWeight: "600", color: l.accuracy < 70 ? "#E74C3C" : "#27AE60" }}>{l.accuracy}%</td>
                    <td style={{ textAlign: "center" }}>{l.avgTtc > 0 ? (l.avgTtc / 1000).toFixed(1) + "s" : "-"}</td>
                    <td style={{ textAlign: "center" }}>{l.bestTtc !== "-" ? (l.bestTtc / 1000).toFixed(1) + "s" : "-"}</td>
                    <td style={{ textAlign: "center", fontSize: "0.75rem", color: "#999" }}>{l.lastPracticed}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      {tab === "sessions" ? (
        recentSessions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#ccc", background: "white", borderRadius: 20, zIndex: 2, width: "100%", maxWidth: 900 }}>אין סשנים עדיין</div>
        ) : (
          <div style={{ zIndex: 2, width: "100%", maxWidth: 900 }}>
            {recentSessions.map(function(s, i) {
              if (s.mode === "match") {
                return (
                  <div key={i} style={{ background: "white", borderRadius: 16, padding: "1rem 1.5rem", marginBottom: "0.8rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.85rem", color: "#999" }}>
                        {new Date(s.date).toLocaleDateString("he-IL")} {new Date(s.date).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "#bbb" }}>התאמת קלפים</span>
                    </div>
                    <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.6rem", alignItems: "center" }}>
                      <span style={{ fontWeight: "600", color: "#E67E22" }}>⏱️ זמן סיום: {formatDuration(s.duration)}</span>
                    </div>
                  </div>
                );
              }

              var sResults = s.letterResults || (s.sequence || []).map(function(l) { return { letter: l, status: "perfect" }; });
              return (
                <div key={i} style={{ background: "white", borderRadius: 16, padding: "1rem 1.5rem", marginBottom: "0.8rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.85rem", color: "#999" }}>
                      {new Date(s.date).toLocaleDateString("he-IL")} {new Date(s.date).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "#bbb" }}>אקראי</span>
                  </div>
                  <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.5rem" }}>
                    <span style={{ fontWeight: "600" }}>✅ {s.completed}/{s.totalQuestions}</span>
                    <span style={{ color: s.accuracy >= 70 ? "#27AE60" : "#E74C3C", fontWeight: "600" }}>🎯 {s.accuracy}%</span>
                    <span>⏱️ {(s.avgTtc / 1000).toFixed(1)}s</span>
                  </div>
                  <div style={{ display: "flex", gap: 4, marginTop: "0.5rem", flexWrap: "wrap" }}>
                    {sResults.map(function(r, j) {
                      var isHelped = r.status === "helpedPerfect" || r.status === "helpedWithErrors";
                      var bgc = r.status === "perfect" ? "#F0FFF0" : r.status === "withErrors" ? "#FFF8E1" : isHelped ? "#EBF5FB" : "#FFF5F5";
                      var clr = r.status === "perfect" ? "#27AE60" : r.status === "withErrors" ? "#F39C12" : isHelped ? "#3498DB" : "#E74C3C";
                      var brc = r.status === "perfect" ? "#C8E6C9" : r.status === "withErrors" ? "#FFE0B2" : isHelped ? "#AED6F1" : "#FFCDD2";
                      return <span key={j} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, fontSize: "0.9rem", fontFamily: "'Suez One', serif", background: bgc, color: clr, border: "1px solid " + brc }}>{r.letter}</span>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : null}

      <div style={{ textAlign: "center", marginTop: "2rem", zIndex: 2 }}>
        {!confirmClear ? (
          <button onClick={function() { setConfirmClear(true); }} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: "0.85rem" }}>🗑️ מחק את כל הנתונים</button>
        ) : (
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", alignItems: "center" }}>
            <span style={{ color: "#E74C3C", fontSize: "0.9rem" }}>בטוח?</span>
            <button onClick={function() { game.clearAllData(); setConfirmClear(false); }} style={{ background: "#E74C3C", color: "white", border: "none", borderRadius: 8, padding: "0.4rem 1rem", cursor: "pointer", fontSize: "0.85rem" }}>כן, מחק</button>
            <button onClick={function() { setConfirmClear(false); }} style={{ background: "#eee", border: "none", borderRadius: 8, padding: "0.4rem 1rem", cursor: "pointer", fontSize: "0.85rem" }}>ביטול</button>
          </div>
        )}
      </div>
    </div>
  );
}
