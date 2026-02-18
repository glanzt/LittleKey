"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCredentials(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("אימייל או סיסמה לא נכונים");
    } else {
      router.push(callbackUrl);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(170deg, #FFF8E7 0%, #FFECD2 30%, #FCB69F 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Rubik', sans-serif", direction: "rtl", padding: "2rem",
    }}>
      <div style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>🎯</div>
      <h1 style={{
        fontFamily: "'Suez One', serif", fontSize: "clamp(2rem, 7vw, 3rem)",
        color: "#2C3E50", marginBottom: "0.3rem", textAlign: "center",
      }}>ציידת האותיות</h1>
      <p style={{ color: "#7F8C8D", marginBottom: "2rem", fontSize: "1.1rem" }}>התחברי כדי לשמור את ההתקדמות שלך</p>

      <div style={{
        background: "white", borderRadius: 24, padding: "2rem",
        width: "100%", maxWidth: 400, boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
      }}>
        {/* Google sign-in */}
        <button onClick={() => signIn("google", { callbackUrl })} style={{
          width: "100%", padding: "0.9rem", borderRadius: 14, border: "1px solid #ddd",
          background: "white", cursor: "pointer", fontSize: "1.05rem",
          fontFamily: "'Secular One', sans-serif", color: "#333",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "box-shadow 0.2s",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          התחברי עם Google
        </button>

        <div style={{
          display: "flex", alignItems: "center", gap: "1rem",
          margin: "1.5rem 0", color: "#ccc", fontSize: "0.85rem",
        }}>
          <div style={{ flex: 1, height: 1, background: "#eee" }} />
          <span>או עם אימייל</span>
          <div style={{ flex: 1, height: 1, background: "#eee" }} />
        </div>

        {/* Email/password form */}
        <form onSubmit={handleCredentials}>
          <input
            type="email" placeholder="אימייל" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            style={{
              width: "100%", padding: "0.85rem 1rem", borderRadius: 12,
              border: "1.5px solid #e0e0e0", fontSize: "1rem", marginBottom: "0.8rem",
              fontFamily: "'Rubik', sans-serif", boxSizing: "border-box",
              outline: "none", transition: "border-color 0.2s",
            }}
          />
          <input
            type="password" placeholder="סיסמה" value={password}
            onChange={(e) => setPassword(e.target.value)} required
            style={{
              width: "100%", padding: "0.85rem 1rem", borderRadius: 12,
              border: "1.5px solid #e0e0e0", fontSize: "1rem", marginBottom: "1rem",
              fontFamily: "'Rubik', sans-serif", boxSizing: "border-box",
              outline: "none", transition: "border-color 0.2s",
            }}
          />

          {error && (
            <div style={{
              background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 10,
              padding: "0.6rem 1rem", marginBottom: "1rem", color: "#E74C3C",
              fontSize: "0.9rem", textAlign: "center",
            }}>{error}</div>
          )}

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "0.9rem", borderRadius: 14, border: "none",
            background: "linear-gradient(135deg, #E74C3C, #C0392B)", color: "white",
            fontSize: "1.1rem", fontFamily: "'Secular One', sans-serif",
            cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1,
            boxShadow: "0 4px 16px rgba(231,76,60,0.3)", transition: "opacity 0.2s",
          }}>
            {loading ? "מתחברת..." : "התחברי"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.2rem", fontSize: "0.9rem", color: "#999" }}>
          אין לך חשבון?{" "}
          <a href="/auth/register" style={{ color: "#7C5CFC", textDecoration: "none", fontWeight: 600 }}>
            הרשמה
          </a>
        </p>
      </div>

      {/* Guest mode link */}
      <button onClick={() => router.push("/")} style={{
        marginTop: "1.5rem", background: "none", border: "none",
        color: "#999", cursor: "pointer", fontSize: "0.95rem",
        fontFamily: "'Rubik', sans-serif", textDecoration: "underline",
      }}>
        המשיכי בלי חשבון (אורחת)
      </button>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
