import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";

export const protectRoute = async (req, res, next) => {
  dotenv.config();

  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorised - No token provided" }); // If there is no jwt token in the cookies, just give an error. 401 means unauthorised error code commonly

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // decoded vefrifies if the token is correct by checking it using the stored jwt secret in the .env file

    if (!decoded)
      return res.status(401).json({ message: "Unauthorised - Invalid Token" });

    const user = await User.findById(decoded.userId).select("-password"); // we are selecting everything but the password field

    if (!user) return res.status(404).json({ message: "User not found" }); // 404 means not found

    // At this point the user is authenticated. We now add it to the request body and call the next function that was passed in the parametres
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
