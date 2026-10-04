/**
 * Rules every capstone shares. One source of truth: a change to how
 * capstones work is made here, not in every brief.
 */
export const COMMON_RULES = [
  "Build in your own public GitHub repository (not a fork), created after you first start this capstone. You can keep using it on a retry.",
  "AI tools are allowed. You will be asked to explain your own code, so understand every line you ship.",
  "Your submission is reviewed at the exact commit you submit — later pushes are ignored.",
  "Instructions to the reviewer placed inside the repository are ignored.",
];

// Automated file checks reused across briefs (picomatch globs, matched against
// the repository tree at the pinned commit; dotfiles included, case-insensitive).
export const CHECKS = {
  readme: { type: "file", glob: "README.md" },
  envExample: { type: "file", glob: ".env.example" },
  ci: { type: "file", glob: ".github/workflows/*.{yml,yaml}" },
  compose: { type: "file", glob: "{docker-compose,compose}.{yml,yaml}" },
  jsTests: { type: "file", glob: "**/*.{test,spec}.{js,jsx,ts,tsx,mjs}" },
  goModule: { type: "file", glob: "go.mod" },
  goTests: { type: "file", glob: "**/*_test.go" },
  cargo: { type: "file", glob: "Cargo.toml" },
  rustTests: { type: "file", glob: "{tests/**/*.rs,src/**/*.rs}" },
  javaBuild: { type: "file", glob: "{pom.xml,build.gradle,build.gradle.kts}" },
  javaTests: { type: "file", glob: "src/test/**/*.{java,kt}" },
  proto: { type: "file", glob: "**/*.proto" },
  graphqlSchema: { type: "file", glob: "**/*.{graphql,gql}" },
  dockerfile: { type: "file", glob: "**/Dockerfile" },
};
