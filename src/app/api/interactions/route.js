import db from "@/app/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request) {
	try {
		const token = request.cookies.get("token")?.value;
		let userId = null;

		if (token) {
			const decoded = jwt.verify(token, JWT_SECRET);
			userId = decoded.userId;
		}

		const likesQuery = `
			SELECT 
				post_id,
				COUNT(*)  AS interaction_count
			FROM user_interactions
			WHERE interaction_type = 'like'
			GROUP BY post_id

		`;
		const likesResult = await db.query(likesQuery);

		let userLikes = [];
		let userSaves = [];
		let userReads = [];

		if (userId) {
			const userLikesQuery = `
				SELECT 
					post_id,
					has_interacted
				FROM user_interactions
				WHERE user_id = $1 AND interaction_type = 'like'
			`;
			const userLikesResult = await db.query(userLikesQuery, [userId]);
			userLikes = userLikesResult.rows;

			const userSavesQuery = `
				SELECT post_id FROM user_interactions
				WHERE user_id = $1 AND interaction_type = 'save'
			`;
			const userSavesResult = await db.query(userSavesQuery, [userId]);
			userSaves = userSavesResult.rows;

			const userReadsQuery = `
				SELECT post_id FROM user_interactions
				WHERE user_id = $1 AND interaction_type = 'read'
			`;
			const userReadsResult = await db.query(userReadsQuery, [userId]);
			userReads = userReadsResult.rows;
		}

		return new Response(
			JSON.stringify({
				globalLikes: likesResult.rows,
				userLikes,
				userSaves,
				userReads,
			}),
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ error: "Failed to fetch interactions" }),
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	try {
		const token = request.cookies.get("token")?.value;
		if (!token) {
			return new Response(
				JSON.stringify({ error: "Unauthorized. Please Log In." }),
				{ status: 401 }
			);
		}

		const decoded = jwt.verify(token, JWT_SECRET);
		if (!decoded) {
			return new Response(
				JSON.stringify({ error: "Invalid or expired token." })
			);
		}

		const userId = decoded.userId;

		const { postId, action, interactionType } = await request.json();

		if (interactionType === "like") {
			if (action === "add") {
				await db.query(
					`INSERT INTO user_interactions (user_id, post_id, has_interacted, interaction_type)
				VALUES ($1, $2, TRUE, 'like')`,
					[userId, postId]
				);
			} else if (action === "remove") {
				await db.query(
					`
                DELETE FROM user_interactions
                WHERE user_id = $1 AND post_id = $2 AND interaction_type = 'like'
                `,
					[userId, postId]
				);
			}
		}

		if (interactionType === "save" || interactionType === "read") {
			if (action === "add") {
				await db.query(
					`
						INSERT INTO user_interactions (user_id, post_id, has_interacted, interaction_type)
						VALUES ($1, $2, TRUE, $3)
						ON CONFLICT (user_id, post_id, interaction_type)
						DO NOTHING
					`,
					[userId, postId, interactionType]
				);
			} else if (action === "remove") {
				await db.query(
					` 
						DELETE FROM user_interactions
						WHERE user_id = $1 AND post_id = $2 AND interaction_type = $3
					`,
					[userId, postId, interactionType]
				);
			}
		}

		let updatedLikesCount = 0;
		if (interactionType === "like") {
			const updatedCounts = await db.query(
				`
					SELECT 
						COUNT(*) AS interaction_count
					FROM user_interactions
					WHERE post_id = $1 AND interaction_type = 'like'
				`,
				[postId]
			);
			updatedLikesCount = updatedCounts.rows[0]?.interaction_count || 0;
		}

		return new Response(
			JSON.stringify({ interaction_count: updatedLikesCount }),
			{
				status: 200,
			}
		);
	} catch (error) {
		console.error("Error saving interaction", error);
		return new Response(
			JSON.stringify({ error: "Failed to save interaction" }),
			{ status: 500 }
		);
	}
}
