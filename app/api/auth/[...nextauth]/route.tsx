import { connectMongoDB } from "@/app/libs/MongoConnect";
import User from "@/app/models/UserModel";
import { compare } from "bcryptjs";
// import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { AuthOptions } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
