"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const PostContext = createContext();

export const usePost = () => {
	return useContext(PostContext);
};

export default function PostProvider({ children }) {
	const [posts, setPosts] = useState([]);
	const { userData, setIsLoading } = useAuth();
	const [updatedPost, setUpdatedPost] = useState();

	const fetchPosts = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get("/api/post");
			const { data } = response;
			setPosts(data);
			setIsLoading(false);
		} catch (error) {
			console.error(error);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchPosts();
	}, [userData.id]);

	return (
		<PostContext.Provider
			value={{ posts, fetchPosts, setUpdatedPost, updatedPost }}>
			{children}
		</PostContext.Provider>
	);
}
