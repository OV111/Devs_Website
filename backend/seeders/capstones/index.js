/**
 * Every capstone brief, grouped by roadmap category (one folder per category,
 * one file per track). Adding a capstone = one file in the right folder + one
 * line here; the seeder and the brief tests both read this list.
 */

// backend
import apiDev from "./backend/api-dev.js";
import nodeDev from "./backend/node-dev.js";
import pythonBackend from "./backend/python-backend.js";
import dbEngineer from "./backend/db-engineer.js";
import goDev from "./backend/go-dev.js";
import rustDev from "./backend/rust-dev.js";
import javaSpring from "./backend/java-spring.js";
import graphqlDev from "./backend/graphql-dev.js";
import grpcDev from "./backend/grpc-dev.js";
import microservices from "./backend/microservices.js";
import securityDev from "./backend/security-dev.js";
import systemsDev from "./backend/systems-dev.js";

// blockchain
import smartContract from "./blockchain/smart-contract.js";
import ethereumDev from "./blockchain/ethereum-dev.js";
import solanaDev from "./blockchain/solana-dev.js";
import blockchainCore from "./blockchain/blockchain-core.js";
import blockchainSecurity from "./blockchain/blockchain-security.js";
import chainArchitect from "./blockchain/chain-architect.js";
import bitcoinDev from "./blockchain/bitcoin-dev.js";
import cosmosDev from "./blockchain/cosmos-dev.js";
import moveDeveloper from "./blockchain/move-developer.js";
import layer2Dev from "./blockchain/layer2-dev.js";

// mobile
import reactNative from "./mobile/react-native.js";
import flutter from "./mobile/flutter.js";
import ios from "./mobile/ios.js";
import android from "./mobile/android.js";
import kotlinDev from "./mobile/kotlin-dev.js";
import swiftDev from "./mobile/swift-dev.js";
import maui from "./mobile/maui.js";
import pwaDev from "./mobile/pwa-dev.js";
import ionic from "./mobile/ionic.js";

// fullstack
import mern from "./fullstack/mern.js";
import pern from "./fullstack/pern.js";
import t3 from "./fullstack/t3.js";
import fullstackEngineer from "./fullstack/fullstack-engineer.js";
import mean from "./fullstack/mean.js";
import jamstack from "./fullstack/jamstack.js";
import djangoReact from "./fullstack/django-react.js";
import railsDev from "./fullstack/rails-dev.js";
import nextFullstack from "./fullstack/next-fullstack.js";
import sveltekitDev from "./fullstack/sveltekit-dev.js";
import nuxtDev from "./fullstack/nuxt-dev.js";
import astroDev from "./fullstack/astro-dev.js";
import laravelVue from "./fullstack/laravel-vue.js";
import remixDev from "./fullstack/remix-dev.js";

export const briefs = [
  apiDev,
  nodeDev,
  pythonBackend,
  dbEngineer,
  goDev,
  rustDev,
  javaSpring,
  graphqlDev,
  grpcDev,
  microservices,
  securityDev,
  systemsDev,
  mern,
  pern,
  t3,
  fullstackEngineer,
  mean,
  jamstack,
  djangoReact,
  railsDev,
  nextFullstack,
  sveltekitDev,
  nuxtDev,
  astroDev,
  laravelVue,
  remixDev,
  smartContract,
  ethereumDev,
  solanaDev,
  blockchainCore,
  blockchainSecurity,
  chainArchitect,
  bitcoinDev,
  cosmosDev,
  moveDeveloper,
  layer2Dev,
  reactNative,
  flutter,
  ios,
  android,
  kotlinDev,
  swiftDev,
  maui,
  pwaDev,
  ionic,
];
