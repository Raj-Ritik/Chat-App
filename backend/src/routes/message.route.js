import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {getUsersForSidebar, getMessages, sendMessage} from "../controller/message.controller.js"

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar) // using get method, so that we can see users on the sidebar
router.get("/:id", protectRoute, getMessages)

router.post("/send/:id", protectRoute, sendMessage)

export default router;