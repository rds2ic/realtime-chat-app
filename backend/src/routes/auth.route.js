import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// When visiting sign up or log in or log out this is called
// Using post methods as we are sending data

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile); // we pass protectRoute here as we only want logged in users on the account to be able to update only their account

router.get("/check", protectRoute, checkAuth);
export default router;
