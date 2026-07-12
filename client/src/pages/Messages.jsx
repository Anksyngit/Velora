import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Eye,
  MessageSquare,
  Bot,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  useUser,
  useAuth,
} from "@clerk/clerk-react";

import socket from "../socket";

const Messages = () => {

  const navigate = useNavigate();

  const { user } = useUser();
  const { getToken } = useAuth();

  const [conversations, setConversations] = useState([]);

  const fetchConversations = async () => {

    if (!user) return;

    try {

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/messages/conversations/${user.id}`
      );

      if (response.data.success) {

        setConversations(response.data.conversations || []);

      } else {

        console.log("Backend Response:", response.data);

        setConversations([]);

      }

    } catch (error) {

      console.log(error);

    }

  };

  // FETCH CONVERSATIONS
  useEffect(() => {

    fetchConversations();

  }, [user]);

  // LIVE REFRESH ON NEW MESSAGE
  useEffect(() => {

    socket.on("receiveMessage", () => {

      fetchConversations();

    });

    return () => {

      socket.off("receiveMessage");

    };

  }, [user]);

  return (

    <div className="min-h-screen relative bg-slate-50">

      <div className="max-w-6xl mx-auto p-6">

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Messages
          </h1>

          <p className="text-slate-600">
            Talk to friends & AI
          </p>

        </div>

        <div className="flex flex-col gap-3">

          {conversations.map((chat) => {

            const userItem = chat.user;

            return (

              <div
                key={userItem._id || userItem.clerkId}
                className="max-w-xl flex flex-wrap gap-5 p-6 bg-white shadow rounded-md"
              >

                <img
                  src={userItem.profile_picture}
                  className="rounded-full size-12 mx-auto"
                  alt=""
                />

                <div className="flex-1">

                  <div className="flex items-center gap-2">

                    <p className="font-medium text-slate-700">
                      {userItem.full_name}
                    </p>

                    {userItem.clerkId === "ai-bot" && (
                      <Bot className="w-4 h-4 text-purple-500" />
                    )}

                  </div>

                  <p className="text-slate-500 text-sm truncate">

                    {chat.lastMessage || "No messages"}

                  </p>

                </div>

                <div className="flex flex-col items-end gap-2">

                  <p className="text-xs text-gray-400">

                    {new Date(chat.lastMessageTime)
                      .toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}

                  </p>

                  {

                    chat.unreadCount > 0 && (

                      <span className="min-w-6 h-6 px-2 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold">

                        {chat.unreadCount}

                      </span>

                    )

                  }

                </div>

                <div className="flex flex-col gap-2 mt-4">

                  <button
                    onClick={() =>
                      navigate(
                        `/messages/${userItem.clerkId}`
                      )
                    }
                    className="size-10 flex items-center justify-center text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-800"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  {userItem.clerkId !== "ai-bot" && (

                    <button
                      onClick={() =>
                        navigate(
                          `/profile/${userItem.clerkId}`
                        )
                      }
                      className="size-10 flex items-center justify-center text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-800"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                  )}

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </div>

  );

};

export default Messages;
