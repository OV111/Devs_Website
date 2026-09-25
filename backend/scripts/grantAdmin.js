/**
 * Promote or demote a user by email.
 *
 * Usage:
 *   node backend/scripts/grantAdmin.js you@example.com
 *   node backend/scripts/grantAdmin.js you@example.com --revoke
 *
 * Exists because there is no other way to create the first admin: every admin
 * route requires an existing admin. Deliberately a CLI script and not an
 * endpoint — self-service promotion is how you end up with an incident.
 */

import process from "process";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });

import connectDB from "../config/db.js";

const [email, ...flags] = process.argv.slice(2);
const revoke = flags.includes("--revoke");

if (!email) {
  console.error("Usage: node backend/scripts/grantAdmin.js <email> [--revoke]");
  process.exit(1);
}

const run = async () => {
  const db = await connectDB();

  const result = await db
    .collection("users")
    .findOneAndUpdate(
      { email },
      { $set: { role: revoke ? "user" : "admin" } },
      { returnDocument: "after", projection: { email: 1, username: 1, role: 1 } },
    );

  if (!result) {
    console.error(`No user found with email ${email}`);
    process.exit(1);
  }

  console.log(
    `${result.username ?? result.email} is now: ${result.role}`,
  );
  process.exit(0);
};

run().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
