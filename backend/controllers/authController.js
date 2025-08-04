const { default: axios } = require("axios");
const { ZOHO_OAUTH_URL, authUrl } = require("../utils/constants");

require("dotenv").config();
const jwt = require("jsonwebtoken");

const loginWithZoho = (req, res) => {
	const redirectUrl = req.query.redirect || process.env.DEFAULT_FRONTEND_URL;
	const state = encodeURIComponent(JSON.stringify({ redirectUrl }));

	res.redirect(authUrl(state));
};

const zohoCallback = async (req, res) => {
	const code = req.query.code;
	const state = req.query.state
		? JSON.parse(decodeURIComponent(req.query.state))
		: {};
	const redirectUrl = state.redirectUrl || process.env.DEFAULT_FRONTEND_URL;
	console.log(`
			code ==> ${code}
			state ==> ${state}
			redirectURL ==> ${redirectUrl}
		`)

	try {
		const tokenResponse = await axios.post(
			ZOHO_OAUTH_URL,
			null,
			{
				params: {
					grant_type: "authorization_code",
					client_id: process.env.ZOHO_CLIENT_ID,
					client_secret: process.env.ZOHO_CLIENT_SECRET,
					redirect_uri: process.env.ZOHO_REDIRECT_URI,
					code,
				},
			}
		);

		const { access_token, refresh_token } = tokenResponse.data;
		// console.log("Token fetched ==> ", access_token);

		let id_token = tokenResponse.data.id_token;
		const decode = jwt.decode(id_token);

		// Store decoded data in session
		if (decode.email) {
			req.session.user = {
				name: `${decode.first_name} ${decode.last_name}`,
				email: decode.email,
				access_token,
				refresh_token,
			};
			const finalRedirect = redirectUrl
				? `${redirectUrl}/leaderboard`
				: "/leaderboard";

			res.redirect(finalRedirect);
		} else {
			res.redirect(`${redirectUrl ?? ""}/login?error=permissiondenied`);
		}
	} catch (error) {
		console.error(
			"Error during authentication or fetching user details",
			error
		);
		res.status(500).json({ message: "Authentication failed" });
	}
};

const logout = (req, res) => {
	if (req.session) {
		req.session.destroy((err) => {
			if (err) {
				console.error("Session destruction error", err);
				return res.status(500).json({ message: "Could not log out." });
			}
			res.clearCookie("user");
			res.status(200).json({ message: "Logged out successfully" });
      return;
		});
	} else {
		res.status(401).json({ message: "Session not found" }); // Not authenticated or session expired
	}
};

const verifySession = (req, res) => {
	console.log("Session Data:", req.session); //debug
	if (req.session && req.session.user) {
		// refresh the session expiration time by the time set during configuration
		req.session.touch();

		// If the session exists and contains user information, the user is logged in
		res.status(200).json({ loggedIn: true, user: req.session.user });
	} else {
		// Otherwise, the user is not logged in
		res.status(200).json({ loggedIn: false, user: null });
	}
};

module.exports = {
	loginWithZoho,
	zohoCallback,
	logout,
	verifySession
};
