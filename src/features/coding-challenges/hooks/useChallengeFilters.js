import { useState } from "react";
import { TIME_RANGES } from "../lib/timeRanges";
import { STATUS_OPTIONS } from "../lib/statuses";

// The filter UI speaks in layer *numbers* ("3", "4+"); the API stores layer
// *ids* ("api-dev-3"). Pull the trailing number off the slug to compare.
const layerNumber = (layerId) => parseInt(layerId?.split("-").pop(), 10);

/**
 * Owns all challenge-catalog filter state and derives the filtered list.
 * Filtering stays client-side — see useChallengeStore for why.
 */
export default function useChallengeFilters(challenges) {
  const [activePath, setActivePath] = useState("all");
  // "all" by default — a hardcoded layer number silently hid every challenge
  // outside it. Defaulting to the user's actual active path/layer is a
  // separate, real personalization feature, not this fix.
  const [activeLayer, setActiveLayer] = useState("all");
  const [activeType, setActiveType] = useState("all");
  const [activeLevel, setActiveLevel] = useState("all");
  const [recommended, setRecommended] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [timeRange, setTimeRange] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleTopicFilter = (label) =>
    setSelectedTopics((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label],
    );

  const toggleStatusFilter = (key) =>
    setSelectedStatuses((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key],
    );

  const clearMoreFilters = () => {
    setSelectedTopics([]);
    setTimeRange(null);
    setSelectedStatuses([]);
  };

  const filteredChallenges = challenges.filter((c) => {
    if (activePath !== "all" && c.trackId !== activePath) return false;

    if (activeLayer !== "all") {
      const n = layerNumber(c.layerId);
      if (activeLayer === "4+") {
        if (!(n >= 4)) return false;
      } else if (String(n) !== activeLayer) return false;
    }

    if (activeType !== "all" && c.type.toLowerCase() !== activeType)
      return false;
    if (activeLevel !== "all" && c.difficulty !== activeLevel) return false;
    if (recommended && !c.hot) return false;

    if (
      selectedTopics.length > 0 &&
      !selectedTopics.some((t) => (c.tags ?? []).includes(t))
    )
      return false;

    if (timeRange) {
      const range = TIME_RANGES.find((r) => r.key === timeRange);
      if (range && !range.test(c.estimatedMins)) return false;
    }

    // Statuses are OR'd against each other: picking two means "either", which
    // is what a set of checkboxes reads as. AND would always be empty.
    if (
      selectedStatuses.length > 0 &&
      !selectedStatuses.some((key) =>
        STATUS_OPTIONS.find((s) => s.key === key)?.test(c),
      )
    )
      return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !c.title.toLowerCase().includes(q) &&
        !(c.summary ?? "").toLowerCase().includes(q) &&
        !(c.tags ?? []).some((t) => t.toLowerCase().includes(q))
      )
        return false;
    }

    return true;
  });

  return {
    filteredChallenges,
    activePath,
    setActivePath,
    activeLayer,
    setActiveLayer,
    activeType,
    setActiveType,
    activeLevel,
    setActiveLevel,
    recommended,
    setRecommended,
    selectedTopics,
    toggleTopicFilter,
    timeRange,
    setTimeRange,
    selectedStatuses,
    toggleStatusFilter,
    clearMoreFilters,
    searchQuery,
    setSearchQuery,
  };
}
