import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import db from "@/app/lib/db";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
	try {
		const body = await req.json();
		const { name, email, password } = body;

		const result = await db.query(
			`SELECT id FROM "user" WHERE email = $1`,
			[email]
		);

		if (result.rows.length > 0) {
			return new Response(
				JSON.stringify({ error: "Email already exists" }),
				{ status: 400 }
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUserResult = await db.query(
			`INSERT INTO "user" (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email`,
			[name, email, hashedPassword]
		);

		const newUser = newUserResult.rows[0];

		const token = jwt.sign(
			{ userId: newUser.id, email: newUser.email },
			JWT_SECRET,
			{
				expiresIn: "24h",
			}
		);

		const response = NextResponse.json({
			message: "Signed Up successfully",
			user: {
				id: newUser.id,
				name: newUser.name,
				email: newUser.email,
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
		return new Response(JSON.stringify({ error: "User creation failed" }), {
			status: 500,
		});
	}
}
