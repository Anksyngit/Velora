import dotenv from "dotenv";
dotenv.config();

import Message from "../models/message.js";
import User from "../models/user.js";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ==============================
// SEND MESSAGE
// ==============================

export const sendMessage = async (
  req,
  res
) => {

  try {

    const {
      senderId,
      receiverId,
      text,
    } = req.body;

    // SAVE USER MESSAGE
    const newMessage =
      await Message.create({
        senderId,
        receiverId,
        text,
        read: false,
      });

    // ==========================
    // AI CHATBOT
    // ==========================

    if (
      receiverId === "ai-bot"
    ) {

      const completion =
        await groq.chat.completions.create({

          messages: [

            {
              role: "system",

              content: `
You are a friendly AI assistant inside a social media app called Velora.

Rules:
- Talk casually
- Be helpful
- Short replies
- Human style
- No markdown
              `,
            },

            {
              role: "user",
              content: text,
            },

          ],

          model:
            "llama-3.3-70b-versatile",

          temperature: 0.7,

          max_tokens: 200,

        });

      const aiReply =
        completion.choices[0]
        .message.content;

      // SAVE AI MESSAGE
      const aiMessage =
        await Message.create({

          senderId: "ai-bot",

          receiverId: senderId,

          text: aiReply,

          read: false,

        });

      return res.json({

        success: true,

        message: newMessage,

        aiMessage,

      });

    }

    res.json({

      success: true,

      message: newMessage,

    });

  } catch (error) {

    console.log(error);

    res.json({

      success: false,

      message: error.message,

    });

  }

};

// ==============================
// GET MESSAGES
// ==============================

export const getMessages = async (
  req,
  res
) => {

  try {

    const {
      senderId,
      receiverId,
    } = req.params;

    const messages =
      await Message.find({

        $or: [

          {
            senderId,
            receiverId,
          },

          {
            senderId: receiverId,
            receiverId: senderId,
          },

        ],

      }).sort({
        createdAt: 1,
      });

    res.json({

      success: true,

      messages,

    });

  } catch (error) {

    console.log(error);

    res.json({

      success: false,

      message: error.message,

    });

  }

};

// ==============================
// AI REPLY SUGGESTIONS
// ==============================

export const getAiReplies = async (
  req,
  res
) => {

  try {

    const { text } = req.body;

    const completion =
      await groq.chat.completions.create({

        messages: [

          {
            role: "system",

            content: `
Generate 3 short casual chat replies.

Rules:
- Human sounding
- Short replies
- Modern texting style
- No numbering
- No emojis
- Separate replies by new line
            `,
          },

          {
            role: "user",
            content: text,
          },

        ],

        model:
          "llama-3.3-70b-versatile",

        temperature: 0.8,

        max_tokens: 80,

      });

    const aiText =
      completion.choices[0]
      .message.content;

    const suggestions =
      aiText
        .split("\n")
        .map((line) =>
          line.trim()
        )
        .filter(
          (line) =>
            line !== ""
        )
        .slice(0, 3);

    res.json({

      success: true,

      suggestions,

    });

  } catch (error) {

    console.log(error);

    res.json({

      success: false,

      message: "AI failed",

    });

  }

};

// ==============================
// GET CONVERSATIONS
// ==============================

export const getConversations = async (req, res) => {

  try {

    const { userId } = req.params;

    // Logged in user
    const currentUser = await User.findOne({
      clerkId: userId,
    }).populate("connections");

    if (!currentUser) {

      return res.json({
        success: false,
        message: "User not found",
      });

    }

    const conversations = [];

    // ============================
    // CONNECTED USERS
    // ============================

    for (const connection of currentUser.connections) {

      const lastMessage = await Message.findOne({

        $or: [

          {
            senderId: userId,
            receiverId: connection.clerkId,
          },

          {
            senderId: connection.clerkId,
            receiverId: userId,
          },

        ],

      }).sort({

        createdAt: -1,

      });

      const unreadCount = await Message.countDocuments({

        senderId: connection.clerkId,

        receiverId: userId,

        read: false,

      });

      conversations.push({

        user: connection,

        lastMessage: lastMessage
          ? lastMessage.text
          : "Start chatting...",

        lastMessageTime: lastMessage
          ? lastMessage.createdAt
          : connection.createdAt,

        unreadCount,

      });

    }

    // ============================
    // AI BOT
    // ============================

    conversations.push({

      user: {

        clerkId: "ai-bot",

        full_name: "Velora AI",

        email: "AI Assistant",

        profile_picture:
          "https://api.dicebear.com/7.x/bottts/svg?seed=Velora",

      },

      lastMessage: "Need help with something?",

      lastMessageTime: new Date(),

      unreadCount: 0,

    });

    // Newest first
    conversations.sort(

      (a, b) =>

        new Date(b.lastMessageTime) -

        new Date(a.lastMessageTime)

    );

    res.json({

      success: true,

      conversations,

    });

  }

  catch (error) {

    console.log(error);

    res.json({

      success: false,

      message: error.message,

    });

  }

};

// ==============================
// MARK AS READ
// ==============================

export const markMessagesRead = async (
  req,
  res
) => {

  try {

    const {
      senderId,
      receiverId,
    } = req.body;

    await Message.updateMany(

      {

        senderId,

        receiverId,

        read: false,

      },

      {

        $set: {

          read: true,

        },

      }

    );

    res.json({

      success: true,

    });

  } catch (error) {

    console.log(error);

    res.json({

      success: false,

      message: error.message,

    });

  }

};