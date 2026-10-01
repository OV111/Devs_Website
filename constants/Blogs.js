// `value` is what's stored on the post (see CATEGORIES in addBlog.js);
// `label` is the short name shown in the filter.
export const BLOG_TOPICS = [
  { label: "Full Stack", value: "Full Stack Development" },
  { label: "Backend", value: "Backend Development" },
  { label: "Frontend", value: "Frontend Development" },
  { label: "Mobile", value: "Mobile Development" },
  { label: "AI & ML", value: "ML & AI" },
  { label: "DevOps", value: "DevOps" },
  { label: "Data Science", value: "Data Science" },
  { label: "Game Dev", value: "Game Development" },
  { label: "QA", value: "Quality Assurance" },
];

// One ordering control. The old "Latest / Popular / Trending" tabs duplicated
// these and fought with them on the server (sort || filter).
export const SORT_OPTIONS = ["Newest", "Popular", "Most Viewed", "Oldest"];

export const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

export const READ_TIMES = ["< 5 min", "5–10 min", "10+ min"];
