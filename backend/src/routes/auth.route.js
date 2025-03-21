import express from "express";
import { signup, login, logout, updateProfile, checkAuth } from "../controller/auth.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js"

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// we will only allow user to update profile once the user is authenticated (using protectRoute for this)
// first protectRoute will call then next updateProfile function will be called.
router.put("/update-profile", protectRoute, updateProfile)

router.get("/check", protectRoute, checkAuth)

export default router;