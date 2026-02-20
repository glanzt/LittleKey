import { renderHook, act } from "@testing-library/react";
import useProgressSync from "@/hooks/useProgressSync";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

const { useSession } = require("next-auth/react");

global.fetch = jest.fn();

describe("useProgressSync", () => {
  beforeEach(() => jest.clearAllMocks());

  function mockSession(status, user = null) {
    useSession.mockReturnValue({
      data: user ? { user } : null,
      status,
    });
  }

  it("returns canSync=false when no profileId", () => {
    mockSession("authenticated", { id: "user-1" });
    const { result } = renderHook(() => useProgressSync(null));
    expect(result.current.canSync).toBe(false);
  });

  it("returns canSync=true when authenticated with profileId", () => {
    mockSession("authenticated", { id: "user-1" });
    const { result } = renderHook(() => useProgressSync("p1"));
    expect(result.current.canSync).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("returns canSync=false when not authenticated", () => {
    mockSession("unauthenticated");
    const { result } = renderHook(() => useProgressSync("p1"));
    expect(result.current.canSync).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("returns user object when authenticated", () => {
    mockSession("authenticated", { id: "u1", email: "a@b.com" });
    const { result } = renderHook(() => useProgressSync("p1"));
    expect(result.current.user).toEqual({ id: "u1", email: "a@b.com" });
  });

  describe("pullFromServer", () => {
    it("fetches progress from server", async () => {
      mockSession("authenticated", { id: "user-1" });
      const progressData = { settings: { sessionLength: 10 }, letterStats: {} };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(progressData),
      });

      const { result } = renderHook(() => useProgressSync("p1"));

      let data;
      await act(async () => {
        data = await result.current.pullFromServer();
      });

      expect(data).toEqual(progressData);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/api/progress?profileId=p1"));
    });

    it("returns null when canSync is false", async () => {
      mockSession("authenticated", { id: "user-1" });
      const { result } = renderHook(() => useProgressSync(null));

      let data;
      await act(async () => {
        data = await result.current.pullFromServer();
      });

      expect(data).toBeNull();
      expect(fetch).not.toHaveBeenCalled();
    });

    it("returns null on fetch error", async () => {
      mockSession("authenticated", { id: "user-1" });
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const { result } = renderHook(() => useProgressSync("p1"));

      let data;
      await act(async () => {
        data = await result.current.pullFromServer();
      });

      expect(data).toBeNull();
    });

    it("returns null on non-ok response", async () => {
      mockSession("authenticated", { id: "user-1" });
      fetch.mockResolvedValueOnce({ ok: false });

      const { result } = renderHook(() => useProgressSync("p1"));

      let data;
      await act(async () => {
        data = await result.current.pullFromServer();
      });

      expect(data).toBeNull();
    });
  });

  describe("pushToServer", () => {
    it("sends progress data to server", async () => {
      mockSession("authenticated", { id: "user-1" });
      fetch.mockResolvedValueOnce({ ok: true });

      const { result } = renderHook(() => useProgressSync("p1"));

      await act(async () => {
        await result.current.pushToServer({ settings: { sessionLength: 20 } });
      });

      expect(fetch).toHaveBeenCalledWith("/api/progress", expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("p1"),
      }));
    });

    it("does nothing when canSync is false", async () => {
      mockSession("authenticated", { id: "user-1" });
      const { result } = renderHook(() => useProgressSync(null));

      await act(async () => {
        await result.current.pushToServer({ settings: {} });
      });

      expect(fetch).not.toHaveBeenCalled();
    });

    it("handles push error silently", async () => {
      mockSession("authenticated", { id: "user-1" });
      fetch.mockRejectedValueOnce(new Error("fail"));

      const { result } = renderHook(() => useProgressSync("p1"));

      await act(async () => {
        await result.current.pushToServer({ settings: {} });
      });

      expect(fetch).toHaveBeenCalled();
    });
  });

  describe("pushSession", () => {
    it("sends session data to server", async () => {
      mockSession("authenticated", { id: "user-1" });
      fetch.mockResolvedValueOnce({ ok: true });

      const { result } = renderHook(() => useProgressSync("p1"));

      await act(async () => {
        await result.current.pushSession({ totalQuestions: 10, accuracy: 0.9 });
      });

      expect(fetch).toHaveBeenCalledWith("/api/progress/session", expect.objectContaining({
        method: "POST",
      }));
    });

    it("does nothing when canSync is false", async () => {
      mockSession("unauthenticated");
      const { result } = renderHook(() => useProgressSync("p1"));

      await act(async () => {
        await result.current.pushSession({ totalQuestions: 5 });
      });

      expect(fetch).not.toHaveBeenCalled();
    });
  });
});
