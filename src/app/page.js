"use client";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { BiCommentDetail } from "react-icons/bi";
import { RiThumbUpFill } from "react-icons/ri";
import { FiThumbsUp } from "react-icons/fi";
import { PiStarFill } from "react-icons/pi";
import { useAuth } from "./context/AuthContext";
import { usePost } from "./context/PostContext";
import Link from "next/link";
import Loading from "./loading";
import Image from "next/image";
import { useInteraction } from "./context/interactionContext";
export default function Home() {
	const { isLoading, userData, userThemePref } = useAuth();
	const { posts } = usePost();
	const {
		likes,
		userInteractions,
		toggleInteraction,
		saves,
		reads,
		comments,
	} = useInteraction();
	const { darkMode } = userThemePref;

	return (
		<>
			{isLoading && <Loading />}
			<section
				className={`min-h-screen relative w-full flex items-center justify-evenly ${
					darkMode ? "bg-dark" : "bg-[#fff]"
				} flex-wrap overflow-hidden gap-[1rem] py-[3rem] px-2`}>
				{posts.map((post) => {
					const source = !post.image_url
						? "/imgs/dog.jpg"
						: post.image_url;
					const encodedTitle = encodeURIComponent(
						post.title.replace(/\s+/g, "-")
					);

					const handleLike = () => {
						const action = userInteractions?.[post.id]
							? "remove"
							: "add";
						toggleInteraction(post.id, action, "like");
					};

					const handleSave = () => {
						const action = saves?.[post.id] ? "remove" : "add";
						toggleInteraction(post.id, action, "save");
					};

					const handleRead = () => {
						const action = reads?.[post.id] ? "remove" : "add";
						toggleInteraction(post.id, action, "read");
					};

					const { id, pfp, title, author, Ctime } = post;

					const postComment = comments?.filter(
						(comment) => comment.post_id === id
					);

					return (
						<article
							className="min-[1018px]:w-[485px] min-[1018px]:h-[550px] h-[600px] w-[98%] shadow-[0_0_8px_#aaa] flex items-center justify-center flex-col hover:shadow-[0_0_25px_10px_#aaa] transition-all duration-300 gap-y-2 overflow-hidden"
							key={id}>
							<section className="relative flex-1 w-full h-full border-b border-brand2 max-h-[220px] pl-4 pr-2 flex flex-col items-center gap-y-2 overflow-hidden">
								<div className="flex items-center w-full gap-x-2 py-2">
									<span
										className={`${
											pfp ? "bg-transparent" : "bg-[#4aa]"
										} w-[55px] h-[55px] font-bold font-poppins text-white flex items-center justify-center rounded-full border-brand2 cursor-pointer hover:shadow-[0_0_5px_1px_#222] transition-all duration-300`}>
										{(
											<img
												src={pfp}
												className="w-full h-full rounded-full  object-cover"
											/>
										) || author[0]}
									</span>
									<h3
										className={`font-bold font-nunito ${
											darkMode
												? "text-brand2"
												: "text-brand"
										}`}>
										{author}
									</h3>
								</div>
								<Link
									href={`post/${encodedTitle}`}
									className={`hover:text-brand2 transition-all duration-300 w-full h-full px-1 ${
										darkMode ? "text-white" : "text-brand"
									} flex items-center justify-center`}>
									<h3 className="font-bold font-nunito text-[1.15rem] tracking-[1px] w-full overflow-hidden text-center">
										{title}
									</h3>
								</Link>
								<h3
									className={`absolute font-bold font-montserrat ${
										darkMode ? "text-white" : "text-[#777]"
									} text-[12px] right-2 top-2`}>
									{Ctime}
								</h3>
								{userData?.name === author && (
									<PiStarFill
										className={`absolute text-brand2 text-[2rem] top-1 right-1/2 left-1/2`}
									/>
								)}
							</section>
							<section className="min-[1018px]:h-[300px] min-[1018px]:w-[95%] h-[350px] min-[1018px]:max-h-[300px] max-h-[350px] overflow-hidden flex items-center justify-center">
								<Link
									href={`/post/${encodedTitle}`}
									className="w-full h-full">
									<Image
										width={550}
										height={300}
										src={source}
										alt={post.title}
										className="object-cover h-full"
										priority
										onError={(e) =>
											(e.target.src =
												"/uploads/profile_pic/profile-1739179805578-197376673.jpg")
										}
									/>
								</Link>
							</section>
							<section className="flex-1 w-full border-t h-full flex flex-col items-center">
								<div className="w-full h-[35px] flex items-center justify-center font-nunito font-bold text-brand">
									<Link
										href={`post/${encodedTitle}`}
										className="h-[100%] w-full flex bg-brand2 items-center justify-center tracking-[5px]">
										Read
									</Link>
								</div>
								<div className="w-full border-2 flex items-center justify-around flex-1 bg-brand2">
									<span className="h-full w-[33.3%] border-r-2 flex items-center justify-center overflow-hidden gap-x-2">
										{userInteractions?.[id] ? (
											<RiThumbUpFill
												className="text-[1.8rem] cursor-pointer text-brand"
												onClick={handleLike}
											/>
										) : (
											<FiThumbsUp
												className="text-[1.75rem] cursor-pointer text-brand"
												onClick={handleLike}
											/>
										)}
										<h3 className="text-brand font-inter  text-[20px] border-l-2 border-brand2 text-center px-2">
											{likes?.[id]?.interaction_count ||
												0}
										</h3>
									</span>
									<span className="h-full w-[33.3%] border-r-2 flex items-center justify-center overflow-hidden gap-x-2">
										{saves?.[id] ? (
											<IoBookmark
												className="text-[1.8rem] cursor-pointer text-brand"
												onClick={handleSave}
											/>
										) : (
											<IoBookmarkOutline
												className="text-[1.75rem] cursor-pointer text-brand"
												onClick={handleSave}
											/>
										)}
									</span>
									<span className="h-full w-[33.3%] flex items-center justify-center overflow-hidden gap-x-2">
										<Link href={`post/${encodedTitle}`}>
											<BiCommentDetail className="text-brand text-[1.75rem]" />
										</Link>
										<h3 className="text-brand font-inter  text-[20px] border-l-2 border-brand2 text-center px-2">
											{postComment.length}
										</h3>
									</span>
								</div>
							</section>
						</article>
					);
				})}
			</section>
		</>
	);
}
