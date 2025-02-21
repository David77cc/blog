"use client";
import "./globals.css";
import AuthProvider from "./context/AuthContext";
import InteractionProvider from "./context/interactionContext";
import PostProvider from "./context/PostContext";
import Header from "./component/header";
import Footer from "./component/footer";

import {
	Poppins,
	Roboto,
	Inter,
	Ubuntu,
	Nunito,
	Montserrat,
} from "next/font/google";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-poppins",
});

const roboto = Roboto({
	subsets: ["latin"],
	weight: ["300", "400", "500", "700", "900"],
	variable: "--font-roboto",
});

const inter = Inter({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-inter",
});
const nunito = Nunito({
	subsets: ["latin"],
	weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-nunito",
});
const ubuntu = Ubuntu({
	subsets: ["latin"],
	weight: ["300", "400", "500", "700"],
	variable: "--font-ubuntu",
});
const montserrat = Montserrat({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-montserrat",
});

export default function RootLayout({ children }) {
	return (
		<html
			lang="en"
			className={`${roboto.variable} ${poppins.variable} ${inter.variable} ${nunito.variable} ${ubuntu.variable} ${montserrat.variable}`}>
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
			</head>
			<body
				className={`relative antialiased min-h-screen flex flex-col w-full`}>
				<AuthProvider>
					<PostProvider>
						<InteractionProvider>
							<Header />
							<section className={`pt-[80px] bg-transparent`}>
								<main className="flex-1 bg-transparent relative">
									{children}
								</main>
							</section>
							<Footer />
						</InteractionProvider>
					</PostProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
