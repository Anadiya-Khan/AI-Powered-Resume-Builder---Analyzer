import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import path from "path"
import dbConnect from "./src/config/db.js"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import userRouter from "./src/routes/user.routes.js"
import resumeRouter from "./src/routes/resume.routes.js"
import aiRouter from "./src/routes/ai.routes.js"
import uploadFile from "./src/routes/upload.routes.js"
import atsRouter from "./src/routes/ats.routes.js"
console.log("Gemini API Loaded:", process.env.GEMINI_API_KEY);


const app = express()
const port = process.env.PORT || 5000

app.use(helmet())

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like Postman or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// app.use(cors({
//   origin: ["http://localhost:5173", process.env.FRONTEND_URL],
//   credentials: true,
// }));

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