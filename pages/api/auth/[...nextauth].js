import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../models/User";
import { validateAllOnce } from "../../../utils/common";
import dbConnect from "../../../utils/mongo";
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        try {
          await dbConnect();
          const { uid, password } = credentials;
          validateAllOnce({ uid, password });

          const userId = uid.toUpperCase();

          const user = await User.findOne({ uid: userId });
          if (!user) {
            throw new Error("Something went wrong");
          }
          const userDoc = user._doc;
          const isMatched = await bcrypt.compare(password, userDoc.password);

          if (user && isMatched) {
            delete userDoc.password;
            return userDoc;
          } else {
            throw new Error("ID Number or password is incorrect");
          }
        } catch (error) {
          throw new Error(error);
        }
      }
    })
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }) {
      if (user && user._id) {
        token.user = user;
      }
      return token;
    }
  },
  session: {
    strategy: "jwt"
  },
  logger: {
    error(code, metadata) {
      console.error(code, metadata);
    },
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      console.debug(code, metadata);
    }
  }
});
