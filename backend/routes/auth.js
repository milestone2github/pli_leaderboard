const { loginWithZoho, zohoCallback, logout, verifySession } = require("../controllers/authController");

const authRouter = require("express").Router();

// Login with zoho
authRouter.get("/zoho", loginWithZoho);

// Zoho callback
authRouter.get("/zoho/callback", zohoCallback);

// Logout user 
authRouter.post("/logout", logout);

// route to verify session 
authRouter.get("/checkLoggedIn", verifySession);

module.exports = authRouter;

