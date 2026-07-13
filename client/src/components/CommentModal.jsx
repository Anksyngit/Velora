import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import moment from "moment";

import {
  X,
  Heart,
  MessageCircle,
  Send,
} from "lucide-react";

import { useUser } from "@clerk/clerk-react";

const CommentModal = ({
  open,
  onClose,
  post,
}) => {

  const { user } = useUser();

  const BASE_URL =
    import.meta.env.VITE_BACKEND_URL;

  const [comments, setComments] =
    useState([]);

  const [text, setText] =
    useState("");

  const emojis = [
    "😀",
    "😂",
    "😍",
    "❤️",
    "🔥",
    "👏",
    "🥹",
    "😎",
  ];

  const fetchComments = async () => {

    try {

      const response =
        await axios.get(
          `${BASE_URL}/api/comments/${post._id}`
        );

      if (response.data.success) {

        setComments(
          response.data.comments
        );

      }

    }

    catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    if (open) {

      fetchComments();

    }

  }, [open]);

  const handleComment = async () => {

    if (!text.trim()) return;

    try {

      const response =
        await axios.post(
          `${BASE_URL}/api/comments/add`,
          {
            postId: post._id,
            clerkId: user.id,
            text,
          }
        );

      if (response.data.success) {

        setText("");

        fetchComments();

      }

    }

    catch (error) {

      console.log(error);

    }

  };

  if (!open) return null;

  return (

    <div className="fixed inset-0 z-50 bg-black/70 flex justify-center items-center p-6">

      <div className="bg-white rounded-2xl overflow-hidden w-full max-w-6xl h-[88vh] flex">

        {/* LEFT */}

        <div className="flex-1 bg-black flex justify-center items-center">

          {

            post.image_urls?.length > 0 ? (

              <img

                src={post.image_urls[0]}

                className="w-full h-full object-contain"

              />

            ) : (

              <div className="text-white text-lg">

                No Image

              </div>

            )

          }

        </div>

        {/* RIGHT */}

        <div className="w-[420px] flex flex-col">

          <div className="flex justify-between items-center border-b p-4">

            <div className="flex items-center gap-3">

              <img

                src={post.user?.profile_picture}

                className="w-10 h-10 rounded-full object-cover"

              />

              <div>

                <p className="font-semibold">

                  {post.user?.full_name}

                </p>

                <p className="text-xs text-gray-500">

                  {moment(post.createdAt).fromNow()}

                </p>

              </div>

            </div>

            <X

              onClick={onClose}

              className="cursor-pointer"

            />

          </div>

          <div className="px-5 py-3 border-b">

            <p className="text-gray-700 whitespace-pre-line">

              {post.content}

            </p>

          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">

            {

              comments.length === 0 && (

                <div className="flex justify-center items-center h-32">

                  <p className="text-gray-400">

                    No comments yet.

                  </p>

                </div>

              )

            }

            {

              comments.map((comment) => (

                <div

                  key={comment._id}

                  className="flex gap-3"

                >

                  <img

                    src={

                      comment.user?.profile_picture ||

                      `https://ui-avatars.com/api/?name=${comment.user?.full_name}`

                    }

                    className="w-10 h-10 rounded-full object-cover"

                  />

                  <div className="flex-1">

                    <div className="flex items-center gap-2">

                      <p className="font-semibold text-sm">

                        {

                          comment.user?.full_name

                        }

                      </p>

                      <p className="text-xs text-gray-400">

                        {

                          moment(

                            comment.createdAt

                          ).fromNow()

                        }

                      </p>

                    </div>

                    <p className="text-sm text-gray-700 mt-1">

                      {comment.text}

                    </p>

                  </div>

                </div>

              ))

            }

          </div>

          {/* ACTION BAR */}

          <div className="border-t border-b px-5 py-3">

            <div className="flex items-center gap-5">

              <div className="flex items-center gap-2">

                <Heart className="w-6 h-6 cursor-pointer hover:text-red-500"/>

                <p className="text-sm">

                  {post.likes?.length || 0}

                </p>

              </div>

              <div className="flex items-center gap-2">

                <MessageCircle className="w-6 h-6"/>

                <p className="text-sm">

                  {comments.length}

                </p>

              </div>

              <div className="flex items-center gap-2">

                <Send className="w-6 h-6"/>

              </div>

            </div>

          </div>

          {/* EMOJIS */}

          <div className="px-5 py-3 flex gap-2 overflow-x-auto">

            {

              emojis.map((emoji,index)=>(

                <button

                  key={index}

                  onClick={()=>

                    setText(

                      (prev)=>prev+emoji

                    )

                  }

                  className="text-2xl hover:scale-125 transition"

                >

                  {emoji}

                </button>

              ))

            }

          </div>

          {/* COMMENT INPUT */}

          <div className="border-t p-4 flex gap-3">

            <input

              value={text}

              onChange={(e)=>

                setText(e.target.value)

              }

              placeholder="Write a comment..."

              className="flex-1 border rounded-full px-5 py-3 outline-none focus:border-indigo-500"

            />

            <button

              onClick={handleComment}

              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 py-3 transition"

            >

              Post

            </button>

          </div>

        </div>

      </div>

    </div>

  );

};

export default CommentModal;
