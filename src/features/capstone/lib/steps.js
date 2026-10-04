/** The six capstone steps; `label` is the short name under each node. */
export const STEPS = [
  { num: "01", label: "Path complete" },
  { num: "02", label: "Assigned" },
  { num: "03", label: "Build & submit" },
  { num: "04", label: "In review" },
  { num: "05", label: "Approved" },
  { num: "06", label: "Certificate" },
];

/**
 * Index of the ACTIVE step, derived only from server state. Every step before
 * it is done; 6 means all done. `failed` marks the active step red.
 */
export const stepState = (status) => {
  if (!status?.eligibility?.complete) return { active: 0, failed: false };
  const s = status.attempt?.status;
  if (!s) return { active: 1, failed: false };
  if (s === "started" || s === "checking") return { active: 2, failed: false };
  if (s === "submitted" || s === "reviewing" || s === "defense")
    return { active: 3, failed: false };
  if (s === "passed") {
    const issued = status.certificate && !status.certificate.locked;
    return { active: issued ? 6 : 5, failed: false };
  }
  // failed: the review or the defense sent it back
  return { active: 3, failed: true };
};
