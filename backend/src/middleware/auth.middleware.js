import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader?.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({ message: "Access token missing" });
    }

    // ------------- TRY VERIFY ACCESS TOKEN -------------
    try {
      const secret = process.env.JWT_SECRET || process.env.SECRET_KEY;
      const decoded = jwt.verify(accessToken, secret);
      req.user = decoded; 
      return next(); // token valid → continue
    } catch (err) { 
      if (err.name !== "TokenExpiredError") {
        return res.status(401).json({ message: "Invalid token" });
      }
      // else token is expired → auto refresh logic below
    }

    // ------------- ACCESS TOKEN EXPIRED → CHECK REFRESH TOKEN -------------
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    // Verify refresh token
    const refreshSecret = process.env.REFRESH_TOKEN || process.env.REFRESH_SECRET;
    jwt.verify(refreshToken, refreshSecret, async (err, decodedRefresh) => {
      if (err) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      // Generate new access token
      const newAccessToken = jwt.sign(
        {
          id: decodedRefresh.id,
        },
        process.env.SECRET_KEY,
        { expiresIn: "15m" }
      );

      // Send new access token in header
      res.setHeader("x-access-token", newAccessToken);

      req.user = decodedRefresh; // attach user to request
      
      return next(); // continue to actual route
    });

  } catch (error) {
    console.log("Error in middleware", error);
    return res.status(500).json({ message: error.message });
  }
};
