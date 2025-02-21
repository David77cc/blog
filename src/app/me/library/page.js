"use client";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { FaBookmark, FaBookReader } from "react-icons/fa";
import { IoMdThumbsUp } from "react-icons/io";
export default function Library() {
	const { darkMode } = useAuth();
	return (
		<section
			className={`h-full w-full ${darkMode ? "bg-dark" : "bg-brand2"}`}>
			<article className="min-h-screen w-full flex flex-wrap bg-[#ddd0e4 justify-center items-center px-4 py-8 gap-x-[5rem] gap-y-[1.5rem]">
				<Link
					href="/me/library/liked"
					className="w-[18rem] h-[15rem] shadow-[0_0_5px_5px_#777] rounded-[1rem] flex items-center justify-center flex-col gap-y-2 bg-[#f5a000]">
					<span className="w-[11rem] h-[11rem] rounded-full bg-white overflow-hidden flex items-center justify-center hover:shadow-[0_0_5px_2px_#222] transition-all duration-500">
						<IoMdThumbsUp className="text-[3.5rem] text-whit text-[#f5a000]" />
					</span>
					<h5 className="font-poppins font-bold text-[1.1rem] text-white tracking-[2px]">
						Liked Post
					</h5>
				</Link>
				<Link
					href="/me/library/saved"
					className="w-[18rem] h-[15rem] shadow-[0_0_5px_5px_#777] rounded-[1rem] flex items-center justify-center flex-col gap-y-2 bg-[#256cc9]">
					<span className="w-[11rem] h-[11rem] rounded-full bg-white overflow-hidden flex items-center justify-center hover:shadow-[0_0_5px_2px_#222] transition-all duration-500">
						<FaBookmark className="text-[2.8rem] text-whit text-[#256cc9]" />
					</span>
					<h5 className="font-poppins font-bold text-[1.1rem] text-white tracking-[2px]">
						Saved Post
					</h5>
				</Link>
				<Link
					href="/me/library/read"
					className="w-[18rem] h-[15rem] shadow-[0_0_5px_5px_#777] rounded-[1rem] flex items-center justify-center flex-col gap-y-2 bg-[#23daac]">
					<span className="w-[11rem] h-[11rem] rounded-full bg-white overflow-hidden flex items-center justify-center hover:shadow-[0_0_5px_2px_#222] transition-all duration-500">
						<FaBookReader className="text-[2.8rem] text-whit text-[#23daac]" />
					</span>
					<h5 className="font-poppins font-bold text-[1.1rem] text-white tracking-[2px]">
						Read Post
					</h5>
				</Link>
			</article>
		</section>
	);
}
