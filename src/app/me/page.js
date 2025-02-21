"use client";
import "@/app/globals.css";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FcCamera } from "react-icons/fc";
import axios from "axios";
import { IoIosClose } from "react-icons/io";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { RiUserHeartFill } from "react-icons/ri";
import { MdAccessTimeFilled } from "react-icons/md";
import { PiCalendarBold } from "react-icons/pi";
import Loading from "../loading";
import { TbMailStar } from "react-icons/tb";
export default function Me() {
	const [file, setFile] = useState(null);
	const [isUpLoading, setIsUpLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [openModal, setOpenModal] = useState(false);
	const { userData, isLoading, fetchUserData, logout, color } = useAuth();
	const { id, name, email, created_time, created_at, display_name, pfp } =
		userData;
	const [fullScreen, setFullScreen] = useState(false);
	const [fill, setFill] = useState(true);
	const [urlMethod, setUrlMethod] = useState(false);
	const [url, setUrl] = useState("");

	const handleFullScreen = () => {
		setFullScreen((prev) => !prev);
	};

	const handleSizeRatio = () => {
		setFill((prev) => !prev);
	};

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile) {
			setFile(selectedFile);
		}
	};

	const handleUrlChange = (e) => {
		setUrl(e.target.value);
	};

	const handleFileSubmit = async (e) => {
		e.preventDefault();

		if (!file && !url) {
			setMessage("Please select a file to upload.");
			return;
		}
		let formData;

		if (!urlMethod && file) {
			formData = new FormData();
			formData.append("uploadedImage", file);
		} else if (urlMethod && url) {
			formData = url;
		}

		setIsUpLoading(true);
		setMessage("");
		setIsUpLoading(true);
		try {
			await axios.post("/api/auth/user/profile-pic", formData, {
				headers: {
					"Content-Type": !urlMethod
						? "multipart/form-data"
						: "application/json",
				},
				withCredentials: true,
			});
			fetchUserData();
			setIsUpLoading(false);
			setOpenModal(false);
			setFile("");
			setUrl("");
		} catch (error) {
			console.error(
				"Error uploading the profile picture please try again",
				error
			);
			setMessage("Network error, please try again.");
		} finally {
			setIsUpLoading(false);
		}
	};

	function toggleModal() {
		setOpenModal((prev) => !prev);
	}

	function handleMethod() {
		setUrlMethod((prev) => !prev);
	}

	const userProfile = {
		backgroundColor: pfp ? "#222" : color?.profileDisplay?.pbg,
		color: color?.profileDisplay?.ptc,
	};

	return (
		<>
			{(isLoading || isUpLoading) && <Loading />}
			<section className="h-screen w-full flex items-center justify-center overflow-hidden relative bg-[#099]">
				<article className="w-full h-full flex flex-col items-center py-8 gap-y-4 ">
					<div className="w-[17rem] h-[17rem] flex flex-col items-center justify-center relative">
						<div
							className={`rounded-full overflow-hidden flex items-center justify-center cursor-pointer shadow-[0_0_3px_2px_#555]
							${
								fullScreen
									? "fixed top-0 left-0 right-0 w-full h-full rounded-none  bg-opacity-[.9] z-[102]"
									: "relative h-[14rem] w-[14rem] bg-transparent"
							} translate-all duration-500 ease-in-out`}
							style={userProfile}
							onClick={!fullScreen ? toggleModal : undefined}>
							{pfp ? (
								<img
									src={pfp}
									alt={display_name}
									className={`${
										fill ? "object-cover" : "object-contain"
									} h-full w-full`}
								/>
							) : (
								<h2 className="text-[#ff0] text-[5.5rem] text-center font-bold font-ubuntu">
									{name && display_name[0]}
								</h2>
							)}
							{!fullScreen && (
								<div className="absolute w-full h-full rounded-full opacity-0 hover:opacity-[1] bg-[#0008]  overflow-hidden flex flex-col items-center justify-center transition-all duration-300 px-2">
									<FcCamera className="text-[2rem]" />
									<h3 className="text-center font-roboto font-[400] text-[15px] text-[#fff]">
										Change Profile Picture
									</h3>
								</div>
							)}
							{fullScreen && (
								<button
									className="h-[3rem] w-[6rem] rounded-[3rem] z-[102] bg-[#dcc9c9] absolute top-2 right-2 font-[600] tracking-[3px] hover:opacity-80 transition-all duraiton-300 text-[.8rem] shadow-[2px_1px_5px_2px_#333]"
									onClick={handleSizeRatio}>
									{fill ? "aspect ratio" : "fill"}
								</button>
							)}
						</div>
						{pfp && (
							<span
								className={`absolute h-[2rem] w-[2rem] rounded-full top-[1rem] right-0 cursor-pointer hover:bg-[#c7a5e9] flex items-center justify-center bg-[#7932bb] transition-all duration-300 ${
									fullScreen
										? "-top-[2rem] -left-[3rem] z-[102]"
										: ""
								}`}
								onClick={handleFullScreen}>
								{fullScreen ? (
									<MdFullscreenExit className="text-[1.5rem] text-[#fff]" />
								) : (
									<MdFullscreen className="text-[1.5rem] text-[#fff]" />
								)}
							</span>
						)}
					</div>
					{/* User's information */}
					<article className="w-full flex flex-col items-center justify-center">
						<div className="w-full h-[12rem] flex flex-col items-center justify-center gap-y-3 py-2 font-medium font-inter text-[1.1rem] border-t bg-[#fef]">
							<span className="w-4/5 text-[#b158d7] flex items-center gap-x-8">
								<RiUserHeartFill className="text-[1.5rem]" />
								{name && name} {id}
							</span>
							<span className="w-4/5 text-[#b158d7] flex items-center gap-x-8">
								<TbMailStar className="text-[1.5rem]" />
								{email && email}
							</span>
							<span className="w-4/5 text-[#b158d7] flex items-center gap-x-8">
								<PiCalendarBold className="text-[1.5rem]" />
								{created_at && created_at}
							</span>
							<span className="w-4/5 text-[#b158d7] flex items-center gap-x-8">
								<MdAccessTimeFilled className="text-[1.5rem]" />
								{created_time && created_time}
							</span>
						</div>
						<div className="w-full h-[10rem] bg-[#099] flex flex-col items-center justify-center font-bold font-poppins  text-white">
							<button
								onClick={logout}
								className="w-2/3 h-[3rem] rounded-[3rem] bg-[#0ff] hover:w-4/5 hover:opacity-[.5] transition-all duration-[.4s]">
								Sign Out
							</button>
						</div>
					</article>
				</article>
				{/* Modal for uploading pfp */}
				{openModal && (
					<>
						<div className="absolute top-0 left-0 h-full w-full bg-[#000d] z-10"></div>
						<article className="absolute h-[70%] w-[95%] rounded-[.5rem] top-[10%] overflow-hidden flex flex-col items-center justify-center z-20 gap-y-[5rem] bg-[#565]">
							<h2 className="text-[2rem] text-[#fff] font-montserrat font-bold">
								Upload Profile Picture
							</h2>
							<span
								className="h-[3rem] w-[3rem] rounded-full flex items-center justify-center bg-[#a22] absolute top-2 right-[.5rem] cursor-pointer hover:bg-[#f22] transition-all duration-300"
								onClick={toggleModal}>
								<IoIosClose className="text-[2.5rem] text-[#fff]" />
							</span>
							<form
								onSubmit={handleFileSubmit}
								className="w-full h-2/4 flex items-center flex-col justify-evenly gap-y-4">
								{!urlMethod ? (
									<>
										<label
											htmlFor="file"
											className="text-white h-[3rem] w-[50%] bg-[#fa5000] rounded-[3rem] overflow-hidden cursor-pointer flex items-center justify-center text-[1.2rem] font-montserrat tracking-[2px] hover:w-[70%] font-bold duration-500 transition-all">
											Choose a File
										</label>
										<input
											type="file"
											name="uploadedImage"
											id="file"
											accept="image/*"
											onChange={handleFileChange}
											className="hidden"
										/>
									</>
								) : (
									<input
										type="url"
										name="urlMet"
										id="urlMet"
										value={url}
										onChange={handleUrlChange}
										className="w-[85%] h-[2.5rem] rounded-[3rem] outline-none indent-4"
									/>
								)}
								<span
									className="h-[3rem] w-[3rem] rounded-full bg-[#eaebec] flex items-center justify-center text-[.9rem] font-bold font-poppins text-[#e26015] cursor-pointer hover:shadow-[0_0_0_3px_#fff] transition-all duration-300"
									onClick={handleMethod}>
									{urlMethod ? "FILE?" : "URL?"}
								</span>
								{file && (
									<p className="text-[#2f2] font-bold tracking-[2px] font-montserrat">
										{file.name}
									</p>
								)}
								<button
									type="submit"
									disabled={isUpLoading}
									className={`h-[3rem] w-[75%] bg-[#fff] rounded-[5rem] text-[1.2rem] ${
										file || url
											? "opacity-[1]"
											: "opacity-[.2]"
									} font-poppins hover:w-[85%] font-bold duration-500 transition-all`}>
									Upload
								</button>
							</form>
							{message && (
								<p className="absolute bottom-[2rem] font-nunito tracking-[2px] font-bold text-[#600] text-[1.1rem]">
									{message}
								</p>
							)}
						</article>
					</>
				)}
			</section>
		</>
	);
}
