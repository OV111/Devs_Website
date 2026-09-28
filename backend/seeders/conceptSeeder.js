/**
 * Curriculum Knowledge Layer seeder (Stage 3).
 *
 * Usage:
 *   node backend/seeders/conceptSeeder.js
 *
 * Concepts are HAND-AUTHORED, never LLM-generated. The mentor teaches from the
 * `correction` lines below, so an inaccurate one here actively teaches something
 * wrong — which is worse than having no concept at all. Prefer few, correct
 * concepts over broad coverage.
 *
 * A concept's `id` is the canonical topic slug (utils/topicKey.js), which is what
 * joins it to the learner's mastery row for the same topic.
 *
 * `misconceptions[].id` values are referenced by teach_back_sessions
 * .misconceptionsDetected, so renaming one orphans existing learner evidence —
 * add a new id instead.
 */

import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import process from "process";

dotenv.config({ path: "./backend/.env.local" });
dotenv.config({ path: "./backend/.env" });

const CONCEPTS = [
  {
    id: "jwt-signature",
    title: "JWT Signature",
    path: "backend",
    layer: "layer-6",
    definition:
      "The third segment of a JWT: a MAC or digital signature computed over the encoded header and payload using a secret (HMAC) or a private key (RSA/ECDSA).",
    purpose:
      "It lets a receiver detect tampering and verify who issued the token. It provides integrity and authenticity — NOT confidentiality.",
    prerequisites: ["hashing"],
    relatedConcepts: ["jwt-payload", "jwt-verification"],
    misconceptions: [
      {
        id: "signature-encrypts-payload",
        description: "Believes the signature encrypts the payload, so the contents are hidden.",
        correction:
          "A standard JWT is signed, not encrypted. The payload is only base64url-encoded, which anyone holding the token can decode and read — paste one into jwt.io and the claims are right there. The signature does not hide anything; it only makes undetected modification infeasible. This is why a JWT must never carry secrets. Hiding contents requires encryption (JWE), which is a separate mechanism.",
      },
      {
        id: "verification-means-decrypting",
        description: "Believes verifying a token means decrypting it.",
        correction:
          "Verification recomputes the signature over the header and payload that arrived, then compares it to the signature that arrived. Nothing is decrypted — there is no ciphertext. If the recomputed value differs, the token was altered or signed with a different key, and it is rejected.",
      },
      {
        id: "signature-proves-user-identity",
        description:
          "Believes the signature proves the identity of the user described in the token.",
        correction:
          "The signature proves only that the holder of the signing key produced this exact payload — it authenticates the ISSUER, not the bearer. Anyone who steals the token can present it and be accepted, which is why transport security, short expiry and revocation still matter.",
      },
    ],
  },
  {
    id: "jwt-payload",
    title: "JWT Payload",
    path: "backend",
    layer: "layer-6",
    definition:
      "The second segment of a JWT: a base64url-encoded JSON object of claims such as sub, exp, iat and any application-specific fields.",
    purpose:
      "Carries the assertions the issuer is making about the subject, so the receiver can authorise a request without a database lookup.",
    prerequisites: [],
    relatedConcepts: ["jwt-signature", "jwt-verification"],
    misconceptions: [
      {
        id: "payload-is-encrypted",
        description: "Believes base64url encoding protects the payload's contents.",
        correction:
          "Encoding is not encryption. base64url is a reversible transport format with no key involved — decoding it requires nothing but the token. Treat every claim in a payload as public.",
      },
      {
        id: "payload-can-be-trusted-unverified",
        description: "Reads claims from the payload before verifying the signature.",
        correction:
          "An unverified payload is attacker-controlled input. Decoding tells you what the token CLAIMS; only signature verification tells you whether to believe it. Always verify first, then read claims.",
      },
    ],
  },
  {
    id: "jwt-verification",
    title: "JWT Verification",
    path: "backend",
    layer: "layer-6",
    definition:
      "The server-side check that a received token's signature is valid for its header and payload, and that its claims (exp, nbf, iss, aud) are acceptable.",
    purpose:
      "It is the step that converts an untrusted string into a trusted set of claims.",
    prerequisites: ["jwt-signature"],
    relatedConcepts: ["jwt-payload"],
    misconceptions: [
      {
        id: "valid-signature-means-valid-token",
        description: "Believes a correct signature alone makes a token acceptable.",
        correction:
          "A signature only proves the token is unmodified and was issued by the key holder. An expired token, one issued for a different audience, or a revoked one can all have perfectly valid signatures. Claim checks are a separate, required step.",
      },
      {
        id: "trusting-alg-header",
        description: "Lets the token's own `alg` header decide how to verify it.",
        correction:
          "The algorithm must be pinned server-side. Trusting the header allows an attacker to change `alg` to `none`, or to swap RS256 for HS256 and sign with the public key as if it were an HMAC secret. Decide the expected algorithm in your own configuration, not from attacker-supplied data.",
      },
    ],
  },
  {
    id: "hashing",
    title: "Hashing",
    path: "backend",
    layer: "layer-6",
    definition:
      "A one-way function mapping arbitrary input to a fixed-size digest, where finding any input for a given digest, or two inputs sharing one, is computationally infeasible.",
    purpose:
      "Lets you prove two values are the same, or that data has not changed, without storing or transmitting the original.",
    prerequisites: [],
    relatedConcepts: ["jwt-signature"],
    misconceptions: [
      {
        id: "hashing-is-encryption",
        description: "Believes hashing is a form of encryption that can be reversed with a key.",
        correction:
          "Encryption is two-way by design: with the key you recover the original. Hashing is one-way and keyless — there is no operation that turns a digest back into its input. Cracking a hash means guessing inputs until one matches, not decrypting.",
      },
      {
        id: "fast-hash-fine-for-passwords",
        description: "Believes a general-purpose hash like SHA-256 is appropriate for passwords.",
        correction:
          "Password hashes must be deliberately slow and salted. SHA-256 is built to be fast, so an attacker with a leaked database can try billions of guesses per second. Use bcrypt, scrypt or Argon2, which add a per-password salt and a tunable work factor.",
      },
    ],
  },
];

const seed = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI env var is required");

  const mongo = new MongoClient(process.env.MONGO_URI);
  await mongo.connect();
  const db = mongo.db("DevsBlog");
  const col = db.collection("concepts");

  await col.createIndex({ id: 1 }, { unique: true });
  await col.createIndex({ path: 1, layer: 1 });

  console.log("Connected to MongoDB.\n");

  for (const concept of CONCEPTS) {
    await col.findOneAndUpdate(
      { id: concept.id },
      { $set: { ...concept, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true },
    );
    console.log(
      `  ✓ ${concept.id.padEnd(20)} ${concept.misconceptions.length} misconception(s)`,
    );
  }

  // A prerequisite or related id pointing at a concept that does not exist would
  // make get_concept return a dangling reference the mentor might cite. Cheap to
  // check here, and the only place it can be caught before it reaches a learner.
  const ids = new Set(CONCEPTS.map((c) => c.id));
  const dangling = CONCEPTS.flatMap((c) =>
    [...c.prerequisites, ...c.relatedConcepts]
      .filter((ref) => !ids.has(ref))
      .map((ref) => `${c.id} → ${ref}`),
  );

  if (dangling.length) {
    console.warn(`\n⚠ Unresolved references (author these next):\n  ${dangling.join("\n  ")}`);
  }

  console.log(`\nDone. Seeded ${CONCEPTS.length} concept(s).`);
  await mongo.close();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
