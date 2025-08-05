import { useEffect, useState } from "react";
import { SiZoho } from "react-icons/si";
import mNiveshlogo from "../assets/mNiveshLogo.png";
import { Link, useNavigate } from "react-router-dom";
import illustration from "../assets/illustration.png";
import Toast from "./common/Toast";
import axios from "axios";

const baseUrl = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : "";

const LoginPage = ({updateLoggedIn}) => {
	const navigate = useNavigate();
	const [isCheckingSession, setCheckingSession] = useState(true);
	const [authError, setAuthError] = useState("");

	useEffect(() => {
		// Parse errors from query params first
		const query = window.location.search;
		const searchParams = new URLSearchParams(query);
		const error = searchParams.get("error");
		if (error) {
			setAuthError(
				error === "permissionDenied"
					? "Access not Allowed."
					: error === "internalServerError"
					? "Internal Server Error."
					: "Login Failed"
			);
		}

		// Check active session
		const verifySession = async () => {
			try {
				const { data } = await axios.get(
					`${baseUrl}/auth/checkLoggedIn`,
					{ withCredentials: true }
				);
				updateLoggedIn(data.loggedIn)
				if (data.loggedIn) {
					navigate("/leaderboard", { replace: true }); // already logged in
				}
			} catch (err) {
				console.error("Session check failed", err);
			} finally {
				setCheckingSession(false);
			}
		};

		verifySession();
		// eslint-disable-next-line
	}, []);

	// Show loader while checking session
	if (isCheckingSession) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-white text-xl text-gray-700">
				Loading...
			</div>
		);
	}

	const handleLogin = () => {
		const frontendRedirectUrl = encodeURIComponent(`${window.location.origin}/leaderboard`);
		window.location.href = `${baseUrl}/auth/zoho?redirect=${frontendRedirectUrl}`;
	};

	return (
		<div className="bg-primary-white gap-y-8 h-full flex flex-col items-center p-0">
			<header className="w-full">
				<nav className="w-full flex">
					<Link to="/" className="logo ms-auto">
						<img
							src={mNiveshlogo}
							loading="lazy"
							alt="Niveshonline link Logo"
							style={{ height: "32px" }}
						/>
					</Link>
				</nav>
			</header>

			<Toast err={authError} />

			<div className="flex items-center justify-center rounded-md shadow-lg">
				<section className="w-full flex flex-col items-center h-full px-6 py-6">
					<h1 className="text-dark-blue text-4xl m-0 my-2">
						Welcome to mNivesh
					</h1>
					<p className="text-base text-gray-500">Login to continue</p>

					<button
						className="mt-12 px-5 py-0 text-dark-blue border-dark-blue hover:shadow-md hover:shadow-blue-200 gap-x-3 rounded-md border flex items-center"
						onClick={handleLogin}
					>
						<span className="text-5xl">
							<SiZoho />
						</span>
						<span>Login with Zoho</span>
					</button>
				</section>

				<section className="hidden w-full md:flex items-center justify-center bg-dark-blue rounded-e-md">
					<div>
						<img src={illustration} alt="" width="380px" />
					</div>
				</section>
			</div>
		</div>
	);
};

export default LoginPage;
