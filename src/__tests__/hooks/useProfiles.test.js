import { renderHook, act } from "@testing-library/react";
import useProfiles from "@/hooks/useProfiles";

global.fetch = jest.fn();

describe("useProfiles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with empty profiles and loading=false", () => {
    const { result } = renderHook(() => useProfiles());
    expect(result.current.profiles).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  describe("fetchProfiles", () => {
    it("fetches and sets profiles", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ profiles: [{ id: "1", name: "דני" }] }),
      });

      const { result } = renderHook(() => useProfiles());

      await act(async () => {
        await result.current.fetchProfiles();
      });

      expect(result.current.profiles).toEqual([{ id: "1", name: "דני" }]);
      expect(result.current.loading).toBe(false);
    });

    it("handles fetch error silently", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const { result } = renderHook(() => useProfiles());

      await act(async () => {
        await result.current.fetchProfiles();
      });

      expect(result.current.profiles).toEqual([]);
      expect(result.current.loading).toBe(false);
    });

    it("handles non-ok response", async () => {
      fetch.mockResolvedValueOnce({ ok: false });

      const { result } = renderHook(() => useProfiles());

      await act(async () => {
        await result.current.fetchProfiles();
      });

      expect(result.current.profiles).toEqual([]);
    });
  });

  describe("createProfile", () => {
    it("creates profile and appends to state", async () => {
      const newProfile = { id: "2", name: "נועה", avatar: "👧" };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ profile: newProfile }),
      });

      const { result } = renderHook(() => useProfiles());
      let created;

      await act(async () => {
        created = await result.current.createProfile("נועה", "👧");
      });

      expect(created).toEqual(newProfile);
      expect(result.current.profiles).toContainEqual(newProfile);
      expect(fetch).toHaveBeenCalledWith("/api/profiles", expect.objectContaining({ method: "POST" }));
    });

    it("returns null on failure", async () => {
      fetch.mockResolvedValueOnce({ ok: false });

      const { result } = renderHook(() => useProfiles());
      let created;

      await act(async () => {
        created = await result.current.createProfile("fail", "🧒");
      });

      expect(created).toBeNull();
    });
  });

  describe("deleteProfile", () => {
    it("deletes profile and removes from state", async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ profiles: [{ id: "1", name: "א" }, { id: "2", name: "ב" }] }),
        })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

      const { result } = renderHook(() => useProfiles());

      await act(async () => {
        await result.current.fetchProfiles();
      });

      let success;
      await act(async () => {
        success = await result.current.deleteProfile("1");
      });

      expect(success).toBe(true);
      expect(result.current.profiles).toHaveLength(1);
      expect(result.current.profiles[0].id).toBe("2");
    });

    it("returns false on failure", async () => {
      fetch.mockResolvedValueOnce({ ok: false });

      const { result } = renderHook(() => useProfiles());
      let success;

      await act(async () => {
        success = await result.current.deleteProfile("1");
      });

      expect(success).toBe(false);
    });
  });
});
