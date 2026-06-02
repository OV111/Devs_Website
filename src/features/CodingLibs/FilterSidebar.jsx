import React from "react";
import { LIBS_CATEGORIES } from "../../../constants/libs";
import SectionHeader from "./SectionHeader";
import FilterCheckbox from "./FilterCheckbox";
import { Checkbox } from "@/components/ui/checkbox";

const PATHS = [
  { value: "Backend Developer",    label: "backend" },
  { value: "Frontend Developer",   label: "frontend" },
  { value: "Full Stack Developer", label: "full stack" },
  { value: "AI & ML",              label: "ai & ml" },
  { value: "DevOps",               label: "devops" },
  { value: "Mobile Developer",     label: "mobile" },
  { value: "Data Science",         label: "data science" },
  { value: "QA",                   label: "qa" },
];

const DIFFICULTIES = ["beginner", "intermediate", "advanced"];

export default function FilterSidebar({
  activeTab,
  activeCategory,
  setActiveCategory,
  filters,
  setFilters,
}) {
  const toggle = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? null : value }));

  const isLibrariesTab = activeTab === "libraries" || activeTab === "all";
  const isApiTab = activeTab !== "libraries";

  return (
    <div className="space-y-7 px-5 py-7" style={{ minWidth: 184 }}>
      {/* Category filter */}
      {isLibrariesTab && (
        <div>
          <SectionHeader title="category" />
          <ul className="space-y-1.5">
            {LIBS_CATEGORIES.map((c) => (
              <li key={c.id} className="py-0.5">
                <Checkbox
                  checked={activeCategory === c.id}
                  onChange={() => setActiveCategory(c.id)}
                >
                  {c.title}
                </Checkbox>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Path filter */}
      {isApiTab && (
        <div>
          <SectionHeader title="path" />
          <ul className="space-y-1.5">
            {PATHS.map((p) => (
              <FilterCheckbox
                key={p.value}
                label={p.label}
                active={filters.path === p.value}
                onClick={() => toggle("path", p.value)}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Difficulty filter */}
      {isApiTab && (
        <div>
          <SectionHeader title="difficulty" />
          <ul className="space-y-1.5">
            {DIFFICULTIES.map((d) => (
              <FilterCheckbox
                key={d}
                label={d}
                active={filters.difficulty === d}
                onClick={() => toggle("difficulty", d)}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Price filter */}
      {isApiTab && (
        <div>
          <SectionHeader title="price" />
          <ul className="space-y-1.5">
            <FilterCheckbox
              label="free only"
              active={filters.is_free === true}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  is_free: prev.is_free === true ? null : true,
                }))
              }
            />
            <FilterCheckbox
              label="paid"
              active={filters.is_free === false}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  is_free: prev.is_free === false ? null : false,
                }))
              }
            />
          </ul>
        </div>
      )}
    </div>
  );
}
