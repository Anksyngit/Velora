import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./configs/db.js";

// ✅ Routes
import userRouter from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import webhookRouter from "./routes/webhookRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import reelRoutes from "./routes/reelRoutes.js";

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

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
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

// STATIC UPLOADS
app.use(
  "/uploads",
  express.static(
    path.join(
      process.cwd(),
      "uploads"
    )
  )
);

// ==============================
// CLERK
// ==============================

app.use(
  clerkMiddleware({
    publishableKey:
      process.env
        .CLERK_PUBLISHABLE_KEY,

    secretKey:
      process.env
        .CLERK_SECRET_KEY,
  })
);

// ==============================
// TEST ROUTE
// ==============================

app.get("/", (req, res) => {

  res.send(
    "Server running 🚀"
  );

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

// ==============================
// SOCKET.IO
// ==============================

const httpServer =
  createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// STORE ONLINE USERS
const onlineUsers = {};

// SOCKET CONNECTION
io.on(
  "connection",
  (socket) => {

    console.log(
      "✅ User connected:",
      socket.id
    );

    // JOIN USER
    socket.on(
      "join",
      (userId) => {

        onlineUsers[userId] =
          socket.id;

        console.log(
          "ONLINE USERS:",
          onlineUsers
        );

      }
    );

    // SEND MESSAGE
    socket.on(
      "sendMessage",
      (messageData) => {

        const receiverSocketId =
          onlineUsers[
            messageData.receiverId
          ];

        if (
          receiverSocketId
        ) {

          io.to(
            receiverSocketId
          ).emit(
            "receiveMessage",
            messageData
          );

        }

      }
    );

    // DISCONNECT
    socket.on(
      "disconnect",
      () => {

        console.log(
          "❌ User disconnected"
        );

        for (
          const userId
          in onlineUsers
        ) {

          if (
            onlineUsers[
              userId
            ] === socket.id
          ) {

            delete onlineUsers[
              userId
            ];

            break;

          }

        }

      }
    );

  }
);

// ==============================
// START SERVER
// ==============================

const PORT = process.env.PORT || 4000;

httpServer.listen(
  PORT,
  () => {

    console.log(
      `🚀 Server running on port ${PORT}`
    );

  }
);