/**
 * Capstone brief — cicd track (cicd), v1.
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
import { COMMON_RULES, CHECKS } from "../shared.js";

export default {
  trackId: "cicd",
  categoryId: "devops",
  slug: "cicd-enterprise-gitops-pipeline",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Enterprise GitOps Release Pipeline with GitHub Actions and ArgoCD",
  summary:
    "Build an end-to-end multi-environment delivery pipeline using GitHub Actions, Jenkins, and ArgoCD. " +
    "You will automate build steps, dependency caching, container scanning, semantic versioning, and " +
    "declarative GitOps application synchronization for progressive deployments.",
  stack: ["GitHub Actions", "Jenkins", "ArgoCD", "Docker", "Helm", "Shell"],

  requirements: [
    {
      id: "build-matrix",
      text: "GitHub Actions workflow builds and tests code across a matrix of runtime versions using cached dependencies.",
      check: CHECKS.ci,
    },
    {
      id: "jenkinsfile",
      text: "A Declarative Jenkinsfile defines build, test, image tag, and security scan stages with post actions.",
      check: { type: "file", glob: "Jenkinsfile" },
    },
    {
      id: "semver-tagging",
      text: "Automated tagging step calculates semantic versioning and tags container images pushed to a local registry.",
      check: CHECKS.ci,
    },
    {
      id: "helm-chart",
      text: "A custom Helm chart packages the application with parameterized values for staging and production environments.",
      check: { type: "file", glob: "charts/**/Chart.yaml" },
    },
    {
      id: "argocd-app",
      text: "Declarative ArgoCD Application manifests define automated sync policies and drift detection for environment promotion.",
      check: { type: "file", glob: "gitops/**/*.yaml" },
    },
    {
      id: "security-scans",
      text: "Pipeline runs static analysis, dependency vulnerability scans, and container image security checks.",
      check: CHECKS.ci,
    },
    {
      id: "dockerfile",
      text: "Optimized Dockerfile creates reproducible minimal runtime images for application releases.",
      check: CHECKS.dockerfile,
    },
    {
      id: "compose-runner",
      text: "Docker Compose boots a local testing environment including Jenkins agent and local container registry.",
      check: CHECKS.compose,
    },
    {
      id: "env-example",
      text: "An .env.example file lists all configuration keys needed for local execution and OIDC pipeline authentication.",
      check: CHECKS.envExample,
    },
    {
      id: "readme",
      text: "README documents pipeline architecture, release workflow, rollback steps, and local ArgoCD simulation instructions.",
      check: CHECKS.readme,
    },
  ],

  rubric: [
    {
      id: "pipeline-automation",
      name: "Pipeline Architecture & Automation",
      weight: 25,
      layerId: "cicd-2",
      description:
        "Efficient multi-stage build workflows with caching, dynamic matrix builds, and clean stage transitions.",
    },
    {
      id: "jenkins-integration",
      name: "Jenkins & Scripted Workflows",
      weight: 15,
      layerId: "cicd-3",
      description:
        "Properly structured Jenkinsfile with robust post actions, error handling, and parallel steps.",
    },
    {
      id: "artifact-versioning",
      name: "Artifact & Version Management",
      weight: 15,
      layerId: "cicd-4",
      description:
        "Strict semantic versioning policies, immutable image tagging, and registry management.",
    },
    {
      id: "gitops-delivery",
      name: "GitOps & Deployment Strategy",
      weight: 20,
      layerId: "cicd-6",
      description:
        "Clean ArgoCD application declarations with automated drift detection and multi-environment promotion.",
    },
    {
      id: "pipeline-security",
      name: "Pipeline Security & Secrets",
      weight: 15,
      layerId: "cicd-7",
      description:
        "Inclusion of dependency scanning, least-privilege runner roles, and zero exposed credentials.",
    },
    {
      id: "ops-observability",
      name: "Observability & Documentation",
      weight: 10,
      layerId: "cicd-8",
      description:
        "Tracking DORA/pipeline metrics, clear failure remediation steps, and comprehensive setup docs.",
    },
  ],

  twistPool: [
    {
      id: "canary-flagger",
      text: "Add progressive canary release manifests using Helm and mock traffic metrics to simulate automated rollback on errors.",
    },
    {
      id: "reusable-action",
      text: "Package security scanning into a custom reusable GitHub Composite Action referenced by the main pipeline.",
    },
    {
      id: "cosign-signing",
      text: "Add container image signing using Cosign/Sigstore keyless flow in CI and verify signatures prior to deployment.",
    },
    {
      id: "dora-metrics-exporter",
      text: "Write a script or step that logs pipeline duration and deployment status formatted for Prometheus DORA metrics ingestion.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
