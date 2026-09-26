import { useState } from "react";
import { Search, X } from "lucide-react";
import FilterGroup from "./FilterGroup";
import MoreFiltersPopover from "./MoreFiltersPopover";

const Divider = () => <div className="hidden sm:block w-px h-4 bg-[#1f1f1f]" />;

/** Sticky toolbar: Path / Layer / Type / Level, recommended, more filters, search. */
export default function FilterBar({ filters, topics }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const openMenu = (name) => setOpenDropdown(name);
  const closeMenu = () => setOpenDropdown(null);

  const {
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
  } = filters;

  return (
    <div className="sticky top-[var(--navbar-h)] z-30 px-6 sm:px-10 lg:px-14 py-3 flex flex-wrap items-center gap-3 backdrop-blur-sm border-b border-[#1a1a1a]">
      <FilterGroup
        label="Path"
        options={["backend", "frontend", "ai/ml", "devops", "all"]}
        active={activePath}
        onSelect={setActivePath}
        isOpen={openDropdown === "path"}
        onOpen={() => openMenu("path")}
        onClose={closeMenu}
      />
      <Divider />
      <FilterGroup
        label="LAYER"
        options={["all", "1", "2", "3", "4+"]}
        active={activeLayer}
        onSelect={setActiveLayer}
        isOpen={openDropdown === "layer"}
        onOpen={() => openMenu("layer")}
        onClose={closeMenu}
      />
      <Divider />
      <FilterGroup
        label="Type"
        options={["all", "code", "debug", "build", "design"]}
        active={activeType}
        onSelect={setActiveType}
        isOpen={openDropdown === "type"}
        onOpen={() => openMenu("type")}
        onClose={closeMenu}
      />
      <Divider /> 
      <FilterGroup
        label="Level"
        options={["all", "easy", "med", "hard"]}
        active={activeLevel}
        onSelect={setActiveLevel}
        isOpen={openDropdown === "level"}
        onOpen={() => openMenu("level")}
        onClose={closeMenu}
      />
      <Divider />
      <button
        onClick={() => setRecommended(!recommended)}
        className={`cursor-pointer whitespace-nowrap rounded-md border px-2.5 py-1.5 text-xs font-medium transition-all duration-200 ${
          recommended
            ? "border-purple-600 bg-purple-600 text-white"
            : "border-[#1f1f1f] bg-[#141414] text-[#888] hover:border-purple-900/60 hover:bg-purple-950/40 hover:text-purple-300"
        }`}
      >
        + recommended
      </button>
      <Divider />
      <MoreFiltersPopover
        topics={topics}
        selectedTopics={selectedTopics}
        onToggleTopic={toggleTopicFilter}
        timeRange={timeRange}
        onSelectTimeRange={setTimeRange}
        selectedStatuses={selectedStatuses}
        onToggleStatus={toggleStatusFilter}
        onClear={clearMoreFilters}
        activeCount={
          selectedTopics.length +
          selectedStatuses.length +
          (timeRange ? 1 : 0)
        }
      />

      <div className="ml-auto flex items-center gap-2 rounded-md border border-[#1f1f1f] bg-[#141414] px-3 py-2">
        <Search className="h-3.5 w-3.5 shrink-0 text-[#555]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search challenges..."
          className="min-w-0 w-[220px] bg-transparent text-sm text-[#e5e5e5] placeholder-[#555] outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="shrink-0 text-[#555] hover:text-[#888]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
