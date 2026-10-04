/**
 * Every capstone brief, checked for the mistakes that would only show up when
 * a learner hits them: a rubric that does not sum to 100, duplicate ids, a
 * layer from another track, or a file check that a correct project can never
 * pass.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { briefs } from "../../seeders/capstones/index.js";
import { evaluateSubmission } from "../../modules/capstone/lib/autoChecks.js";

const roadmap = (file) =>
  JSON.parse(
    readFileSync(
      new URL(`../../../src/data/roadmaps/${file}.json`, import.meta.url),
      "utf8",
    ),
  );

// A realistic, correct project layout per track: every automated check must pass on it.
const LAYOUTS = {
  "api-dev": [
    "README.md",
    ".env.example",
    "docker-compose.yml",
    ".github/workflows/ci.yml",
    "src/app.js",
    "tests/notes.test.js",
  ],
  "node-dev": [
    "README.md",
    ".env.example",
    "compose.yaml",
    ".github/workflows/ci.yml",
    "prisma/schema.prisma",
    "src/server.ts",
    "test/links.test.ts",
  ],
  "python-backend": [
    "README.md",
    ".env.example",
    "docker-compose.yml",
    ".github/workflows/test.yml",
    "pyproject.toml",
    "app/main.py",
    "tests/test_booking.py",
  ],
  "db-engineer": [
    "README.md",
    "docker-compose.yml",
    ".github/workflows/ci.yml",
    "db/migrations/001_init.sql",
    "queries/revenue.sql",
    "tests/constraints.sql",
  ],
  "go-dev": [
    "README.md",
    "go.mod",
    "docker-compose.yml",
    ".github/workflows/ci.yml",
    "cmd/api/main.go",
    "internal/stock/reserve_test.go",
  ],
  "rust-dev": [
    "README.md",
    "Cargo.toml",
    "compose.yaml",
    ".github/workflows/ci.yml",
    "src/main.rs",
    "tests/api.rs",
  ],
  "java-spring": [
    "README.md",
    "pom.xml",
    "docker-compose.yml",
    ".github/workflows/ci.yml",
    "src/main/java/app/LoanService.java",
    "src/test/java/app/LoanServiceTest.java",
  ],
  "graphql-dev": [
    "README.md",
    ".env.example",
    "docker-compose.yml",
    ".github/workflows/ci.yml",
    "src/schema.graphql",
    "src/resolvers.ts",
    "test/recipes.test.ts",
  ],
  "grpc-dev": [
    "README.md",
    "buf.yaml",
    "docker-compose.yml",
    ".github/workflows/ci.yml",
    "proto/ride/v1/ride.proto",
    "server/main.go",
  ],
  microservices: [
    "README.md",
    "docker-compose.yml",
    ".github/workflows/ci.yml",
    "orders/Dockerfile",
    "payments/Dockerfile",
    "orders/src/app.js",
  ],
  "security-dev": [
    "README.md",
    "THREAT_MODEL.md",
    ".env.example",
    "docker-compose.yml",
    ".github/workflows/security.yml",
    "src/app.py",
    "tests/test_idor.py",
  ],
  "systems-dev": [
    "README.md",
    "CMakeLists.txt",
    ".github/workflows/ci.yml",
    "src/server.c",
    "tests/test_protocol.c",
  ],
  pern: [
    "README.md",
    ".github/workflows/ci.yml",
    "client/src/App.jsx",
    "server/src/app.js",
    "server/tests/expenses.test.js",
    "prisma/schema.prisma",
  ],
  t3: [
    "README.md",
    ".github/workflows/ci.yml",
    "src/pages/index.tsx",
    "src/server/api/routers/book.ts",
    "src/server/api/book.test.ts",
    "prisma/schema.prisma",
  ],
  "fullstack-engineer": [
    "README.md",
    "docker-compose.yml",
    ".github/workflows/ci.yml",
    "web/src/App.jsx",
    "api/src/app.js",
    "api/tests/tickets.test.js",
    "e2e/ticket.spec.ts",
  ],
  mean: [
    "README.md",
    ".github/workflows/ci.yml",
    "client/src/app/app.component.ts",
    "client/src/app/events/events.service.spec.ts",
    "server/src/app.js",
  ],
  jamstack: [
    "README.md",
    ".github/workflows/ci.yml",
    "src/pages/index.jsx",
    "src/templates/session.jsx",
    "netlify/functions/attendee.js",
    "src/__tests__/session.test.jsx",
  ],
  "django-react": [
    "README.md",
    ".github/workflows/ci.yml",
    "backend/manage.py",
    "backend/recipes/tests.py",
    "frontend/src/App.jsx",
    "frontend/src/App.test.jsx",
  ],
  "rails-dev": [
    "README.md",
    ".github/workflows/ci.yml",
    "Gemfile",
    "app/models/opportunity.rb",
    "spec/models/opportunity_spec.rb",
    "spec/requests/applications_spec.rb",
  ],
  "next-fullstack": [
    "README.md",
    ".github/workflows/ci.yml",
    "app/page.tsx",
    "app/invoices/actions.ts",
    "tests/invoice-total.test.ts",
    "e2e/invoice.spec.ts",
  ],
  "sveltekit-dev": [
    "README.md",
    ".github/workflows/ci.yml",
    "src/routes/+page.svelte",
    "src/routes/habits/+page.server.ts",
    "src/lib/validation.test.ts",
    "tests/habit.spec.ts",
  ],
  "nuxt-dev": [
    "README.md",
    ".github/workflows/ci.yml",
    "app.vue",
    "pages/trips/[id].vue",
    "server/api/trips/index.get.ts",
    "tests/trips.test.ts",
  ],
  "astro-dev": [
    "README.md",
    ".github/workflows/ci.yml",
    "src/pages/docs/[...slug].astro",
    "src/content/config.ts",
    "src/lib/toc.test.ts",
    "tests/navigation.spec.ts",
  ],
  "laravel-vue": [
    "README.md",
    ".github/workflows/ci.yml",
    "app/Models/MaintenanceRequest.php",
    "tests/Feature/RequestWorkflowTest.php",
    "resources/js/App.vue",
  ],
  "remix-dev": [
    "README.md",
    ".github/workflows/ci.yml",
    "app/routes/workshops.$id.tsx",
    "app/models/booking.server.ts",
    "app/models/booking.test.ts",
    "e2e/booking.spec.ts",
  ],
  "smart-contract": [
    "README.md",
    "foundry.toml",
    ".github/workflows/ci.yml",
    "src/Escrow.sol",
    "test/Escrow.t.sol",
  ],
  "ethereum-dev": [
    "README.md",
    "hardhat.config.ts",
    ".github/workflows/ci.yml",
    "contracts/Emitter.sol",
    "src/indexer.ts",
    "test/indexer.test.ts",
  ],
  "solana-dev": [
    "README.md",
    "Anchor.toml",
    ".github/workflows/ci.yml",
    "programs/treasury/src/lib.rs",
    "tests/treasury.ts",
  ],
  "blockchain-core": [
    "README.md",
    "Cargo.toml",
    ".github/workflows/ci.yml",
    "src/main.rs",
    "tests/chain.rs",
  ],
  "blockchain-security": [
    "README.md",
    "foundry.toml",
    ".github/workflows/ci.yml",
    "AUDIT.md",
    "src/Vault.sol",
    "test/Vault.t.sol",
  ],
  "chain-architect": [
    "README.md",
    "go.mod",
    ".github/workflows/ci.yml",
    "proto/app/v1/state.proto",
    "x/app/module.go",
    "x/app/keeper/keeper_test.go",
  ],
  "bitcoin-dev": [
    "README.md",
    ".env.example",
    ".github/workflows/ci.yml",
    "src/vault.js",
    "test/vault.test.js",
  ],
  "cosmos-dev": [
    "README.md",
    "go.mod",
    ".github/workflows/ci.yml",
    "proto/grants/v1/query.proto",
    "x/grants/module.go",
    "x/grants/keeper/keeper_test.go",
  ],
  "move-developer": [
    "README.md",
    ".github/workflows/ci.yml",
    "Move.toml",
    "sources/membership.move",
    "tests/membership_tests.move",
  ],
  "layer2-dev": [
    "README.md",
    ".env.example",
    ".github/workflows/ci.yml",
    "script/Deploy.s.sol",
    "test/Escrow.t.sol",
    "app/page.tsx",
  ],
  mern: [
    "README.md",
    ".env.example",
    ".github/workflows/ci.yml",
    "client/src/App.jsx",
    "server/src/app.js",
    "server/tests/boards.test.js",
  ],
  "react-native": [
    "README.md",
    "app.json",
    ".github/workflows/ci.yml",
    "App.tsx",
    "src/screens/Home.tsx",
    "__tests__/App.test.tsx",
  ],
  flutter: [
    "README.md",
    "pubspec.yaml",
    ".github/workflows/ci.yml",
    "lib/main.dart",
    "lib/screens/home.dart",
    "test/home_test.dart",
  ],
  ios: [
    "README.md",
    "Package.swift",
    ".github/workflows/ci.yml",
    "Sources/App/App.swift",
    "Sources/App/RecipeStore.swift",
    "Tests/AppTests/RecipeTests.swift",
  ],
  android: [
    "README.md",
    "app/src/main/AndroidManifest.xml",
    ".github/workflows/ci.yml",
    "app/src/main/java/app/MainActivity.kt",
    "app/src/test/java/app/PantryTest.kt",
  ],
  "kotlin-dev": [
    "README.md",
    "build.gradle.kts",
    ".github/workflows/ci.yml",
    "src/main/kotlin/App.kt",
    "src/test/kotlin/AppTest.kt",
  ],
  "swift-dev": [
    "README.md",
    "Package.swift",
    ".github/workflows/ci.yml",
    "Sources/App/App.swift",
    "Tests/AppTests/HabitTests.swift",
  ],
  maui: [
    "README.md",
    "App.csproj",
    ".github/workflows/ci.yml",
    "Views/MainPage.xaml",
    "ViewModels/JobViewModel.cs",
    "Tests/JobViewModelTests.cs",
  ],
  "pwa-dev": [
    "README.md",
    "manifest.json",
    "service-worker.js",
    ".github/workflows/ci.yml",
    "src/app.js",
    "test/app.test.js",
  ],
  ionic: [
    "README.md",
    ".github/workflows/ci.yml",
    "src/app/home/home.page.ts",
    "src/app/home/home.page.spec.ts",
  ],
};

describe.each(briefs.map((b) => [b.trackId, b]))(
  "capstone brief %s",
  (trackId, brief) => {
    const categoryLayers = roadmap(brief.categoryId)[trackId];

    it("belongs to a real track in its category", () => {
      expect(categoryLayers?.length).toBeGreaterThan(0);
    });

    it("has a rubric that sums to 100, with unique ids, each mapped to a layer of this track", () => {
      const layerIds = new Set(categoryLayers.map((l) => l.id));
      expect(brief.rubric.reduce((s, c) => s + c.weight, 0)).toBe(100);
      expect(new Set(brief.rubric.map((c) => c.id)).size).toBe(
        brief.rubric.length,
      );
      for (const c of brief.rubric)
        expect(layerIds.has(c.layerId), `${c.id} → ${c.layerId}`).toBe(true);
    });

    it("has unique requirement ids and four unique twists", () => {
      expect(new Set(brief.requirements.map((r) => r.id)).size).toBe(
        brief.requirements.length,
      );
      expect(brief.twistPool).toHaveLength(4);
      expect(new Set(brief.twistPool.map((t) => t.id)).size).toBe(4);
    });

    it("is never published without a human review", () => {
      expect(["draft", "published"]).toContain(brief.status);
      if (brief.status === "published") expect(brief.reviewed).toBe(true);
    });

    // A newly pasted brief has no layout yet: the other rules still run on it,
    // and its layout is added during review.
    it.skipIf(!LAYOUTS[trackId])(
      "passes every automated check on a correct project layout",
      () => {
        const result = evaluateSubmission({
          repo: {
            id: 1,
            private: false,
            fork: false,
            sizeKb: 100,
            createdAt: new Date("2026-10-05T00:00:00Z"),
          },
          head: { sha: "a", treeSha: "b" },
          stats: {
            count: 20,
            rootCommittedAt: new Date("2026-10-05T00:01:00Z"),
          },
          tree: { truncated: false, paths: LAYOUTS[trackId] },
          firstStartedAt: new Date("2026-10-04T00:00:00Z"),
          repoUsedByOtherUser: false,
          treeSeenFromOtherUser: false,
          requirements: brief.requirements,
        });
        expect(result.checks.filter((c) => !c.passed)).toEqual([]);
      },
    );
  },
);

it("has one brief per track with unique slugs", () => {
  expect(new Set(briefs.map((b) => b.trackId)).size).toBe(briefs.length);
  expect(new Set(briefs.map((b) => b.slug)).size).toBe(briefs.length);
});
