import {
	type NextFetchEvent,
	type NextMiddleware,
	type NextRequest,
	NextResponse,
} from "next/server";
import { getToken } from "next-auth/jwt";

const onlyAdminPage = ["/dashboard"];
const authPage = ["/login", "/register"];

export default function withAuth(
	middleware: NextMiddleware,
	requireAuth: string[] = [],
) {
	return async (req: NextRequest, next: NextFetchEvent) => {
		const pathname = req.nextUrl.pathname;
		if (requireAuth.includes(pathname)) {
			const token = await getToken({
				req,
				secret: process.env.NEXTAUTH_SECRET,
			});
			if (!token && !authPage.includes(pathname)) {
				const url = new URL("/login", req.url);
				url.searchParams.set("callbackUrl", encodeURI(req.url));
				return NextResponse.redirect(url);
			}

			if (token) {
				if (authPage.includes(pathname)) {
					const prevUrl = req.headers.get("referer") || "/"; // akan menyimpan url yang sebelumnya jikalau berpindah
					return NextResponse.redirect(new URL(prevUrl, encodeURI(req.url)));
				}

				if (token.role !== "admin" && onlyAdminPage.includes(pathname)) {
					const prevUrl = req.headers.get("referer") || "/"; 
					return NextResponse.redirect(new URL(prevUrl, encodeURI(req.url)));
				}
			}
		}
		return middleware(req, next);
	};
}
