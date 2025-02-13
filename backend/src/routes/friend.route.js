import express from "express";
import {
  remove_friend,
  friend_req,
  find_friend,
  get_friend_requests,
  reject_friend_req,
  getAllUsersForFriendsHub,
} from "../controllers/friend.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/find/:username", protectRoute, find_friend);
router.get("/friend-requests", protectRoute, get_friend_requests);
router.put("/friend-req/:username", protectRoute, friend_req);
router.put("/rej-friend-req/:username", protectRoute, reject_friend_req);
router.put("/remove-friend/:username", protectRoute, remove_friend);
router.get("/all-users", protectRoute, getAllUsersForFriendsHub);

export default router;
