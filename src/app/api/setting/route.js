import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET;

async function authenticateUser(request) {
	const token = request.cookies.get("token")?.value;
	if (!token) {
		return { error: "Invalid or expired token.", status: 401 };
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		if (decoded.exp * 1000 < Date.now()) {
			return NextResponse.json(
				{ error: "Token expired" },
				{ status: 401 }
			);
		}

		const userId = decoded.userId;

		const userResult = await db.query(
			'SELECT * FROM "user" WHERE id = $1',
			[userId]
		);
		const user = userResult.rows[0];

		if (!user) {
			return { error: "User not found.", status: 404 };
		}

		return { user, userId };
	} catch (error) {
		console.error("Token verification error: ", error);
		return { error: "Failed to authenticate user.", status: 500 };
	}
}

export async function PUT(req) {
	try {
		const { userId, error, status } = await authenticateUser(req);

		if (error) return NextResponse.json({ error }, { status });

		const { email, password } = await req.json();

		console.log("new password", password);

		if (!email && !password) {
			return NextResponse.json(
				{ error: "Missing required field" },
				{ status: 400 }
			);
		}

		const userResult = await db.query(
			`SELECT * FROM "user" WHERE id = $1 AND email = $2`,
			[userId, email]
		);

		const userQuery = userResult.rows[0];

		if (!userQuery) {
			return NextResponse.json(
				{ error: "User with provided credential not found" },
				{ status: 404 }
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		if (hashedPassword === userQuery.password) {
			return NextResponse.json(
				{
					error: "You can't update your password with the previous password",
				},
				{ status: 400 }
			);
		}

		await db.query(`UPDATE "user" SET password = $1 WHERE email = $2`, [
			hashedPassword,
			email,
		]);

		return NextResponse.json(
			{ message: "Password Updated successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Internal Server Error", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
