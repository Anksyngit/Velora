import Story from "../models/story.js";
import User from "../models/user.js";
import cloudinary from "../configs/cloudinary.js";
import streamifier from "streamifier";

// ======================================
// UPLOAD TO CLOUDINARY
// ======================================

const uploadToCloudinary = (buffer, resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "velora-stories",
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);

        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ======================================
// CREATE STORY
// ======================================

export const createStory = async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    const currentUser = await User.findOne({
      clerkId,
    });

    if (!currentUser) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    let media_url = "";
    let media_type = "text";

    const { content, background_color } = req.body;

    if (req.file) {
      media_type = req.file.mimetype.startsWith("video")
        ? "video"
        : "image";

      const upload = await uploadToCloudinary(
        req.file.buffer,
        media_type === "video" ? "video" : "image"
      );

      media_url = upload.secure_url;
    }

    const story = await Story.create({
      user: currentUser._id,
      media_url,
      media_type,
      content,
      background_color,
    });

    res.json({
      success: true,
      story,
    });

  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};
// ======================================
// GET ALL ACTIVE STORIES
// ======================================

export const getStories = async (req, res) => {
  try {

    const stories = await Story.find()
      .populate("user", "full_name username profile_picture")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      stories,
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });

  }
};
// ======================================
// DELETE STORY
// ======================================

export const deleteStory = async (req, res) => {
  try {

    const { id } = req.params;

    await Story.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Story deleted",
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message,
    });

  }
};