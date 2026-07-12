import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./configs/db.js";

// ✅ Routes
import commentRoutes from "./routes/commentRoutes.js";
import userRouter from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import webhookRouter from "./routes/webhookRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import reelRoutes from "./routes/reelRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js"; // ✅ NEW
import notificationRoutes from "./routes/notificationRoutes.js";

// ✅ Clerk
import { clerkMiddleware } from "@clerk/express";

// 🔥 LOAD ENV
dotenv.config();

const app = express();

// ✅ Connect DB
await connectDB();

// ==============================
// WEBHOOK
// ==============================

app.use(
  "/api/webhook",
  express.raw({
    type: "application/json",
  }),
  webhookRouter
);

// ==============================
// MIDDLEWARES
// ==============================

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
];

const corsOriginHandler = function (origin, callback) {
  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error("Not allowed by CORS"));
  }
};

app.use(
  cors({
    origin: corsOriginHandler,
    credentials: true,
  })
);

// 🔥 BIG PAYLOAD SUPPORT
app.use(
  express.json({
    limit: "100mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "100mb",
  })
);

// ==============================
// CLERK
// ==============================

app.use(
  clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  })
);

// ==============================
// TEST ROUTE
// ==============================

app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// ==============================
// ROUTES
// ==============================

app.use(
  "/api/user",
  userRouter
);

app.use(
  "/api/post",
  postRoutes
);

app.use(
  "/api/messages",
  messageRoutes
);

// ✅ REELS
app.use(
  "/api/reels",
  reelRoutes
);

// ✅ STORIES
app.use(
  "/api/story",
  storyRoutes
);

// ✅ IMAGE UPLOADS
app.use(
  "/api/upload",
  uploadRoutes
);

app.use(

  "/api/notifications",

  notificationRoutes

);

app.use(
  "/api/comments",
  commentRoutes
);

// ==============================
// SOCKET.IO
// ==============================

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: corsOriginHandler,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// STORE ONLINE USERS
const onlineUsers = {};

// SOCKET CONNECTION
io.on("connection", (socket) => {

  console.log("✅ User connected:", socket.id);

  // JOIN USER
  socket.on("join", (userId) => {

    onlineUsers[userId] = socket.id;

    console.log("ONLINE USERS:", onlineUsers);

  });

  // SEND MESSAGE
  socket.on("sendMessage", (messageData) => {

    const receiverSocketId =
      onlineUsers[messageData.receiverId];

    if (receiverSocketId) {

      io.to(receiverSocketId).emit(
        "receiveMessage",
        messageData
      );

    }

    io.emit("messagesUpdated");

  });

  // DISCONNECT
  socket.on("disconnect", () => {

    console.log("❌ User disconnected");

    for (const userId in onlineUsers) {

      if (onlineUsers[userId] === socket.id) {

        delete onlineUsers[userId];
        break;

      }

    }

  });

});

// ==============================
// START SERVER
// ==============================

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {

  console.log(`🚀 Server running on port ${PORT}`);

});