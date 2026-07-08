import express from "express";

import Post from "../models/post.js";

import User from "../models/user.js";

import upload from "../configs/multer.js";

const router = express.Router();

// ======================================
// ✅ CREATE POST
// ======================================

router.post(
  "/create",
  upload.array("images", 5),
  async (req, res) => {
    try {

      const {
        content,
        clerkId,
      } = req.body;

      // VALIDATE
      if (
        !content &&
        (!req.files ||
          req.files.length === 0)
      ) {
        return res.status(400).json({
          error:
            "Post cannot be empty",
        });
      }

      // FIND USER
      const user =
        await User.findOne({
          clerkId,
        });

      if (!user) {
        return res.status(404).json({
          error:
            "User not found",
        });
      }

      // IMAGES
      const imageUrls =
        req.files?.map(
          (file) =>
            `uploads/${file.filename}`
        ) || [];

      console.log(
        "📸 Uploaded images:",
        imageUrls
      );

      // CREATE POST
      const post =
        await Post.create({
          content,

          image_urls:
            imageUrls,

          user: user._id,
        });

      // POPULATE USER
      const populatedPost =
        await Post.findById(
          post._id
        ).populate("user");

      res.json({
        success: true,
        post: populatedPost,
      });

    } catch (err) {

      console.error(
        "❌ POST CREATE ERROR:",
        err
      );

      res.status(500).json({
        error: err.message,
      });
    }
  }
);

// ======================================
// ✅ GET ALL POSTS
// ======================================

router.get(
  "/",
  async (req, res) => {
    try {

      const posts =
        await Post.find()
          .populate("user")
          .sort({
            createdAt: -1,
          });

      res.json({
        success: true,
        posts,
      });

    } catch (err) {

      console.error(
        "❌ GET POSTS ERROR:",
        err
      );

      res.status(500).json({
        error: err.message,
      });
    }
  }
);

// ======================================
// ✅ GET USER POSTS
// ======================================

router.get(
  "/user/:clerkId",
  async (req, res) => {
    try {

      const { clerkId } =
        req.params;

      // FIND USER
      const user =
        await User.findOne({
          clerkId,
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      // FIND POSTS
      const posts =
        await Post.find({
          user: user._id,
        })
          .populate("user")
          .sort({
            createdAt: -1,
          });

      res.json({
        success: true,
        posts,
      });

    } catch (err) {

      console.error(
        "❌ GET USER POSTS ERROR:",
        err
      );

      res.status(500).json({
        error: err.message,
      });
    }
  }
);

// ======================================
// ✅ LIKE POST
// ======================================

router.post(
  "/like",
  async (req, res) => {
    try {

      const {
        postId,
        clerkId,
      } = req.body;

      const user =
        await User.findOne({
          clerkId,
        });

      const post =
        await Post.findById(
          postId
        );

      if (!user || !post) {
        return res.status(404).json({
          error:
            "User or Post not found",
        });
      }

      if (
        !post.likes.includes(
          user._id
        )
      ) {
        post.likes.push(
          user._id
        );

        await post.save();
      }

      res.json({
        success: true,
      });

    } catch (err) {

      console.error(
        "❌ LIKE ERROR:",
        err
      );

      res.status(500).json({
        error: err.message,
      });
    }
  }
);

// ======================================
// ✅ UNLIKE POST
// ======================================

router.post(
  "/unlike",
  async (req, res) => {
    try {

      const {
        postId,
        clerkId,
      } = req.body;

      const user =
        await User.findOne({
          clerkId,
        });

      const post =
        await Post.findById(
          postId
        );

      if (!user || !post) {
        return res.status(404).json({
          error:
            "User or Post not found",
        });
      }

      post.likes =
        post.likes.filter(
          (id) =>
            id.toString() !==
            user._id.toString()
        );

      await post.save();

      res.json({
        success: true,
      });

    } catch (err) {

      console.error(
        "❌ UNLIKE ERROR:",
        err
      );

      res.status(500).json({
        error: err.message,
      });
    }
  }
);

export default router;