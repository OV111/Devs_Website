/**
 * Capstone brief — cloud-native track (cloud-native), v1.
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
  trackId: "cloud-native",
  categoryId: "cloud",
  slug: "cloud-native-microservices-platform",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "GitOps-Driven Microservices Platform on Kubernetes with Istio",
  summary:
    "Build a production-grade Kubernetes microservices platform using modern cloud-native patterns. " +
    "You will write multi-stage Dockerfiles, package workloads with Helm, deploy via ArgoCD GitOps, " +
    "configure Istio service mesh mTLS and traffic shifting, enforce OPA Gatekeeper security policies, " +
    "and collect metrics with Prometheus/Grafana.",
  stack: [
    "Kubernetes",
    "Helm",
    "ArgoCD",
    "Istio",
    "Prometheus",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "multi-stage-docker",
      text: "Microservices include multi-stage Dockerfiles producing minimal, unprivileged container runtime images.",
      check: CHECKS.dockerfile,
    },
    {
      id: "helm-chart",
      text: "Workloads are packaged into a custom Helm chart with configurable values, subcharts, and release templates.",
      check: { type: "file", glob: "**/Chart.yaml" },
    },
    {
      id: "gitops-argocd",
      text: "ArgoCD application manifests (or app-of-apps pattern) define automated deployment state synchronization from Git.",
      check: { type: "file", glob: "**/Application*.{yml,yaml}" },
    },
    {
      id: "service-mesh-istio",
      text: "Istio VirtualService and DestinationRule objects manage traffic shifting, canary rollouts, and strict peer mTLS.",
    },
    {
      id: "k8s-security-policy",
      text: "Enforces Pod Security Standards and OPA Gatekeeper constraint templates restricting container root privileges.",
    },
    {
      id: "prometheus-monitoring",
      text: "Configures ServiceMonitor resources to scrape custom metrics for visualization in Grafana dashboards.",
    },
    {
      id: "tests",
      text: "Tests validate Helm chart template rendering and container endpoint behavior.",
      check: CHECKS.jsTests,
    },
    {
      id: "readme",
      text: "README documents cluster setup, Helm installation parameters, ArgoCD sync commands, and Istio routing validation.",
      check: CHECKS.readme,
    },
    {
      id: "env-example",
      text: "Includes .env.example or values-example.yaml template file specifying configuration variables.",
      check: CHECKS.envExample,
    },
    {
      id: "ci",
      text: "A GitHub Actions workflow executes helm lint, kubeconform manifest validation, and container vulnerability scans on push.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "containerization",
      name: "Container & Image Optimization",
      weight: 15,
      layerId: "cloud-native-1",
      description:
        "Multi-stage builds, non-root user execution, image size reduction, and security scanning.",
    },
    {
      id: "helm-packaging",
      name: "Kubernetes & Helm Engineering",
      weight: 20,
      layerId: "cloud-native-3",
      description:
        "Modular Helm chart design, parameter abstractions, dynamic template functions, and hooks.",
    },
    {
      id: "gitops-delivery",
      name: "GitOps & Continuous Delivery",
      weight: 20,
      layerId: "cloud-native-7",
      description:
        "ArgoCD manifest structure, sync policies, automated rollouts, and repository structure.",
    },
    {
      id: "service-mesh",
      name: "Service Mesh & Traffic Management",
      weight: 20,
      layerId: "cloud-native-6",
      description:
        "Istio VirtualService routing, mTLS PeerAuthentication enforcement, and circuit breaking.",
    },
    {
      id: "security-policy",
      name: "Policy Enforcement & Security",
      weight: 15,
      layerId: "cloud-native-8",
      description:
        "OPA Gatekeeper constraint definitions, RBAC role bindings, and Pod Security Standards.",
    },
    {
      id: "docs-ops",
      name: "Observability & Documentation",
      weight: 10,
      layerId: "cloud-native-9",
      description:
        "ServiceMonitor metrics collection, Grafana dashboard definitions, and complete setup guides.",
    },
  ],

  twistPool: [
    {
      id: "flagger-canary",
      text: "Automate progressive canary deployments using Flagger integrated with Istio metrics and Prometheus alerts.",
    },
    {
      id: "falco-runtime-security",
      text: "Deploy Falco runtime security rules detecting unauthorized shell executions within application pods.",
    },
    {
      id: "kustomize-overlays",
      text: "Add Kustomize environment overlays (dev/prod) managing environment-specific resource limits and replicas.",
    },
    {
      id: "opentelemetry-tracing",
      text: "Instrument application code with OpenTelemetry SDK sending trace spans to a Tempo or Jaeger collector.",
    },
  ],

  rules: [...COMMON_RULES, NO_LIVE_ACCOUNT_RULE],

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
