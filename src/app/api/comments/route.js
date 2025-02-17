import db from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { formatDistanceToNow } from "date-fns";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
	try {
		const result = await db.query(
			`
				SELECT comments.*, "user".pfp, "user".name
				FROM comments
				LEFT JOIN "user" ON comments.user_id = "user".id
			`
		);

		const formattedComments = result.rows.map((comment) => {
			const ctime = formatDistanceToNow(new Date(comment.createdat), {
				addSuffix: true,
			});
			const utime = formatDistanceToNow(new Date(comment.updatedat), {
				addSuffix: true,
			});
			return {
				...comment,
				name: comment.name,
				pfp: comment.pfp,
				Ctime: ctime,
				Utime: utime,
			};
		});

		return NextResponse.json(formattedComments, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch comments" },
			{ status: 500 }
		);
	}
}

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

export async function POST(req) {
	try {
		const { error, status, userId } = await authenticateUser(req);
		if (error) return NextResponse.json({ error }, { status });

		const { post_id, content, parent_comment } = await req.json();

		if (!post_id || !content) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		const existingCommentResult = await db.query(
			`SELECT * FROM comments WHERE post_id = $1 AND user_id = $2 AND content = $3`,
			[post_id, userId, content]
		);

		if (existingCommentResult.rows.length > 0) {
			return NextResponse.json(
				{ error: "Duplicate comment detected" },
				{ status: 409 }
			);
		}

		const result = await db.query(
			`INSERT INTO comments (post_id, user_id, content, parent_comment) VALUES ($1, $2, $3, $4) RETURNING *`,
			[post_id, userId, content, parent_comment || null]
		);

		const newComment = result.rows[0];

		return NextResponse.json(newComment, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Failed to add Comment" },
			{ status: 500 }
		);
	}
}

export async function PUT(req) {
	try {
		const { error, status, userId } = await authenticateUser(req);
		if (error) return NextResponse.json({ error }, { status });

		const { id, content } = await req.json();

		if (!id || !content) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		const result = await db.query(
			`UPDATE comments SET content = $1, updatedat = NOW() WHERE id = $2 AND user_id = $3`,
			[content, id, userId]
		);

		if (result.rowCount === 0) {
			return NextResponse.json(
				{ error: "Comment not found or you're not authorized" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ message: "Comment was updated successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error updating comment", error);
		return NextResponse.json(
			{ error: "Failed to update Comment" },
			{ status: 500 }
		);
	}
}

export async function DELETE(req) {
	try {
		const { error, status, userId } = await authenticateUser(req);
		if (error) return NextResponse.json({ error }, { status });

		const { id } = await req.json();

		if (!id) {
			return NextResponse.json(
				{ error: "Missing comment ID" },
				{ status: 400 }
			);
		}

		const result = await db.query(
			`DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING *`,
			[id, userId]
		);

		if (result.rowCount === 0) {
			return NextResponse.json(
				{ error: "Comment not found or not authorized" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ message: "comment deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting comment", error);
		return NextResponse.json(
			{ error: "Failed to delete comment" },
			{ status: 500 }
		);
	}
}
