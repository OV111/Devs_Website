// Script: inject sideLeft + sideRight into every blockchain.json layer
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../src/data/roadmaps/blockchain.json");
const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

// ─── Side panel definitions ───────────────────────────────────────────────────
// Format: sides[trackId][layerOrder] = { sideLeft: [...], sideRight: [...] }

const sides = {
  "smart-contract": {
    1: {
      sideLeft: [
        {
          title: "The EVM Execution Model",
          children: [
            {
              title: "Opcodes and the stack machine",
              description: "The EVM is a 256-bit stack machine. Every Solidity statement compiles to a sequence of opcodes that manipulate a last-in-first-out stack — understanding this helps you reason about gas costs.",
              resources: [
                { label: "EVM Opcodes Reference", url: "https://www.evm.codes/", type: "docs" },
                { label: "Ethereum Yellow Paper", url: "https://ethereum.github.io/yellowpaper/paper.pdf", type: "docs" }
              ]
            },
            {
              title: "Gas and computation costs",
              description: "Every opcode has a fixed gas cost. Storage writes are the most expensive (20,000 gas for a cold SSTORE), while reading from memory is cheap — this asymmetry shapes every optimization decision.",
              resources: [
                { label: "EVM Gas Costs Explained", url: "https://docs.alchemy.com/docs/ethereum-virtual-machine-evm", type: "article" },
                { label: "Gas Cost Table (EIP-2929)", url: "https://eips.ethereum.org/EIPS/eip-2929", type: "docs" }
              ]
            }
          ]
        },
        {
          title: "Solidity Type Safety",
          children: [
            {
              title: "Value types vs reference types",
              description: "Value types (uint, bool, address) are copied on assignment; reference types (arrays, structs, mappings) point into storage or memory. Confusing the two is a common source of bugs.",
              resources: [
                { label: "Solidity Docs – Types", url: "https://docs.soliditylang.org/en/latest/types.html", type: "docs" },
                { label: "Solidity Value vs Reference Types", url: "https://medium.com/coinmonks/solidity-storage-vs-memory-vs-calldata-8c7e8c38bce", type: "article" }
              ]
            },
            {
              title: "Integer overflow before 0.8",
              description: "Solidity < 0.8 silently wraps on overflow; 0.8+ reverts by default. Legacy contracts use SafeMath — knowing why prevents critical arithmetic bugs.",
              resources: [
                { label: "SafeMath vs Solidity 0.8", url: "https://docs.openzeppelin.com/contracts/4.x/utilities#math", type: "docs" },
                { label: "Overflow Attack History", url: "https://consensys.github.io/smart-contract-best-practices/attacks/arithmetic-overflow/", type: "article" }
              ]
            }
          ]
        }
      ],
      sideRight: [
        {
          title: "Remix IDE Mastery",
          children: [
            {
              title: "Deploy and interact without a wallet",
              description: "Remix's JavaScript VM simulates a local blockchain with pre-funded accounts — ideal for rapid iteration without MetaMask or testnets.",
              resources: [
                { label: "Remix IDE Documentation", url: "https://remix-ide.readthedocs.io/", type: "docs" },
                { label: "Remix Quickstart Video", url: "https://www.youtube.com/watch?v=WmeWbo7wzGI", type: "video" }
              ]
            },
            {
              title: "Reading transaction receipts",
              description: "After deployment, Remix shows the transaction receipt with gas used, contract address, and event logs — learn to read these before moving to mainnet tools.",
              resources: [
                { label: "Ethereum Transaction Receipts", url: "https://ethereum.org/en/developers/docs/transactions/", type: "docs" },
                { label: "Decoding Event Logs", url: "https://docs.alchemy.com/docs/deep-dive-into-eth_getlogs", type: "article" }
              ]
            }
          ]
        },
        {
          title: "Blockchain Immutability",
          children: [
            {
              title: "Why contracts can't be changed",
              description: "Once deployed, contract bytecode is permanent on-chain. Upgrade patterns (proxy, diamond) work around this limitation by separating logic from storage.",
              resources: [
                { label: "OpenZeppelin Upgrades Guide", url: "https://docs.openzeppelin.com/upgrades-plugins/1.x/", type: "docs" },
                { label: "Proxy Pattern Explained", url: "https://medium.com/openzeppelin/proxy-patterns-explained-e693b069e2c1", type: "article" }
              ]
            },
            {
              title: "Finality and reorgs",
              description: "Ethereum blocks become final after enough confirmations. A reorg can un-mine a transaction — production dApps wait for finality before releasing funds.",
              resources: [
                { label: "Ethereum Finality", url: "https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/#finality", type: "docs" },
                { label: "Chain Reorg Risk", url: "https://www.alchemy.com/overviews/what-is-a-reorg", type: "article" }
              ]
            }
          ]
        }
      ]
    },
    2: {
      sideLeft: [
        {
          title: "Storage Layout Internals",
          children: [
            {
              title: "Slot packing",
              description: "The EVM stores state in 32-byte slots. Solidity packs smaller types (uint128, bool) into the same slot — ordering your struct fields correctly can halve your storage costs.",
              resources: [
                { label: "Solidity Storage Layout", url: "https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html", type: "docs" },
                { label: "Slot Packing Gas Savings", url: "https://medium.com/coinmonks/gas-optimization-in-solidity-part-i-variables-9d5775e43dde", type: "article" }
              ]
            },
            {
              title: "Mappings and hash collisions",
              description: "Mapping values are stored at keccak256(key . slot). You cannot enumerate mapping keys — a design limitation that shapes many token and registry patterns.",
              resources: [
                { label: "Solidity Mappings Docs", url: "https://docs.soliditylang.org/en/latest/types.html#mappings", type: "docs" },
                { label: "How Mappings Work Internally", url: "https://programtheblockchain.com/posts/2018/03/09/understanding-ethereum-smart-contract-storage/", type: "article" }
              ]
            }
          ]
        },
        {
          title: "Events and Indexing",
          children: [
            {
              title: "Logs are not storage",
              description: "Events emit data into transaction logs — readable off-chain but inaccessible to contracts. They are 8x cheaper than storage, making them ideal for audit trails.",
              resources: [
                { label: "Solidity Events Reference", url: "https://docs.soliditylang.org/en/latest/contracts.html#events", type: "docs" },
                { label: "Ethereum Logs vs Storage", url: "https://blog.openzeppelin.com/ethereum-in-depth-part-2-6339cf6bddb9", type: "article" }
              ]
            },
            {
              title: "Indexed parameters",
              description: "Marking up to 3 event parameters as indexed creates a Bloom filter topic, enabling efficient off-chain filtering — critical for dApps that subscribe to contract activity.",
              resources: [
                { label: "eth_getLogs Filtering", url: "https://docs.alchemy.com/docs/deep-dive-into-eth_getlogs", type: "docs" },
                { label: "Indexed vs Non-Indexed Events", url: "https://medium.com/mycrypto/understanding-event-logs-on-the-ethereum-blockchain-f4ae7ba50378", type: "article" }
              ]
            }
          ]
        }
      ],
      sideRight: [
        {
          title: "Error Handling Patterns",
          children: [
            {
              title: "require vs revert vs assert",
              description: "require is for input validation (refunds remaining gas), assert is for invariant checks (should never fail), and custom revert errors save gas vs string messages.",
              resources: [
                { label: "Solidity Error Handling", url: "https://docs.soliditylang.org/en/latest/control-structures.html#error-handling", type: "docs" },
                { label: "Custom Errors Gas Savings", url: "https://blog.soliditylang.org/2021/04/21/custom-errors/", type: "article" }
              ]
            },
            {
              title: "Reentrancy and CEI pattern",
              description: "The DAO hack exploited reentrancy: always follow Checks-Effects-Interactions (CEI) — validate, update state, then make external calls — to prevent recursive re-entry.",
              resources: [
                { label: "Reentrancy Attack Explained", url: "https://consensys.github.io/smart-contract-best-practices/attacks/reentrancy/", type: "article" },
                { label: "OpenZeppelin ReentrancyGuard", url: "https://docs.openzeppelin.com/contracts/4.x/api/security#ReentrancyGuard", type: "docs" }
              ]
            }
          ]
        },
        {
          title: "Constructor Patterns",
          children: [
            {
              title: "Initializing with ownership",
              description: "Most contracts need an owner. The constructor is the safest place to set msg.sender as owner — it runs exactly once at deployment time.",
              resources: [
                { label: "OpenZeppelin Ownable", url: "https://docs.openzeppelin.com/contracts/4.x/access-control", type: "docs" },
                { label: "Constructor Security", url: "https://medium.com/@blockchainsimplified/smart-contract-security-ownership-patterns-d9b4e0a13b35", type: "article" }
              ]
            },
            {
              title: "Immutable variables",
              description: "Variables declared immutable are set once in the constructor and inlined into the bytecode — cheaper to read than storage and safer than constants for deployment-time values.",
              resources: [
                { label: "Solidity Immutable Docs", url: "https://docs.soliditylang.org/en/latest/contracts.html#immutable", type: "docs" },
                { label: "Immutable vs Constant Gas", url: "https://medium.com/coinmonks/gas-cost-of-solidity-library-functions-dbe0cedd4678", type: "article" }
              ]
            }
          ]
        }
      ]
    },
    3: {
      sideLeft: [
        {
          title: "Foundry Architecture",
          children: [
            {
              title: "forge, cast, anvil, chisel",
              description: "Foundry ships four tools: forge for building and testing, cast for on-chain interactions, anvil for a local testnet, and chisel for a Solidity REPL — each maps to a stage of the dev lifecycle.",
              resources: [
                { label: "Foundry Book", url: "https://book.getfoundry.sh/", type: "docs" },
                { label: "Foundry vs Hardhat Comparison", url: "https://medium.com/coinmonks/foundry-vs-hardhat-which-is-better-for-solidity-development-in-2023-af9a85aa1eb", type: "article" }
              ]
            },
            {
              title: "forge test verbosity flags",
              description: "Running forge test -vvvv gives full call traces including reverts — invaluable for debugging why a test fails without inserting console.log into contracts.",
              resources: [
                { label: "Foundry Testing Docs", url: "https://book.getfoundry.sh/forge/tests", type: "docs" },
                { label: "Debugging with Foundry Traces", url: "https://www.youtube.com/watch?v=4OJlYo5fKgk", type: "video" }
              ]
            }
          ]
        },
        {
          title: "Local Development Workflow",
          children: [
            {
              title: "Forking mainnet with anvil",
              description: "anvil --fork-url lets you simulate mainnet state locally — test interactions with live Uniswap or Aave contracts without spending ETH.",
              resources: [
                { label: "Anvil Fork Mode", url: "https://book.getfoundry.sh/anvil/", type: "docs" },
                { label: "Mainnet Forking Guide", url: "https://www.quicknode.com/guides/ethereum-development/how-to-fork-ethereum-mainnet-with-foundry", type: "article" }
              ]
            },
            {
              title: "Deterministic deployments",
              description: "Using CREATE2 with a salt produces predictable contract addresses regardless of nonce — essential for counterfactual deployment and cross-chain address parity.",
              resources: [
                { label: "CREATE2 EIP-1014", url: "https://eips.ethereum.org/EIPS/eip-1014", type: "docs" },
                { label: "CREATE2 Factory Pattern", url: "https://docs.openzeppelin.com/cli/2.8/deploying-with-create2", type: "article" }
              ]
            }
          ]
        }
      ],
      sideRight: [
        {
          title: "Script-Based Deployment",
          children: [
            {
              title: "forge script vs forge create",
              description: "forge script runs a Solidity deployment script with full scripting capabilities (loops, conditionals, chaining); forge create is simpler for single-contract deploys.",
              resources: [
                { label: "Foundry Deploy Scripts", url: "https://book.getfoundry.sh/tutorials/solidity-scripting", type: "docs" },
                { label: "Deployment Best Practices", url: "https://www.youtube.com/watch?v=wjnj0HRSXMU", type: "video" }
              ]
            },
            {
              title: "Broadcast and verification",
              description: "--broadcast sends transactions on-chain; adding --verify and --etherscan-api-key auto-verifies source on Etherscan in one command.",
              resources: [
                { label: "Etherscan Verification via Foundry", url: "https://book.getfoundry.sh/reference/forge/forge-verify-contract", type: "docs" },
                { label: "Contract Verification Guide", url: "https://medium.com/coinmonks/how-to-verify-a-smart-contract-on-etherscan-using-foundry-9c1b62dceb97", type: "article" }
              ]
            }
          ]
        },
        {
          title: "Environment and Key Management",
          children: [
            {
              title: ".env and vm.envString()",
              description: "Never hardcode private keys. Load them from .env using vm.envString() in Foundry scripts — and add .env to .gitignore immediately.",
              resources: [
                { label: "Foundry Cheatcodes – env", url: "https://book.getfoundry.sh/cheatcodes/env-string", type: "docs" },
                { label: "Secret Management for Web3 Devs", url: "https://medium.com/@dev.to/how-to-handle-secrets-in-foundry-projects-6a4a69a4fc22", type: "article" }
              ]
            },
            {
              title: "Hardware wallets with cast",
              description: "cast wallet sign --ledger and forge script --ledger send transactions through a Ledger without exposing the private key to the host machine.",
              resources: [
                { label: "Foundry Hardware Wallet Docs", url: "https://book.getfoundry.sh/reference/cast/cast-wallet-sign", type: "docs" },
                { label: "Secure Key Management in Crypto", url: "https://www.ledger.com/academy/hardwarewallet/why-you-should-use-a-hardware-wallet", type: "article" }
              ]
            }
          ]
        }
      ]
    },
    4: {
      sideLeft: [
        {
          title: "OpenZeppelin Contract Architecture",
          children: [
            {
              title: "Why inherit from OZ contracts",
              description: "OpenZeppelin contracts are audited, battle-tested, and follow ERC standards precisely. Inheriting them reduces attack surface and keeps your code reviewable against a known reference.",
              resources: [
                { label: "OpenZeppelin Contracts Docs", url: "https://docs.openzeppelin.com/contracts/4.x/", type: "docs" },
                { label: "OZ Security Audits", url: "https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/audits", type: "docs" }
              ]
            },
            {
              title: "ERC-20 hooks and _beforeTokenTransfer",
              description: "OZ's ERC-20 exposes virtual hooks like _beforeTokenTransfer so you can add pausability, blacklists, or vesting logic without rewriting the core token.",
              resources: [
                { label: "ERC20 _beforeTokenTransfer", url: "https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20-_beforeTokenTransfer-address-address-uint256-", type: "docs" },
                { label: "Extending OZ ERC20", url: "https://medium.com/coinmonks/extending-erc-20-with-custom-logic-using-openzeppelin-14c5b2b41b25", type: "article" }
              ]
            }
          ]
        },
        {
          title: "ERC Token Standards",
          children: [
            {
              title: "ERC-20 allowance and permit",
              description: "The approve/transferFrom pattern requires two transactions. EIP-2612 permit() adds gasless approvals via signatures, reducing UX friction significantly.",
              resources: [
                { label: "EIP-2612 Permit", url: "https://eips.ethereum.org/EIPS/eip-2612", type: "docs" },
                { label: "Permit Explained", url: "https://soliditydeveloper.com/erc20-permit", type: "article" }
              ]
            },
            {
              title: "ERC-721 vs ERC-1155",
              description: "ERC-721 is one NFT per ID; ERC-1155 supports both fungible and non-fungible tokens in one contract with batch transfers — better for gaming assets.",
              resources: [
                { label: "ERC-1155 Standard", url: "https://eips.ethereum.org/EIPS/eip-1155", type: "docs" },
                { label: "When to Use ERC-1155 vs ERC-721", url: "https://medium.com/sandbox-game/erc-1155-a-new-standard-for-non-fungible-tokens-9d7d258b6dae", type: "article" }
              ]
            }
          ]
        }
      ],
      sideRight: [
        {
          title: "Access Control Patterns",
          children: [
            {
              title: "Ownable vs AccessControl",
              description: "Ownable is simple single-owner; AccessControl supports multiple roles with fine-grained permissions. Use AccessControl for any contract with more than one privileged operation.",
              resources: [
                { label: "OZ AccessControl Docs", url: "https://docs.openzeppelin.com/contracts/4.x/access-control", type: "docs" },
                { label: "Role-Based Access Control", url: "https://medium.com/coinmonks/role-based-access-control-with-openzeppelin-f75b5af5cac7", type: "article" }
              ]
            },
            {
              title: "Two-step ownership transfer",
              description: "Ownable2Step requires the new owner to accept before transfer completes — preventing accidental loss of ownership by mistyping an address.",
              resources: [
                { label: "Ownable2Step Docs", url: "https://docs.openzeppelin.com/contracts/4.x/api/access#Ownable2Step", type: "docs" },
                { label: "Safe Ownership Transfer", url: "https://medium.com/consensys-diligence/ownership-and-access-control-in-solidity-6a5a49c6bc27", type: "article" }
              ]
            }
          ]
        },
        {
          title: "Upgradeability with Proxies",
          children: [
            {
              title: "Transparent vs UUPS proxies",
              description: "Transparent proxies put upgrade logic in the proxy; UUPS puts it in the implementation — UUPS is cheaper to deploy and call but requires discipline to keep upgradeability in the impl.",
              resources: [
                { label: "OZ Proxy Upgrade Pattern", url: "https://docs.openzeppelin.com/contracts/4.x/api/proxy", type: "docs" },
                { label: "Transparent vs UUPS", url: "https://medium.com/openzeppelin/uups-proxies-tutorial-solidity-javascript-9d12a1f1c0bd", type: "article" }
              ]
            },
            {
              title: "Storage collision and ERC-1967",
              description: "Proxy and implementation contracts share storage slots — ERC-1967 defines dedicated slots for proxy metadata to prevent collisions with implementation variables.",
              resources: [
                { label: "ERC-1967 Storage Slots", url: "https://eips.ethereum.org/EIPS/eip-1967", type: "docs" },
                { label: "Storage Collision Explained", url: "https://medium.com/nomic-labs-blog/malicious-backdoors-in-ethereum-proxies-62629adf3357", type: "article" }
              ]
            }
          ]
        }
      ]
    },
    5: {
      sideLeft: [
        {
          title: "Forge Test Architecture",
          children: [
            {
              title: "setUp() and test isolation",
              description: "Each Forge test function runs against a fresh setUp() snapshot — state does not bleed between tests, giving you true unit isolation without mocking.",
              resources: [
                { label: "Foundry Tests Docs", url: "https://book.getfoundry.sh/forge/tests", type: "docs" },
                { label: "Writing Good Forge Tests", url: "https://www.youtube.com/watch?v=FqwTdWJCZTs", type: "video" }
              ]
            },
            {
              title: "Cheatcodes for time and caller",
              description: "vm.warp() advances block time, vm.prank() spoofs msg.sender, vm.deal() sets ETH balance — these cheatcodes let you simulate any scenario without deploying to a testnet.",
              resources: [
                { label: "Foundry Cheatcodes", url: "https://book.getfoundry.sh/cheatcodes/", type: "docs" },
                { label: "Cheatcodes Tutorial", url: "https://www.youtube.com/watch?v=BKKLMnbZEFc", type: "video" }
              ]
            }
          ]
        },
        {
          title: "Coverage and Quality",
          children: [
            {
              title: "forge coverage reports",
              description: "forge coverage generates LCOV/HTML coverage reports showing which lines and branches were hit — aim for 100% branch coverage on financial logic.",
              resources: [
                { label: "Foundry Coverage Docs", url: "https://book.getfoundry.sh/forge/coverage", type: "docs" },
                { label: "Interpreting Coverage Reports", url: "https://medium.com/coinmonks/smart-contract-test-coverage-with-foundry-1b43be94e6d0", type: "article" }
              ]
            },
            {
              title: "Fuzz testing with Forge",
              description: "Prefix a test with testFuzz_ and Foundry runs it hundreds of times with random inputs — finding edge cases your unit tests miss.",
              resources: [
                { label: "Foundry Fuzz Testing", url: "https://book.getfoundry.sh/forge/fuzz-testing", type: "docs" },
                { label: "Fuzz Testing Smart Contracts", url: "https://blog.trailofbits.com/2022/03/14/use-our-suite-of-fuzz-testing-tools/", type: "article" }
              ]
            }
          ]
        }
      ],
      sideRight: [
        {
          title: "Invariant Testing",
          children: [
            {
              title: "Stateful fuzz vs invariant testing",
              description: "Invariant tests run sequences of random calls across the whole contract and assert global properties after each sequence — they find vulnerabilities that unit tests can't.",
              resources: [
                { label: "Foundry Invariant Testing", url: "https://book.getfoundry.sh/forge/invariant-testing", type: "docs" },
                { label: "Invariant Testing Guide", url: "https://medium.com/coinmonks/invariant-testing-in-foundry-explained-c44f2e6b8e5e", type: "article" }
              ]
            },
            {
              title: "Handler contracts",
              description: "Handler contracts scope which calls the fuzzer makes, preventing time-wasting invalid sequences and guiding the fuzzer toward meaningful state transitions.",
              resources: [
                { label: "Invariant Test Handlers", url: "https://book.getfoundry.sh/forge/invariant-testing#handler-based-testing", type: "docs" },
                { label: "Advanced Invariant Testing", url: "https://www.youtube.com/watch?v=O5nFmGCKB4w", type: "video" }
              ]
            }
          ]
        },
        {
          title: "CI for Smart Contracts",
          children: [
            {
              title: "GitHub Actions with Foundry",
              description: "foundry-rs/foundry-toolchain installs Foundry in CI; combine with forge test --gas-report to catch regressions in both correctness and gas costs.",
              resources: [
                { label: "Foundry CI GitHub Action", url: "https://github.com/foundry-rs/foundry-toolchain", type: "docs" },
                { label: "CI for Smart Contracts", url: "https://medium.com/coinmonks/setting-up-ci-cd-for-smart-contracts-with-foundry-and-github-actions-de9e985428d6", type: "article" }
              ]
            },
            {
              title: "Slither in CI",
              description: "Running Slither as a CI step catches known vulnerability patterns on every commit — faster feedback than manual review for common issues.",
              resources: [
                { label: "Slither GitHub Action", url: "https://github.com/crytic/slither-action", type: "docs" },
                { label: "Automating Security Checks", url: "https://blog.trailofbits.com/2018/10/19/slither-a-solidity-static-analysis-framework/", type: "article" }
              ]
            }
          ]
        }
      ]
    },
    6: {
      sideLeft: [
        {
          title: "Hardhat Plugin Ecosystem",
          children: [
            {
              title: "hardhat-gas-reporter",
              description: "hardhat-gas-reporter prints a gas cost table after every test run — showing min, max, and average gas per function call, tied to current ETH and gas prices.",
              resources: [
                { label: "hardhat-gas-reporter", url: "https://github.com/cgewecke/hardhat-gas-reporter", type: "docs" },
                { label: "Gas Reporting Tutorial", url: "https://medium.com/coinmonks/how-to-use-hardhat-gas-reporter-to-measure-smart-contract-gas-usage-ac45e7e706fc", type: "article" }
              ]
            },
            {
              title: "hardhat-network-helpers",
              description: "loadFixture(), time.increase(), and impersonateAccount() mirror Foundry's cheatcodes for JavaScript tests — essential for time-dependent and fork tests.",
              resources: [
                { label: "Hardhat Network Helpers", url: "https://hardhat.org/hardhat-network-helpers/docs/overview", type: "docs" },
                { label: "Fixtures and Helpers Guide", url: "https://hardhat.org/tutorial/testing-contracts", type: "docs" }
              ]
            }
          ]
        },
        {
          title: "ethers.js v6 Patterns",
          children: [
            {
              title: "Providers and signers",
              description: "A Provider reads from the chain; a Signer can sign and send transactions. Always separate them — your app should work read-only when no wallet is connected.",
              resources: [
                { label: "ethers.js v6 Docs", url: "https://docs.ethers.org/v6/", type: "docs" },
                { label: "Providers vs Signers Explained", url: "https://medium.com/coinmonks/ethers-js-providers-and-signers-explained-fc786a7d30a8", type: "article" }
              ]
            },
            {
              title: "Contract events and filters",
              description: "contract.queryFilter(filter, fromBlock, toBlock) fetches historical events; contract.on(event, handler) subscribes to live events — both use the same filter syntax.",
              resources: [
                { label: "ethers.js Events", url: "https://docs.ethers.org/v6/api/contract/#ContractEvent", type: "docs" },
                { label: "Event Filtering in ethers.js", url: "https://medium.com/coinmonks/listening-to-events-using-ethers-js-7e3b8d24e877", type: "article" }
              ]
            }
          ]
        }
      ],
      sideRight: [
        {
          title: "TypeChain for Type Safety",
          children: [
            {
              title: "Why TypeChain matters",
              description: "TypeChain generates TypeScript bindings from your ABIs — giving you compile-time checks on contract calls instead of runtime surprises from wrong argument types.",
              resources: [
                { label: "TypeChain Documentation", url: "https://github.com/dethcrypto/TypeChain", type: "docs" },
                { label: "TypeChain Setup Guide", url: "https://medium.com/coinmonks/typechain-tutorial-typesafe-ethereum-smart-contract-interactions-7acfba1be9b6", type: "article" }
              ]
            },
            {
              title: "ABI encoding and decoding",
              description: "ethers.js AbiCoder encodes/decodes raw calldata — useful for multicall, proxy dispatch, and understanding what the EVM actually receives.",
              resources: [
                { label: "ethers.js AbiCoder", url: "https://docs.ethers.org/v6/api/abi/", type: "docs" },
                { label: "ABI Encoding Explained", url: "https://medium.com/coinmonks/abi-encoding-in-solidity-understanding-function-selectors-and-calldata-9a41d1b1a2e8", type: "article" }
              ]
            }
          ]
        },
        {
          title: "Hardhat Forking and Impersonation",
          children: [
            {
              title: "Forking with Alchemy/Infura",
              description: "Set forking.url in hardhat.config.ts to fork mainnet — every test runs against real on-chain state including balances, deployed contracts, and storage.",
              resources: [
                { label: "Hardhat Mainnet Forking", url: "https://hardhat.org/hardhat-network/docs/guides/forking-other-networks", type: "docs" },
                { label: "Fork Testing Tutorial", url: "https://www.quicknode.com/guides/ethereum-development/hardhat-fork", type: "article" }
              ]
            },
            {
              title: "impersonateAccount for whale testing",
              description: "hardhat_impersonateAccount lets your tests act as any address — including whales with millions of tokens — to test edge cases without acquiring real funds.",
              resources: [
                { label: "Hardhat Impersonation Docs", url: "https://hardhat.org/hardhat-network/docs/reference#hardhat_impersonateaccount", type: "docs" },
                { label: "Impersonation Testing Guide", url: "https://medium.com/coinmonks/how-to-impersonate-a-wallet-in-hardhat-tests-bc7e59b0b19e", type: "article" }
              ]
            }
          ]
        }
      ]
    },
    7: {
      sideLeft: [
        {
          title: "Proxy and Upgrade Patterns",
          children: [
            {
              title: "Diamond standard (ERC-2535)",
              description: "The Diamond pattern lets a single proxy delegate to multiple facets (implementation contracts), solving the 24KB contract size limit and enabling modular upgrades.",
              resources: [
                { label: "ERC-2535 Diamond Standard", url: "https://eips.ethereum.org/EIPS/eip-2535", type: "docs" },
                { label: "Diamond Pattern Tutorial", url: "https://medium.com/1milliondevs/new-storage-layout-for-proxy-contracts-and-diamonds-98d01d0eadb", type: "article" }
              ]
            },
            {
              title: "Initializers vs constructors",
              description: "Proxy contracts can't use constructors (the logic runs in the implementation's context). Use an initializer function protected by an Initializable guard instead.",
              resources: [
                { label: "OZ Initializable Docs", url: "https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable", type: "docs" },
                { label: "Proxy Constructor Issue", url: "https://docs.openzeppelin.com/learn/upgrading-smart-contracts", type: "article" }
              ]
            }
          ]
        },
        {
          title: "Assembly and Yul",
          children: [
            {
              title: "Inline assembly with assembly {}",
              description: "Solidity's assembly{} block lets you write raw EVM opcodes inline — used for gas-critical paths, bit manipulation, and operations Solidity doesn't expose.",
              resources: [
                { label: "Solidity Inline Assembly", url: "https://docs.soliditylang.org/en/latest/assembly.html", type: "docs" },
                { label: "Yul Deep Dive", url: "https://medium.com/coinmonks/optimizing-your-solidity-smart-contracts-using-assembly-b5c01d625c06", type: "article" }
              ]
            },
            {
              title: "Yul for contract internals",
              description: "Pure Yul contracts compile to tighter bytecode than Solidity for hotspot functions — used in AMMs and other high-frequency contracts where every opcode counts.",
              resources: [
                { label: "Yul Language Reference", url: "https://docs.soliditylang.org/en/latest/yul.html", type: "docs" },
                { label: "Writing Contracts in Yul", url: "https://www.youtube.com/watch?v=r4yKide6jiU", type: "video" }
              ]
            }
          ]
        }
      ],
      sideRight: [
        {
          title: "Signature and Meta-Transactions",
          children: [
            {
              title: "EIP-712 typed data signing",
              description: "EIP-712 structured data signing makes signatures human-readable in wallets and prevents cross-contract replay attacks — the foundation of most gasless protocols.",
              resources: [
                { label: "EIP-712 Standard", url: "https://eips.ethereum.org/EIPS/eip-712", type: "docs" },
                { label: "EIP-712 Implementation Guide", url: "https://medium.com/metamask/eip712-is-coming-what-to-expect-and-how-to-use-it-bb92fd1a7a26", type: "article" }
              ]
            },
            {
              title: "Gasless relayer (ERC-2771)",
              description: "ERC-2771 defines a standard way for relayers to forward meta-transactions, with the ForwarderRecipient recovering the original sender from the trusted forwarder.",
              resources: [
                { label: "ERC-2771 Meta Transactions", url: "https://eips.ethereum.org/EIPS/eip-2771", type: "docs" },
                { label: "Gasless Transactions with Gelato", url: "https://docs.gelato.network/developer-services/relay", type: "docs" }
              ]
            }
          ]
        },
        {
          title: "Clone Factory Pattern",
          children: [
            {
              title: "ERC-1167 minimal proxies",
              description: "EIP-1167 minimal proxies deploy a 45-byte clone that delegates all calls to a master implementation — deploying 10x cheaper than a full contract while sharing logic.",
              resources: [
                { label: "ERC-1167 Minimal Proxy", url: "https://eips.ethereum.org/EIPS/eip-1167", type: "docs" },
                { label: "Clone Factory Pattern", url: "https://blog.openzeppelin.com/deep-dive-into-the-minimal-proxy-contract", type: "article" }
              ]
            },
            {
              title: "ClonesWithImmutableArgs",
              description: "This pattern extends ERC-1167 to allow immutable constructor-like arguments appended to the bytecode — zero-cost parameterized clones without storage.",
              resources: [
                { label: "ClonesWithImmutableArgs", url: "https://github.com/wighawag/clones-with-immutable-args", type: "docs" },
                { label: "Immutable Args Clone Deep Dive", url: "https://medium.com/coinmonks/clones-with-immutable-args-in-solidity-9f7e9ab93f29", type: "article" }
              ]
            }
          ]
        }
      ]
    },
    8: {
      sideLeft: [
        {
          title: "EVM Gas Internals",
          children: [
            {
              title: "Cold vs warm storage access (EIP-2929)",
              description: "After EIP-2929, first access to a storage slot costs 2100 gas (cold), subsequent accesses cost 100 (warm). Structuring operations to re-use warm slots is critical for loops.",
              resources: [
                { label: "EIP-2929 Gas Costs", url: "https://eips.ethereum.org/EIPS/eip-2929", type: "docs" },
                { label: "Cold vs Warm Storage", url: "https://medium.com/coinmonks/eip-2929-and-access-lists-explained-d63ebc25a09a", type: "article" }
              ]
            },
            {
              title: "Memory expansion cost",
              description: "Memory in the EVM grows quadratically — allocating large arrays in memory can cost more than expected. Prefer calldata for read-only inputs.",
              resources: [
                { label: "EVM Memory Costs", url: "https://www.evm.codes/about", type: "docs" },
                { label: "Memory Optimization in Solidity", url: "https://medium.com/coinmonks/memory-optimization-in-solidity-a-complete-guide-64e9faf13e0c", type: "article" }
              ]
            }
          ]
        },
        {
          title: "Bytecode Optimization",
          children: [
            {
              title: "Solidity optimizer runs",
              description: "The optimizer runs parameter trades code size vs gas at runtime. High runs (e.g. 1,000,000) optimize for repeated calls; low runs (200) optimize deployment size.",
              resources: [
                { label: "Solidity Optimizer Docs", url: "https://docs.soliditylang.org/en/latest/internals/optimizer.html", type: "docs" },
                { label: "Optimizer Runs Explained", url: "https://medium.com/coinmonks/solidity-optimizer-optimizing-smart-contracts-for-gas-efficiency-3b2f9d5a8024", type: "article" }
              ]
            },
            {
              title: "via-IR compilation pipeline",
              description: "via-IR routes compilation through Yul IR before final code generation, enabling optimizations (like CSE and dead code elimination) impossible in the legacy pipeline.",
              resources: [
                { label: "Solidity via-IR Docs", url: "https://docs.soliditylang.org/en/latest/ir-breaking-changes.html", type: "docs" },
                { label: "via-IR Deep Dive", url: "https://medium.com/coinmonks/solidity-via-ir-compile-pipeline-explained-6da7c1b6dbab", type: "article" }
              ]
            }
          ]
        }
      ],
      sideRight: [
        {
          title: "Common Gas Optimizations",
          children: [
            {
              title: "Custom errors over revert strings",
              description: "Custom errors (error InsufficientBalance()) cost ~50% less gas than string reverts and are easier to decode programmatically — there is no reason not to use them.",
              resources: [
                { label: "Custom Errors Blog Post", url: "https://blog.soliditylang.org/2021/04/21/custom-errors/", type: "article" },
                { label: "Gas Cost Comparison", url: "https://medium.com/coinmonks/solidity-custom-errors-saving-gas-with-custom-error-handling-58e9aead0ab7", type: "article" }
              ]
            },
            {
              title: "Unchecked arithmetic blocks",
              description: "In Solidity 0.8+, wrapping arithmetic in unchecked{} skips overflow checks — safe for loop counters and decrement operations where overflow is provably impossible.",
              resources: [
                { label: "Solidity Unchecked Docs", url: "https://docs.soliditylang.org/en/latest/control-structures.html#checked-or-unchecked-arithmetic", type: "docs" },
                { label: "Unchecked Gas Savings", url: "https://medium.com/coinmonks/gas-savings-in-solidity-by-using-unchecked-arithmetic-0c8c30b8ffa", type: "article" }
              ]
            }
          ]
        },
        {
          title: "Storage Optimization",
          children: [
            {
              title: "Packing booleans into a bitmap",
              description: "Storing 256 boolean flags in a single uint256 using bitwise operations uses one storage slot instead of 256, cutting storage costs by 99%.",
              resources: [
                { label: "Bitmap Patterns in Solidity", url: "https://medium.com/coinmonks/bitmaps-in-solidity-explained-a-complete-guide-6ad6e7cf8ede", type: "article" },
                { label: "ERC-721A Bitpacked Storage", url: "https://www.azuki.com/erc721a", type: "article" }
              ]
            },
            {
              title: "SSTORE2 for large data",
              description: "SSTORE2 stores arbitrary bytes as contract bytecode (read via EXTCODECOPY) — 100x cheaper than storage for large blobs like NFT metadata or Merkle trees.",
              resources: [
                { label: "SSTORE2 Library", url: "https://github.com/0xsequence/sstore2", type: "docs" },
                { label: "SSTORE2 Explained", url: "https://medium.com/coinmonks/sstore2-a-gas-efficient-alternative-to-storage-in-solidity-1bf4db8b2b0f", type: "article" }
              ]
            }
          ]
        }
      ]
    },
    9: {
      sideLeft: [
        {
          title: "AMM Design Principles",
          children: [
            {
              title: "Constant product formula",
              description: "x*y=k means price is determined by the ratio of reserves. Adding liquidity shifts k upward; swaps move along the curve — understanding this prevents impermanent loss surprises.",
              resources: [
                { label: "Uniswap v2 Whitepaper", url: "https://uniswap.org/whitepaper.pdf", type: "docs" },
                { label: "AMM Mechanics Explained", url: "https://medium.com/dragonfly-research/what-explains-the-rise-of-amms-7d008af1c399", type: "article" }
              ]
            },
            {
              title: "Uniswap v3 concentrated liquidity",
              description: "v3 lets LPs concentrate liquidity within price ranges, boosting capital efficiency by up to 4000x vs v2 — but introduces active management complexity.",
              resources: [
                { label: "Uniswap v3 Whitepaper", url: "https://uniswap.org/whitepaper-v3.pdf", type: "docs" },
                { label: "Concentrated Liquidity Explained", url: "https://medium.com/uniswap/uniswap-v3-the-universal-amm-94c69300a67d", type: "article" }
              ]
            }
          ]
        },
        {
          title: "Lending Protocol Design",
          children: [
            {
              title: "Collateralization and liquidations",
              description: "Lending protocols require over-collateralization. When collateral value drops below the liquidation threshold, bots earn a bonus to liquidate positions and keep the system solvent.",
              resources: [
                { label: "Aave Risk Framework", url: "https://docs.aave.com/risk/", type: "docs" },
                { label: "Liquidation Mechanics", url: "https://medium.com/coinmonks/defi-liquidations-explained-how-they-work-and-why-they-matter-b1e27e2b0c3b", type: "article" }
              ]
            },
            {
              title: "Interest rate models",
              description: "DeFi protocols use algorithmic interest rate models (linear or kinked) where rates rise with utilization to incentivize capital return when a pool is near-empty.",
              resources: [
                { label: "Compound Interest Rate Model", url: "https://compound.finance/docs/interest-rates", type: "docs" },
                { label: "Interest Rate Models in DeFi", url: "https://medium.com/coinmonks/interest-rate-models-in-defi-explained-76e254edac09", type: "article" }
              ]
            }
          ]
        }
      ],
      sideRight: [
        {
          title: "Flash Loans",
          children: [
            {
              title: "How flash loans work",
              description: "Flash loans borrow any amount within one transaction with zero collateral — as long as the full amount is returned in the same tx. Used for arbitrage, liquidations, and collateral swaps.",
              resources: [
                { label: "Aave Flash Loans Docs", url: "https://docs.aave.com/developers/guides/flash-loans", type: "docs" },
                { label: "Flash Loan Mechanics", url: "https://medium.com/coinmonks/flash-loans-explained-how-they-work-and-why-they-matter-e3c0e37b8b8e", type: "article" }
              ]
            },
            {
              title: "Flash loan attack vectors",
              description: "Many DeFi hacks use flash loans to manipulate on-chain price oracles. Never use spot AMM prices as oracles — use TWAPs or Chainlink instead.",
              resources: [
                { label: "Flash Loan Attack History", url: "https://medium.com/coinmonks/flash-loan-attacks-a-comprehensive-overview-96f547f31c47", type: "article" },
                { label: "TWAP Oracle Docs", url: "https://docs.uniswap.org/contracts/v2/concepts/core-concepts/oracles", type: "docs" }
              ]
            }
          ]
        },
        {
          title: "Oracle Integration",
          children: [
            {
              title: "Chainlink price feeds",
              description: "Chainlink aggregators provide tamper-resistant price data. Always check the updatedAt timestamp and answer to detect stale or invalid feeds before using the price.",
              resources: [
                { label: "Chainlink Data Feeds Docs", url: "https://docs.chain.link/data-feeds", type: "docs" },
                { label: "Safe Oracle Integration", url: "https://medium.com/coinmonks/how-to-safely-use-chainlink-price-feeds-in-smart-contracts-6d7a24261e16", type: "article" }
              ]
            },
            {
              title: "On-chain TWAP oracles",
              description: "Uniswap v3's TWAP oracle accumulates price-weighted time, making short-term manipulation expensive. Calculate the geometric mean price over a suitable window.",
              resources: [
                { label: "Uniswap v3 Oracle Docs", url: "https://docs.uniswap.org/contracts/v3/reference/core/interfaces/pool/IUniswapV3PoolDerivedState", type: "docs" },
                { label: "Building TWAP Oracles", url: "https://medium.com/coinmonks/twap-oracles-on-uniswap-v3-explained-e28d6cd8bfce", type: "article" }
              ]
            }
          ]
        }
      ]
    },
    10: {
      sideLeft: [
        {
          title: "Security Audit Preparation",
          children: [
            {
              title: "Self-audit checklist",
              description: "Before paying for an audit, self-audit with Slither, run Echidna invariant tests, check all external calls follow CEI, and review every privileged function.",
              resources: [
                { label: "Smart Contract Security Checklist", url: "https://consensys.github.io/smart-contract-best-practices/", type: "docs" },
                { label: "Pre-Audit Preparation Guide", url: "https://medium.com/coinmonks/how-to-prepare-your-smart-contract-for-a-security-audit-6fe7ed20ba0d", type: "article" }
              ]
            },
            {
              title: "Choosing an auditor",
              description: "Top firms include Trail of Bits, Spearbit, OpenZeppelin, and Code4rena (competitive). Budget $20k–$200k+ depending on contract complexity and firm reputation.",
              resources: [
                { label: "Security Auditor Directory", url: "https://www.web3securitydao.xyz/", type: "docs" },
                { label: "How to Choose an Auditor", url: "https://medium.com/coinmonks/how-to-choose-a-smart-contract-security-auditor-4d60a9a29d67", type: "article" }
              ]
            }
          ]
        },
        {
          title: "Mainnet Deployment",
          children: [
            {
              title: "Multisig with Safe",
              description: "Never deploy admin keys to an EOA on mainnet. Use a Gnosis Safe multisig so no single compromised key can drain the protocol.",
              resources: [
                { label: "Safe Docs", url: "https://docs.safe.global/", type: "docs" },
                { label: "Multisig Best Practices", url: "https://medium.com/coinmonks/gnosis-safe-best-practices-for-defi-protocols-6f25d4e0f90f", type: "article" }
              ]
            },
            {
              title: "Timelock controllers",
              description: "A TimelockController delays admin actions by a minimum delay (e.g. 48 hours), giving users time to exit if they disagree with a governance decision.",
              resources: [
                { label: "OZ TimelockController", url: "https://docs.openzeppelin.com/contracts/4.x/api/governance#TimelockController", type: "docs" },
                { label: "Timelock in DeFi Governance", url: "https://medium.com/coinmonks/timelocks-in-defi-how-they-protect-users-d0c5d5b44c33", type: "article" }
              ]
            }
          ]
        }
      ],
      sideRight: [
        {
          title: "On-Chain Monitoring",
          children: [
            {
              title: "Tenderly alerts",
              description: "Tenderly lets you set real-time alerts on events, function calls, or balance changes — getting paged when something unexpected happens on your contract.",
              resources: [
                { label: "Tenderly Alerting Docs", url: "https://docs.tenderly.co/alerts/intro-to-alerts", type: "docs" },
                { label: "DeFi Protocol Monitoring", url: "https://medium.com/coinmonks/how-to-monitor-defi-protocols-with-tenderly-f3f5e39a3451", type: "article" }
              ]
            },
            {
              title: "Forta threat detection",
              description: "Forta is a decentralized network of detection bots. Deploy a bot that fires on suspicious activity (large withdrawals, oracle deviations) and triggers your incident response.",
              resources: [
                { label: "Forta Documentation", url: "https://docs.forta.network/", type: "docs" },
                { label: "Building Forta Bots", url: "https://medium.com/fortanetwork/writing-your-first-forta-bot-1a9b4c44b3bb", type: "article" }
              ]
            }
          ]
        },
        {
          title: "Incident Response",
          children: [
            {
              title: "Emergency pause mechanisms",
              description: "Every production protocol should have a pause() function protected by a multisig that can halt deposits and withdrawals within minutes of detecting an attack.",
              resources: [
                { label: "OZ Pausable", url: "https://docs.openzeppelin.com/contracts/4.x/api/security#Pausable", type: "docs" },
                { label: "Incident Response for DeFi", url: "https://medium.com/coinmonks/smart-contract-incident-response-best-practices-e7e2f5d8a9bc", type: "article" }
              ]
            },
            {
              title: "Bug bounty programs",
              description: "Immunefi hosts the largest web3 bug bounty programs. Offering $50k–$10M+ rewards incentivizes white-hats to responsibly disclose vulnerabilities before attackers find them.",
              resources: [
                { label: "Immunefi Documentation", url: "https://immunefi.com/learn/", type: "docs" },
                { label: "Setting Up a Bug Bounty", url: "https://medium.com/coinmonks/how-to-launch-a-bug-bounty-program-for-your-defi-protocol-3b2f9c9e9c2a", type: "article" }
              ]
            }
          ]
        }
      ]
    }
  }
};

