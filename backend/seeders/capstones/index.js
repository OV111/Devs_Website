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

// aiml
import aimlMlEngineer from "./aiml/ml-engineer.js";
import aimlDataScientist from "./aiml/data-scientist.js";
import aimlAiDeveloper from "./aiml/ai-developer.js";
import aimlNlpEngineer from "./aiml/nlp-engineer.js";
import aimlCvEngineer from "./aiml/cv-engineer.js";
import aimlLlmEngineer from "./aiml/llm-engineer.js";
import aimlMlops from "./aiml/mlops.js";
import aimlDataEngineer from "./aiml/data-engineer.js";
import aimlRlEngineer from "./aiml/rl-engineer.js";
import aimlPromptEngineer from "./aiml/prompt-engineer.js";

// cloud
import cloudAwsArchitect from "./cloud/aws-architect.js";
import cloudAzureArchitect from "./cloud/azure-architect.js";
import cloudGcpArchitect from "./cloud/gcp-architect.js";
import cloudServerlessDev from "./cloud/serverless-dev.js";
import cloudCloudNative from "./cloud/cloud-native.js";
import cloudFinopsEngineer from "./cloud/finops-engineer.js";
import cloudMultiCloudArchitect from "./cloud/multi-cloud-architect.js";
import cloudCloudMigration from "./cloud/cloud-migration.js";
import cloudEdgeEngineer from "./cloud/edge-engineer.js";
import cloudObservabilityEngineer from "./cloud/observability-engineer.js";

// cybersecurity
import cybersecurityMalwareAnalyst from "./cybersecurity/malware-analyst.js";
import cybersecurityGrcAnalyst from "./cybersecurity/grc-analyst.js";
import cybersecuritySecurityArchitect from "./cybersecurity/security-architect.js";
import cybersecurityThreatHunter from "./cybersecurity/threat-hunter.js";
import cybersecurityForensicsAnalyst from "./cybersecurity/forensics-analyst.js";
import cybersecurityBugBountyHunter from "./cybersecurity/bug-bounty-hunter.js";
import cybersecurityPentester from "./cybersecurity/pentester.js";
import cybersecuritySocAnalyst from "./cybersecurity/soc-analyst.js";
import cybersecurityAppsecEngineer from "./cybersecurity/appsec-engineer.js";
import cybersecurityRedTeam from "./cybersecurity/red-team.js";
import cybersecurityBlueTeam from "./cybersecurity/blue-team.js";
import cybersecurityCloudSecurity from "./cybersecurity/cloud-security.js";

// database
import databaseGraphDbEngineer from "./database/graph-db-engineer.js";
import databaseVectorDbEngineer from "./database/vector-db-engineer.js";
import databaseCassandraEngineer from "./database/cassandra-engineer.js";
import databaseRedisEngineer from "./database/redis-engineer.js";
import databaseDbReliability from "./database/db-reliability.js";
import databaseNosqlEngineer from "./database/nosql-engineer.js";
import databaseDataModeler from "./database/data-modeler.js";
import databaseMongodbAdmin from "./database/mongodb-admin.js";
import databaseMysqlDba from "./database/mysql-dba.js";
import databasePostgresDba from "./database/postgres-dba.js";

// datascience
import datascienceStatistician from "./datascience/statistician.js";
import datascienceAnalyticsEngineer from "./datascience/analytics-engineer.js";
import datascienceDataArchitect from "./datascience/data-architect.js";
import datascienceMlAnalyst from "./datascience/ml-analyst.js";
import datascienceBiDeveloper from "./datascience/bi-developer.js";
import datascienceDsDataEngineer from "./datascience/ds-data-engineer.js";
import datascienceDsDataScientist from "./datascience/ds-data-scientist.js";
import datascienceDataAnalyst from "./datascience/data-analyst.js";

// devops
import devopsPlatformEngineer from "./devops/platform-engineer.js";
import devopsDevsecops from "./devops/devsecops.js";
import devopsAzureDev from "./devops/azure-dev.js";
import devopsGcpDev from "./devops/gcp-dev.js";
import devopsAwsDev from "./devops/aws-dev.js";
import devopsKubernetes from "./devops/kubernetes.js";
import devopsInfra from "./devops/infra.js";
import devopsSre from "./devops/sre.js";
import devopsCicd from "./devops/cicd.js";
import devopsCloud from "./devops/cloud.js";

// gamedev
import gamedevToolsDev from "./gamedev/tools-dev.js";
import gamedevGameplayEngineer from "./gamedev/gameplay-engineer.js";
import gamedevXrDev from "./gamedev/xr-dev.js";
import gamedevGameBackend from "./gamedev/game-backend.js";
import gamedevShaderDev from "./gamedev/shader-dev.js";
import gamedevGameAi from "./gamedev/game-ai.js";
import gamedevGodot from "./gamedev/godot.js";
import gamedevGameDesigner from "./gamedev/game-designer.js";
import gamedevWebGame from "./gamedev/web-game.js";
import gamedevUnreal from "./gamedev/unreal.js";
import gamedevUnity from "./gamedev/unity.js";

// qa
import qaQaLead from "./qa/qa-lead.js";
import qaAccessibilityQa from "./qa/accessibility-qa.js";
import qaChaosEngineer from "./qa/chaos-engineer.js";
import qaSdet from "./qa/sdet.js";
import qaApiQa from "./qa/api-qa.js";
import qaMobileQa from "./qa/mobile-qa.js";
import qaSecurityQa from "./qa/security-qa.js";
import qaPerformance from "./qa/performance.js";
import qaManual from "./qa/manual.js";
import qaAutomation from "./qa/automation.js";

