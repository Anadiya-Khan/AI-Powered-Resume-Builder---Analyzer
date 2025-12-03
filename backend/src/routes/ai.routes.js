import express from "express";
import { generateResume } from "../controllers/ai.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/generate",authMiddleware, generateResume);

export default router;
