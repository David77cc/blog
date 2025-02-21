"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { usePost } from "../context/PostContext";

export default function CreatePost() {
	const router = useRouter();
	const { isAuthenticated } = useAuth();
	const { fetchPosts, updatedPost } = usePost();
	const [formData, setformData] = useState({
		title: updatedPost ? updatedPost.title : "",
		content: updatedPost ? updatedPost.content : "",
		image_url: updatedPost ? updatedPost.image_url : "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setformData((prev) => ({ ...prev, [name]: value }));
	};

	const clearInput = () => {
		setformData({
			title: "",
			content: "",
			image_url: "",
		});
	};

	const handleClear = () => {
		const confirmClear = window.confirm(
			"Are you sure you want to clear all fields?"
		);
		if (confirmClear) {
			clearInput();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.title || !formData.content) {
			return;
		}
		if (isAuthenticated) {
			try {
				if (updatedPost) {
					await axios.put(
						"/api/post",
						{ ...formData, postId: updatedPost.id },
						{
							withCredentials: true,
						}
					);
				} else {
					await axios.post("/api/post", formData, {
						withCredentials: true,
					});
				}
				fetchPosts();
				router.push("/");
				clearInput();
			} catch (error) {
				console.error("Failed to create post:", error);
			}
		}
	};

	return (
		<section className="min-h-screen w-full bg-[#d0dde4] flex items-center justify-center p-2">
			<form
				onSubmit={handleSubmit}
				className="min-h-[700px] relative py-8 min-[800px]:w-[95%] w-full border rounded-[.5rem] flex flex-col items-center justify-center gap-y-8 shadow-lg bg-white overflow-hidden px-2">
				<input
					type="text"
					name="title"
					value={formData.title}
					onChange={handleChange}
					required
					autoComplete="title"
					placeholder="Post Title"
					className="outline-none font-poppins font-medium border border-[#d0dde4] rounded-[3rem] w-[85%] h-[35px] flex placeholder:uppercase indent-4"
				/>
				<textarea
					name="content"
					value={formData.content}
					onChange={handleChange}
					required
					autoComplete="content"
					placeholder="Your content here"
					className="w-[95%] min-h-[300px] font-poppins rounded-lg outline-none border-2 px-3 py-2"
				/>
				<input
					type="url"
					name="image_url"
					value={formData.image_url}
					onChange={handleChange}
					autoComplete="image_url"
					className="outline-none border-2 font-inter w-4/6 h-8 rounded-2xl indent-3 text-[#105410]"
					placeholder="Image URL (optional)"
				/>
				<button
					type="submit"
					className="w-[10rem] h-[3rem] mt-4 bg-[#3b3] font-bold font-poppins text-[#fff] hover:bg-[#5d5] transition-all 300 ease-in rounded-[5rem] tracking-[3px] shadow-[0_0_5px_#333]">
					{updatedPost ? "Update Post" : "Create Post"}
				</button>
				<button
					className="absolute top-2 right-2 h-[3rem] w-[6rem] bg-[#f22] rounded-[3rem] text-[#fff] font-inter font-bold hover:bg-[#941515] transition-all duration-300"
					onClick={handleClear}>
					Clear all
				</button>
			</form>
		</section>
	);
}
