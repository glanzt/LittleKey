"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { TOP_BAR_HEIGHT } from "@/lib/game-constants";

const MENU_BTN = {
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(79,168,232,0.22)",
  borderRadius: 999,
  padding: "0.46rem 1rem",
  cursor: "pointer",
  fontSize: "0.84rem",
  fontFamily: "'Secular One', sans-serif",
  color: "#4A5578",
  boxShadow: "0 10px 24px rgba(79,134,198,0.14)",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  whiteSpace: "nowrap",
};

const MENU_BTN_ACTIVE = {
  ...MENU_BTN,
  background: "linear-gradient(180deg, #EAF6FF, #D9EEFC)",
  borderColor: "rgba(79,168,232,0.45)",
  color: "#2E3A59",
};

const PRIMARY_BTN = {
  background: "linear-gradient(135deg, #FFB938, #FF9B83)",
  border: "none",
  borderRadius: 999,
  padding: "0.5rem 1.15rem",
  cursor: "pointer",
  fontSize: "0.88rem",
  fontFamily: "'Secular One', sans-serif",
  color: "white",
  boxShadow: "0 12px 24px rgba(255,165,90,0.3)",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  whiteSpace: "nowrap",
};

const LOGO = {
  fontFamily: "'Suez One', serif",
  fontSize: "1rem",
  color: "#2E3A59",
  textDecoration: "none",
  background: "rgba(255,255,255,0.95)",
  border: "1px solid rgba(79,168,232,0.25)",
  borderRadius: 999,
  padding: "0.46rem 0.9rem",
  boxShadow: "0 10px 24px rgba(79,134,198,0.14)",
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
    <div className="gtm-bar" style={{
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
      background: "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(222,240,253,0.88))",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(79,168,232,0.2)",
      boxShadow: "0 12px 26px rgba(79,134,198,0.12)",
      boxSizing: "border-box",
      flexWrap: "nowrap",
      overflowX: "auto",
      overflowY: "hidden",
      scrollbarWidth: "none",
      WebkitOverflowScrolling: "touch",
    }}>
      <Link href="/" className="gtm-logo" style={LOGO}>ציידת האותיות</Link>

      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "nowrap" }}>
        {isAuthenticated ? (
          <>
            <Link href="/play/profiles" style={{ ...MENU_BTN, maxWidth: 220, background: "rgba(255,255,255,0.98)" }}>
              {user && user.image ? (
                <img
                  src={user.image}
                  alt={userLabel}
                  style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover", boxShadow: "0 4px 10px rgba(79,134,198,0.18)", flexShrink: 0 }}
                />
              ) : (
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg, rgba(255,185,56,0.4), rgba(79,168,232,0.4))",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem",
                }}>{userInitial}</div>
              )}
              <span className="gtm-username" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>{userLabel}</span>
            </Link>
            {navLink("/play", "משחקים")}
            {navLink("/play/dashboard", "התקדמות")}
            {navLink("/play/settings", "הגדרות")}
          </>
        ) : null}
      </div>

      <div style={{ flex: 1, minWidth: "0.45rem" }} />

      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "nowrap" }}>
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

      <style>{
        ".gtm-bar::-webkit-scrollbar { display: none; }" +
        "@media (max-width: 640px) {" +
        "  .gtm-bar { gap: 0.3rem !important; padding-left: 0.55rem !important; padding-right: 0.55rem !important; }" +
        "  .gtm-bar a, .gtm-bar button { font-size: 0.72rem !important; padding: 0.38rem 0.62rem !important; }" +
        "  .gtm-logo { font-size: 0.82rem !important; }" +
        "  .gtm-username { display: none !important; }" +
        "}"
      }</style>
    </div>
  );
}
