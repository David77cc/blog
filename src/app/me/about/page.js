"use client";
import { useAuth } from "@/app/context/AuthContext";
export default function About() {
	const { userData } = useAuth();
	return (
		<section className="h-screen w-full flex items-center justify-center bg-brand">
			<h1 className="text-[1.2rem] font-poppins">
				Hey it's me <b className="text-[#2f2]">{userData?.name}</b>
			</h1>
		</section>
	);
}
