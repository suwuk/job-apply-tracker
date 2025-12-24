import bcrypt from "bcrypt";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { getUserByEmail, loginWithGoogle } from "@/lib/firebase/service";

interface DbUser {
  id: string;
  fullname: string;
  email: string;
  password: string;
  role: string;
  image?: string | null;
}

const authOptions: NextAuthOptions = {
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        console.log(credentials);

        const user = (await getUserByEmail(email)) as DbUser | null;
        if (!user) {
          return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;
        console.log(user);
        return {
          id: user.id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
          image: user.image,
        };
        // if(email === "diaz@gmail.com" && password === "12345"){
        //     return user;
        // }else {
        //     return null
        // }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }: any) {
      if (user) {
        token.email = user.email;
        token.fullname = user.fullname;
        token.role = user.role;
        token.image = user.image;
      }
      // const freshUser = await getUserByEmail(token.email);
      // if (freshUser) {
      //   token.image = freshUser.image;
      // }
      if (account?.provider === "google") {
        const data = {
          fullname: user.name,
          email: user.email,
          image: profile.picture,
          type: "google",
        };

        await loginWithGoogle(
          data,
          (result: { status: boolean; data: any }) => {
            if (result.status) {
              token.email = result.data.email;
              token.fullname = result.data.fullname;
              token.image = result.data.image;
              token.role = result.data.role;
              // token.type = result.data.type;
            }
          }
        );
      }
      return token;
    },

    async session({ session, token }: any) {
      if ("email" in token) {
        session.user.email = token.email;
      }
      if ("fullname" in token) {
        session.user.fullname = token.fullname;
      }
      if ("role" in token) {
        session.user.role = token.role;
      }
      if ("image" in token) {
        session.user.image = token.image; // ⬅️ tambahin ini
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", //ini untuk memakai layout yang sudah dibuat, kalau mau pakai layout otomatis dari next auth pagesnya hapus saja
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
