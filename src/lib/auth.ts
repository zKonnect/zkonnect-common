import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { SigninMessage } from "./SignInMessage";

const providers = [
  CredentialsProvider({
    name: "web3-auth",
    credentials: {
      message: {
        label: "Message",
        type: "text",
      },
      signature: {
        label: "Signature",
        type: "text",
      },
      csrfToken: {
        label: "CSRF Token",
        type: "text",
      },
    },
    async authorize(credentials) {
      try {
        const signinMessage = new SigninMessage(
          JSON.parse((credentials?.message as string) || "{}"),
        );

        const nextAuthUrl = new URL(process.env.NEXTAUTH_URL!);

        if (signinMessage.domain !== nextAuthUrl.host) {
          throw new Error("Domain mismatch");
        }

        if (signinMessage.nonce !== credentials.csrfToken) {
          throw new Error("CSRF token mismatch");
        }

        const validationResult = await signinMessage.validate(
          (credentials?.signature as string) || "",
        );

        if (!validationResult)
          throw new Error("Could not validate the signed message");

        return {
          id: signinMessage.publicKey,
        };
      } catch (error) {
        console.error("Error during authorization:", error);
        return null;
      }
    },
  }),
];

export const authOptions = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.sub;
        session.token = token.jti;
        session.user.image = `https://ui-avatars.com/api/?name=${token.sub}&background=random`;
      }
      return session;
    },
  },
});
