"use client";
import React, { useRef } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { usePost } from "@/app/context/PostContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { BiCommentDetail } from "react-icons/bi";
import { RiThumbUpFill } from "react-icons/ri";
import { FiThumbsUp } from "react-icons/fi";
import { SlOptionsVertical } from "react-icons/sl";
import { IoIosClose } from "react-icons/io";
import { FaUserNinja } from "react-icons/fa";
import { useInteraction } from "@/app/context/interactionContext";
import Loading from "@/app/loading";
import axios from "axios";
export default function PostPage({ params }) {
	const { title } = React.use(params);
	const { posts } = usePost();
	const [post, setPost] = useState(null);
	const { isLoading, userData, isAuthenticated } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [showComment, setShowComments] = useState(false);
	const [option, setOption] = useState({});
	const [commentToEdit, setCommentToEdit] = useState({
		id: null,
		content: "",
	});
	const [comment, setComment] = useState(commentToEdit?.content || "");

	const toggleOption = (komment) => {
		setOption((prev) => ({
			[komment]: !prev[komment],
		}));
	};

	const {
		likes,
		handleComment,
		handleUpdateComment,
		userInteractions,
		toggleInteraction,
		saves,
		comments,
		fetchComments,
	} = useInteraction();

	const handleLike = () => {
		const action = userInteractions?.[post.id] ? "remove" : "add";
		toggleInteraction(post.id, action, "like");
	};

	const handleSave = () => {
		const action = saves?.[post.id] ? "remove" : "add";
		toggleInteraction(post.id, action, "save");
	};

	const toggleComment = () => {
		setShowComments((prev) => !prev);
	};

	const normalizeTitle = (str) => str.toLowerCase().replace(/[-\s]+/g, " ");

	useEffect(() => {
		if (title && posts?.length > 0) {
			const foundPost = posts.find(
				(p) => normalizeTitle(p.title) === normalizeTitle(title)
			);
			setPost(foundPost);
		}
	}, [title, posts]);

	if (!post) {
		return <Loading />;
	}

	const handleCancel = () => {
		setComment("");
		setIsEditing(false);
		setCommentToEdit({ id: "", content: "" });
	};

	const handleInputChange = (e) => {
		setComment(e.target.value);
	};

	const source =
		!post.image_url || post.image_url.trim() === ""
			? "/imgs/dog.jpg"
			: post.image_url;

	const commentsCount =
		comments.filter((comment) => comment.post_id === post.id).length || 0;

	const postComments = comments.filter(
		(comment) => comment.post_id === post.id
	);

	const handleDelete = async (id) => {
		try {
			await axios.delete("/api/comments", {
				data: { id },
				withCredentials: true,
			});
			fetchComments();
		} catch (error) {
			console.error("Error deleting the post", error);
		}
	};

	const idOfOpenComment = Number(Object.keys(option));

	const handleUpdateClick = (id, content) => {
		setCommentToEdit({
			id: id,
			content: content,
		});
		setComment(content);
	};

	const handleAction = (post_id, id, content, parent_comment) => {
		if (commentToEdit.content) {
			handleUpdateComment(id, content);
			setComment("");
			setCommentToEdit({ id: "", content: "" });
		} else {
			handleComment(post_id, content, parent_comment || null);
			setComment("");
		}
	};

	return (
		<>
			{isLoading && <Loading />}
			<section className="relative h-full w-full bg-[#aebcdb] flex items-center justify-center pt-8 pb-4">
				<article className="min-h-screen w-[95%] flex gap-y-4 flex-col p-2 border-b overflow-hidden">
					<h3 className="font-bold text-[#fff] text-[2.5rem] font-poppins border-b-2 border-brand2 py-1">
						{post.title}
					</h3>
					<div className="h-[5rem] w-full gap-x-4 flex items-center overflow-hidden border-b shadow-[0_0_5px_1px_#333] bg-brand2 px-2">
						<div
							className={`h-[70px] w-[70px] rounded-[50%] ${
								post.pfp ? "" : "bg-white"
							} flex overflow-hidden items-center justify-center font-extrabold font-poppins bg-center text-[#5a5] text-[1.8rem] hover:shadow-[0_0_4px_1px_#222] transition-all duration-300 cursor-pointer`}>
							{post.pfp ? (
								<img
									src={post.pfp}
									alt={post.author}
									className="object-cover h-full w-full rounded-full"
								/>
							) : (
								post?.author[0]
							)}
						</div>
						<div className="">
							<h5 className="font-bold text-[1rem] text-brand font-poppins tracking-[2px]">
								{post.author}
							</h5>
							<h6 className="text-[13px] font-inter font-bold text-[#511]">
								{post.Ctime}
							</h6>
						</div>
					</div>
					<div className="h-[3rem] flex items-center justify-around border-b shadow-[0_0_5px_1px_#333] bg-brand2">
						<span
							onClick={handleSave}
							className="cursor-pointer text-[1.6rem] text-brand flex items-center justify-center border-r-2 border-brand flex-1 h-[90%]">
							{saves?.[post.id] ? (
								<IoBookmark />
							) : (
								<IoBookmarkOutline />
							)}
						</span>
						<span className="flex gap-x-1 text-brand font-bold font-roboto flex-1 items-center justify-center border-r-2 h-[90%] border-brand">
							<BiCommentDetail
								className="text-[1.6rem] cursor-pointer "
								onClick={toggleComment}
							/>
							{commentsCount}
						</span>
						<span
							onClick={handleLike}
							className="cursor-pointer text-[1.6rem] text-brand flex items-center justify-center gap-x-1 flex-1 h-4/5">
							{userInteractions?.[post.id] ? (
								<RiThumbUpFill />
							) : (
								<FiThumbsUp />
							)}
							<h3 className="my-auto text-[20px]">
								{likes?.[post.id]?.interaction_count || 0}
							</h3>
						</span>
					</div>
					<article className="w-full min-[900px]:w-[75%] h-[600px] overflow-hidden">
						<Image
							width={500}
							height={350}
							src={source}
							alt={post.title}
							priority
							className="w-full h-full mb-4 object-contain "
						/>
					</article>
					<p className="w-full h-full font-roboto text-[15px]  text-justify pt-2 tracking-[1px]">
						{post.content}
						{". "}
					</p>
				</article>
				{/* Modal */}
				{showComment && (
					<article className="absolute flex pt-[2rem] justify-center top-0 right-0 h-full w-full bg-[#0009] z-[50] overflow-hidden">
						<section className="w-[90%] h-[650px] bg-[#fff] z-[100] rounded-[1rem] overflow-hidden flex flex-col">
							<header className="w-full h-[3.8rem] border-b overflow-hidden flex items-center justify-between px-6">
								<div className="flex items-center gap-x-2 justify-center">
									<h1 className="text-[1.3rem] font-bold font-inter">
										Comments
									</h1>
									<h4 className="text-[#777] text-[17px]">
										{commentsCount}
									</h4>
								</div>
								<span className="w-[3rem] h-[3rem] bg-[#fff] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#bbb] transition-all duration-300">
									<IoIosClose
										className="text-[2.7rem]"
										onClick={toggleComment}
									/>
								</span>
							</header>
							<main className="w-full flex-1 px-4 py-2 overflow-y-scroll relative">
								{postComments.map((postComment) => {
									const {
										content,
										id,
										name,
										pfp,
										Utime,
										updatedat,
										Ctime,
										user_id,
									} = postComment;
									const isOpen = option[id];
									return (
										<div
											className="relative flex min-h-[5rem] max-h-full w-[97%] justify-between gap-x-[8px]"
											key={id}>
											{(pfp && (
												<img
													src={pfp}
													alt={name}
													className="object-cover w-[45px] h-[45px] rounded-full "
												/>
											)) ||
												(content && !name && (
													<span className="w-[45px] h-[45px] rounded-full bg-[#8abdbd] flex items-center justify-center overflow-hidden">
														<FaUserNinja
															className={`text-[1.8rem]  text-[#96283d]`}
														/>
													</span>
												)) ||
												(content && name && !pfp && (
													<span className="flex h-[45px] w-[45px] rounded-full items-center justify-center font-bold text-[21px] bg-[#40b040] text-white">
														{userData?.name?.[0]}
													</span>
												))}
											<div className="h-full w-[90%]">
												<span className="flex gap-x-4">
													<p className="text-[14px] font-bold font-roboto text-[#283d96]">
														@
														{content && !name
															? "Deleted User"
															: name}
													</p>
													<p className="text-[12px] font-bold">
														{updatedat
															? Utime
															: Ctime}
													</p>
													{updatedat && (
														<h5 className="text-[13px] font-bold font-roboto">
															edited
														</h5>
													)}
												</span>

												<p className="font-inter text-[13px] h-full">
													{content && content}
												</p>
											</div>
											<SlOptionsVertical
												className="text-[#666] cursor-pointer"
												onClick={() => toggleOption(id)}
											/>
											{isOpen && (
												<div
													className={`w-[4rem] max-h-[4rem] absolute  right-4 rounded-[2px] shadow-[0_0_3px_#333] top-0 flex flex-col justify-center overflow-hidden `}>
													{userData?.id !==
													user_id ? (
														<button className="w-full flex flex-1 hover:bg-[#bbb] duration-300 transition-all items-center px-1 font-bold text-[15px] font-roboto">
															Flag
														</button>
													) : (
														<>
															<button
																className="w-full flex flex-1 hover:bg-[#bbb] duration-300 transition-all items-center px-1 font-bold text-[15px] font-roboto border-b"
																onClick={() =>
																	handleUpdateClick(
																		id,
																		content
																	)
																}>
																Edit
															</button>
															<button
																className="w-full flex flex-1 hover:bg-[#bbb] duration-300 transition-all items-center px-1 font-bold text[15px] font-roboto"
																onClick={() =>
																	handleDelete(
																		id
																	)
																}>
																Delete
															</button>
														</>
													)}
												</div>
											)}
										</div>
									);
								})}
							</main>
							{isAuthenticated && (
								<div className="min-h-[6rem] max-h-[8rem] w-full border-t overflow-hidden flex">
									<div className="w-[10%] min-w-[5rem] h-full flex items-center justify-center border-r">
										{userData?.pfp ? (
											<img
												src={userData.pfp}
												alt={userData.name}
												className="object-cover w-[50px] h-[50px] rounded-full "
											/>
										) : (
											<div className="h-[50px] w-[50px] rounded-full bg-[#8abdbd] flex items-center justify-center font-bold text-[21px] text-white">
												{userData?.name?.[0]}
											</div>
										)}
									</div>
									{/* New code */}

									<div className="w-full flex flex-col items-center justify-center">
										<input
											type="text"
											name="comment"
											id="comment"
											value={comment}
											onChange={(e) =>
												handleInputChange(e)
											}
											className={`border w-[90%] h-[2.5rem] rounded-[1rem] outline-none indent-2`}
										/>
										<div className="flex justify-end mt-1 px-2">
											<button
												className="px-4 py-1 text-sm text-gray-500 hover:bg-[#ccc] duration-300 transition-all rounded-[2rem]"
												onClick={handleCancel}>
												Cancel
											</button>
											<button
												className={`px-4 h-[2rem] ml-2 text-sm rounded-[2rem] ${
													comment
														? "bg-blue-500 text-white"
														: "bg-gray-300 text-gray-500 cursor-not-allowed"
												}`}
												onClick={() =>
													handleAction(
														post.id,
														idOfOpenComment,
														comment,
														""
													)
												}>
												{commentToEdit.content
													? "Update"
													: "Comment"}
											</button>
										</div>
									</div>
								</div>
							)}
						</section>
					</article>
				)}
			</section>
		</>
	);
}
