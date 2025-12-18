import { Router } from "express";
import { setCookie } from "../shared/utils/setCookies.js";
import dotenv from "dotenv";
import passport from "passport";
dotenv.config();
const router = Router();
// GOOGLE
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false }), async (req, res, next) => {
    try {
        const user = req.user;
        const accessToken = user.SignAccessToken("user");
        const refreshToken = user.SignRefreshToken("user");
        setCookie("refresh_token", refreshToken, res);
        setCookie("access_token", accessToken, res);
        res.redirect(process.env.CLIENT_URL);
    }
    catch (error) {
        console.log(error.message);
    }
});
export default router;
