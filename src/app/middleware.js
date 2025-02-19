import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export function middleware(req) {
	const token = req.cookies.get("token");
	const url = req.nextUrl.pathname;

	const publicRoutes = ["/", "/about"];
	const authRoutes = ["/auth/login", "/auth/signup"];
	const protectedRoutes = ["/dashboard", "/me", "/me/setting", "me/library"];

	if (token && authRoutes.includes(url)) {
		return NextResponse.redirect(new URL("/", req.url));
	}

	if (!token && protectedRoutes.includes(url)) {
		return NextResponse.redirect(new URL("/auth/login", req.url));
	}

	if (token) {
		try {
			const decoded = verify(token, process.env.JWT_SECRET);
			req.user = decoded;
		} catch (err) {
			console.log("Invalid token:", err);
			return NextResponse.redirect(new URL("/auth/login", req.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/me", "/auth/login", "/auth/signup", "/create", "me/setting"],
};
