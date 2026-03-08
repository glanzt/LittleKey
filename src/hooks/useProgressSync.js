"use client";

import { useSession } from "next-auth/react";
import { useCallback } from "react";

export default function useProgressSync(profileId) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user?.id;
  const canSync = isAuthenticated && !!profileId;

  const pullFromServer = useCallback(async () => {
    if (!canSync) return null;
    try {
      const res = await fetch("/api/progress?profileId=" + encodeURIComponent(profileId));
      if (!res.ok) {
        console.warn("[sync] pull failed:", res.status, await res.text().catch(() => ""));
        return null;
      }
      return await res.json();
    } catch (err) {
      console.warn("[sync] pull error:", err);
      return null;
    }
  }, [canSync, profileId]);

  const pushToServer = useCallback(async (data) => {
    if (!canSync) return;
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, profileId }),
      });
      if (!res.ok) {
        console.warn("[sync] push failed:", res.status, await res.text().catch(() => ""));
      }
    } catch (err) {
      console.warn("[sync] push error:", err);
    }
  }, [canSync, profileId]);

  const pushSession = useCallback(async (sessionData) => {
    if (!canSync) return;
    try {
      const res = await fetch("/api/progress/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...sessionData, profileId }),
      });
      if (!res.ok) {
        console.warn("[sync] session push failed:", res.status, await res.text().catch(() => ""));
      }
    } catch (err) {
      console.warn("[sync] session push error:", err);
    }
  }, [canSync, profileId]);

  return { isAuthenticated, canSync, user: session?.user, pullFromServer, pushToServer, pushSession };
}
