import db from "@/app/lib/db";
import { formatDistanceToNow } from "date-fns";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

async function authenticateUser(request) {
	const token = request.cookies.get("token")?.value;
	if (!token) {
		return { error: "Invalid or expired token.", status: 401 };
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		if (!decoded) {
			return { error: "Invalid or expired token.", status: 401 };
		}

		const userId = decoded.userId;

		const userResult = await db.query(
			'SELECT name FROM "user" WHERE id = $1',
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

export async function GET() {
	try {
		const result = await db.query(
			`
				SELECT posts.*, "user".pfp
				FROM posts
				LEFT JOIN "user" ON posts.author = "user".name
			`
		);

		const formattedPosts = result.rows.map((post) => {
			const CDate = new Date(post.createdat);
			const CFTime = CDate.toISOString().slice(11, 16);

			const CUserFriendlyDate = CDate.toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
			});

			const ctime = formatDistanceToNow(new Date(post.createdat), {
				addSuffix: true,
			});
			// const utime = formatDistanceToNow(new Date(post.updatedat), {
			// 	addSuffix: true,
			// });

			return {
				...post,
				CUserFriendlyDate,
				CFTime,
				pfp: post.pfp,
				Ctime: ctime,
				// Utime: utime,
			};
		});
		return NextResponse.json(formattedPosts, { status: 200 });
	} catch (err) {
		console.error("Error executing query", err.stack);
		return new Response(
			JSON.stringify({ error: "Failed to fetch posts" }),
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	try {
		const { user, error, status } = await authenticateUser(request);
		if (error) return NextResponse.json({ error }, { status });

		const { title, content, image_url } = await request.json();
		const author = user.name;

		const existingPostResult = await db.query(
			`SELECT * FROM posts WHERE title = $1 AND content = $2 AND image_url = $3 AND author = $4`,
			[title, content, image_url, author]
		);

		if (existingPostResult.rows.length > 0) {
			return NextResponse.json(
				{ error: "Duplicate post detected" },
				{ status: 409 }
			);
		}

		const result = await db.query(
			"INSERT INTO posts (title, content, image_url, author) VALUES ($1, $2, $3, $4) RETURNING *",
			[title, content, image_url || null, author]
		);
		return NextResponse.json(result.rows[0], { status: 201 });
	} catch (error) {
		console.error("Error inserting post", error);
		return new Response(
			JSON.stringify({ error: "Failed to create post" }),
			{ status: 500 }
		);
	}
}

export async function PUT(request) {
	try {
		const { user, error, status } = await authenticateUser(request);
		if (error) return NextResponse.json({ error }, { status });

		const { postId, title, content, image_url } = await request.json();

		const postResult = await db.query(
			"SELECT * FROM posts WHERE id = $1 AND author = $2",
			[postId, user.name]
		);

		if (postResult.rows.length === 0) {
			return NextResponse.json(
				{ error: "Post not found or you're not authorized to edit." },
				{ status: 404 }
			);
		}

		const updateResult = await db.query(
			`
				UPDATE posts
				SET title = $1, content = $2, image_url = $3
				WHERE id = $4
				RETURNING *
			`,
			[title, content, image_url || null, postId]
		);

		return NextResponse.json(updateResult.rows[0], { status: 200 });
	} catch (error) {
		console.error("Error Updating Post", error);
		return NextResponse.json(
			{ error: "Failed to update Post :)" },
			{ status: 500 }
		);
	}
}

export async function DELETE(request) {
	try {
		const { user, error, status } = await authenticateUser(request);
		if (error) return NextResponse.json({ error }, { status });
		const { postId } = await request.json();

		if (!user) {
			return NextResponse.json(
				{ error: "User not authenticated" },
				{ status: 401 }
			);
		}

		const postResult = await db.query(
			"SELECT * FROM posts WHERE id = $1 AND author = $2",
			[postId, user.name]
		);

		if (postResult.rows.length === 0) {
			return NextResponse.json(
				{ error: "Post not found or you're not authorized to edit." },
				{ status: 404 }
			);
		}

		await db.query("DELETE FROM posts WHERE id = $1", [postId]);

		return NextResponse.json(
			{ message: "Post deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting Post", error);
		return NextResponse.json(
			{ error: "Failed to delete Post" },
			{ status: 500 }
		);
	}
}
