import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Handles the creation of json web tokens which is used after our sign up
export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  }); // Payload is the first thing we pass and is how we differentiate the user depending on the token. It then requires the JWT_SECRET and a last object for options, where I put this expire in 7 days

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // maxAge is set in ms
    httpOnly: true, //prevent XSS (cross-site scripting attacks)
    sameSite: "strict", // prevents cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development", // only requires https when in deployment as in development we use localhost which is http. This is determined in the .env file
  });

  return token;
};
