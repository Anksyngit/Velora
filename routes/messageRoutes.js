import express from "express";

import {
  sendMessage,
  getMessages,
  getAiReplies,
} from "../controllers/messageController.js";

const router = express.Router();

// SEND MESSAGE
router.post(
  "/send",
  sendMessage
);

// GET MESSAGES
router.get(
  "/:senderId/:receiverId",
  getMessages
);

// AI REPLIES
router.post(
  "/ai-replies",
  getAiReplies
);

export default router;