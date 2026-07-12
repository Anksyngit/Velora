import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {

    receiverId: {
      type: String,
      required: true,
    },

    senderId: {
      type: String,
      required: true,
    },

    senderName: {
      type: String,
      default: "",
    },

    senderProfile: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: [
        "LIKE",
        "COMMENT",
        "FOLLOW",
        "MESSAGE",
        "STORY",
      ],
      required: true,
    },

    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Notification",
  notificationSchema
);