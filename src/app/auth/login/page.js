"use client";
import "@/app/globals.css";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import ErrorModal from "../authError";
import { CgArrowLongRightC } from "react-icons/cg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
	const { login, errorModal } = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const [inputValues, setInputValues] = useState({
		email: "",
		password: "",
	});

	const toggleShowPassword = () => {
		setShowPassword((prev) => !prev);
	};

	const [inlineError, setInlineError] = useState({
		email: "",
		password: "",
	});

	const errorMessages = {
		emptyField: "Sorry, Please this field is required.",
		invalidEmail: "Please enter a valid email address please.",
	};

	const placeholders = {
		email: "Enter your email",
		password: "Enter your password",
	};

	const handleInputValues = (key, values) => {
		setInputValues((prev) => ({ ...prev, [key]: values }));
	};

	const handleInlineErrors = (key, value) => {
		setInlineError((prev) => ({ ...prev, [key]: value }));
	};

	const handleChange = (event) => {
		const { value, name } = event.target;
		setInlineError((prev) => ({ ...prev, [name]: "" }));
		handleInputValues(name, value);
	};

	const handleClick = async (event) => {
		event.preventDefault();

		const { email, password } = inputValues;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		const validationRules = [
			{
				key: "email",
				value: email,
				validate: (val) => val && emailRegex.test(val),
				errorMessage: email
					? errorMessages.invalidEmail
					: errorMessages.emptyField,
			},
			{
				key: "password",
				value: password,
				validate: (val) => !!val,
				errorMessage: errorMessages.emptyField,
			},
		];

		let hasError = false;

		validationRules.forEach(({ key, value, validate, errorMessage }) => {
			if (!validate(value)) {
				handleInlineErrors(key, errorMessage);
				hasError = true;
			}
		});

		if (hasError) {
			return;
		}

		const credentials = {
			email,
			password,
		};

		try {
			login(credentials);
		} catch (error) {
			console.error("Login failed ", error);
		}
	};

	const { password, email } = inlineError;
	return (
		<>
			<section className="h-screen w-full bg-[#e5edff] flex flex-col items-center">
				<h1 className="text-[3rem] font-bold font-ubuntu text-center text-[#fff] min-[600px]:mb-10 min-[600px]:text-[4rem] drop-shadow-[0_0_1px_#00f]">
					Login
				</h1>
				<form
					onSubmit={handleClick}
					className="w-full h-2/3 flex flex-col gap-y-[2.2rem] items-center justify-center min-[600px]:w-[80%] min-[600px]:shadow-[0_0_5px_2px_#444] min-[600px]:rounded-[3rem]">
					<div className="h-2/5 w-full flex flex-col justify-around items-center">
						<div className="w-[90%] h-[6rem] flex flex-col justify-center items-center gap-y-2">
							<input
								type="email"
								name="email"
								id="email"
								onChange={handleChange}
								value={inputValues.email}
								autoComplete="email"
								placeholder={placeholders.email}
								className="w-full h-[2.5rem] outline-none bg-[#dfd] rounded-[3rem] indent-4 shadow-[0_0_5px_#222] placeholder-[#216c21] font-medium font-roboto text-[#216c21]"
							/>

							{email && (
								<p className="text-[#f00] font-medium font-roboto tracking-[3px]">
									{email}
								</p>
							)}
						</div>
						<div className="w-[90%] h-[6rem] flex flex-col justify-center items-center gap-y-2 relative">
							<input
								type={showPassword ? "text" : "password"}
								name="password"
								id="password"
								onChange={handleChange}
								value={inputValues.password}
								autoComplete="ignore"
								placeholder={placeholders.password}
								className="w-full h-[2.5rem] outline-none bg-[#faa] rounded-[3rem] indent-4 shadow-[0_0_5px_#222] placeholder-[#f00] font-roboto text-[#f00]"
							/>
							{!password &&
								(showPassword ? (
									<FaEyeSlash
										className="absolute top-[2.1rem] right-4 text-[1.7rem] cursor-pointer"
										onClick={toggleShowPassword}
									/>
								) : (
									<FaEye
										className="absolute top-[2.1rem] right-4 text-[1.7rem] cursor-pointer"
										onClick={toggleShowPassword}
									/>
								))}
							{password && (
								<p className="text-[#f00] font-medium font-roboto tracking-[3px]">
									{password}
								</p>
							)}
						</div>
					</div>
					<button
						type="submit"
						className="h-[3rem] tracking-[3px] w-3/5 text-[#fff] rounded-[5rem] bg-[#00f] font-bold font-poppins text-[1.2rem] hover:shadow-[0_0_5px_1px_#444] transition-all duration-500">
						Login
					</button>
					<div className="flex gap-x-4 items-center">
						<p className="font-bold font-nunito text-[#555]">
							Don't have an account?
						</p>
						<CgArrowLongRightC className="text-[1.8rem] text-[#00a]" />
						<Link
							href="/auth/signup"
							className="font-bold font-montserrat text-[#00d]">
							Sign Up
						</Link>
					</div>
					<span className="font-bold font-montserrat text-[#f22] cursor-pointer">
						Forgot Password?
					</span>
				</form>
				{errorModal && <ErrorModal />}
			</section>
		</>
	);
}
