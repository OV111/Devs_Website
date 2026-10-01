/**
 * Teach-Back Rubric Seeder
 *
 * Usage:
 *   MONGO_URI=... node backend/seeders/teachBackRubricSeeder.js
 *
 * Rubrics are hand-authored (not LLM-generated) — grading quality depends on
 * these being accurate, so edit RUBRICS directly and re-run to update.
 *
 * MISCONCEPTIONS LIVE IN conceptSeeder.js, not here (Stage 3). `getRubric`
 * hydrates them from the matching concept, so one authored list drives both
 * grading and teaching. A `misconceptions` array left on a rubric below is only a
 * fallback for topics whose concept has not been authored yet.
 */

import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import process from "process";

// Same env files, in the same order, as backend/server.js.
dotenv.config({ path: "./backend/.env.local" });
dotenv.config({ path: "./backend/.env" });

const RUBRICS = [
  {
    path: "backend",
    layer: "layer-6",
    topic: "JWT Signature",
    criteria: [
      {
        id: "signature-purpose",
        label: "Purpose",
        description: "Why a JWT is signed",
        levels: [
          { score: 0, description: "Does not understand the purpose of a signature." },
          { score: 1, description: "Knows JWT contains a signature but cannot explain why." },
          { score: 2, description: "Correctly explains that the signature allows integrity/authenticity verification." },
          { score: 3, description: "Clearly explains signing, verification, integrity, and security implications." },
        ],
      },
      {
        id: "signing-vs-encryption",
        label: "Signing vs Encryption",
        description: "Distinguishing signing from encryption",
        levels: [
          { score: 0, description: "Confuses signing and encryption." },
          { score: 1, description: "Recognizes they are different but cannot explain how." },
          { score: 2, description: "Correctly distinguishes signing from encryption." },
          { score: 3, description: "Correctly distinguishes them and explains practical security implications." },
        ],
      },
      {
        id: "verification",
        label: "Verification",
        description: "How signature verification works",
        levels: [
          { score: 0, description: "Incorrect explanation." },
          { score: 1, description: "Basic understanding of verification." },
          { score: 2, description: "Correctly explains that the server verifies the signature." },
          { score: 3, description: "Can reason through what happens when a signed token is modified." },
        ],
      },
    ],
    // Misconceptions intentionally omitted — authored in conceptSeeder.js under
    // the "jwt-signature" concept and hydrated by getRubric.
  },
  {
    path: "backend",
    layer: "api-dev-1",
    topic: "DNS — domain resolution, A records, TTL",
    criteria: [
      {
        id: "resolution-chain",
        label: "Resolution chain",
        description: "How a hostname actually becomes an IP address",
        levels: [
          { score: 0, description: "Cannot describe how a domain name turns into an IP address." },
          { score: 1, description: "Knows DNS 'looks up' the IP but can't describe the chain of servers involved." },
          { score: 2, description: "Correctly describes the recursive resolver querying root, then TLD, then authoritative servers." },
          { score: 3, description: "Explains the full chain and why each hop exists, including what a resolver caches along the way." },
        ],
      },
      {
        id: "record-types",
        label: "Record types",
        description: "What an A record specifically maps, vs other record types",
        levels: [
          { score: 0, description: "Treats 'DNS record' as one undifferentiated thing." },
          { score: 1, description: "Knows an A record exists but can't say what it maps or how it differs from CNAME/MX." },
          { score: 2, description: "Correctly explains an A record maps a hostname to an IPv4 address." },
          { score: 3, description: "Correctly explains A records and can contrast with at least one other record type (CNAME, MX, AAAA) and when each applies." },
        ],
      },
      {
        id: "ttl-implications",
        label: "TTL implications",
        description: "What TTL controls and why it matters operationally",
        levels: [
          { score: 0, description: "Doesn't know what TTL is." },
          { score: 1, description: "Knows TTL is a number on a DNS record but not what it does." },
          { score: 2, description: "Correctly explains TTL controls how long resolvers cache the record before re-querying." },
          { score: 3, description: "Explains TTL and reasons correctly about a real consequence — e.g. why a high TTL means visitors keep hitting an old IP for a while after a DNS change, and why you'd lower it before a planned cutover." },
        ],
      },
    ],
    misconceptions: [
      "DNS resolution happens in a single step directly against one authoritative server, rather than through a chain of recursive/root/TLD/authoritative lookups.",
      "Changing a DNS record takes effect everywhere instantly — ignoring that caches obey the record's TTL until it expires.",
    ],
  },
  {
    path: "backend",
    layer: "api-dev-1",
    topic: "TCP vs UDP — connections, handshakes, reliability",
    criteria: [
      {
        id: "connection-model",
        label: "Connection model",
        description: "Connection-oriented vs connectionless, in their own words",
        levels: [
          { score: 0, description: "Cannot distinguish TCP from UDP at all." },
          { score: 1, description: "Knows TCP is 'reliable' and UDP is 'fast' but can't explain the mechanism behind either claim." },
          { score: 2, description: "Correctly explains TCP establishes and maintains a connection state, while UDP sends independent packets with no connection state." },
          { score: 3, description: "Explains the connection-model difference and can name a concrete protocol/use case built on each (e.g. HTTP over TCP, DNS queries or video streaming over UDP)." },
        ],
      },
      {
        id: "three-way-handshake",
        label: "Three-way handshake",
        description: "What actually happens when a TCP connection opens",
        levels: [
          { score: 0, description: "No concept of a handshake occurring before data transfer." },
          { score: 1, description: "Knows 'there's a handshake' but can't describe its steps." },
          { score: 2, description: "Correctly describes SYN, SYN-ACK, ACK as the three steps that establish a connection." },
          { score: 3, description: "Describes the handshake correctly and explains what it accomplishes — both sides confirming they can send and receive before any application data moves." },
        ],
      },
      {
        id: "reliability-tradeoff",
        label: "Reliability trade-off",
        description: "Why TCP's guarantees cost something, and when that cost isn't worth paying",
        levels: [
          { score: 0, description: "Believes one protocol is simply 'better' with no trade-off." },
          { score: 1, description: "Knows TCP retransmits lost packets but can't explain the cost of that guarantee." },
          { score: 2, description: "Correctly explains TCP's ordering/retransmission guarantees add latency and overhead that UDP skips." },
          { score: 3, description: "Explains the trade-off and gives a correct real scenario where UDP's lack of guarantees is the right choice (e.g. live video/voice, where a late retransmitted packet is worse than a dropped one)." },
        ],
      },
    ],
    misconceptions: [
      "UDP is simply 'worse' or 'less advanced' than TCP, rather than a deliberate trade-off that suits specific use cases (real-time media, DNS queries) better than TCP would.",
      "The three-way handshake carries application data — it only establishes the connection; no request/response content is exchanged during it.",
    ],
  },
  {
    path: "backend",
    layer: "api-dev-1",
    topic: "Browsers vs API clients — curl, Postman, Insomnia",
    criteria: [
      {
        id: "browser-vs-client",
        label: "Browser vs API client",
        description: "What a browser does automatically that a raw API client doesn't",
        levels: [
          { score: 0, description: "Treats a browser and a tool like curl as interchangeable ways to 'visit a URL'." },
          { score: 1, description: "Knows they're different but can't say what a browser does that curl doesn't." },
          { score: 2, description: "Correctly explains a browser renders HTML/CSS/JS and manages cookies/redirects automatically, while a raw client just sends the request you specify." },
          { score: 3, description: "Explains the distinction and why that matters in practice — e.g. testing a JSON API response is clearer in curl/Postman than reading it embedded in rendered HTML." },
        ],
      },
      {
        id: "request-construction",
        label: "Request construction",
        description: "Building a request by hand: method, headers, body",
        levels: [
          { score: 0, description: "Cannot describe the parts of an HTTP request." },
          { score: 1, description: "Knows requests have a 'method' and maybe headers, but can't construct one." },
          { score: 2, description: "Correctly describes setting method, headers (e.g. Content-Type, Authorization), and a request body for something like a POST." },
          { score: 3, description: "Correctly describes request construction and can reason about why a specific header is required for a specific case (e.g. why Content-Type: application/json matters for a JSON body)." },
        ],
      },
      {
        id: "debugging-use",
        label: "Debugging use",
        description: "Why developers reach for curl/Postman instead of a browser address bar",
        levels: [
          { score: 0, description: "No sense of why an API testing tool would ever be preferred over a browser." },
          { score: 1, description: "Vaguely says 'it's for testing APIs' without a concrete reason." },
          { score: 2, description: "Correctly explains these tools let you set arbitrary methods/headers/bodies and inspect the raw response, which a browser address bar can't do for non-GET requests." },
          { score: 3, description: "Gives a correct concrete debugging scenario — e.g. reproducing a failing POST request with a specific auth header to isolate whether a bug is server-side or front-end-side." },
        ],
      },
    ],
    misconceptions: [
      "A browser and an API client tool are just two ways to do the same thing, rather than the browser adding a full rendering/scripting layer on top of the raw HTTP request/response.",
      "You can only test GET requests without a tool like curl/Postman, when in fact the limitation is specifically that a browser's address bar can only trigger GET navigations.",
    ],
  },
];

const seed = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI env var is required");

  const mongo = new MongoClient(process.env.MONGO_URI);
  await mongo.connect();
  const db = mongo.db("DevsBlog");

  console.log("Connected to MongoDB.\n");

  // Writes through the service rather than hand-rolling the update, so the
  // seeder cannot drift from the real write shape — that is how `topicSlug`
  // ended up missing from seeded rubrics in the first place.
  const { upsertRubric } = await import("../services/rubricService.js");

  for (const { path, layer, topic, criteria, misconceptions } of RUBRICS) {
    await upsertRubric(db, path, layer, topic, { criteria, misconceptions });
    console.log(`  ✓ Seeded rubric: ${path}/${layer}/${topic}`);
  }

  console.log(`\nDone. Seeded ${RUBRICS.length} rubric(s).`);
  await mongo.close();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
