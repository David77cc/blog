import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
	const token = req.cookies.get("token")?.value || null;
	const url = req.nextUrl.pathname;

	console.log("Middleware is running for:", url);

	// const publicRoutes = ["/", "/about"];
	const authRoutes = ["/auth/login", "/auth/signup"];
	const protectedRoutes = ["/me", "/me/setting", "/me/library", "/create"];

	if (token && authRoutes.includes(url)) {
		return NextResponse.redirect(new URL("/", req.url));
	}

	if (!token && protectedRoutes.includes(url)) {
		if (url === "/auth/login") return NextResponse.next();
		return NextResponse.redirect(new URL("/auth/login", req.url));
	}

	if (token) {
		try {
			const { payload } = await jwtVerify(token, JWT_SECRET);
		} catch (err) {
			console.log("Invalid token:", err);
			return NextResponse.redirect(new URL("/auth/login", req.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/me/:path*", "/auth/:path*", "/create"],
};
