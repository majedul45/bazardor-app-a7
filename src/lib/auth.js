import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongoUrl = process.env.BETTER_AUTH_MONGODB_URL;
// Reuse one MongoClient across Next.js hot reloads in development.
// The connection is only configured when a local environment file is present.
const globalForMongo = globalThis;
const mongoClient = mongoUrl
  ? (globalForMongo.__bazardorMongoClient ?? new MongoClient(mongoUrl))
  : null;
if (mongoClient && process.env.NODE_ENV !== "production") {
  globalForMongo.__bazardorMongoClient = mongoClient;
}
const database = mongoClient?.db("better-auth");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  ...(database ? { database: mongodbAdapter(database) } : {}),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  },
});
