/**
 * Challenge content, one file per problem, grouped by track — flattened into
 * a single array for the seeder.
 *
 * New challenge? Add a file under `<trackId>/<slug>.js` exporting the object
 * (see any existing file for the shape) and add one import line + one array
 * entry below. Explicit imports rather than a directory scan, so this file
 * doubles as the index of everything that exists.
 */

import asyncErrorWrapper from "./api-dev/async-error-wrapper.js";
import streamingFileUpload from "./api-dev/streaming-file-upload.js";
import lruResponseCache from "./api-dev/lru-response-cache.js";
import fixLongRunningMemoryLeak from "./api-dev/fix-long-running-memory-leak.js";
import parseMultipartFormData from "./api-dev/parse-multipart-form-data.js";
import parseHttpRequest from "./api-dev/parse-http-request.js";
import statusCodePicker from "./api-dev/status-code-picker.js";
import parseUrl from "./api-dev/parse-url.js";
import restRouteMatcher from "./api-dev/rest-route-matcher.js";
import parseCacheControl from "./api-dev/parse-cache-control.js";
import parseEnvFile from "./api-dev/parse-env-file.js";
import octalToSymbolic from "./api-dev/octal-to-symbolic.js";
import resolvePath from "./api-dev/resolve-path.js";
import grepLines from "./api-dev/grep-lines.js";
import splitShellArgs from "./api-dev/split-shell-args.js";

import debounceWithCancelAndFlush from "./mern/debounce-with-cancel-and-flush.js";

import memoizeWithCacheLimit from "./javascript/memoize-with-cache-limit.js";
import deepClone from "./javascript/deep-clone.js";
import promisePool from "./javascript/promise-pool.js";
import curryFunction from "./javascript/curry-function.js";
import groupByPolyfill from "./javascript/group-by-polyfill.js";

