import mongoose from "mongoose";

const reelSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
    },
    profile_picture: {
      type: String,
    },

    caption: {
      type: String,
    },

    video: {
      type: String,
      required: true,
    },

    likes: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Reel =
  mongoose.models.reel ||
  mongoose.model("reel", reelSchema);

export default Reel;