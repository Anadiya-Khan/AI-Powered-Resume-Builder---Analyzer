import express from "express"
import {upload} from "../middleware/upload.middleware.js"
import {uploadAndScoreResume} from "../controllers/ats.controllers.js"

const router = express.Router();

router.post("/analyze",upload.single("resume"), uploadAndScoreResume)

export default router