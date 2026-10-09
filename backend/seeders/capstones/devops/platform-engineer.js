/**
 * Capstone brief — platform-engineer track (platform-engineer), v1.
 *
 * DRAFT by ChatGPT, 2026-10-08 — status stays "draft" until a human has read
 * every requirement, rubric line and twist. The seeder refuses to publish a
 * brief whose `reviewed` flag is false.
 *
 * Shape notes:
 * - requirements[].check is for the stage-2 automated checks. `file` is a glob
 *   matched against the repo tree at the pinned commit. Requirements without a
 *   check are judged only by the AI rubric review.
 * - rubric[].weight values sum to 100. rubric[].layerId maps a weak criterion
 *   back to the roadmap layer that teaches it, for weak-spot tracking.
 * - Bump `version` for any change that affects grading; never edit a
 *   published version in place (attempts point at the exact brief document).
 */

import { DEFAULT_PASS_THRESHOLDS } from "../../../modules/capstone/lib/constants.js";
import { CHECKS, COMMON_RULES, NO_LIVE_ACCOUNT_RULE } from "../shared.js";

export default {
  trackId: "platform-engineer",
  categoryId: "devops",
  slug: "platform-engineer-backstage-crossplane-idp",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Internal Developer Platform with Backstage, Crossplane, and GitOps",
  summary:
    "Construct an Internal Developer Platform (IDP) enabling self-service infrastructure and service scaffolding. " +
    "You will integrate Backstage software catalog templates, Crossplane custom resource abstractions, " +
    "ArgoCD App-of-Apps GitOps delivery, OPA admission guardrails, and golden signal dashboards.",
  stack: [
    "Backstage",
    "Crossplane",
    "ArgoCD",
    "Kubernetes",
    "Helm",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "backstage-catalog",
      text: "Backstage configuration catalog defines software entity models, component relationships, and TechDocs specs.",
      check: { type: "file", glob: "catalog-info.yaml" },
    },
    {
      id: "software-templates",
      text: "Backstage Software Templates scaffold golden-path microservices complete with CI/CD workflows and Dockerfiles.",
      check: { type: "file", glob: "templates/**/template.yaml" },
    },
    {
      id: "crossplane-compositions",
      text: "Crossplane Compositions and Custom Resource Definitions (XRDs) abstract infrastructure provisioning for developers.",
      check: { type: "file", glob: "crossplane/**/*.yaml" },
    },
    {
      id: "argocd-app-of-apps",
      text: "ArgoCD App-of-Apps pattern orchestrates platform component releases and tenant workload deployments declaratively.",
      check: { type: "file", glob: "gitops/**/app-of-apps.yaml" },
    },
    {
      id: "helm-golden-path",
      text: "A standardized Helm chart acts as a golden-path base template for all self-serviced application workloads.",
      check: { type: "file", glob: "charts/**/Chart.yaml" },
    },
    {
      id: "opa-guardrails",
      text: "Policy-as-code rules reject non-compliant self-service requests missing required tags or exceeding resource limits.",
      check: { type: "file", glob: "policies/*.rego" },
    },
    {
      id: "golden-signals-dashboard",
      text: "Grafana dashboard templates visualize platform-wide golden signals and self-service adoption metrics.",
      check: { type: "file", glob: "dashboards/*.json" },
    },
    {
      id: "docker-compose",
      text: "Docker Compose boots local development environment with Backstage, kind cluster scripts, and mock GitOps repo.",
      check: CHECKS.compose,
    },
    {
      id: "ci-validation",
      text: "GitHub Actions workflow validates template syntax, runs rego policy tests, and lints Helm charts on pull requests.",
      check: CHECKS.ci,
    },
    {
      id: "readme",
      text: "README documents platform architecture, developer onboarding onboarding guide, and self-service provisioning workflow.",
      check: CHECKS.readme,
    },
  ],

  rubric: [
    {
      id: "developer-portal",
      name: "Developer Portal & Scaffolding",
      weight: 25,
      layerId: "platform-engineer-5",
      description:
        "Effective Backstage catalog setup and fully working software templates producing golden-path microservices.",
    },
    {
      id: "self-service-apis",
      name: "Self-Service APIs & Operators",
      weight: 20,
      layerId: "platform-engineer-7",
      description:
        "Clean Crossplane compositions hiding infrastructure complexity behind developer-friendly abstractions.",
    },
    {
      id: "gitops-delivery",
      name: "GitOps Platform Delivery",
      weight: 20,
      layerId: "platform-engineer-6",
      description:
        "Robust App-of-Apps pattern implementation in ArgoCD handling multi-tenant workload propagation.",
    },
    {
      id: "governance-security",
      name: "Policy, Guardrails & RBAC",
      weight: 15,
      layerId: "platform-engineer-9",
      description:
        "Enforcement of OPA policies for self-serviced resources and multi-tenant namespace isolation.",
    },
    {
      id: "observability-dx",
      name: "Platform Observability & DX",
      weight: 10,
      layerId: "platform-engineer-8",
      description:
        "Platform-wide golden signal dashboards, TechDocs integration, and low developer cognitive load.",
    },
    {
      id: "operations-docs",
      name: "Platform Operations & Onboarding",
      weight: 10,
      layerId: "platform-engineer-10",
      description:
        "Comprehensive documentation covering team onboarding, platform versioning, and operational runbooks.",
    },
  ],

  twistPool: [
    {
      id: "scorecard-plugin",
      text: "Integrate a custom Backstage TechInsights / Scorecard configuration scoring component production-readiness.",
    },
    {
      id: "ephemeral-environments",
      text: "Extend Software Templates to dynamically provision ephemeral pull-request environments via ArgoCD.",
    },
    {
      id: "cost-allocation-exporter",
      text: "Implement a platform cost allocation sidecar exporting per-team compute usage metrics to Prometheus.",
    },
    {
      id: "keda-autoscaling-template",
      text: "Embed KEDA (Kubernetes Event-driven Autoscaling) scaled objects inside the golden-path Helm chart template.",
    },
  ],

  rules: [...COMMON_RULES, NO_LIVE_ACCOUNT_RULE],

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
