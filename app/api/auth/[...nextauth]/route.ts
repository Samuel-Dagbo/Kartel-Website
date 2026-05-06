import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

export const authOptions = {
  // Connect to MongoDB Atlas
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Email sign-in
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      route: "/api/auth/email",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, user }) {
      // Add role info to session
      return session;
    },
  },
  events: {
    async redirect({ url, baseUrl }) {
      // All redirects go to the relative URL
      return url;
    },
  },
  debug: process.env.NODE_ENV === "development",
};

export const handler = NextAuth(authOptions);
export const { auth, signIn, signOut } = NextAuth(authOptions);

async function clientPromise() {
  const global = global as any;
  if (!global._mongoosePromise) {
    global._mongoosePromise = mongoose.connect(MONGODB_URI!);
  }
  return global._mongoosePromise;
}