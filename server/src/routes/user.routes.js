import { Router } from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser, getUsers, changeCurrentPassword } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(verifyJWT, logoutUser);

router.route("/current").get(verifyJWT, getCurrentUser);

router.route("/users").get(getUsers);

router.route("/change-password").post(changeCurrentPassword);

export default router;