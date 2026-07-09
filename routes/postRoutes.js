import express from "express";

import Post from "../models/post.js";
import User from "../models/user.js";
import upload from "../configs/multer.js";
import { createPost, getAllPosts, getUserPosts } from "../controllers/postController.js";

const router = express.Router();

// ======================================
// ✅ CREATE POST
// ======================================

router.post("/create", upload.array("images", 5), createPost);

// ======================================
// ✅ GET ALL POSTS
// ======================================

router.get("/", getAllPosts);

// ======================================
// ✅ GET USER POSTS
// ======================================

router.get("/user/:clerkId", getUserPosts);

// ======================================
// ✅ LIKE POST
// ======================================

router.post("/like", async (req, res) => {
  try {
    const { postId, clerkId } = req.body;

    const user = await User.findOne({ clerkId });
    const post = await Post.findById(postId);

    if (!user || !post) {
      return res.status(404).json({
        error: "User or Post not found",
      });
    }

    if (!post.likes.includes(user._id)) {
      post.likes.push(user._id);
      await post.save();
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ LIKE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ======================================
// ✅ UNLIKE POST
// ======================================

router.post("/unlike", async (req, res) => {
  try {
    const { postId, clerkId } = req.body;

    const user = await User.findOne({ clerkId });
    const post = await Post.findById(postId);

    if (!user || !post) {
      return res.status(404).json({
        error: "User or Post not found",
      });
    }

    post.likes = post.likes.filter(
      (id) => id.toString() !== user._id.toString()
    );

    await post.save();

    res.json({ success: true });
  } catch (err) {
    console.error("❌ UNLIKE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;