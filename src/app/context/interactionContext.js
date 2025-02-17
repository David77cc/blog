"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const InteractionContext = createContext();

export const useInteraction = () => {
	return useContext(InteractionContext);
};

export default function InteractionProvider({ children }) {
	const [likes, setLikes] = useState({});
	const [userInteractions, setUserInteractions] = useState({});
	const [saves, setSaves] = useState({});
	const [reads, setReads] = useState({});
	const [comments, setComments] = useState([]);

	useEffect(() => {
		const fetchLikes = async () => {
			try {
				const response = await axios.get("/api/interactions");
				const { globalLikes, userLikes, userSaves, userReads } =
					response.data;

				const likesObject = {};
				const interactionObject = {};
				const savesObject = {};
				const readsObject = {};

				globalLikes?.forEach((item) => {
					likesObject[item?.post_id] = {
						interaction_count: parseInt(item.interaction_count, 10),
					};
				});

				userLikes?.forEach((item) => {
					interactionObject[item?.post_id] = item?.has_interacted;
				});
				userSaves?.forEach((item) => {
					savesObject[item?.post_id] = item?.post_id ? true : false;
				});
				userReads?.forEach((item) => {
					readsObject[item?.post_id] = item?.post_id ? true : false;
				});

				setLikes(likesObject);
				setSaves(savesObject);
				setReads(readsObject);
				setUserInteractions(interactionObject);
			} catch (error) {
				console.error("Failed to fetch likes", error);
			}
		};
		fetchLikes();
		fetchComments();
	}, []);

	const toggleInteraction = async (postId, action, interactionType) => {
		try {
			await axios.post("/api/interactions", {
				postId,
				action,
				interactionType,
			});

			if (interactionType === "like") {
				setLikes((prev) => {
					const updatedLikes = { ...prev };
					const currentCount =
						updatedLikes[postId]?.interaction_count || 0;
					if (action === "add" && currentCount === 0) {
						updatedLikes[postId] = {
							interaction_count: currentCount + 1,
						};
					} else if (action === "remove" && currentCount > 0) {
						updatedLikes[postId] = {
							interaction_count: currentCount - 1,
						};
					}
					return updatedLikes;
				});

				setUserInteractions((prev) => ({
					...prev,
					[postId]: action === "add",
				}));
			} else if (interactionType === "save") {
				setSaves((prev) => ({
					...prev,
					[postId]: action === "add",
				}));
			} else if (interactionType === "read") {
				setReads((prev) => ({
					...prev,
					[postId]: action === "add",
				}));
			}
		} catch (error) {
			console.error("Failed to update like", error);
		}
	};

	const fetchComments = async () => {
		try {
			const response = await axios.get("/api/comments");
			const { data } = response;
			setComments(data);
		} catch (error) {
			console.error("Error fetching comments", error);
		}
	};

	const handleComment = async (post_id, content, parent_comment) => {
		try {
			const pc = parent_comment ? parent_comment : "";
			await axios.post(
				"/api/comments",
				{
					post_id,
					content,
					parent_comment: pc,
				},
				{ withCredentials: true }
			);

			fetchComments();
		} catch (error) {
			console.error("Error commenting on this post", error);
		}
	};

	const handleUpdateComment = async (id, content) => {
		try {
			console.log(id, content);
			if (!id || !content) {
				console.log("missing field(s)");
				return;
			}
			const response = await axios.put(
				"/api/comments",
				{ id, content },
				{ withCredentials: true }
			);
			fetchComments();
			console.log(response);
		} catch (error) {
			console.error("Error updating comment", error);
		}
	};

	return (
		<InteractionContext.Provider
			value={{
				likes,
				userInteractions,
				toggleInteraction,
				reads,
				saves,
				comments,
				handleComment,
				handleUpdateComment,
				fetchComments,
			}}>
			{children}
		</InteractionContext.Provider>
	);
}
