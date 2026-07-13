import express from "express";

import Post from "../models/post.js";
import User from "../models/user.js";
import Notification from "../models/notification.js";
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

router.get("/user/:id", getUserPosts);

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

      console.log("===== LIKE PRESSED =====");

      console.log("POST OWNER:", post.user);

      console.log("LIKED BY:", user.full_name);

      console.log("POST ID:", post._id);

      // DON'T NOTIFY YOURSELF
      if (post.user.toString() !== user._id.toString()) {

        const receiver = await User.findById(post.user);

        console.log("Creating notification...");

        await Notification.create({

          receiverId: receiver.clerkId,

          senderId: user.clerkId,

          senderName: user.full_name,

          senderProfile: user.profile_picture,

          type: "LIKE",

          postId: post._id,

          message: `${user.full_name} liked your post.`

        });

        console.log("Notification created!");

      }
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