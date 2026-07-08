import Post from "../models/post.js";

import User from "../models/user.js";

// =====================================
// ✅ CREATE POST
// =====================================

export const createPost = async (
  req,
  res
) => {
  try {

    const clerkId =
      req.auth?.userId;

    if (!clerkId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // FIND USER
    const user =
      await User.findOne({
        clerkId,
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { content } =
      req.body;

    // EMPTY CHECK
    if (
      !content &&
      (!req.files ||
        req.files.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Post cannot be empty",
      });
    }

    // IMAGES
    const imageUrls =
      req.files?.map(
        (file) => file.path
      ) || [];

    // CREATE POST
    const post =
      await Post.create({
        content:
          content || "",

        image_urls:
          imageUrls,

        user: user._id,
      });

    // POPULATE USER
    const populatedPost =
      await Post.findById(
        post._id
      ).populate("user");

    return res.status(201).json({
      success: true,
      post: populatedPost,
    });

  } catch (error) {

    console.error(
      "❌ CREATE POST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// ✅ GET ALL POSTS
// =====================================

export const getAllPosts =
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

    } catch (error) {

      res.json({
        success: false,
        message: error.message,
      });
    }
  };

// =====================================
// ✅ GET POSTS BY USER
// =====================================

export const getUserPosts =
  async (req, res) => {
    try {

      const { clerkId } =
        req.params;

      const user =
        await User.findOne({
          clerkId,
        });

      if (!user) {
        return res.json({
          success: false,
          message:
            "User not found",
        });
      }

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

    } catch (error) {

      res.json({
        success: false,
        message: error.message,
      });
    }
  };