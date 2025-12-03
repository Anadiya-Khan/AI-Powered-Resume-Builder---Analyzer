import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../services/sendEmail.js";

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const isValidPassword = (password) => {
  return passwordRegex.test(password);
};

// ---------------------- REGISTER ----------------------
export const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be 8+ characters long and include at least one letter, one number, and one special character.",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      data: {
        message: "User Registered Successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.log("Error in register", error);
    res
      .status(500)
      .json({ success: false, message: error.message || "Something went wrong" });
  }
};

// ---------------------- LOGIN ----------------------
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(401).json({ success: false, message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User does not exist" });

    const matchedPassword = await bcrypt.compare(password, user.password);
    if (!matchedPassword)
      return res.status(400).json({ success: false, message: "Invalid Password" });

    // -------- ACCESS TOKEN --------
      const jwtSecret = process.env.JWT_SECRET || process.env.SECRET_KEY;
      const accessToken = jwt.sign(
        { id: user._id, name: user.name, email: user.email },
        jwtSecret,
        { expiresIn: "15m" }   // short expiry
    );

    // -------- REFRESH TOKEN --------
    const refreshSecret = process.env.REFRESH_TOKEN || process.env.REFRESH_SECRET;
    const refreshToken = jwt.sign(
      { id: user._id },
      refreshSecret,
      { expiresIn: "7d" }
    );

    // Save refresh token in DB (optional but recommended)
    user.refreshToken = refreshToken;
    await user.save();

    // -------- SET REFRESH TOKEN IN COOKIE --------
   res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: false, 
  sameSite: "lax",  // allow localhost:5173 to send cookie
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
    return res.status(200).json({
      success: true,
      data: {
        message: "Login Successfully",
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });

  } catch (error) {
    console.log("Error in Login", error);
    res.status(500).json({ message: error.message });
  }
};

// ---------------------- FORGOT PASSWORD ----------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${resetUrl}`,
    });

    res
      .status(200)
      .json({ success: true, message: "Password reset link sent to your email" });
  } catch (error) {
    console.log("Error in forgot password", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------------- RESET PASSWORD ----------------------
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    if (!isValidPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be 8+ characters long and include at least one letter, one number, and one special character.",
      });
    }

    user.password = password; // pre-save will hash
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token provided" });

    // Verify refresh token
    const refreshSecret = process.env.REFRESH_TOKEN || process.env.REFRESH_SECRET;
    jwt.verify(refreshToken, refreshSecret, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      const user = await User.findById(decoded.id);
      if (!user || user.refreshToken !== refreshToken) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Create new access token
        const jwtSecret = process.env.JWT_SECRET || process.env.SECRET_KEY;
        const newAccessToken = jwt.sign(
          { id: user._id, name: user.name, email: user.email },
          jwtSecret,
          { expiresIn: "15m" }
      );

      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
      });
    });

  } catch (error) {
    console.log("Error in refresh token", error);
    res.status(500).json({ message: error.message });
  }
};



