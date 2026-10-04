import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";

vi.mock("@/features/capstone/capstoneApi", () => ({
  capstoneApi: { overview: vi.fn(), certificates: vi.fn() },
}));
vi.mock("@/services/profileApi", () => ({
  fetchExamHistory: vi.fn(),
  fetchChallengeStats: vi.fn(),
}));

import { capstoneApi } from "@/features/capstone/capstoneApi";
import { fetchChallengeStats, fetchExamHistory } from "@/services/profileApi";
import useProfileProgress from "./useProfileProgress";

beforeEach(() => {
  vi.clearAllMocks();
  capstoneApi.overview.mockResolvedValue([{ trackId: "api-dev" }]);
  capstoneApi.certificates.mockResolvedValue([]);
  fetchExamHistory.mockResolvedValue([{ _id: "e1" }]);
  fetchChallengeStats.mockResolvedValue({ solved: 1 });
});

const allSettled = (result) =>
  ["tracks", "challenges", "certificates", "exams"].every(
    (k) => result.current[k].status !== "loading",
  );

describe("useProfileProgress", () => {
  it("loads every section", async () => {
    const { result } = renderHook(() => useProfileProgress());
    await waitFor(() => expect(allSettled(result)).toBe(true));

    expect(result.current.tracks).toMatchObject({ status: "ready", data: [{ trackId: "api-dev" }] });
    expect(result.current.challenges.data).toEqual({ solved: 1 });
    expect(result.current.exams.data).toEqual([{ _id: "e1" }]);
  });

  it("one failing section does not break the others", async () => {
    fetchExamHistory.mockRejectedValue(new Error("exams down"));
    const { result } = renderHook(() => useProfileProgress());
    await waitFor(() => expect(allSettled(result)).toBe(true));

    expect(result.current.exams).toMatchObject({ status: "error", data: null });
    expect(result.current.exams.error.message).toBe("exams down");
    expect(result.current.tracks.status).toBe("ready");
    expect(result.current.challenges.status).toBe("ready");
  });

  it("reload retries only the section asked for", async () => {
    fetchExamHistory.mockRejectedValueOnce(new Error("blip"));
    const { result } = renderHook(() => useProfileProgress());
    await waitFor(() => expect(result.current.exams.status).toBe("error"));

    await act(() => result.current.reload("exams"));
    expect(result.current.exams.status).toBe("ready");
    expect(fetchExamHistory).toHaveBeenCalledTimes(2);
    expect(capstoneApi.overview).toHaveBeenCalledTimes(1);
  });
});