import aabbCollisionResolution from "./web-game/aabb-collision-resolution.js";
import gameStateMachine from "./web-game/game-state-machine.js";
import physicsStepWithBounce from "./web-game/physics-step-with-bounce.js";
import reliableMessageBuffer from "./web-game/reliable-message-buffer.js";
import objectPool from "./web-game/object-pool.js";
import retryAsync from "./api-dev/retry-async.js";
import miniEventEmitter from "./api-dev/mini-event-emitter.js";
import validateBody from "./api-dev/validate-body.js";
import composeMiddleware from "./api-dev/compose-middleware.js";
import paginate from "./api-dev/paginate.js";
import resolveApiVersion from "./api-dev/resolve-api-version.js";
import sqlWhereBuilder from "./api-dev/sql-where-builder.js";
import mongoFilterFromQuery from "./api-dev/mongo-filter-from-query.js";
import joinArrays from "./api-dev/join-arrays.js";
import cursorPagination from "./api-dev/cursor-pagination.js";
import suggestCompoundIndex from "./api-dev/suggest-compound-index.js";
import parseBearerToken from "./api-dev/parse-bearer-token.js";
import passwordPolicyCheck from "./api-dev/password-policy-check.js";
import corsOriginMatcher from "./api-dev/cors-origin-matcher.js";
import stripMongoOperators from "./api-dev/strip-mongo-operators.js";
import refreshTokenRotation from "./api-dev/refresh-token-rotation.js";
import tokenBucketLimiter from "./api-dev/token-bucket-limiter.js";
import dataloaderBatching from "./api-dev/dataloader-batching.js";
import conditionalGet from "./api-dev/conditional-get.js";
import ttlCache from "./api-dev/ttl-cache.js";
import miniSpy from "./api-dev/mini-spy.js";
import deepEqual from "./api-dev/deep-equal.js";
import matchObject from "./api-dev/match-object.js";
import routesToOpenapi from "./api-dev/routes-to-openapi.js";
import validateAgainstSchema from "./api-dev/validate-against-schema.js";
import inMemoryJobQueue from "./api-dev/in-memory-job-queue.js";
import cronNextRun from "./api-dev/cron-next-run.js";
import eventBusWildcards from "./api-dev/event-bus-wildcards.js";
import idempotentEventHandler from "./api-dev/idempotent-event-handler.js";
import delayedJobScheduler from "./api-dev/delayed-job-scheduler.js";
import healthCheckAggregator from "./api-dev/health-check-aggregator.js";
import structuredLogger from "./api-dev/structured-logger.js";
import semverCompare from "./api-dev/semver-compare.js";
import envInterpolate from "./api-dev/env-interpolate.js";
import gracefulShutdownTracker from "./api-dev/graceful-shutdown-tracker.js";
import closureCounter from "./node-dev/closure-counter.js";
import allSettled from "./node-dev/all-settled.js";
import withTimeout from "./node-dev/with-timeout.js";
import parseUserGuard from "./node-dev/parse-user-guard.js";
import summarizeOrders from "./node-dev/summarize-orders.js";
import eventLoopOrder from "./node-dev/event-loop-order.js";
import utf8Encode from "./node-dev/utf8-encode.js";
import resolveModule from "./node-dev/resolve-module.js";
import semverSatisfies from "./node-dev/semver-satisfies.js";
import loadConfig from "./node-dev/load-config.js";
import promisify from "./node-dev/promisify.js";
import lineSplitter from "./node-dev/line-splitter.js";
import backpressureWritable from "./node-dev/backpressure-writable.js";
import batchAsyncIterable from "./node-dev/batch-async-iterable.js";
import onceEvent from "./node-dev/once-event.js";
import miniRouter from "./node-dev/mini-router.js";
import serializeBySchema from "./node-dev/serialize-by-schema.js";
import pluginEncapsulation from "./node-dev/plugin-encapsulation.js";
import diContainer from "./node-dev/di-container.js";
import crudResource from "./node-dev/crud-resource.js";
import httpClientInterceptors from "./mern/http-client-interceptors.js";
import queryCache from "./mern/query-cache.js";
import miniStore from "./mern/mini-store.js";
import authTokenRefresh from "./mern/auth-token-refresh.js";
import toastQueue from "./mern/toast-queue.js";
import renderToString from "./mern/render-to-string.js";
import useStateRuntime from "./mern/use-state-runtime.js";
import diffKeyedList from "./mern/diff-keyed-list.js";
import controlledForm from "./mern/controlled-form.js";
import memoComponent from "./mern/memo-component.js";
import parsePrismaSchema from "./node-dev/parse-prisma-schema.js";
import prismaWhere from "./node-dev/prisma-where.js";
import transactionRunner from "./node-dev/transaction-runner.js";
import migrationPlanner from "./node-dev/migration-planner.js";
import connectionPool from "./node-dev/connection-pool.js";
import jwtVerify from "./node-dev/jwt-verify.js";
import sessionStore from "./node-dev/session-store.js";
import rbacCheck from "./node-dev/rbac-check.js";
import ssrfGuard from "./node-dev/ssrf-guard.js";
import securityHeaders from "./node-dev/security-headers.js";
import zodLite from "./node-dev/zod-lite.js";
import errorHandler from "./node-dev/error-handler.js";
import userService from "./node-dev/user-service.js";
import buildConfig from "./node-dev/build-config.js";
import logDeduper from "./node-dev/log-deduper.js";
import moduleRegistry from "./node-dev/module-registry.js";
import fixtureFactory from "./node-dev/fixture-factory.js";
import requestTester from "./node-dev/request-tester.js";
import coverageGate from "./node-dev/coverage-gate.js";
import contractCheck from "./node-dev/contract-check.js";
import miniRedis from "./node-dev/mini-redis.js";
import swrCache from "./node-dev/swr-cache.js";
import semaphore from "./node-dev/semaphore.js";
import nPlusOneDetector from "./node-dev/n-plus-one-detector.js";
import detectMemoryLeak from "./node-dev/detect-memory-leak.js";
import prometheusMetrics from "./node-dev/prometheus-metrics.js";
import traceContext from "./node-dev/trace-context.js";
import dockerfileLint from "./node-dev/dockerfile-lint.js";
import workflowValidate from "./node-dev/workflow-validate.js";
import rollingUpdate from "./node-dev/rolling-update.js";

import combineReducers from "./mern/combine-reducers.js";
import createSelector from "./mern/create-selector.js";
import cssSpecificity from "./mern/css-specificity.js";
import deepMerge from "./mern/deep-merge.js";
import fetchWithRetry from "./mern/fetch-with-retry.js";
import flexRowLayout from "./mern/flex-row-layout.js";
import htmlSanitizer from "./mern/html-sanitizer.js";
import matchRoutes from "./mern/match-routes.js";
import mediaQueryMatch from "./mern/media-query-match.js";
import nestedRoutes from "./mern/nested-routes.js";
import promiseCombinators from "./mern/promise-combinators.js";
import prototypeChain from "./mern/prototype-chain.js";
import requestTracker from "./mern/request-tracker.js";
import validateMarkup from "./mern/validate-markup.js";

import canvasScale from "./web-game/canvas-scale.js";
import createTween from "./web-game/create-tween.js";
import fixedTimestepLoop from "./web-game/fixed-timestep-loop.js";
import inputStateTracker from "./web-game/input-state-tracker.js";

