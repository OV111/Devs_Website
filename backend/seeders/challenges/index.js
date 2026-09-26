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

export const challenges = [
  asyncErrorWrapper,
  streamingFileUpload,
  lruResponseCache,
  fixLongRunningMemoryLeak,
  parseMultipartFormData,
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
];
