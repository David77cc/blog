import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export async function middelware(req) {
	const token = req.cookies.get("token");
	const url = req.url;

	if (
		token &&
		(url.includes("/auth/login") || url.includes("/auth/signup"))
	) {
		return NextResponse.redirect(new URL("/", req.url));
	}

	if (!token) {
		return NextResponse.redirect(new URL("/auth/login", req.url));
	}

	try {
		const decoded = verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		return NextResponse.next();
	} catch (err) {
		console.log(err);
		return NextResponse.redirect(new URL("/auth/login", req.url));
	}
}