import assetLoader from "./web-game/asset-loader.js";
import atlasFrames from "./web-game/atlas-frames.js";
import audioMixer from "./web-game/audio-mixer.js";
import createAnimator from "./web-game/create-animator.js";
import createEmitter from "./web-game/create-emitter.js";
import createGameStats from "./web-game/create-game-stats.js";
import createMenuStack from "./web-game/create-menu-stack.js";
import decodeGid from "./web-game/decode-gid.js";
import findOverlaps from "./web-game/find-overlaps.js";
import frustumCulling from "./web-game/frustum-culling.js";
import highScores from "./web-game/high-scores.js";
import mat4 from "./web-game/mat4.js";
import moveAndCollide from "./web-game/move-and-collide.js";
import orbitCamera from "./web-game/orbit-camera.js";
import projectPoint from "./web-game/project-point.js";
import quaternions from "./web-game/quaternions.js";
import sceneManager from "./web-game/scene-manager.js";
import voiceLimiter from "./web-game/voice-limiter.js";
import wrapText from "./web-game/wrap-text.js";

import createBody from "./web-game/create-body.js";
import narrowPhase from "./web-game/narrow-phase.js";
import raycast from "./web-game/raycast.js";
import resolveSphereCollision from "./web-game/resolve-sphere-collision.js";

export const challenges = [
  asyncErrorWrapper,
  streamingFileUpload,
  lruResponseCache,
  fixLongRunningMemoryLeak,
  parseMultipartFormData,
  parseHttpRequest,
  statusCodePicker,
  parseUrl,
  restRouteMatcher,
  parseCacheControl,
  parseEnvFile,
  octalToSymbolic,
  resolvePath,
  grepLines,
  splitShellArgs,
  debounceWithCancelAndFlush,
  memoizeWithCacheLimit,
  deepClone,
  promisePool,
  curryFunction,
  groupByPolyfill,
  aabbCollisionResolution,
  gameStateMachine,
  physicsStepWithBounce,
  reliableMessageBuffer,
  objectPool,
  retryAsync,
  miniEventEmitter,
  validateBody,
  composeMiddleware,
  paginate,
  resolveApiVersion,
  sqlWhereBuilder,
  mongoFilterFromQuery,
  joinArrays,
  cursorPagination,
  suggestCompoundIndex,
  parseBearerToken,
  passwordPolicyCheck,
  corsOriginMatcher,
  stripMongoOperators,
  refreshTokenRotation,
  tokenBucketLimiter,
  dataloaderBatching,
  conditionalGet,
  ttlCache,
  miniSpy,
  deepEqual,
  matchObject,
  routesToOpenapi,
  validateAgainstSchema,
  inMemoryJobQueue,
  cronNextRun,
  eventBusWildcards,
  idempotentEventHandler,
  delayedJobScheduler,
  healthCheckAggregator,
  structuredLogger,
  semverCompare,
  envInterpolate,
  gracefulShutdownTracker,
  closureCounter,
  allSettled,
  withTimeout,
  parseUserGuard,
  summarizeOrders,
  eventLoopOrder,
  utf8Encode,
  resolveModule,
  semverSatisfies,
  loadConfig,
  promisify,
  lineSplitter,
  backpressureWritable,
  batchAsyncIterable,
  onceEvent,
  miniRouter,
  serializeBySchema,
  pluginEncapsulation,
  diContainer,
  crudResource,
  httpClientInterceptors,
  queryCache,
  miniStore,
  authTokenRefresh,
  toastQueue,
  renderToString,
  useStateRuntime,
  diffKeyedList,
  controlledForm,
  memoComponent,
  parsePrismaSchema,
  prismaWhere,
  transactionRunner,
  migrationPlanner,
  connectionPool,
  jwtVerify,
  sessionStore,
  rbacCheck,
  ssrfGuard,
  securityHeaders,
  zodLite,
  errorHandler,
  userService,
  buildConfig,
  logDeduper,
  moduleRegistry,
  fixtureFactory,
  requestTester,
  coverageGate,
  contractCheck,
  miniRedis,
  swrCache,
  semaphore,
  nPlusOneDetector,
  detectMemoryLeak,
  prometheusMetrics,
  traceContext,
  dockerfileLint,
  workflowValidate,
  rollingUpdate,
  combineReducers,
  createSelector,
  cssSpecificity,
  deepMerge,
  fetchWithRetry,
  flexRowLayout,
  htmlSanitizer,
  matchRoutes,
  mediaQueryMatch,
  nestedRoutes,
  promiseCombinators,
  prototypeChain,
  requestTracker,
  validateMarkup,
  canvasScale,
  createTween,
  fixedTimestepLoop,
  inputStateTracker,
  assetLoader,
  atlasFrames,
  audioMixer,
  createAnimator,
  createEmitter,
  createGameStats,
  createMenuStack,
  decodeGid,
  findOverlaps,
  frustumCulling,
  highScores,
  mat4,
  moveAndCollide,
  orbitCamera,
  projectPoint,
  quaternions,
  sceneManager,
  voiceLimiter,
  wrapText,
  createBody,
  narrowPhase,
  raycast,
  resolveSphereCollision,
];
