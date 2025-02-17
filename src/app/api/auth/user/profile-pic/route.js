import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import db from "@/app/lib/db";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
	try {
		const token = req.cookies.get("token")?.value;

		if (!token) {
			return NextResponse.json(
				{ error: "No token provided" },
				{ status: 401 }
			);
		}

		const decoded = jwt.verify(token, JWT_SECRET);
		if (decoded.exp * 1000 < Date.now()) {
			return NextResponse.json(
				{ error: "Token expired" },
				{ status: 401 }
			);
		}

		const result = await db.query(`SELECT * FROM "user" WHERE id = $1`, [
			decoded.userId,
		]);

		if (result.rows.length === 0) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		let newProfilePic;

		const contentType = req.headers.get("Content-Type");

		if (contentType.includes("multipart/form-data")) {
			const formData = await req.formData();
			const uploadedImage = formData.get("uploadedImage");
			if (!uploadedImage || uploadedImage.size === 0) {
				return NextResponse.json(
					{ error: "No file uploaded" },
					{ status: 400 }
				);
			}

			const fileExtension = path.extname(uploadedImage.name);
			const uniqueFileName = `profile-${Date.now()}-${Math.round(
				Math.random() * 1e9
			)}${fileExtension}`;
			const uploadDir = path.join(
				process.cwd(),
				"public/uploads/profile_pic"
			);
			await fs.mkdir(uploadDir, { recursive: true });
			const filePath = path.join(uploadDir, uniqueFileName);

			await fs.writeFile(
				filePath,
				Buffer.from(await uploadedImage.arrayBuffer())
			);

			newProfilePic = `/uploads/profile_pic/${uniqueFileName}`;
		} else if (contentType.includes("application/json")) {
			const url = await req.json();
			if (!url) {
				return NextResponse.json(
					{ error: "No URL provided" },
					{ status: 400 }
				);
			}
			newProfilePic = url;
		} else {
			return NextResponse.json(
				{ error: "Unsupported content type" },
				{ status: 400 }
			);
		}

		await db.query(`UPDATE "user" SET pfp = $1 WHERE id = $2`, [
			newProfilePic,
			decoded.userId,
		]);

		return NextResponse.json(
			{
				message: "Profile picture updated successfully!",
				pfp: newProfilePic,
			},
			{ status: 200 }
		);
	} catch (error) {
		// console.error("Error in post handler", error);
		return NextResponse.json(
			{ error: "Something went wrong. Please try again." },
			{ status: 500 }
		);
	}
}

export const config = {
	api: {
		bodyParser: false,
	},
};