// ─── Inject sides into data ────────────────────────────────────────────────────
// For tracks not in the sides object above, we generate a minimal placeholder
function makePlaceholderSides(trackId, layer) {
  return {
    sideLeft: [
      {
        title: `${layer.title} – Core Concepts`,
        children: [
          {
            title: "Theory and background",
            description: `Deep foundational knowledge behind ${layer.title.toLowerCase()} — the mental models that let you reason about correctness before writing any code.`,
            resources: [
              { label: `${layer.title} Overview`, url: "https://ethereum.org/en/developers/docs/", type: "docs" },
              { label: "Blockchain Engineering Fundamentals", url: "https://www.youtube.com/results?search_query=blockchain+development", type: "video" }
            ]
          },
          {
            title: "Key design decisions",
            description: `Understanding why this technology was designed the way it was helps you use it correctly and avoid the pitfalls that tripped up earlier adopters.`,
            resources: [
              { label: "Official Documentation", url: "https://ethereum.org/en/developers/", type: "docs" },
              { label: "Architecture Discussion", url: "https://medium.com/coinmonks", type: "article" }
            ]
          }
        ]
      },
      {
        title: `${layer.title} – Tools and Ecosystem`,
        children: [
          {
            title: "Development tooling",
            description: "The tools, frameworks, and libraries the ecosystem has converged on for this area — knowing the ecosystem reduces time spent reinventing solved problems.",
            resources: [
              { label: "Developer Tooling Guide", url: "https://ethereum.org/en/developers/local-environment/", type: "docs" },
              { label: "Ecosystem Overview", url: "https://github.com/ConsenSys/ethereum-developer-tools-list", type: "docs" }
            ]
          },
          {
            title: "Testing and validation",
            description: "Every production-bound component in this layer needs tests. The specific patterns depend on the layer but always cover happy paths, edge cases, and failure modes.",
            resources: [
              { label: "Testing Smart Contracts", url: "https://ethereum.org/en/developers/docs/smart-contracts/testing/", type: "docs" },
              { label: "Security Best Practices", url: "https://consensys.github.io/smart-contract-best-practices/", type: "docs" }
            ]
          }
        ]
      }
    ],
    sideRight: [
      {
        title: `${layer.title} – Security Considerations`,
        children: [
          {
            title: "Attack surface",
            description: `Each layer of the blockchain stack has a specific attack surface. Understanding what can go wrong — and why — is prerequisite to writing code that won't.`,
            resources: [
              { label: "SWC Registry", url: "https://swcregistry.io/", type: "docs" },
              { label: "Trail of Bits Blog", url: "https://blog.trailofbits.com/", type: "article" }
            ]
          },
          {
            title: "Production checklist",
            description: "Before going live, verify your implementation against the industry-accepted checklist for this layer — deployment is permanent on mainnet.",
            resources: [
              { label: "Smart Contract Security Checklist", url: "https://consensys.github.io/smart-contract-best-practices/", type: "docs" },
              { label: "Rekt News – Post-Mortems", url: "https://rekt.news/", type: "article" }
            ]
          }
        ]
      },
      {
        title: `${layer.title} – Career and Community`,
        children: [
          {
            title: "Where developers gather",
            description: "The blockchain development community is spread across GitHub, Discord, and Ethereum Research. Following the right channels accelerates learning dramatically.",
            resources: [
              { label: "Ethereum Stack Exchange", url: "https://ethereum.stackexchange.com/", type: "docs" },
              { label: "Ethereum Research Forum", url: "https://ethresear.ch/", type: "article" }
            ]
          },
          {
            title: "Practice through competitions",
            description: "CTF competitions like Ethernaut, Damn Vulnerable DeFi, and Code4rena contests give hands-on experience with real vulnerability patterns in a safe environment.",
            resources: [
              { label: "Ethernaut Challenges", url: "https://ethernaut.openzeppelin.com/", type: "docs" },
              { label: "Damn Vulnerable DeFi", url: "https://www.damnvulnerabledefi.xyz/", type: "docs" }
            ]
          }
        ]
      }
    ]
  };
}

for (const trackId of Object.keys(data)) {
  for (const layer of data[trackId]) {
    const trackSides = sides[trackId];
    if (trackSides && trackSides[layer.order]) {
      layer.sideLeft = trackSides[layer.order].sideLeft;
      layer.sideRight = trackSides[layer.order].sideRight;
    } else {
      const placeholder = makePlaceholderSides(trackId, layer);
      layer.sideLeft = placeholder.sideLeft;
      layer.sideRight = placeholder.sideRight;
    }
  }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
console.log("Done. Layers updated:", Object.keys(data).map(k => `${k}(${data[k].length})`).join(", "));
