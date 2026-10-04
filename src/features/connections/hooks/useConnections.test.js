import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";

vi.mock("@/services/followersApi", () => ({
  fetchFollowers: vi.fn(),
  fetchFollowing: vi.fn(),
  toggleFollow: vi.fn(),
}));
vi.mock("react-hot-toast", () => ({ default: { error: vi.fn() } }));

import { fetchFollowers, toggleFollow } from "@/services/followersApi";
import toast from "react-hot-toast";
import useConnections from "./useConnections";

const person = (id, over = {}) => ({
  _id: id,
  username: `user_${id}`,
  youFollow: false,
  followsYou: true,
  ...over,
});

const page = (rows, { hasMore = false, followers = rows.length, following = 0 } = {}) => ({
  followers: rows,
  hasMore,
  followersCount: followers,
  followingCount: following,
});

beforeEach(() => vi.clearAllMocks());

describe("useConnections", () => {
  it("loads the first page and the counts", async () => {
    fetchFollowers.mockResolvedValue(page([person("a"), person("b")], { followers: 2, following: 5 }));
    const { result } = renderHook(() => useConnections("followers"));

    expect(result.current.status).toBe("loading");
    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(result.current.items.map((u) => u._id)).toEqual(["a", "b"]);
    expect(result.current.counts).toEqual({ followers: 2, following: 5 });
    expect(fetchFollowers).toHaveBeenCalledWith(1, 20);
  });

  it("appends the next page on loadMore", async () => {
    fetchFollowers
      .mockResolvedValueOnce(page([person("a")], { hasMore: true, followers: 2 }))
      .mockResolvedValueOnce(page([person("b")], { followers: 2 }));
    const { result } = renderHook(() => useConnections("followers"));
    await waitFor(() => expect(result.current.status).toBe("ready"));

    await act(() => result.current.loadMore());
    expect(result.current.items.map((u) => u._id)).toEqual(["a", "b"]);
    expect(result.current.hasMore).toBe(false);
    expect(fetchFollowers).toHaveBeenLastCalledWith(2, 20);
  });

  it("shows an error state (not an empty list) when the first page fails", async () => {
    fetchFollowers.mockRejectedValue(new Error("offline"));
    const { result } = renderHook(() => useConnections("followers"));
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error.message).toBe("offline");
  });

  it("follows optimistically and keeps the change when the server agrees", async () => {
    fetchFollowers.mockResolvedValue(page([person("a")], { following: 0 }));
    toggleFollow.mockResolvedValue({ ok: true });
    const { result } = renderHook(() => useConnections("followers"));
    await waitFor(() => expect(result.current.status).toBe("ready"));

    await act(() => result.current.toggle(result.current.items[0]));
    expect(toggleFollow).toHaveBeenCalledWith("user_a", false);
    expect(result.current.items[0].youFollow).toBe(true);
    expect(result.current.counts.following).toBe(1);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("rolls back and tells the user when the server refuses", async () => {
    fetchFollowers.mockResolvedValue(page([person("a")], { following: 0 }));
    toggleFollow.mockResolvedValue({ ok: false });
    const { result } = renderHook(() => useConnections("followers"));
    await waitFor(() => expect(result.current.status).toBe("ready"));

    await act(() => result.current.toggle(result.current.items[0]));
    expect(result.current.items[0].youFollow).toBe(false);
    expect(result.current.counts.following).toBe(0);
    expect(toast.error).toHaveBeenCalledOnce();
    expect(result.current.isPending(result.current.items[0])).toBe(false);
  });
});
