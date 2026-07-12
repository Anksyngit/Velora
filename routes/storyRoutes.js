import express from "express";
import upload from "../configs/multer.js";
import { protect } from "../middlewares/auth.js";

import {
  createStory,
  getStories,
  deleteStory,
} from "../controllers/storyController.js";

const router = express.Router();

// Create Story
router.post(
  "/create",
  protect,
  upload.single("media"),
  createStory
);

// Get Stories
router.get(
  "/",
  getStories
);

// Delete Story
router.delete(
  "/:id",
  protect,
  deleteStory
);

export default router;