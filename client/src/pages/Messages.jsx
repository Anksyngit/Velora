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

import { useUser } from "@clerk/clerk-react";

const Messages = () => {

  const navigate = useNavigate();

  const { user } = useUser();

  const [users, setUsers] =
    useState([]);

  // FETCH USERS
  useEffect(() => {

    const fetchUsers =
      async () => {

        try {

          const response =
            await axios.get(
              "http://localhost:4000/api/user/all"
            );

          if (
            response.data.success
          ) {

            const filteredUsers =
              response.data.users.filter(
                (u) =>
                  u.clerkId !==
                  user.id
              );

            // ADD AI BOT
            const aiBot = {

              _id: "ai-bot",

              clerkId: "ai-bot",

              full_name:
                "Velora AI",

              email:
                "AI Assistant",

              profile_picture:
                "https://api.dicebear.com/7.x/bottts/svg?seed=Velora",

            };

            setUsers([
              aiBot,
              ...filteredUsers,
            ]);

          }

        } catch (error) {

          console.log(error);

        }

      };

    if (user) {
      fetchUsers();
    }

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

          {users.map(
            (userItem) => (

              <div
                key={userItem._id}
                className="max-w-xl flex flex-wrap gap-5 p-6 bg-white shadow rounded-md"
              >

                <img
                  src={
                    userItem.profile_picture
                  }
                  className="rounded-full size-12 mx-auto"
                />

                <div className="flex-1">

                  <div className="flex items-center gap-2">

                    <p className="font-medium text-slate-700">
                      {
                        userItem.full_name
                      }
                    </p>

                    {
                      userItem.clerkId ===
                        "ai-bot" && (

                        <Bot className="w-4 h-4 text-purple-500" />

                      )
                    }

                  </div>

                  <p className="text-slate-500 text-sm">
                    {userItem.email}
                  </p>

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

                  {
                    userItem.clerkId !==
                      "ai-bot" && (

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

                    )
                  }

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>

  );

};

export default Messages;