// quantum
import quantumQuantumSimulation from "./quantum/quantum-simulation.js";
import quantumQuantumOptimization from "./quantum/quantum-optimization.js";
import quantumQuantumHardware from "./quantum/quantum-hardware.js";
import quantumQuantumResearcher from "./quantum/quantum-researcher.js";
import quantumQuantumCrypto from "./quantum/quantum-crypto.js";
import quantumQuantumMl from "./quantum/quantum-ml.js";
import quantumQuantumAlgorithms from "./quantum/quantum-algorithms.js";
import quantumQuantumDeveloper from "./quantum/quantum-developer.js";

// languages
import languagesDart from "./languages/dart.js";
import languagesSwift from "./languages/swift.js";
import languagesC from "./languages/c.js";
import languagesKotlin from "./languages/kotlin.js";
import languagesPhp from "./languages/php.js";
import languagesRuby from "./languages/ruby.js";
import languagesCsharp from "./languages/csharp.js";
import languagesCpp from "./languages/cpp.js";
import languagesJava from "./languages/java.js";
import languagesRust from "./languages/rust.js";
import languagesGo from "./languages/go.js";
import languagesJavascript from "./languages/javascript.js";
import languagesTypescript from "./languages/typescript.js";
import languagesPython from "./languages/python.js";

// web3
import web3Web3Indexer from "./web3/web3-indexer.js";
import web3ZkDeveloper from "./web3/zk-developer.js";
import web3DaoDeveloper from "./web3/dao-developer.js";
import web3GamefiDeveloper from "./web3/gamefi-developer.js";
import web3WalletDeveloper from "./web3/wallet-developer.js";
import web3Web3Fullstack from "./web3/web3-fullstack.js";
import web3NftDeveloper from "./web3/nft-developer.js";
import web3DefiDeveloper from "./web3/defi-developer.js";
import web3Web3Frontend from "./web3/web3-frontend.js";
import web3DappDeveloper from "./web3/dapp-developer.js";

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
  aimlMlEngineer,
  aimlDataScientist,
  aimlAiDeveloper,
  aimlNlpEngineer,
  aimlCvEngineer,
  aimlLlmEngineer,
  aimlMlops,
  aimlDataEngineer,
  aimlRlEngineer,
  aimlPromptEngineer,
  cloudAwsArchitect,
  cloudAzureArchitect,
  cloudGcpArchitect,
  cloudServerlessDev,
  cloudCloudNative,
  cloudFinopsEngineer,
  cloudMultiCloudArchitect,
  cloudCloudMigration,
  cloudEdgeEngineer,
  cloudObservabilityEngineer,
  cybersecurityMalwareAnalyst,
  cybersecurityGrcAnalyst,
  cybersecuritySecurityArchitect,
  cybersecurityThreatHunter,
  cybersecurityForensicsAnalyst,
  cybersecurityBugBountyHunter,
  cybersecurityPentester,
  cybersecuritySocAnalyst,
  cybersecurityAppsecEngineer,
  cybersecurityRedTeam,
  cybersecurityBlueTeam,
  cybersecurityCloudSecurity,
  databaseGraphDbEngineer,
  databaseVectorDbEngineer,
  databaseCassandraEngineer,
  databaseRedisEngineer,
  databaseDbReliability,
  databaseNosqlEngineer,
  databaseDataModeler,
  databaseMongodbAdmin,
  databaseMysqlDba,
  databasePostgresDba,
  datascienceStatistician,
  datascienceAnalyticsEngineer,
  datascienceDataArchitect,
  datascienceMlAnalyst,
  datascienceBiDeveloper,
  datascienceDsDataEngineer,
  datascienceDsDataScientist,
  datascienceDataAnalyst,
  devopsPlatformEngineer,
  devopsDevsecops,
  devopsAzureDev,
  devopsGcpDev,
  devopsAwsDev,
  devopsKubernetes,
  devopsInfra,
  devopsSre,
  devopsCicd,
  devopsCloud,
  gamedevToolsDev,
  gamedevGameplayEngineer,
  gamedevXrDev,
  gamedevGameBackend,
  gamedevShaderDev,
  gamedevGameAi,
  gamedevGodot,
  gamedevGameDesigner,
  gamedevWebGame,
  gamedevUnreal,
  gamedevUnity,
  qaQaLead,
  qaAccessibilityQa,
  qaChaosEngineer,
  qaSdet,
  qaApiQa,
  qaMobileQa,
  qaSecurityQa,
  qaPerformance,
  qaManual,
  qaAutomation,
  quantumQuantumSimulation,
  quantumQuantumOptimization,
  quantumQuantumHardware,
  quantumQuantumResearcher,
  quantumQuantumCrypto,
  quantumQuantumMl,
  quantumQuantumAlgorithms,
  quantumQuantumDeveloper,
  languagesDart,
  languagesSwift,
  languagesC,
  languagesKotlin,
  languagesPhp,
  languagesRuby,
  languagesCsharp,
  languagesCpp,
  languagesJava,
  languagesRust,
  languagesGo,
  languagesJavascript,
  languagesTypescript,
  languagesPython,
  web3Web3Indexer,
  web3ZkDeveloper,
  web3DaoDeveloper,
  web3GamefiDeveloper,
  web3WalletDeveloper,
  web3Web3Fullstack,
  web3NftDeveloper,
  web3DefiDeveloper,
  web3Web3Frontend,
  web3DappDeveloper,
];
