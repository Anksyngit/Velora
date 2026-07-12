import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
    },

    full_name: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      unique: true,
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    bio: {
      type: String,
      default: "Hey There! I am using Velora.",
    },

    profile_picture: {
      type: String,
      default: "",
    },

    cover_photo: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);