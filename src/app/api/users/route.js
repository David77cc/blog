import db from "@/app/lib/db";

export async function GET() {
	try {
		const result = await db.query(`SELECT * FROM "user"`);
		return new Response(JSON.stringify(result.rows), { status: 200 });
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ error: "Failed to fetch users" }, { status: 500 })
		);
	}
}
