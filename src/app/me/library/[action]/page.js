"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useInteraction } from "@/app/context/interactionContext";
import { useAuth } from "@/app/context/AuthContext";
import { usePost } from "@/app/context/PostContext";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";
export default function LibraryAction({ params }) {
	const { action } = React.use(params);
	const { likes, saves, reads } = useInteraction();
	const { posts } = usePost();
	const [interactions, setInteractions] = useState([]);

	useEffect(() => {
		let url;

		switch (action) {
			case "liked":
				url = likes;
				break;
			case "saved":
				url = saves;
				break;
			case "read":
				url = reads;
				break;
			default:
				return;
		}

		if (url && posts) {
			const newInteractions = Object.keys(url).reduce((acc, id) => {
				const actionType = posts.find(
					(post) => post.id === parseInt(id)
				);
				if (actionType && !acc.some((i) => i.id === actionType.id)) {
					acc.push(actionType);
				}
				return acc;
			}, []);
			setInteractions(newInteractions);
		}
	}, [action, posts, likes, saves, reads]);

	return (
		<section className="min-h-screen h-full w-full bg-[#d0d0ff] relative py-[1rem] flex justify-center">
			<article className="h-full w-[80%] flex flex-col mx-auto py-[3rem] gap-y-[1.5rem]  overflow-hidden">
				<Link
					href="/me/library"
					className="absolute top-2 left-2 w-[2rem] h-[2rem] rounded-full bg-white overflow-hidden flex items-center justify-center shadow-[0_0_3px_1px_#222] transition-all duration-500">
					<IoMdArrowRoundBack className="text-[1.4rem] text-[#d0d0ff]" />
				</Link>
				{interactions.map((interaction) => {
					const encodedTitle = encodeURIComponent(
						interaction.title.replace(/\s+/g, "-")
					);
					return (
						<Link
							href={`/post/${encodedTitle}`}
							key={interaction.id}
							className="text-[1rem] text-[#55e] text-center font-poppins font-[600] uppercas">
							{interaction.title}
						</Link>
					);
				})}
			</article>
		</section>
	);
}
