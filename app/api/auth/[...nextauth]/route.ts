import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,

  session: {
    strategy: "jwt",   // use JWT so Credentials provider works alongside OAuth
  },

  // pages: {
  //   signIn:  "/auth/login",
  //   error:   "/auth/error",
  // },

  providers: [
    // ── Google OAuth ──────────────────────────────────────────────────────────
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ── Email / Password (Credentials) ────────────────────────────────────────
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("No account found with that email address.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Incorrect password.");
        }

        return {
          id:    user.id,
          email: user.email,
          name:  user.name,
          image: user.image,
          role:  user.role,
        };
      },
    }),
  ],

  callbacks: {
    // Attach role + id to JWT so they survive between requests
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = (user as any).role ?? "USER";
      }
      return token;
    },

    // Expose id + role in the client-side session object
    async session({ session, token }) {
      if (session.user) {
        (session.user).id   = token.id;
        (session.user).role = token.role;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
