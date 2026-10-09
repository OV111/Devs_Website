/**
 * Capstone brief — cloud-migration track (cloud-migration), v1.
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
  trackId: "cloud-migration",
  categoryId: "cloud",
  slug: "cloud-migration-monolith-modernization",
  version: 1,
  status: "draft",
  reviewed: false,
  title: "On-Premises Monolith Migration and Strangler Fig Modernization",
  summary:
    "Plan and execute an end-to-end cloud migration of a legacy on-premises web application and database. " +
    "You will write automation scripts to assess legacy dependencies, set up a secure hub-and-spoke landing zone, " +
    "migrate relational databases to AWS Aurora PostgreSQL using DMS with Change Data Capture (CDC), and implement " +
    "the Strangler Fig pattern using API Gateway routing.",
  stack: [
    "Python",
    "AWS DMS",
    "AWS CloudFormation or Terraform",
    "Docker",
    "AWS API Gateway",
    "GitHub Actions",
  ],

  requirements: [
    {
      id: "assessment-script",
      text: "Script performs automated discovery on simulated on-premises configurations, generating dependency maps and TCO analysis.",
    },
    {
      id: "landing-zone-setup",
      text: "Provisions a target AWS hub-and-spoke landing zone with transit gateway routing, private endpoints, and AD Connector integration.",
    },
    {
      id: "dms-replication",
      text: "Configures AWS Database Migration Service (DMS) tasks with Schema Conversion Tool rules and continuous Change Data Capture (CDC).",
    },
    {
      id: "strangler-fig-routing",
      text: "Configures API Gateway / ALB reverse proxy routing applying the Strangler Fig pattern to incrementally redirect endpoints from legacy to microservices.",
    },
    {
      id: "containerized-replatform",
      text: "Replatforms legacy application components into Docker containers running on Amazon ECS or AWS App Runner.",
    },
    {
      id: "cutover-playbook",
      text: "Automation scripts execute database validation checks and DNS cutover verification during final migration window.",
    },
    {
      id: "tests",
      text: "Pytest suite verifies database migration schema fidelity, CDC sequence validation, and API proxy routing rules.",
      check: { type: "file", glob: "**/test_*.py" },
    },
    {
      id: "readme",
      text: "README presents 7Rs decision rationale, migration wave plan, TCO comparison tables, and cutover execution playbook.",
      check: CHECKS.readme,
    },
    {
      id: "env-example",
      text: "Includes .env.example with source/target database connection strings and migration parameter settings.",
      check: CHECKS.envExample,
    },
    {
      id: "ci",
      text: "A GitHub Actions workflow executes automated code linting, unit tests, and migration script syntax checks.",
      check: CHECKS.ci,
    },
  ],

  rubric: [
    {
      id: "migration-strategy",
      name: "Assessment & Strategy (7Rs)",
      weight: 15,
      layerId: "cloud-migration-1",
      description:
        "Thorough discovery dependency mapping, sound 7Rs migration strategy choice, and realistic TCO calculation.",
    },
    {
      id: "landing-zone",
      name: "Landing Zone Architecture",
      weight: 20,
      layerId: "cloud-migration-3",
      description:
        "Hub-and-spoke network design, transit gateway peering, AD integration, and secure hybrid access.",
    },
    {
      id: "database-migration",
      name: "Database Migration & CDC",
      weight: 25,
      layerId: "cloud-migration-5",
      description:
        "Effective DMS replication task setup, schema transformation rules, and zero-downtime CDC synchronization.",
    },
    {
      id: "modernization",
      name: "Application Modernization & Strangler Fig",
      weight: 15,
      layerId: "cloud-migration-7",
      description:
        "Incremental traffic routing via API Gateway/ALB, containerization of legacy assets, and microservice decoupling.",
    },
    {
      id: "tests",
      name: "Validation & Testing",
      weight: 15,
      layerId: "cloud-migration-9",
      description:
        "Data integrity verification, cutover validation testing, and automated migration scripts.",
    },
    {
      id: "docs-ops",
      name: "Playbook & Program Governance",
      weight: 10,
      layerId: "cloud-migration-10",
      description:
        "Detailed cutover playbook, rollback steps, wave planning documentation, and CI workflows.",
    },
  ],

  twistPool: [
    {
      id: "mgn-block-replication",
      text: "Incorporate AWS Application Migration Service (MGN) agent scripts for continuous block-level server rehosting.",
    },
    {
      id: "zero-downtime-dns",
      text: "Implement Route 53 weighted routing policy automation for progressive percentage-based cutover.",
    },
    {
      id: "rollback-automation",
      text: "Add an automated rollback script triggered by post-cutover error threshold spikes in CloudWatch.",
    },
    {
      id: "heterogeneous-schema",
      text: "Configure Schema Conversion Tool (SCT) rule actions translating legacy Oracle/SQL Server stored procedures to PostgreSQL PL/pgSQL.",
    },
  ],

  rules: [...COMMON_RULES, NO_LIVE_ACCOUNT_RULE],

  passThresholds: DEFAULT_PASS_THRESHOLDS,
};
