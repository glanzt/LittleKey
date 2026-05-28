"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GameTopMenu from "@/components/game-top-menu";
import { TOP_BAR_HEIGHT } from "@/lib/game-constants";
import { shared, GoogleIcon, FloatingLettersBackground } from "@/styles/shared";

export default function RegisterPage() {
  const router = useRouter();
  const { status } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/play");
    }
  }, [status, router]);

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("הסיסמאות לא תואמות");
      return;
    }

    if (password.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      const messages = {
        "An account with this email already exists": "כבר קיים חשבון עם אימייל זה",
        "Email and password are required": "אימייל וסיסמה הם שדות חובה",
        "Password must be at least 6 characters": "הסיסמה חייבת להכיל לפחות 6 תווים",
      };
      setError(messages[data.error] || "ההרשמה נכשלה, נסו שוב");
      return;
    }

    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (result?.error) {
      setError("ההרשמה הצליחה, אך ההתחברות נכשלה. נסו להתחבר.");
      return;
    }

    router.push("/play");
  }

  return (
    <div style={{ ...shared.page, paddingTop: TOP_BAR_HEIGHT }}>
      <GameTopMenu />
      <FloatingLettersBackground />

      <h1 style={shared.title}>הרשמה</h1>
      <p style={shared.subtitle}>צרו חשבון כדי לשמור את ההתקדמות</p>

      <div style={shared.card}>
        <button onClick={() => signIn("google", { callbackUrl: "/play" })} style={shared.googleBtn}>
          <GoogleIcon />
          הרשמה עם Google
        </button>

        <div style={shared.divider}>
          <div style={shared.dividerLine} />
          <span>או עם אימייל</span>
          <div style={shared.dividerLine} />
        </div>

        <form onSubmit={handleRegister}>
          <input type="text" placeholder="שם" value={name} onChange={(e) => setName(e.target.value)} style={shared.input} />
          <input type="email" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} required style={shared.input} />
          <input type="password" placeholder="סיסמה (לפחות 6 תווים)" value={password} onChange={(e) => setPassword(e.target.value)} required style={shared.input} />
          <input type="password" placeholder="אימות סיסמה" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={shared.input} />

          {error && <div style={shared.error}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{ ...shared.submitBtn, opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
          >
            {loading ? "נרשמים..." : "צרו חשבון"}
          </button>
        </form>

        <p style={shared.footerText}>
          כבר יש לכם חשבון?{" "}
          <a href="/auth/signin" style={shared.footerLink}>התחברות</a>
        </p>
      </div>

    </div>
  );
}
