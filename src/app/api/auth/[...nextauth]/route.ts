import bcrypt from "bcrypt";
import NextAuth, { type NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import { getUserByEmail, loginWithGoogle } from "@/lib/firebase/service";
import { DbUser } from "@/types/user";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) return null;

        const user = (await getUserByEmail(credentials.email)) as DbUser | null;
        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) return null;

        return {
          id: user.id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
          image: user.image,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // Logic untuk Credentials Login
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.fullname = user.fullname;
        token.role = user.role;
        token.image = user.image;
      }

      if (account?.provider === "google" && profile) {
        // Casting ke GoogleProfile agar mendapatkan akses ke .picture secara spesifik
        const googleProfile = profile as GoogleProfile;

        const data = {
          fullname: googleProfile.name,
          email: googleProfile.email,
          image: googleProfile.picture,
          type: "google",
        };

        await loginWithGoogle(
          data,
          (result: { status: boolean; data: DbUser }) => {
            if (result.status) {
              token.id = result.data.id;
              token.email = result.data.email;
              token.fullname = result.data.fullname;
              token.image = result.data.image;
              token.role = result.data.role;
            }
          }
        );
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.fullname = token.fullname as string;
        session.user.role = token.role as string;
        session.user.image = (token.image as string | null | undefined) || null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
