/**
 * Capstone brief — kubernetes track (kubernetes), v1.
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
  trackId: "kubernetes",
  categoryId: "devops",
  slug: "kubernetes-production-platform-cluster",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "Production-Grade Microservice Platform on Kubernetes",
  summary:
    "Design and deploy a resilient microservice application platform on Kubernetes (kind/minikube). " +
    "You will craft multi-stage Dockerfiles, Helm charts, Ingress routing rules, Istio service mesh mTLS policies, " +
    "RBAC permissions, Horizontal Pod Autoscalers, and GitOps sync manifests.",
  stack: ["Kubernetes", "Docker", "Helm", "Istio", "ArgoCD", "GitHub Actions"],

  requirements: [
    {
      id: "dockerfile",
      text: "Multi-stage Dockerfile builds secure, non-root, minimal container images for microservices.",
      check: CHECKS.dockerfile,
    },
    {
      id: "k8s-workloads",
      text: "Manifests define Deployments, ClusterIP Services, ConfigMaps, and Secrets with explicit resource requests and limits.",
      check: { type: "file", glob: "k8s/**/*.yaml" },
    },
    {
      id: "helm-chart",
      text: "A custom Helm chart abstracts application configuration with templates, helpers, and environment value overrides.",
      check: { type: "file", glob: "charts/**/Chart.yaml" },
    },
    {
      id: "ingress-networking",
      text: "Ingress resources configure host-based routing, path rewriting, and TLS secret termination.",
      check: { type: "file", glob: "k8s/**/ingress*.yaml" },
    },
    {
      id: "istio-mesh",
      text: "Istio VirtualService, DestinationRule, and PeerAuthentication manifests enforce strict mTLS and canary traffic splitting.",
      check: { type: "file", glob: "istio/**/*.yaml" },
    },
    {
      id: "rbac-security",
      text: "Role, ClusterRole, and RoleBinding objects restrict ServiceAccount permissions using the principle of least privilege.",
      check: { type: "file", glob: "k8s/**/rbac*.yaml" },
    },
    {
      id: "autoscaling",
      text: "HorizontalPodAutoscaler (HPA) manifests scale workloads based on CPU and Memory usage thresholds.",
      check: { type: "file", glob: "k8s/**/hpa*.yaml" },
    },
    {
      id: "argocd-gitops",
      text: "ArgoCD Application manifests automate continuous deployment and drift detection from this repository.",
      check: { type: "file", glob: "gitops/**/*.yaml" },
    },
    {
      id: "ci-validation",
      text: "GitHub Actions workflow executes kube-linter, helm lint, and validates manifest syntax on PRs.",
      check: CHECKS.ci,
    },
    {
      id: "readme",
      text: "README provides step-by-step instructions to spin up a local kind cluster, install dependencies, and verify traffic routing.",
      check: CHECKS.readme,
    },
  ],

  rubric: [
    {
      id: "workload-architecture",
      name: "K8s Workload Architecture",
      weight: 25,
      layerId: "kubernetes-2",
      description:
        "Properly configured Pod specs with health probes, resource limits, anti-affinity, and configuration injection.",
    },
    {
      id: "packaging-helm",
      name: "Helm Packaging & Templating",
      weight: 15,
      layerId: "kubernetes-4",
      description:
        "Modular Helm chart design using helpers, input schema validation, and clean parameterization.",
    },
    {
      id: "networking-mesh",
      name: "Ingress & Istio Service Mesh",
      weight: 20,
      layerId: "kubernetes-6",
      description:
        "Effective VirtualService traffic routing, canary splits, and PeerAuthentication mTLS enforcement.",
    },
    {
      id: "security-rbac",
      name: "Cluster Security & RBAC",
      weight: 15,
      layerId: "kubernetes-7",
      description:
        "Strict Role-Based Access Control, standard Pod Security Standards, and non-root container specs.",
    },
    {
      id: "autoscaling-ops",
      name: "Autoscaling & Operations",
      weight: 15,
      layerId: "kubernetes-8",
      description:
        "Correct HPA configuration and operational resilience under simulated load.",
    },
    {
      id: "gitops-docs",
      name: "GitOps Delivery & Docs",
      weight: 10,
      layerId: "kubernetes-9",
      description:
        "Clean ArgoCD GitOps workflow setup and clear cluster setup/teardown instructions.",
    },
  ],

  twistPool: [
    {
      id: "etcd-backup-script",
      text: "Include an automated cron job manifest and script that performs etcd snapshot backups to simulated S3 storage.",
    },
    {
      id: "network-policy-lockdown",
      text: "Implement strict NetworkPolicy objects blocking cross-namespace traffic except explicitly allowed ports.",
    },
    {
      id: "custom-prometheus-rule",
      text: "Add PrometheusRule custom resources defining firing alerts for pod crash loops and high memory utilization.",
    },
    {
      id: "pvc-storage-class",
      text: "Configure a dynamic PersistentVolumeClaim using a local StorageClass for stateful application data preservation.",
    },
  ],

  rules: COMMON_RULES,

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
