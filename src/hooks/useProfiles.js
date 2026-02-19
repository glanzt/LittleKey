"use client";

import { useState, useCallback } from "react";

export default function useProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profiles");
      if (!res.ok) return [];
      const data = await res.json();
      const list = data.profiles || [];
      setProfiles(list);
      return list;
    } catch {
      // Silent fail
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createProfile = useCallback(async (name, avatar) => {
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, avatar }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      setProfiles((prev) => [...prev, data.profile]);
      return data.profile;
    } catch {
      return null;
    }
  }, []);

  const deleteProfile = useCallback(async (id) => {
    try {
      const res = await fetch("/api/profiles/" + id, { method: "DELETE" });
      if (!res.ok) return false;
      setProfiles((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch {
      return false;
    }
  }, []);

  return { profiles, loading, fetchProfiles, createProfile, deleteProfile };
}
