import { NuxtAuthHandler } from "#auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "~/server/models/userModel";
import bcrypt from "bcrypt";

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,

  pages: {
    signIn: "/sign-in",
  },

  providers: [
    CredentialsProvider.default({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const user = await User.findOne({ username: credentials.username });

        if (!user) {
          throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
          });
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
          });
        }

        return {
          ...user.toObject(),
          password: "",
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = {
          ...token,
          ...user,
        };
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        let userData = await User.findOne({
          email: token.email,
          username: token.username,
        }).select("-password");
        userData = userData.toObject();
        token = { ...userData, _id: userData._id.toString() };
      }
      session.user = {
        ...token,
        ...session.user,
      };

      return session;
    },
  },
});
