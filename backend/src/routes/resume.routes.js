import express from "express";
import { createResume, deleteResume, getAllResumes, updateResumes } from "../controllers/resume.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {generatePdfStream} from "../controllers/pdf.controllers.js";

const router = express.Router()

router.post("/create",authMiddleware,createResume)
router.get("/",authMiddleware,getAllResumes)
router.put("/update/:id",authMiddleware,updateResumes)
router.delete("/delete/:id",authMiddleware,deleteResume)
// router.post('/pdf', authMiddleware, generatePdfFromData)  // pdf generate one added here 
router.post('/pdf/stream', authMiddleware, generatePdfStream) // stream PDF directly to client
// router.get('/download/:filename', authMiddleware, downloadPdfFile)

export default router