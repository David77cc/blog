"use client";
import { useState, useRef, useEffect } from "react";
import { TiThMenu } from "react-icons/ti";
import { useAuth } from "@/app/context/AuthContext";
import Loading from "@/app/loading";
import { RiAccountCircleFill, RiMoonFill, RiSunFill } from "react-icons/ri";
import { MdVpnKey } from "react-icons/md";
import { BsFillPaletteFill } from "react-icons/bs";
import { RiResetLeftFill, RiPenNibFill } from "react-icons/ri";
import { PiSignOutFill } from "react-icons/pi";
import { GrSettingsOption } from "react-icons/gr";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import bcrypt from "bcryptjs";
import { BiSolidUserAccount } from "react-icons/bi";

export default function Setting() {
	const {
		isLoading,
		logout,
		userData,
		fetchUserData,
		userThemePref,
		changeMode,
		changeThemePref,
	} = useAuth();
	const { darkMode } = userThemePref;
	const [optionText, setOptionText] = useState("account");
	const [openModal, setOpenModal] = useState(false);
	const [passwordModal, setPasswordModal] = useState(false);
	const [hidden, setHidden] = useState(true);
	const [doesPasswordMatch, setDoesPasswordMatch] = useState(false);
	const modalRef = useRef(null);
	const rmodalRef = useRef(null);
	const confirmRef = useRef(null);
	const successRef = useRef(null);
	const themeRef = useRef(null);
	const [passwordVerification, setPasswordVerification] = useState("");
	const [message, setMessage] = useState("");
	const [confirmationModal, setConfirmationModal] = useState({
		delAccountModal: {
			message:
				"Are you sure you want to delete your account, this operation cannnot be undone",
			open: false,
			confirm: false,
		},
		passwordChanged: {
			message: "Password changed successfully",
			open: false,
		},
	});
	const [themeModal, setThemeModal] = useState({ isOpen: false, action: "" });

	const actions = [
		"account",
		"password",
		"theme",
		"default settings",
		"sign out",
	];

	const icons = [
		RiAccountCircleFill,
		MdVpnKey,
		BsFillPaletteFill,
		RiResetLeftFill,
		PiSignOutFill,
	];

	const toggleVisibility = () => {
		setHidden((prev) => !prev);
	};

	const handleOptionText = (id) => {
		setOptionText(actions[id]);
		setOpenModal(false);
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (modalRef.current && !modalRef.current.contains(event.target)) {
				setOpenModal(false);
			}
			if (
				rmodalRef.current &&
				!rmodalRef.current.contains(event.target)
			) {
				setPasswordModal(false);
				setDoesPasswordMatch(false);
			}
			if (
				confirmRef.current &&
				!confirmRef.current.contains(event.target)
			) {
				setConfirmationModal((prev) => ({
					...prev,
					delAccountModal: {
						...prev.delAccountModal,
						open: false,
					},
				}));
				setPasswordVerification("");
				setDoesPasswordMatch(false);
			}
			if (
				successRef.current &&
				!successRef.current.contains(event.target)
			) {
				setConfirmationModal((prev) => ({
					...prev,
					passwordChanged: {
						...prev.passwordChanged,
						open: false,
					},
				}));
			}
			if (themeRef.current && !themeRef.current.contains(event.target)) {
				setThemeModal({ isOpen: false, action: "" });
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	});

	const toggleModal = () => {
		setOpenModal((prev) => !prev);
	};

	const deleteAccount = async (confirm) => {
		if (!confirm) {
			return;
		}
		try {
			const { id, email } = userData;
			console.log(id, email);
			await axios.delete("/api/auth/user", {
				data: { userId: id, email },
				withCredentials: true,
			});
			fetchUserData();
		} catch (error) {
			console.error("Couldn't delete User", error);
		}
	};

	const handlePasswordModal = () => {
		setPasswordModal((prev) => !prev);
	};

	const checkPassword = async () => {
		if (!passwordVerification) {
			setMessage("Please enter your previous password");
			return;
		}
		try {
			const isValidPassword = await bcrypt.compare(
				passwordVerification,
				userData?.password
			);
			console.log("User previous Password", userData.password);
			if (!isValidPassword) {
				setDoesPasswordMatch(false);
				setMessage("Password do not match");
				return;
			}
			setDoesPasswordMatch(true);
			setPasswordVerification("");
		} catch (error) {
			console.error("Password do not match", error);
		}
	};

	const handleOnChangePassword = (event) => {
		const { value } = event.target;
		setMessage("");
		setPasswordVerification(value);
	};

	const handleUpdatePassword = async () => {
		try {
			if (!doesPasswordMatch) return;
			if (!passwordVerification) {
				setMessage("Password cannot be empty");
			}
			await axios.put(
				"/api/setting",
				{ email: userData?.email, password: passwordVerification },
				{ withCredentials: true }
			);
			console.log("Did it go through");
			console.log("password", passwordVerification);
			setDoesPasswordMatch(false);
			setPasswordVerification("");
			fetchUserData();
			setConfirmationModal((prev) => ({
				...prev,
				passwordChanged: {
					...prev.passwordChanged,
					open: true,
				},
			}));
		} catch (error) {
			console.error("Error updating password", error);
		}
	};

	const toggleThemeModal = (actionType) => {
		setThemeModal({ isOpen: !!actionType, action: actionType });
	};

	const content = {
		account: (
			<div className="w-full h-full flex flex-col items-center justify-center relative">
				<RiAccountCircleFill className="absolute animate-bounce top-[4rem] text-[3rem] text-brand2" />
				<button
					className="text-center w-4/5 h-[2.7rem] rounded-[3rem] bg-[#b02] text-[1.3rem] font-sans font-bold tracking-[2px] text-white shadow-[2px_2px_4px_1px_#222] hover:bg-[#c00] hover:tracking-[4px] transition-all duration-300"
					onClick={() =>
						setConfirmationModal((prev) => ({
							...prev,
							delAccountModal: {
								...prev.delAccountModal,
								open: true,
							},
						}))
					}>
					Delete Account
				</button>
			</div>
		),
		password: (
			<div className="w-full h-full flex flex-col items-center justify-center relative">
				<MdVpnKey className="absolute animate-bounce top-[4rem] text-[3rem] text-brand2" />
				<button
					className="text-center w-4/5 h-[2.7rem] rounded-[3rem] bg-[#fff] text-[1.3rem] font-sans font-bold tracking-[2px] text-[#b02] shadow-[2px_2px_4px_1px_#222] hover:bg-[#c0dfe2] hover:tracking-[4px] transition-all duration-300"
					onClick={handlePasswordModal}>
					Change Password
				</button>
			</div>
		),
		"default settings": (
			<div className="w-full h-full flex flex-col items-center justify-center relative">
				<RiResetLeftFill className="absolute animate-spin [animation-duration:1.5s] top-[4rem] text-[3rem] text-brand2" />
				<button className="text-center w-4/5 h-[2.7rem] rounded-[3rem] bg-white text-[1.3rem] font-sans font-bold tracking-[2px] text-[#b02] shadow-[2px_2px_4px_1px_#222] hover:bg-[#c00] hover:text-white hover:tracking-[4px] transition-all duration-300">
					Reset to default settings
				</button>
			</div>
		),
		"sign out": (
			<div className="w-full h-full flex flex-col items-center justify-center relative">
				<PiSignOutFill className="absolute animate-bounce top-[3rem] text-[3rem] text-brand2" />
				<button
					className="text-center w-4/5 h-[2.7rem] rounded-[3rem] bg-[#b02] text-[1.3rem] font-sans font-bold tracking-[2px] text-white shadow-[2px_2px_4px_1px_#222] hover:bg-[#c00] hover:tracking-[4px] transition-all duration-300"
					onClick={logout}>
					Sign Out
				</button>
			</div>
		),
		theme: (
			<>
				<div className="w-full h-4/5 flex flex-col items-center justify-center  overflow-hidde px-2 gap-y-4 relative">
					<BsFillPaletteFill className="absolute animate-bounce top-2 text-[3rem] text-brand2" />
					<button
						className="w-full h-[2.3rem] border-b-2 flex items-center justify-between text-left pl-2 text-[1.3rem] text-[#2ff] hover:text-brand2 transition-all duration-300"
						onClick={changeMode}>
						{darkMode ? "Light Mode" : "Dark Mode"}
						{!darkMode ? (
							<RiMoonFill className="text-[1.6rem]" />
						) : (
							<RiSunFill className="text-[1.6rem]" />
						)}
					</button>
					<button
						className="w-full h-[2.3rem] border-b-2 flex items-center justify-between text-left pl-2 text-[1.3rem] text-[#2ff] hover:text-brand2 transition-all duration-300 overflow-hidden"
						onClick={() => toggleThemeModal("pc")}>
						Profile Color{" "}
						<RiAccountCircleFill className="text-[1.6rem]" />
					</button>
					<button
						className="w-full h-[2.3rem] border-b-2 flex items-center justify-between overflow-hidden text-left pl-2 text-[1.3rem] text-[#2ff] hover:text-brand2 transition-all duration-300"
						onClick={() => toggleThemeModal("upc")}>
						User Profile Card Color{" "}
						<BiSolidUserAccount className="" />
					</button>
				</div>
			</>
		),
	};

	return (
		<>
			{isLoading && <Loading />}
			<section
				className={`h-screen w-full ${
					darkMode ? "bg-dark" : "bg-white"
				} flex flex-col items-center min-[800px]:flex-1`}>
				<header className="w-full h-[70px] bg-[#8527c3] flex items-center justify-between pl-1 pr-4">
					<div className="flex gap-x-2 items-center transition-all duration-300">
						<span
							className="h-[3.2rem] w-[3.2rem] rounded-full overflow-hidden min-[800px]:hidden flex items-center justify-center hover:bg-[#9543cd] transition-all duration-300 cursor-pointer "
							onClick={toggleModal}>
							<TiThMenu className="text-white text-[2rem]" />
						</span>
					</div>
					<h3 className="text-[30px] text-white font-[450] font-poppins tracking-[7px]">
						Setting
					</h3>
				</header>
				{/* Actions */}
				<section className="w-[98%] min-[800px]:w-[70%] min-[800px]:translate-x-[20%] min-h-[300px] flex flex-col items-center py-6">
					<h3 className="w-full h-[2rem] text-[1.4rem] font-bold text-brand font-poppins tracking-[.5rem] text-center mb-4 capitalize">
						{optionText}
					</h3>
					<article className="w-full min-h-[400px] rounded-[1rem] bg-[#8527c3] shadow-[2px_2px_5px_1px_#222] flex items-center justify-center overflow-hidden">
						{content[optionText]}
					</article>
				</section>
				{/* Modals */}
				{/* Navbar Modal */}
				<article
					className={`absolute w-2/3 left-0 h-[700px] top-0 bottom-18 border z-30 border-none transition-all duration-500 -translate-x-[100%] ${
						!openModal ? "-translate-x-[100%]" : "translate-x-[0%]"
					} min-[800px]:translate-x-[0%] min-[800px]:w-[25%] min-[800px]:bg-white `}
					ref={modalRef}>
					<div
						className={`w-full h-[70px] min-[800px]:block bg-[#8527c3] text-[2.3rem] text-white font-poppins font-bold tracking-[2px] flex items-center text-center jutify-center px-2 ${
							openModal
								? "border-b border-b-white"
								: "border-none"
						} min-[800px]:border-none`}>
						<span className="flex items-center overflow-hidden pl-2 w-full h-full">
							<GrSettingsOption className="text-[3.2rem] animate-spin [animation-duration:1.5s]" />
						</span>
					</div>
					<section
						className={`w-full h-full ${
							darkMode
								? "bg-dark"
								: "min-[800px]:bg-white bg-brand"
						} flex flex-col transition-all duration-300`}>
						{actions.map((action, id) => {
							const IconComponent = icons[id];
							return (
								<div
									className="w-full flex items-center gap-x-6 pl-4 h-[4rem]"
									key={id}
									onClick={() => handleOptionText(id)}>
									<IconComponent className="text-[1.5rem] text-[#fff] min-[800px]:text-[#8527c3]" />

									<button className="text-[1.1rem] font-montserrat text-white font-[500] min-[800px]:text-[#8527c3] capitalize">
										{action}
									</button>
									{optionText === action && (
										<span
											className={`absolute h-[10px] w-[10px] rounded-full ${
												darkMode
													? "bg-brand2"
													: "min-[800px]:bg-brand bg-brand2"
											} right-4`}></span>
									)}
								</div>
							);
						})}
					</section>
				</article>
				{/* Password Modal */}
				{passwordModal && (
					<div
						className="absolute top-[10rem] h-[300px] w-[90%] rounded-[2rem] shadow-[0_0_3px_#333] bg-white z-[50] overflow-hidden flex items-center justify-center flex-col gap-8"
						ref={rmodalRef}>
						<h2 className="text-[21px] font-poppins text-[red] tracking-[2px]">
							{doesPasswordMatch
								? "Enter your new Password"
								: "Enter your previous Password"}
						</h2>
						<div className="h-[4.5rem] relative w-[90%] overflow-hidden flex flex-col items-center justify-center gap-y-2">
							<input
								type={`${hidden ? "password" : "text"}`}
								name="rp"
								id="rp"
								value={passwordVerification}
								placeholder="Password"
								onChange={(e) => handleOnChangePassword(e)}
								className="bg-[#a51e1e] w-full h-[2.7rem] rounded-[3rem] outline-none indent-2 placeholder:text-[#e65d5d] text-white text-[1rem] font-poppins"
							/>
							{!message && (
								<>
									{hidden ? (
										<FaEye
											className="absolute right-[1.5rem] text-[1.5rem] text-[#2f2] cursor-pointer"
											onClick={toggleVisibility}
										/>
									) : (
										<FaEyeSlash
											className="absolute right-[1.5rem] text-[1.5rem] text-[#f22] cursor-pointer"
											onClick={toggleVisibility}
										/>
									)}
								</>
							)}
							{message && (
								<p className="text-[red] text-[14px] font-roboto tracking-[2px] font-[550]">
									{message}
								</p>
							)}
						</div>
						{doesPasswordMatch ? (
							<button
								className="w-2/4 h-[2.4rem] bg-[#2bb] rounded-[3rem] font-bold font-poppins tracking-[2px] text-[#fff] hover:w-4/5 transition-all duration-300"
								onClick={handleUpdatePassword}>
								Change
							</button>
						) : (
							<button
								className="w-2/4 h-[2.4rem] bg-[#2bb] rounded-[3rem] font-bold font-poppins tracking-[2px] text-[#fff] hover:w-4/5 transition-all duration-300"
								onClick={checkPassword}>
								Verify
							</button>
						)}
					</div>
				)}
				{passwordModal && (
					<>
						<div className="absolute top-0 left-0 right-0 bottom-0 bg-[#000] h-full w-full bg-opacity-[.6] transition-all duration-300 z-[30]"></div>
					</>
				)}
				{openModal && (
					<>
						<div className="absolute top-0 left-0 bottom-0 bg-[#000] h-full w-full bg-opacity-[.6] transition-all duration-300 min-[800px]:hidden"></div>
					</>
				)}
				{confirmationModal.delAccountModal.open && (
					<>
						<div className="absolute top-0 left-0 right-0 bottom-0 bg-[#000] h-full w-full bg-opacity-[.6] transition-all duration-300 z-[100] flex items-center justify-center">
							<div
								className="flex w-[95%] h-[400px] items-center justify-center flex-col bg-white rounded-[1rem] gap-y-[2rem] shadow-[0_0_7px_3px_#ddd]"
								ref={confirmRef}>
								<h3 className="w-full text-[1.2rem] font-bold font-mono text-[red] text-center tracking-[3px] overflow-hidden">
									{confirmationModal.delAccountModal.message}
								</h3>
								<div className="w-full flex justify-center gap-x-8">
									<button
										className="w-[25%] h-[2.3rem] bg-[#292] rounded-[.5rem] text-[18px] font-bold font-montserrat text-white hover:bg-[#2f2] transition-all duration-300 shadow-[0_0_3px_#222]"
										onClick={() => {
											setConfirmationModal((prev) => ({
												...prev,
												delAccountModal: {
													...prev.delAccountModal,
													confirm: true,
												},
											}));
											deleteAccount(true);
										}}>
										Yes
									</button>
									<button
										className="w-[25%] h-[2.3rem] bg-[#922] rounded-[.5rem] text-[18px] font-bold font-montserrat text-white hover:bg-[#f22] transition-all duration-300 shadow-[0_0_3px_#222]"
										onClick={() =>
											setConfirmationModal((prev) => ({
												...prev,
												delAccountModal: {
													...prev.delAccountModal,
													open: false,
												},
											}))
										}>
										No
									</button>
								</div>
							</div>
						</div>
					</>
				)}
				{confirmationModal.passwordChanged.open && (
					<>
						<div className="absolute top-0 left-0 bottom-0 bg-[#000] h-full w-full bg-opacity-[.6] transition-all duration-300 z-[100] flex items-center justify-center">
							<div
								className="w-[80%] h-[300px] bg-white rounded-[10rem]  flex items-center justify-center flex-col gap-y-8"
								ref={successRef}>
								<h3 className="text-[1.5rem] text-brand font-bold font-montserrat tracking-[.3rem]">
									{confirmationModal.passwordChanged.message}
								</h3>
								<button
									className="h-[3rem] w-[80%] bg-cool rounded-[1rem] text-[1.2rem] text-white font-bold font-montserrat hover:w-[93%] transition-all duration-300"
									onClick={() =>
										setConfirmationModal((prev) => ({
											...prev,
											passwordChanged: {
												...prev.passwordChanged,
												open: false,
											},
										}))
									}>
									Close
								</button>
							</div>
						</div>
					</>
				)}
				{themeModal.action && (
					<>
						<div className="absolute top-0 left-0 right-0 bottom-0 bg-black h-full w-full bg-opacity-[.8] transition-all duration-300 z-[30] flex items-center justify-center">
							<article
								className="h-2/3 w-[90%] bg-white rounded-[5rem] flex items-center overflow-hidden shadow-[0_0_10px_2px_#ccc]"
								ref={themeRef}>
								<section className="h-4/5 w-1/3 border-r-2 border-cool flex items-center justify-center overflow-hidden">
									{themeModal.action === "pc" ? (
										<div className="min-[800px]:w-[10rem] min-[800px]:h-[10rem] h-[6.5rem] w-[6.5rem] bg-brand rounded-full flex items-center justify-center text-[4rem] text-cool font-bold">
											{userData?.name?.[0]}
										</div>
									) : (
										<section className="h-full w-full flex items-center justify-center flex-col gap-y-6">
											<div className="w-[5rem] h-[5rem] min-[800px]:h-[8rem] min-[800px]:w-[8rem] bg-topc rounded-full"></div>
											<div className="w-[5rem] h-[5rem] min-[800px]:h-[8rem] min-[800px]:w-[8rem] bg-bottomc rounded-full"></div>
											<div className="w-4/5 h-[3rem] bg-[orange] rounded-[1.3rem] text-[1.2rem] flex items-center justify-center font-bold">
												{userData?.name.split(" ")[0]}
											</div>
										</section>
									)}
								</section>
								<section className="flex justify-center items-center w-2/3 h-full flex-col gap-y-[3rem]">
									{themeModal.action === "pc" ? (
										<>
											<div className="h-[2.5rem] w-10/12 border-b-2 border-cool text-[.95rem] min-[800px]:text-[1.2rem] flex items-center justify-between px-1 text-brand">
												Change Background Color
												<RiPenNibFill className="text-brand text-[1.4rem] cursor-pointer" />
											</div>
											<div className="h-[2.5rem] w-10/12 border-b-2 border-cool text-[.95rem] min-[800px]:text-[1.2rem] flex items-center justify-between px-1 text-brand">
												Change Text Color
												<RiPenNibFill className="text-brand text-[1.4rem] cursor-pointer" />
											</div>
										</>
									) : (
										<>
											<div className="h-[2.5rem] w-10/12 border-b-2 border-cool text-[.95rem] min-[800px]:text-[1.2rem] flex items-center justify-between px-1 text-brand">
												Change Top Carousel Color
												<RiPenNibFill className="text-brand text-[1.4rem] cursor-pointer" />
											</div>
											<div className="h-[2.5rem] w-10/12 border-b-2 border-cool text-[.95rem] min-[800px]:text-[1.2rem] flex items-center justify-between px-1 text-brand">
												Change Bottom Carousel Color
												<RiPenNibFill className="text-brand text-[1.4rem] cursor-pointer" />
											</div>
											<div className="h-[2.5rem] w-10/12 border-b-2 border-cool text-[.95rem] min-[800px]:text-[1.2rem] flex items-center justify-between px-1 text-brand">
												Change Carousel Text Color
												<RiPenNibFill className="text-brand text-[1.4rem] cursor-pointer" />
											</div>
										</>
									)}
								</section>
							</article>
						</div>
					</>
				)}
			</section>
		</>
	);
}
