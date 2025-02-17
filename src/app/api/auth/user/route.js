import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import db from "@/app/lib/db";

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

export async function GET(req) {
	try {
		const { user, error, status } = await authenticateUser(req);

		if (error) return NextResponse.json({ error }, { status });

		const shortName = user?.name?.split(" ")[0];

		const CDate = new Date(user.createdat);
		const CFTime = CDate.toISOString().slice(11, 16);
		const CUserFriendlyDate = CDate.toDateString();

		let timeF = CFTime.slice(0, 2);
		timeF = timeF >= 12 ? `${timeF} pm` : `${timeF} am`;

		return NextResponse.json(
			{
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					created_at: CUserFriendlyDate,
					created_time: timeF,
					display_name: shortName,
					pfp: user.pfp,
					password: user.password,
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		if (error.name === "JsonWebTokenError") {
			return NextResponse.json(
				{ error: "Invalid or expired token" },
				{ status: 401 }
			);
		}
		console.error(error);
		return NextResponse.json(
			{ error: "Error retrieving user" },
			{ status: 500 }
		);
	}
}

export async function DELETE(req) {
	try {
		const { user, error, status } = await authenticateUser(req);
		if (error) return NextResponse.json({ error }, { status });

		const { userId, email } = await req.json();

		console.log("from the backend", userId, email);

		const userResult = await db.query(
			`SELECT * from "user" WHERE id = $1 AND email = $2`,
			[userId, email]
		);

		if (userResult.rows.length === 0) {
			return NextResponse.json(
				{ error: "User not found or has been deleted" },
				{ status: 404 }
			);
		}

		await db.query(`DELETE from "user" WHERE id = $1 AND email = $2`, [
			userId,
			email,
		]);

		return NextResponse.json(
			{ message: "User deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error Deleting user from the database", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

export async function PUT(req) {
	try {
		const { user, error, status } = await authenticateUser();

		if (error) return NextResponse.json({ error }, { status });

		const { email } = req.json();
	} catch (error) {
		console.error("Internal Server error", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
