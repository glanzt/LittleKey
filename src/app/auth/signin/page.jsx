"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GameTopMenu from "@/components/game-top-menu";
import { TOP_BAR_HEIGHT } from "@/lib/game-constants";
import { shared, GoogleIcon, FloatingLettersBackground } from "@/styles/shared";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/play";
  const { status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, callbackUrl, router]);

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
    <div style={{ ...shared.page, paddingTop: TOP_BAR_HEIGHT }}>
      <GameTopMenu />
      <FloatingLettersBackground />

      <h1 style={shared.title}>התחברות</h1>
      <p style={shared.subtitle}>היכנסו כדי לשמור את ההתקדמות</p>

      <div style={shared.card}>
        <button onClick={() => signIn("google", { callbackUrl })} style={shared.googleBtn}>
          <GoogleIcon />
          התחברות עם Google
        </button>

        <div style={shared.divider}>
          <div style={shared.dividerLine} />
          <span>או עם אימייל</span>
          <div style={shared.dividerLine} />
        </div>

        <form onSubmit={handleCredentials}>
          <input
            type="email" placeholder="אימייל" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            style={shared.input}
          />
          <input
            type="password" placeholder="סיסמה" value={password}
            onChange={(e) => setPassword(e.target.value)} required
            style={shared.input}
          />

          {error && <div style={shared.error}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{ ...shared.submitBtn, opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
          >
            {loading ? "מתחברים..." : "התחברות"}
          </button>
        </form>

        <p style={shared.footerText}>
          אין לכם חשבון?{" "}
          <a href="/auth/register" style={shared.footerLink}>הרשמה</a>
        </p>
      </div>

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
