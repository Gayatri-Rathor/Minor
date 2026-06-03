import express from "express";
import { login, register } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


//api/auth/login
router.post("/login", login);
//api/auth/register
router.post("/register", register);

export default router;