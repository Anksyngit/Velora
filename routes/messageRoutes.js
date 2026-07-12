import express from "express";

import {
  sendMessage,
  getMessages,
  getAiReplies,
  getConversations,
  markMessagesRead,
} from "../controllers/messageController.js";

const router = express.Router();

// SEND MESSAGE
router.post(
  "/send",
  sendMessage
);

// GET CONVERSATIONS
router.get(
  "/conversations/:userId",
  getConversations
);

// GET MESSAGES
router.get(
  "/:senderId/:receiverId",
  getMessages
);

// MARK AS READ
router.post(
  "/read",
  markMessagesRead
);

// AI REPLIES
router.post(
  "/ai-replies",
  getAiReplies
);

export default router;