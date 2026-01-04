import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import withAuth from "./middlewares/withAuth";

export async function mainMiddleware(request: NextRequest) {
	// const token = await getToken({
	//   req: request,
	//   secret: process.env.AUTH_SECRET,
	// });

	// const { pathname, origin } = request.nextUrl;

	// // Kalau tidak ada token, redirect ke login
	// if (!token) {
	//   return NextResponse.redirect(
	//     `${origin}/login?callbackUrl=${encodeURIComponent(pathname)}`
	//   );
	//   // return NextResponse.redirect(new URL("/login", request.url));
	// }
	const res = NextResponse.next();
	return res;
}

export default withAuth(mainMiddleware, [
	"/dashboard",
	"/login",
	"/register",
]);

// export const config = {
//   matcher: ["/dashboard/:path*", "/about/:path*",  "/product/:path*"],
// //   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
// };
