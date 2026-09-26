/** "Estimated time" buckets offered in the More Filters popover. */
export const TIME_RANGES = [
  { key: "under15", label: "< 15 min", test: (m) => m < 15 },
  { key: "15to30", label: "15 – 30 min", test: (m) => m >= 15 && m <= 30 },
  { key: "30to60", label: "30 – 60 min", test: (m) => m > 30 && m <= 60 },
  { key: "60plus", label: "60+ min", test: (m) => m > 60 },
];
