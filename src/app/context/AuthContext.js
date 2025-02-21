"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => {
	return useContext(AuthContext);
};

export default function AuthProvider({ children }) {
	const [userData, setUserData] = useState({});
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [errorModal, setErrorModal] = useState();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [displayName, setDisplayName] = useState("");
	const [darkMode, setDarkMode] = useState(false);
	const [color, setColor] = useState({
		profileDisplay: {
			pbg: "#8527c3",
			ptc: "#ff0",
		},
		profileCarousel: {
			topcrl: "#fb932c",
			bottomcrl: "#d0daed",
			textcolor: "#000",
		},
	});

	const toggleDarkMode = () => {
		setDarkMode((prev) => !prev);
	};

	const [showPicker, setShowPicker] = useState(false);
	const [activeColorKey, setActiveColorKey] = useState(null);

	const handleEditClick = (key) => {
		setActiveColorKey(key);
		setShowPicker(true);
	};

	const handleColorChange = (newColor) => {
		if (!activeColorKey) return;

		setColor((prev) => {
			const updatedColors = { ...prev };
			for (const section in updatedColors) {
				if (activeColorKey in updatedColors[section]) {
					updatedColors[section][activeColorKey] = newColor.hex;
					break;
				}
			}
			return { ...updatedColors };
		});
	};

	const getActiveColor = () => {
		if (!activeColorKey) return "#000";

		for (const section in color) {
			if (activeColorKey in color[section]) {
				return color[section][activeColorKey];
			}
		}

		return "#000";
	};

	const closePicker = () => {
		setShowPicker(false);
		setActiveColorKey(null);
	};

	useEffect(() => {
		const storedIsLoggedIn = Cookies.get("isLoggedIn");
		if (storedIsLoggedIn === "true") {
			setIsLoggedIn(true);
			fetchUserData();
		}
	}, []);

	const fetchUserData = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get("/api/auth/user", {
				withCredentials: true,
			});
			setIsAuthenticated(true);
			const { user } = response.data;
			setUserData(user);
			setIsLoading(false);
		} catch (error) {
			if (error.response?.status === 401) {
				console.error(error);
			} else {
				console.error(error);
			}
			setIsAuthenticated(false);
			setIsLoading(false);
			setUserData({});
		}
	};

	const login = async (payload) => {
		try {
			await axios.post("/api/auth/login", payload, {
				withCredentials: true,
			});

			const response = await axios.get("/api/auth/user", {
				withCredentials: true,
			});
			const { user } = response.data;
			setUserData(user);
			setIsAuthenticated(true);
			setIsLoggedIn(true);
			Cookies.set("isLoggedIn", "true", { expires: 1 });
			setErrorModal("");
			router.push("/");
		} catch (error) {
			console.error("Login failed", error);
			if (error.response) {
				if (error.response.status === 404) {
					setErrorModal("The requested resource was not found.");
				} else {
					const serverMessage = error.response?.data?.error;
					setErrorModal(serverMessage);
				}
			} else if (error.request) {
				setErrorModal("No response from the server. Please try again.");
			} else {
				setErrorModal(
					"An unexpected error occurred. Please try again."
				);
			}
			setIsAuthenticated(false);
		}
	};

	const signup = async (payload) => {
		try {
			await axios.post("/api/auth/signup", payload, {
				withCredentials: true,
			});

			const response = await axios.get("/api/auth/user", {
				withCredentials: true,
			});
			const { user } = response.data;
			setUserData(user);
			setIsAuthenticated(true);
			Cookies.set("isLoggedIn", "true", { expires: 1 });
			setErrorModal("");
			router.push("/");
		} catch (error) {
			console.error("Sign up failed", error);
			if (error.response) {
				if (error.response.status === 404) {
					setErrorModal("The requested resource was not found.");
				} else {
					const serverMessage = error.response?.data?.error;
					setErrorModal(serverMessage);
				}
			} else if (error.request) {
				setErrorModal("No response from the server. Please try again.");
			} else {
				setErrorModal(
					"An unexpected error occurred. Please try again."
				);
			}
			setIsAuthenticated(false);
		}
	};

	const logout = async () => {
		try {
			await axios.post("/api/auth/logout", {}, { withCredentials: true });
			setIsAuthenticated(false);
			setIsLoggedIn(false);
			setUserData({});
			setErrorModal("");
			Cookies.remove("isLoggedIn");
			router.push("/");
		} catch (error) {
			console.error("Logout failed", error);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				userData,
				login,
				logout,
				isAuthenticated,
				isLoggedIn,
				setIsAuthenticated,
				setUserData,
				signup,
				errorModal,
				setErrorModal,
				isLoading,
				setIsLoading,
				displayName,
				setDisplayName,
				fetchUserData,
				color,
				showPicker,
				closePicker,
				getActiveColor,
				handleColorChange,
				handleEditClick,
				toggleDarkMode,
				darkMode,
			}}>
			{children}
		</AuthContext.Provider>
	);
}
