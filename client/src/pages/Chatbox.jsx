import React, {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  Send,
  Sparkles,
  Bot,
} from "lucide-react";

import moment from "moment";

import { useUser } from "@clerk/clerk-react";

import toast from "react-hot-toast";

import socket from "../socket";

const Chatbox = () => {

  const { userId } = useParams();

  const { user } = useUser();

  const [input, setInput] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [otherUser, setOtherUser] =
    useState(null);

  const [aiReplies, setAiReplies] =
    useState([]);

  const [loadingAi, setLoadingAi] =
    useState(false);

  const [typingAi, setTypingAi] =
    useState(false);

  const bottomRef = useRef(null);

  // AUTO SCROLL
  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages, typingAi]);

  // FETCH USER
  useEffect(() => {

    const fetchUser = async () => {

      // AI BOT
      if (userId === "ai-bot") {

        setOtherUser({

          full_name:
            "Velora AI",

          email:
            "AI Assistant",

          profile_picture:
            "https://api.dicebear.com/7.x/bottts/svg?seed=Velora",

        });

        return;

      }

      try {

        const response =
          await fetch(
            "http://localhost:4000/api/user/all"
          );

        const data =
          await response.json();

        if (data.success) {

          const foundUser =
            data.users.find(
              (u) =>
                u.clerkId === userId
            );

          setOtherUser(foundUser);

        }

      } catch (error) {

        console.log(error);

      }

    };

    fetchUser();

  }, [userId]);

  // LOAD OLD MESSAGES
  useEffect(() => {

    const fetchMessages =
      async () => {

        try {

          const response =
            await fetch(
              `http://localhost:4000/api/messages/${user.id}/${userId}`
            );

          const data =
            await response.json();

          if (data.success) {

            setMessages(
              data.messages
            );

          }

        } catch (error) {

          console.log(error);

        }

      };

    if (user && userId) {
      fetchMessages();
    }

  }, [user, userId]);

  // RECEIVE REALTIME MESSAGE
  useEffect(() => {

    socket.on(
      "receiveMessage",
      (newMessage) => {

        setMessages((prev) => [
          ...prev,
          newMessage,
        ]);

        toast.success(
          `${
            otherUser?.full_name ||
            "Someone"
          } sent a message`
        );

      }
    );

    return () => {

      socket.off(
        "receiveMessage"
      );

    };

  }, [otherUser]);

  // SEND MESSAGE
  const handleSend = async () => {

    if (!input.trim()) return;

    const messageData = {

      senderId: user.id,

      receiverId: userId,

      text: input,

      createdAt:
        new Date().toISOString(),

    };

    // LOCAL USER MESSAGE
    setMessages((prev) => [
      ...prev,
      messageData,
    ]);

    // REALTIME SEND
    socket.emit(
      "sendMessage",
      messageData
    );

    const currentInput =
      input;

    setInput("");

    try {

      // AI TYPING
      if (
        userId === "ai-bot"
      ) {

        setTypingAi(true);

      }

      const response =
        await fetch(
          "http://localhost:4000/api/messages/send",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              messageData
            ),
          }
        );

      const data =
        await response.json();

      // AI RESPONSE
      if (
        userId === "ai-bot" &&
        data.aiMessage
      ) {

        setTimeout(() => {

          setTypingAi(false);

          setMessages((prev) => [

            ...prev,

            data.aiMessage,

          ]);

        }, 1200);

      }

    } catch (error) {

      console.log(error);

      setTypingAi(false);

    }

  };

  // AI SUGGESTIONS
  const getAiSuggestions =
    async () => {

      if (!input.trim()) return;

      try {

        setLoadingAi(true);

        const response =
          await fetch(
            "http://localhost:4000/api/messages/ai-replies",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                text: input,
              }),
            }
          );

        const data =
          await response.json();

        if (data.success) {

          setAiReplies(
            data.suggestions
          );

        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoadingAi(false);

      }

    };

  // ENTER KEY SEND
  const handleKeyUp = (e) => {

    if (e.key === "Enter") {

      handleSend();

    }

  };

  return (

    <div className="flex flex-col h-full bg-gray-50">

      {/* HEADER */}
      <div className="flex items-center gap-3 px-6 py-4 bg-white border-b border-gray-200 shadow-sm">

        <img
          src={
            otherUser
              ?.profile_picture
          }
          className="w-10 h-10 rounded-full object-cover"
        />

        <div>

          <div className="flex items-center gap-2">

            <p className="font-semibold text-gray-800">

              {
                otherUser
                  ?.full_name
              }

            </p>

            {
              userId ===
                "ai-bot" && (

                <Bot className="w-4 h-4 text-purple-500" />

              )
            }

          </div>

          <p className="text-xs text-gray-500">

            {
              otherUser?.email
            }

          </p>

        </div>

        <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">

          Online

        </span>

      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

        {messages.length === 0 && (

          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">

            <img
              src={
                otherUser
                  ?.profile_picture
              }
              className="w-16 h-16 rounded-full object-cover shadow"
            />

            <p className="font-semibold text-gray-700">

              {
                otherUser
                  ?.full_name
              }

            </p>

            <p className="text-gray-400 text-sm">

              Start your conversation 👋

            </p>

          </div>

        )}

        {messages.map(
          (msg, index) => {

            const sender =
              msg.senderId ||
              msg.from_user_id;

            const messageText =
              msg.text ||
              msg.message;

            const isMe =
              sender === user.id;

            return (

              <div
                key={index}
                className={`flex flex-col ${
                  isMe
                    ? "items-end"
                    : "items-start"
                }`}
              >

                <div
                  className={`px-4 py-2.5 rounded-2xl max-w-sm text-sm shadow-sm ${
                    isMe
                      ? "bg-indigo-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none"
                  }`}
                >

                  {messageText}

                </div>

                <p className="text-xs text-gray-400 mt-1">

                  {moment(
                    msg.createdAt
                  ).format(
                    "hh:mm A"
                  )}

                </p>

              </div>

            );

          }
        )}

        {/* AI TYPING */}
        {
          typingAi && (

            <div className="flex items-start">

              <div className="px-4 py-3 rounded-2xl bg-white text-gray-500 shadow-sm text-sm">

                Velora AI is typing...

              </div>

            </div>

          )
        }

        <div ref={bottomRef} />

      </div>

      {/* INPUT */}
      <div className="px-6 py-4 bg-white border-t border-gray-200">

        {/* AI SUGGESTIONS */}
        {
          aiReplies.length > 0 && (

            <div className="flex flex-wrap gap-2 mb-3">

              {
                aiReplies.map(
                  (reply, index) => (

                    <button
                      key={index}
                      onClick={() =>
                        setInput(reply)
                      }
                      className="px-3 py-2 text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-full transition"
                    >

                      {reply}

                    </button>

                  )
                )
              }

            </div>

          )
        }

        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-4 py-2">

          <input
            type="text"
            placeholder={`Message ${otherUser?.full_name}...`}
            value={input}
            onChange={(e) =>
              setInput(
                e.target.value
              )
            }
            onKeyUp={handleKeyUp}
            className="flex-1 bg-transparent text-sm text-gray-700 focus:outline-none"
          />

          {/* AI BUTTON */}
          <button
            onClick={
              getAiSuggestions
            }
            disabled={
              loadingAi
            }
            className="w-9 h-9 flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white rounded-full transition cursor-pointer active:scale-95"
          >

            <Sparkles className="w-4 h-4" />

          </button>

          {/* SEND BUTTON */}
          <button
            onClick={handleSend}
            disabled={
              !input.trim()
            }
            className="w-9 h-9 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition cursor-pointer active:scale-95 disabled:opacity-50"
          >

            <Send className="w-4 h-4" />

          </button>

        </div>

      </div>

    </div>

  );

};

export default Chatbox;