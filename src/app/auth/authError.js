"use client";
import { MdError } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { PiQuestionMarkBold } from "react-icons/pi";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
export default function ErrorModal() {
	const { setErrorModal, errorModal } = useAuth();

	const closeModal = () => {
		setErrorModal("");
	};

	useEffect(() => {
		if (!errorModal) return;
	}, [errorModal]);
	return (
		<>
			<div className="absolute w-full h-full bg-[#0b0909d5] top-0 left-0 z-20"></div>
			<div className="absolute w-[85%] rounded-sm flex top-[10%] bottom-[25%] bg-[#fff] z-20">
				<div className="relative h-full w-full flex flex-col items-center justify-center pb-1">
					<header className="h-[40px] w-full flex items-center pl-1 bg-[#d11] text-[#fff] text-[2rem] overflow-hidden font-poppins font-extrabold">
						<MdError className="text-[2.3rem]" />{" "}
						<p className="pl-[5px]">Error</p>
					</header>
					<span
						className="absolute w-[50px] h-[50px] rounded-full flex items-center justify-center bg-[#f00] -top-9 -right-7 z-30 hover:bg-[#a73232] transition-all duration-500 cursor-pointer shadow-[0_0_5px_1px_#333]"
						onClick={closeModal}>
						<IoIosClose className="w-[50px] h-[50px] text-[#fff] " />
					</span>
					<div className="w-full flex-1 pt-[7rem] pb-1 flex justify-center flex-col items-center">
						<div className="absolute top-16 w-[100px] h-[100px] bg-[#f00] rounded-full flex items-center justify-center shadow-[0_0_3px_2px_#444]">
							<PiQuestionMarkBold className="text-white text-[4rem]" />
						</div>
						<p className="h-full w-full p-2 text-center flex items-center justify-center flex-wrap font-extrabold font-nunito text-[1.2rem] text-[#f00] tracking-[2px]">
							{errorModal}.
						</p>
					</div>
					<button
						className="w-[97%] h-[3rem] rounded-[7px] bg-[#f00] text-[#fff] text-[1.3rem] font-poppins hover:bg-[#b92727] hover:tracking-[3px] font-bold transition-all duration-500 shadow-[0_0_3px_2px_#444]"
						onClick={closeModal}>
						Close
					</button>
				</div>
			</div>
		</>
	);
}
