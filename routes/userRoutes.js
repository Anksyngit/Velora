import express from "express";

import {
  syncUser,
  getUserData,
  getAllUsers,
  updateUserData,
  discoverUsers,
  followUsers,
  unfollowUsers,
} from "../controllers/usercontroller.js";

const router = express.Router();

// ✅ SYNC USER
router.post("/sync", syncUser);

// ✅ GET CURRENT USER
router.get("/me", getUserData);

// ✅ GET ALL USERS
router.get("/all", getAllUsers);

// ✅ UPDATE USER
router.post(
  "/update",
  updateUserData
);

// ✅ DISCOVER USERS
router.post(
  "/discover",
  discoverUsers
);

// ✅ FOLLOW USER
router.post(
  "/follow",
  followUsers
);

// ✅ UNFOLLOW USER
router.post(
  "/unfollow",
  unfollowUsers
);

export default router;