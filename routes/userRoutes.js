import express from "express";
import { protect } from "../middlewares/auth.js";

import {
  syncUser,
  getUserData,
  getAllUsers,
  getFollowingUsers,
  updateUserData,
  setupProfile,
  discoverUsers,
  followUsers,
  unfollowUsers,
  getFollowers,
  getFollowing,
  getConnections,
} from "../controllers/usercontroller.js";

const router = express.Router();

// ✅ SYNC USER
router.post("/sync", syncUser);

// ✅ GET CURRENT USER
router.get("/me", protect, getUserData);

// ✅ GET ALL USERS
router.get("/all", protect, getAllUsers);

// ✅ USERS AVAILABLE FOR CHAT
router.get("/chat-users", protect, getFollowingUsers);

// ✅ UPDATE USER
router.post("/update", protect, updateUserData);

router.post("/setup", protect, setupProfile);

// ✅ DISCOVER USERS
router.post("/discover", protect, discoverUsers);

// ✅ FOLLOW USER
router.post("/follow", protect, followUsers);

// ✅ UNFOLLOW USER
router.post("/unfollow", protect, unfollowUsers);

// ✅ FOLLOWERS
router.get("/followers", protect, getFollowers);

// ✅ FOLLOWING
router.get("/following", protect, getFollowing);

// ✅ CONNECTIONS
router.get("/connections", protect, getConnections);

export default router;