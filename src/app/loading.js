"use client";

function Loading() {
	return (
		<>
			<div className="fixed top-0 left-0 w-full h-full bg-[#4aa] bg-opacity-[1] flex justify-center items-center z-[900]">
				<div className="w-[175px] h-[175px] border-[.3rem]  border-[#c7a5e9] rounded-tl-[45%] rounded-tr-[40%] rounded-br-[40%] rounded-bl-[40%] animate-spin"></div>
			</div>
		</>
	);
}
export default Loading;
