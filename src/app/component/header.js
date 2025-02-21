"use client";
import "@/app/globals.css";
import {
	FaUser,
	FaQuestion,
	FaAward,
	FaBookOpen,
	FaMoon,
	FaSun,
} from "react-icons/fa";
import {
	RiHome4Fill,
	RiPencilRuler2Fill,
	RiAccountCircleFill,
} from "react-icons/ri";
import { TiThMenu, TiBook } from "react-icons/ti";
import { GrSettingsOption } from "react-icons/gr";
import { BsFillPaletteFill } from "react-icons/bs";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
	const {
		userData,
		isAuthenticated,
		logout,
		toggleDarkMode,
		darkMode,
		color,
	} = useAuth();
	const [isScrolled, setIsScrolled] = useState(false);
	const [show, setShow] = useState(false);
	const [navBar, setnavBar] = useState(false);
	const buttonRef = useRef(null);
	const modalRef = useRef(null);
	const navRef = useRef(null);
	const navBtnRef = useRef(null);
	const toggleModeRef = useRef(null);
	const pathname = usePathname();

	const { name, display_name, pfp } = userData;

	const navigations = [
		{ id: 1, text: "home", links: "/", Icon: RiHome4Fill },
		{ id: 2, text: "library", links: "/me/library", Icon: TiBook },
		{
			id: 3,
			text: "create post",
			links: "/create",
			Icon: RiPencilRuler2Fill,
		},
		{ id: 4, text: "profile", links: "/me", Icon: RiAccountCircleFill },
		{
			id: 5,
			text: "settings",
			links: "/me/setting",
			Icon: GrSettingsOption,
		},
		{ id: 6, text: "theme", links: "/me/setting", Icon: BsFillPaletteFill },
	];

	const toggleModalVisibility = () => {
		setShow((prev) => !prev);
	};

	const toggleNavBar = () => {
		setnavBar((prev) => !prev);
	};

	const userProfile = {
		backgroundColor: color.profileDisplay.pbg,
		color: color.profileDisplay.ptc,
	};

	const hover =
		"hover:tracking-[6px] hover:text-topc transition-all duration-500";

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 0) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		const handleClickOutside = (event) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target) &&
				toggleModeRef.current &&
				!toggleModeRef.current.contains(event.target)
			) {
				setShow(false);
			}
			if (
				navRef.current &&
				!navRef.current.contains(event.target) &&
				navBtnRef.current &&
				!navBtnRef.current.contains(event.target)
			) {
				setnavBar(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);
	return (
		<>
			<header
				className={`fixed top-0 left-0 h-[80px] w-full flex items-center justify-between transition-all duration-300 z-[100] px-2 ${
					isScrolled
						? darkMode
							? "bg-brand"
							: "bg-[#ddd0e4]"
						: darkMode
						? "bg-[#333]"
						: "bg-white"
				}  shadow-md`}>
				<span
					className="min-[800px]:hidden cursor-pointer"
					onClick={toggleNavBar}
					ref={navBtnRef}>
					<TiThMenu
						className={`text-[2rem] ${
							darkMode ? "text-brand2" : "text-brand"
						} `}
					/>
				</span>
				<nav
					className={`px-4 w-full h-full hidden items-center justify-around ${
						!darkMode ? "text-[#6f3285]" : "text-brand2"
					} font-bold gap-x-5 font-nunito min-[800px]:flex capitalize`}>
					<>
						{navigations
							.filter((nav) => nav.id < 5)
							.map(({ id, text, links }) => {
								return (
									<Link
										href={links}
										key={id}
										className={`${
											darkMode
												? "border-brand2"
												: "border-brand"
										} ${
											pathname === links
												? "border-b-2"
												: "border-b-none"
										} h-full flex items-center justify-center w-full`}>
										{text}
									</Link>
								);
							})}
					</>
				</nav>

				<article
					className={`absolute left-0 top-[5rem] bg-brand z-[100] h-[650px] w-2/3 flex flex-col gap-y-6 min-[800px]:hidden ${
						navBar ? "translate-x-[0%]" : "-translate-x-[100%]"
					} transition-all duration-500`}
					ref={navRef}>
					<div className="w-full h-[70px] border-b"></div>
					{navigations.map(({ id, text, links, Icon }) => {
						const active = pathname === links;
						return (
							<div
								className="flex gap-x-6 items-center px-2 relative"
								key={id}
								onClick={toggleNavBar}>
								<Link href={links}>
									<Icon
										className={`text-[1.7rem] text-[cyan] cursor-pointer
											
										${active ? (id === 5 ? "animate-spin" : "animate-bounce") : "animate-none"}`}
									/>
								</Link>
								<Link
									href={links}
									className={`text-[1.25rem] text-[white] ${
										active ? "font-bold text-[#0ff]" : ""
									} capitalize hover:tracking-[.4rem] hover:text-[cyan] transition-all duration-300`}>
									{text}
								</Link>
								<span
									className={`absolute h-[10px] w-[10px] ${
										active ? "block" : "hidden"
									} rounded-full bg-[#0ff] right-[3rem]`}></span>
							</div>
						);
					})}
				</article>

				{isAuthenticated ? (
					<>
						{/* User Profile picx */}
						<section className="h-full w-[7rem] relative flex flex-col items-center justify-center">
							<div
								className={`h-[55px] w-[55px] rounded-full text-[1.5rem] font-bold flex items-center justify-center overflow-hidden cursor-pointer hover:bg-brand2 hover:shadow-[0_0_5px_5px_#555] transition-all duration-500 shadow-[0_0_6px_2px_#222]`}
								onClick={toggleModalVisibility}
								ref={buttonRef}
								style={userProfile}>
								{!pfp && name[0]}
								{pfp && (
									<img
										src={pfp}
										alt={display_name}
										className="object-cover h-full w-full rounded-full"
									/>
								)}
							</div>
						</section>
						{/* User modal */}
						<div
							className={`absolute w-[300px] h-[650px] top-[5rem] right-5 flex flex-col items-center justify-center rounded-[1rem] overflow-hidden shadow-[0_0_6px_#323] transition-opacity duration-500 ease-in-out ${
								show
									? "opacity-100 visible pointer-events-auto"
									: "opacity-0 invisible pointer-events-none"
							}`}
							ref={modalRef}
							style={{
								backgroundColor:
									color?.profileCarousel?.bottomcrl,
								color: color?.profileCarousel?.textcolor,
							}}>
							{/* Design part */}
							<div className="h-[150px] relative border-b-2 w-full">
								<div
									className="w-full h-2/4"
									style={{
										backgroundColor:
											color?.profileCarousel?.topcrl,
									}}></div>
								<div
									className="absolute h-[60px] w-[60px] rounded-full top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center border-4"
									style={{
										borderColor:
											color?.profileCarousel?.topcrl,
									}}>
									<div
										className={`h-full w-full rounded-full text-[1.5rem] font-bold flex overflow-hidden items-center justify-center cursor-pointer  transition-all duration-300 ${
											show ? "animate-rotate-anime" : ""
										}`}
										style={userProfile}>
										{!pfp && name[0]}
										{pfp && (
											<img
												src={pfp}
												alt={display_name}
												className="object-cover h-full w-full"
											/>
										)}
									</div>
								</div>
								<div className="flex-1 w-full flex flex-col items-center pt-7">
									<h1 className="font-bold font-nunito">
										Hi, {userData?.name}
									</h1>
									<h1 className="font-bold font-inter text-[#1f568e]">
										{userData?.email}
									</h1>
								</div>
							</div>
							{/* Profile part */}
							<div
								className="flex-1 pl-2 border-b-2 w-full h-full flex flex-col items-center justify-center gap-y-6 font-bold font-nunito"
								onClick={toggleModalVisibility}>
								<Link
									href="/me"
									className={`w-full flex gap-x-6 ${hover}`}>
									<FaUser className="text-[1.2rem]" /> Profile
								</Link>
								<Link
									href="/me/library"
									className={`w-full flex gap-x-6 ${hover}`}>
									<TiBook className="text-[1.2rem]" /> Library
								</Link>
								<Link
									href="/me/posts"
									className={`w-full flex gap-x-6 ${hover}`}>
									<FaBookOpen className="text-[1.2rem]" />{" "}
									Posts
								</Link>
								<Link
									href="/me/about"
									className={`w-full flex gap-x-6 ${hover}`}>
									<FaAward className="text-[1.2rem]" /> My
									Story
								</Link>
							</div>
							{/* Setting Part */}
							<div className="flex-1 px-2 border-b-2 w-full h-full flex flex-col items-center justify-center gap-y-6 font-bold">
								<Link
									href="/me/setting"
									className={` w-full flex gap-x-6 ${hover}`}
									onClick={toggleModalVisibility}>
									<GrSettingsOption className="text-[1.2rem] animate-spin" />{" "}
									Setting
								</Link>
								<Link
									href="/"
									className={` w-full flex gap-x-6 ${hover}`}
									onClick={toggleModalVisibility}>
									<FaQuestion className="text-[1.2rem]" />
									Help
								</Link>
								<Link
									href="/"
									className={` w-full flex gap-x-6 ${hover}`}
									onClick={toggleModalVisibility}>
									<BsFillPaletteFill className="text-[1.2rem]" />
									Theme
								</Link>

								<span
									className="w-full h-[30px] flex items-center justify-center bg-brand rounded-[.5rem] overflow-hidden text-white"
									ref={toggleModeRef}
									style={{
										backgroundColor:
											color?.profileCarousel?.topcrl,
										color: color?.profileCarousel
											?.textcolor,
									}}>
									<FaMoon
										className={`text-[1.2rem] cursor-pointer ${
											darkMode
												? "-translate-x-[9rem]"
												: "translate-x-0"
										} hover:text-brand2 transition-all duration-300`}
										onClick={toggleDarkMode}
									/>
									<FaSun
										className={`text-[1.2rem] cursor-pointer ${
											darkMode
												? "translate-x-0"
												: "translate-x-[9rem]"
										} hover:text-brand2 transition-all duration-300`}
										onClick={toggleDarkMode}
									/>
								</span>
							</div>
							{/* Sign Out */}
							<div className="h-[5rem] w-full flex flex-col justify-center items-center">
								<span
									className="font-bold text-[#d41d1d] hover:text-[#d45c5c] cursor-pointer transition-colors duration-500"
									onClick={logout}>
									Sign Out
								</span>
							</div>
						</div>
					</>
				) : (
					<>
						<Link
							href="/auth/login"
							className="font-bold font-ubuntu text-[1.3rem] text-[#fff] h-[3rem] w-[7rem] flex justify-center items-center rounded-[5rem] bg-[#5a5] hover:opacity-80 duration-300 transition-all">
							Sign In
						</Link>
					</>
				)}
			</header>
			{navBar && (
				<div className="absolute top-0 bottom-0 min-[800px]:hidden h-full w-full bg-black bg-opacity-[.7] z-20"></div>
			)}
		</>
	);
}
