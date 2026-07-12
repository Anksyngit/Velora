import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    media_url: {
      type: String,
      default: "",
    },

    media_type: {
      type: String,
      enum: ["image", "video", "text"],
      required: true,
    },

    content: {
      type: String,
      default: "",
    },

    background_color: {
      type: String,
      default: "#4f46e5",
    },

    expiresAt: {
      type: Date,
      default: () =>
        new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 Hours
      expires: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Story", storySchema);