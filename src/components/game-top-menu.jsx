"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { TOP_BAR_HEIGHT } from "@/lib/game-constants";

const MENU_BTN = {
  background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,245,240,0.88))",
  border: "1px solid rgba(255,194,162,0.28)",
  borderRadius: 999,
  padding: "0.46rem 1rem",
  cursor: "pointer",
  fontSize: "0.84rem",
  fontFamily: "'Secular One', sans-serif",
  color: "#5c5470",
  boxShadow: "0 10px 24px rgba(236,160,137,0.14)",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  whiteSpace: "nowrap",
};

const MENU_BTN_ACTIVE = {
  ...MENU_BTN,
  background: "linear-gradient(180deg, rgba(255,243,233,1), rgba(255,232,219,0.96))",
  borderColor: "rgba(255,159,136,0.5)",
  color: "#2a2238",
};

const PRIMARY_BTN = {
  background: "linear-gradient(135deg, #ff9b83, #ffbf6d)",
  border: "none",
  borderRadius: 999,
  padding: "0.5rem 1.15rem",
  cursor: "pointer",
  fontSize: "0.88rem",
  fontFamily: "'Secular One', sans-serif",
  color: "white",
  boxShadow: "0 12px 24px rgba(255,165,132,0.24)",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  whiteSpace: "nowrap",
};

const LOGO = {
  fontFamily: "'Suez One', serif",
  fontSize: "1rem",
  color: "#111319",
  textDecoration: "none",
  background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,247,243,0.88))",
  border: "1px solid rgba(255,178,154,0.28)",
  borderRadius: 999,
  padding: "0.46rem 0.9rem",
  boxShadow: "0 10px 24px rgba(255,166,133,0.14)",
  whiteSpace: "nowrap",
};

export default function GameTopMenu(props) {
  const pathname = usePathname() || "";
  const sessionResult = useSession();
  const session = sessionResult ? sessionResult.data : null;
  const status = sessionResult ? sessionResult.status : "loading";

  const passedUser = props.user;
  const user = passedUser || (session ? session.user : null);
  const isAuthenticated = !!user && status !== "loading";

  const onSignOut = props.onSignOut || function() { signOut({ callbackUrl: "/" }); };

  const userLabel = user && (user.name || user.email) ? (user.name || user.email) : "פרופיל";
  const userInitial = userLabel && userLabel.length > 0 ? userLabel.charAt(0).toUpperCase() : "U";

  function isActive(href) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.indexOf(href + "/") === 0;
  }

  function navLink(href, label) {
    const style = isActive(href) ? MENU_BTN_ACTIVE : MENU_BTN;
    return (
      <Link href={href} style={style}>{label}</Link>
    );
  }

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
      gap: "0.45rem",
      background: "linear-gradient(180deg, rgba(255,249,243,0.96), rgba(255,244,238,0.86))",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(255,194,162,0.2)",
      boxShadow: "0 12px 26px rgba(236,160,137,0.12)",
      boxSizing: "border-box",
    }}>
      <Link href="/" style={LOGO}>ציידת האותיות</Link>

      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
        {isAuthenticated ? (
          <>
            <Link href="/play/profiles" style={{ ...MENU_BTN, maxWidth: 220, background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,243,236,0.92))" }}>
              {user && user.image ? (
                <img
                  src={user.image}
                  alt={userLabel}
                  style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover", boxShadow: "0 4px 10px rgba(236,160,137,0.16)" }}
                />
              ) : (
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(255,176,146,0.42), rgba(180,191,255,0.42))",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem",
                }}>{userInitial}</div>
              )}
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>{userLabel}</span>
            </Link>
            {navLink("/play", "משחקים")}
            {navLink("/play/dashboard", "התקדמות")}
            {navLink("/play/settings", "הגדרות")}
          </>
        ) : null}
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
        {isAuthenticated ? (
          <button onClick={onSignOut} style={PRIMARY_BTN}>התנתקות</button>
        ) : (
          <>
            {navLink("/auth/register", "הרשמה")}
            {navLink("/auth/signin", "התחברות")}
            <Link href="/play" style={PRIMARY_BTN}>בואו נשחק</Link>
          </>
        )}
      </div>
    </div>
  );
}
