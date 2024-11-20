import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { AuthOptions, Awaitable, DefaultSession, Session } from "next-auth";
import User from "../models/UserModel";
import { connectMongoDB } from "../libs/MongoConnect";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import Email from "next-auth/providers/email";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
  },

  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials, req) {
        await connectMongoDB();
        if (credentials?.email.trim().length === 0 || credentials?.password.trim().length === 0) {
          throw new Error("Введите логин/пароль");
        }
        const user = await User.findOne({ email: credentials?.email });
        if (!user) {
          throw new Error("Такого пользователя не существует");
        }
        if (credentials) {
          // console.log(`Password from credentials ${credentials?.password}`);
          // console.log(`Password from user ${user.password}`);
          const validPassword = await compare(credentials?.password, user.password);
          // console.log(validPassword);
          if (!validPassword && credentials?.password !== user.password) {
            throw new Error("Неверный пароль");
          }
        }

        if (user) {
          console.log(user);
          return user;
        } else {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    session: async ({ session, token }): Promise<Session | DefaultSession> => {
      const currentUser = await fetch(
        `${process.env.HOST}/api/users/getUserType/${session?.user?.email}`
      );
      const data = await currentUser.json();

      session!.user.userType = data.result.userType;

      return session;
    },
  },
};
