"use client";

import { useSession } from "next-auth/react";
import { useCallback, useRef } from "react";

export default function useProgressSync(profileId) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user?.id;
  const canSync = isAuthenticated && !!profileId;
  const syncingRef = useRef(false);

  const pullFromServer = useCallback(async () => {
    if (!canSync) return null;
    try {
      const res = await fetch("/api/progress?profileId=" + encodeURIComponent(profileId));
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }, [canSync, profileId]);

  const pushToServer = useCallback(async (data) => {
    if (!canSync || syncingRef.current) return;
    syncingRef.current = true;
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, profileId }),
      });
    } catch {
      // Silent fail -- localStorage is the source of truth
    } finally {
      syncingRef.current = false;
    }
  }, [canSync, profileId]);

  const pushSession = useCallback(async (sessionData) => {
    if (!canSync) return;
    try {
      await fetch("/api/progress/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...sessionData, profileId }),
      });
    } catch {
      // Silent fail
    }
  }, [canSync, profileId]);

  return { isAuthenticated, canSync, user: session?.user, pullFromServer, pushToServer, pushSession };
}
