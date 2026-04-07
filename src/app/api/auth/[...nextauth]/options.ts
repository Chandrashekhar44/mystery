import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

interface AuthUser {
  id: string; 
  _id: string;
  email: string;
  username: string;
  isVerified: boolean;
  isAcceptingMessages: boolean;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(
        credentials?: Record<"identifier" | "password", string>
      ): Promise<AuthUser | null> {
        if (!credentials?.identifier || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        await dbConnect();

        const identifier = credentials.identifier;

       const userDoc = await UserModel.findOne({
  $or: [{ email: identifier }, { username: identifier }],
           }).lean();

          if (!userDoc) {
          throw new Error("UserNotFound");
       }

      if (!userDoc.password) {
  throw new Error("NoPassword");
         }

       if (!userDoc.isVerified) {
  throw new Error("NotVerified");
       }

     const isPasswordCorrect = await bcrypt.compare(
  credentials.password,
  userDoc.password
    );

      if (!isPasswordCorrect) {
  throw new Error("InvalidPassword");
       }


        return {
          id: userDoc._id.toString(),
          _id: userDoc._id.toString(),
          email: userDoc.email,
          username: userDoc.username,
          isVerified: !!userDoc.isVerified,
          isAcceptingMessages: !!userDoc.isAcceptingMessages,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          _id: token._id,
          username: token.username,
          isVerified: token.isVerified,
          isAcceptingMessages: token.isAcceptingMessages,
        };
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge:60*60*24
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/sign-in",
  },

  debug: process.env.NODE_ENV === "development",
};
