import { MongoClient } from "mongodb";
import process from "process";
let db;
let client;

const connectDB = async () => {
  if (db) return db; // reuse existing connection

  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is missing");
    }

    client = new MongoClient(mongoUri);
    await client.connect();
    console.log("MongoDB connected successfully!");
    db = client.db("DevsBlog"); // store reference to DB

    await Promise.all([
      db.collection("follows").createIndex({ followerId: 1, followingId: 1 }, { unique: true }),
      db.collection("notifications").createIndex({ targetUserId: 1, createdAt: -1 }),
      db.collection("blogs").createIndex({ status: 1, category: 1, createdAt: -1 }),
      db.collection("exam_attempts").createIndex({ userId: 1, path: 1, layer: 1, startedAt: -1 }),
    ]);

    return db;
  } catch (err) {
    console.error("MongoDB connection error", err);
    throw err;
  }
};
// let x = await connectDB()
// console.log(x)
export default connectDB;
