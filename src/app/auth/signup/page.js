"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { CgArrowLongRightC } from "react-icons/cg";
import ErrorModal from "../authError";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signup() {
	const { signup, errorModal } = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	// the input values
	const [inputValues, setInputValues] = useState({
		name: "",
		email: "",
		password: "",
		confirm: "",
	});

	const toggleShowPassword = () => {
		setShowPassword((prev) => !prev);
	};

	const toggleShowConfirm = () => {
		setShowConfirm((prev) => !prev);
	};

	const [error, setError] = useState({
		name: "",
		email: "",
		password: "",
		confirm: "",
	});

	const errorMessages = {
		invalidName: "Please enter a valid username.",
		invalidEmail: "Please enter a valid email address.",
		passwordDNM: "Password do not match!.",
		emptyField: "Sorry this field is required please.",
	};

	const handleError = (key, value) => {
		setError((prev) => ({ ...prev, [key]: value }));
	};

	const placeholders = {
		name: "Enter your name",
		email: "Enter your email",
		password: "Enter your password",
		confirm: "Confirm your password",
	};

	const handleInputValues = (key, value) => {
		setInputValues((prev) => ({ ...prev, [key]: value }));
	};
	function handleChange(event) {
		const { name, value } = event.target;
		setError((prev) => ({ ...prev, [name]: "" }));
		handleInputValues(name, value);
	}

	async function handleClick(e) {
		e.preventDefault();

		const { name, email, password, confirm } = inputValues;

		const nameRegex = /^[a-zA-Z\s]+$/;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		const validationRules = [
			{
				key: "name",
				value: name,
				validate: (val) => val && nameRegex.test(val),
				errorMessage: name
					? errorMessages.invalidName
					: errorMessages.emptyField,
			},
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
			{
				key: "confirm",
				value: confirm,
				validate: (val) => val === password,
				errorMessage: confirm
					? errorMessages.passwordDNM
					: errorMessages.emptyField,
			},
		];

		let hasError = false;

		validationRules.forEach(({ key, value, validate, errorMessage }) => {
			if (!validate(value)) {
				handleError(key, errorMessage);
				hasError = true;
			}
		});

		if (hasError) {
			return;
		}

		const values = {
			name,
			email,
			password,
		};

		signup(values);
	}

	return (
		<>
			<section className="h-screen relative w-full flex flex-col items-center bg-[#e4ddd0]">
				<h1 className="absolute top-[1rem] min-[600px]:relative font-extrabold font-poppins text-[3rem] text-[#fff] drop-shadow-[2px_2px_8px_#2f2] overflow-hidden">
					Sign Up
				</h1>
				<form
					onSubmit={handleClick}
					className="absolute top-[2.3rem] min-[600px]:relative h-[550px] font-nunito  min-[600px]:w-4/5 w-full border-0 flex flex-col items-center justify-center min-[600px]:shadow-[0_0_6px_2px_#333] rounded-[5rem] gap-y-2 min-[600px]:border-8 overflow-hidden">
					<div className="w-[90%] min-[600px]:w-4/5 h-[3.7rem]">
						<input
							type="text"
							name="name"
							id="name"
							value={inputValues.name}
							onChange={handleChange}
							autoComplete="name"
							placeholder={placeholders.name}
							className="w-full h-[2.2rem] outline-none rounded-[3rem] bg-[#ddd0e4] indent-3 font-bold tracking-[3px] placeholder-[#00f] shadow-[0_0_5px_#333] focus:shadow-[0_0_5px_#00f] text-[#00f]"
						/>
						{error.name && (
							<p className="font-bold text-sm font-poppins text-center text-[#f00] tracking-[3px]">
								{error.name}
							</p>
						)}
					</div>
					<div className="w-[90%] min-[600px]:w-4/5 h-[3.7rem]">
						<input
							type="text"
							name="email"
							id="email"
							value={inputValues.email}
							onChange={handleChange}
							autoComplete="email"
							placeholder={placeholders.email}
							className="w-full h-[2.2rem] outline-none rounded-[3rem] bg-[#a3d5b2] indent-3 placeholder-[#147c14] font-bold tracking-[3px] shadow-[0_0_5px_#333] focus:shadow-[0_0_5px_1px_#0f0] text-[#147c14]"
						/>
						{error.email && (
							<p className="font-bold text-sm font-poppins text-center text-[#f00] tracking-[3px]">
								{error.email}
							</p>
						)}
					</div>
					<div className="w-[90%] min-[600px]:w-4/5 h-[3.7rem] relative">
						<input
							type={showPassword ? "text" : "password"}
							name="password"
							id="password"
							value={inputValues.password}
							onChange={handleChange}
							autoComplete="ignore"
							placeholder={placeholders.password}
							className="w-full h-[2.2rem] outline-none rounded-[3rem] bg-[#ffd0dd] indent-3 font-bold tracking-[3px] placeholder-[#e00] shadow-[0_0_5px_#333] focus:shadow-[0_0_5px_#f00] text-[#e00]"
						/>
						{!error.password &&
							(showPassword ? (
								<FaEyeSlash
									className="absolute top-[.2rem] text-[#e00] right-4 text-[1.7rem] cursor-pointer"
									onClick={() =>
										toggleShowPassword("password")
									}
								/>
							) : (
								<FaEye
									className="absolute top-[.2rem] right-4 text-[1.7rem] cursor-pointer text-[#e00]"
									onClick={() =>
										toggleShowPassword("password")
									}
								/>
							))}
						{error.password && (
							<p className="font-bold text-sm font-poppins text-center text-[#f00] tracking-[3px]">
								{error.password}
							</p>
						)}
					</div>
					<div className="w-[90%] min-[600px]:w-4/5 h-[3.7rem] relative">
						<input
							type={showConfirm ? "text" : "password"}
							name="confirm"
							id="confirm"
							value={inputValues.confirm}
							onChange={handleChange}
							autoComplete="ignore"
							placeholder={placeholders.confirm}
							className="w-full h-[2.2rem] outline-none rounded-[3rem] bg-[#c86363] indent-3 placeholder-white font-bold tracking-[3px] shadow-[0_0_5px_#333] focus:shadow-[0_0_5px_#f00] text-white"
						/>
						{!error.confirm &&
							(showConfirm ? (
								<FaEyeSlash
									className="absolute top-[.2rem] right-4 text-[1.7rem] cursor-pointer text-white"
									onClick={() => toggleShowConfirm("confirm")}
								/>
							) : (
								<FaEye
									className="absolute top-[.2rem] right-4 text-[1.7rem] cursor-pointer text-white"
									onClick={() => toggleShowConfirm("confirm")}
								/>
							))}
						{error.confirm && (
							<p className="font-bold font-mono text-center text-[#f00] tracking-[3px]">
								{error.confirm}
							</p>
						)}
					</div>

					<button
						type="submit"
						className="font-bold font-poppins absolute bottom-[3.5rem] text-[#00f] text-2xl h-[50px] scale-[.8] w-2/3 bg-[#ddd0e4] rounded-[3rem] hover:opacity-75 hover:scale-100 transition-all duration-500 shadow-[0_0_5px_1px_#777] ease-in-out">
						Sign Up
					</button>
					<div className="absolute bottom-[0] flex gap-x-4 justify-center items-center">
						<p className="font-[800] font-nunito text-[1rem] text-[#555]">
							Have an account?
						</p>
						<CgArrowLongRightC className="min-[600px]:text-[2rem] text-[30px]" />
						<Link
							href="/auth/login"
							className="font-[800] text-[#1d7d1d] text-[1.3rem]">
							Login
						</Link>
					</div>
				</form>
				{errorModal && <ErrorModal />}
			</section>
		</>
	);
}
