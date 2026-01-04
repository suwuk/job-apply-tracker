import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// Hanya export GET dan POST
export { handler as GET, handler as POST };