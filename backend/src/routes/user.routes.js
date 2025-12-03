import express from "express"
import { userLogin, userRegister,forgotPassword,resetPassword, refreshAccessToken} from "../controllers/user.controllers.js"

const router = express.Router()

router.post("/register",userRegister)
router.post("/login",userLogin) 
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/refresh-token",refreshAccessToken)

// router.get("/profile", authMiddleware, (req, res) => {
//   res.json({ message: "Protected data", user: req.user });
// });


export default router