import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import db from "@/app/lib/db";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
	try {
		const body = await req.json();
		const { email, password } = body;

		const result = await db.query(
			`SELECT id, name, email, password FROM "user" WHERE email = $1`,
			[email]
		);

		if (result.rows.length === 0) {
			return new Response(
				JSON.stringify({ error: "Invalid credentials" }),
				{ status: 400 }
			);
		}

		const user = result.rows[0];

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return new Response(
				JSON.stringify({ error: "Invalid credentials" }),
				{ status: 400 }
			);
		}

		const token = jwt.sign(
			{ userId: user.id, email: user.email },
			JWT_SECRET,
			{
				expiresIn: "24h",
			}
		);

		const response = NextResponse.json({
			message: "Login Successful",
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
		});

		response.cookies.set("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 60 * 60 * 24,
			sameSite: "strict",
			path: "/",
		});

		return response;
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ error: "Login failed, Server error" }),
			{
				status: 500,
			}
		);
	}
}
