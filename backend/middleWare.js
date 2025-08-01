import Jwt from "jsonwebtoken";
import User from "./models/authModel.js";

export const protectRoute = async (req, res, next) => {
  try {
    // 1. Get token from cookie OR Authorization header
    let token = null;

    if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access: token missing"
      });
    }

    // 2. Verify token
    let decoded;
    try {
      decoded = Jwt.verify(
        token,
        process.env.JWT_SECRET_KEY || process.env.JWT_SECRECT_KRY
      );
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload"
      });
    }

    // 3. Fetch user (excluding password)
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found for token"
      });
    }

    // 4. Attach and continue
    req.user = user;
    next();
  } catch (error) {
    console.error("protectRoute error:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized access"
    });
  }
};
