import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongoUrl = process.env.BETTER_AUTH_MONGODB_URL;
if (!mongoUrl) {
  throw new Error("Missing BETTER_AUTH_MONGODB_URL in .env");
}
if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("Missing BETTER_AUTH_SECRET in .env");
}

// Keep one MongoClient during Next.js development reloads.
// Use the database configured in the MongoDB URI instead of silently
// writing auth records into a hard-coded, separate database.
const globalForMongo = globalThis;
const mongoClient =
  globalForMongo.__bazardorMongoClient ??
  new MongoClient(mongoUrl);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.__bazardorMongoClient = mongoClient;
}

const database = mongoClient.db();

const socialProviders = {};
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(database),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders,
});
