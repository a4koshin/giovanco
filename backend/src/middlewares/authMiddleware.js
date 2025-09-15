import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.Token;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userModel.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Only allow admins
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) next();
  else
    res.status(403).json({ success: false, message: "Admin access required" });
};
