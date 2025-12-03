import multer from "multer";

// Use memory storage to avoid writing uploads to disk (prevents reliance on public/temp)
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit for safety
});

