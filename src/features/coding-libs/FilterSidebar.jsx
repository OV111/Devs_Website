import React from "react";
import { LIBS_CATEGORIES } from "../../../constants/libs";
import SectionHeader from "./SectionHeader";
import FilterCheckbox from "./FilterCheckbox";

const PATHS = [
  { value: "Backend Developer", label: "Backend" },
  { value: "Frontend Developer", label: "Frontend" },
  { value: "Full Stack Developer", label: "Full stack" },
  { value: "AI & ML", label: "AI & ML" },
  { value: "DevOps", label: "DevOps" },
  { value: "Mobile Developer", label: "Mobile" },
  { value: "Data Science", label: "Data science" },
  { value: "QA", label: "QA" },
];

const DIFFICULTIES = ["beginner", "intermediate", "advanced"];

export default function FilterSidebar({ activeTab, activeCategory, setActiveCategory, filters, setFilters }) {
  const toggleFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? null : value }));

  // The packages tab filters by category (static data); every other tab uses the API filters.
  const isLibrariesTab = activeTab === "libraries";

  return (
    <div className="space-y-7 px-5 py-6">
      {isLibrariesTab ? (
        <div>
          <SectionHeader title="Category" as="h3" />
          <ul className="space-y-1.5">
            {LIBS_CATEGORIES.map((c) => (
              <FilterCheckbox
                key={c.id}
                label={c.title}
                active={activeCategory === c.id}
                onClick={() => setActiveCategory(c.id)}
              />
            ))}
          </ul>
        </div>
      ) : (
        <>
          <div>
            <SectionHeader title="Learning path" as="h3" />
            <ul className="space-y-1.5">
              {PATHS.map((p) => (
                <FilterCheckbox
                  key={p.value}
                  label={p.label}
                  active={filters.path === p.value}
                  onClick={() => toggleFilter("path", p.value)}
                />
              ))}
            </ul>
          </div>

          <div>
            <SectionHeader title="Difficulty" as="h3" />
            <ul className="space-y-1.5">
              {DIFFICULTIES.map((d) => (
                <FilterCheckbox
                  key={d}
                  label={d[0].toUpperCase() + d.slice(1)}
                  active={filters.difficulty === d}
                  onClick={() => toggleFilter("difficulty", d)}
                />
              ))}
            </ul>
          </div>

          <div>
            <SectionHeader title="Price" as="h3" />
            <ul className="space-y-1.5">
              <FilterCheckbox
                label="Free only"
                active={filters.is_free === true}
                onClick={() => toggleFilter("is_free", true)}
              />
              <FilterCheckbox
                label="Paid"
                active={filters.is_free === false}
                onClick={() => toggleFilter("is_free", false)}
              />
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
