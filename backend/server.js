import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import dbConnect from "./src/config/db.js"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import userRouter from "./src/routes/user.routes.js"
import resumeRouter from "./src/routes/resume.routes.js"
import aiRouter from "./src/routes/ai.routes.js"
import uploadFile from "./src/routes/upload.routes.js"
import atsRouter from "./src/routes/ats.routes.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(helmet())


app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(cookieParser());
app.use(express.urlencoded({extended:true}))
app.use(express.json())

// Serve static files from `public` so generated PDFs are accessible at /downloads/<file>
app.use(express.static(path.join(process.cwd(), 'public')));

dbConnect()

app.use("/api/users",userRouter)
app.use("/api/resumes",resumeRouter)
app.use("/api/ai",aiRouter)
app.use("/api/file",uploadFile)
app.use("/api/ats",atsRouter)

app.listen(port,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})