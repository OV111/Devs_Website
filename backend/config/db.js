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
    return db;
  } catch (err) {
    console.error("MongoDB connection error", err);
    throw err;
  }
};
// let x = await connectDB()
// console.log(x)
export default connectDB;
