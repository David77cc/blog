"use client";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { usePost } from "@/app/context/PostContext";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { GrUpdate } from "react-icons/gr";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
export default function MyPosts() {
	const { userData } = useAuth();
	const { posts, setUpdatedPost, fetchPosts } = usePost();
	const [dropDown, setDropDown] = useState({});
	const router = useRouter();

	const user = userData?.name || "";
	const trimedUser = user.trim();

	const filterPosts = posts.filter((post) => post?.author === trimedUser);

	const toggleAction = (postId) => {
		setDropDown((prev) => ({
			...prev,
			[postId]: !prev[postId],
		}));
	};

	const handleUpdateClick = (post) => {
		setUpdatedPost(post);
		router.push("/create");
	};

	const handleDelete = async (postId) => {
		if (window.confirm("Are you sure you want to delete this Post?")) {
			try {
				await axios.delete("/api/post", {
					data: { postId },
					withCredentials: true,
				});
				fetchPosts();
			} catch (error) {
				console.error("Failed to delete post", error);
			}
		}
	};
	return (
		<section className="h-screen w-full bg-[#099] flex flex-col items-center py-4 gap-y-6">
			{filterPosts.map((post) => {
				const encodedTitle = encodeURIComponent(
					post.title.replace(/\s+/g, "-")
				);
				const isOpen = dropDown[post.id];
				return (
					<div
						className="w-[95%] rounded-[.3rem] bg-[#2f2] h-[6rem] flex items-center overflow-hidden"
						key={post.id}>
						<Link
							href={`/post/${encodedTitle}`}
							className="text-[#fff] w-[90%] h-full text-wrap font-poppins text-[15px] font-bold px-2">
							{post.title}
						</Link>
						<span className="flex flex-col w-[10%] h-full items-center justify-between px-2 bg-[#fff]">
							{!isOpen ? (
								<IoIosArrowDown
									className="text-[25px] cursor-pointer text-[#ea7e13] "
									onClick={() => toggleAction(post.id)}
								/>
							) : (
								<IoIosArrowUp
									className="text-[25px] cursor-pointer text-[#ea7e13]"
									onClick={() => toggleAction(post.id)}
								/>
							)}
							{isOpen && (
								<span className="flex flex-col items-center justify-between w-full h-[4.5rem] py-2">
									<RiDeleteBin5Fill
										className="text-[1.3rem] text-[#f00] cursor-pointer"
										onClick={() => handleDelete(post.id)}
									/>
									<GrUpdate
										className="text-[1.3rem] text-[#2f2] cursor-pointer "
										onClick={() => handleUpdateClick(post)}
									/>
								</span>
							)}
						</span>
					</div>
				);
			})}
		</section>
	);
}
