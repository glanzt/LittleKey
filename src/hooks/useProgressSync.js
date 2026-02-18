"use client";

import { useSession } from "next-auth/react";
import { useCallback, useRef } from "react";

export default function useProgressSync() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user?.id;
  const syncingRef = useRef(false);

  const pullFromServer = useCallback(async () => {
    if (!isAuthenticated) return null;
    try {
      const res = await fetch("/api/progress");
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }, [isAuthenticated]);

  const pushToServer = useCallback(async (data) => {
    if (!isAuthenticated || syncingRef.current) return;
    syncingRef.current = true;
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {
      // Silent fail -- localStorage is the source of truth
    } finally {
      syncingRef.current = false;
    }
  }, [isAuthenticated]);

  const pushSession = useCallback(async (sessionData) => {
    if (!isAuthenticated) return;
    try {
      await fetch("/api/progress/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData),
      });
    } catch {
      // Silent fail
    }
  }, [isAuthenticated]);

  return { isAuthenticated, user: session?.user, pullFromServer, pushToServer, pushSession };
}
