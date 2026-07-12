import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import moment from "moment";

import { X } from "lucide-react";

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

    console.log("POST BUTTON CLICKED");
    console.log("TEXT:", text);
    console.log("USER:", user);

    if (!text.trim()) return;

    try {

      console.log("Sending request...");

      const response = await axios.post(
        `${BASE_URL}/api/comments/add`,
        {
          postId: post._id,
          clerkId: user.id,
          text,
        }
      );

      console.log(response.data);

      if (response.data.success) {
        setText("");
        fetchComments();
      }

    } catch (error) {
      console.log(error);
    }

  };

  if (!open) return null;

  return (

    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl w-full max-w-lg p-5">

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-xl font-semibold">

            Comments

          </h2>

          <X

            onClick={onClose}

            className="cursor-pointer"

          />

        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">

          {

            comments.length === 0 && (

              <p className="text-gray-400 text-center">

                No comments yet.

              </p>

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
                    comment.user
                      ?.profile_picture ||
                    `https://ui-avatars.com/api/?name=${comment.user?.full_name}`
                  }

                  className="w-10 h-10 rounded-full object-cover"

                />

                <div>

                  <p className="font-semibold">

                    {

                      comment.user
                        ?.full_name

                    }

                  </p>

                  <p>

                    {comment.text}

                  </p>

                  <p className="text-xs text-gray-400">

                    {

                      moment(
                        comment.createdAt
                      ).fromNow()

                    }

                  </p>

                </div>

              </div>

            ))

          }

        </div>

        <div className="flex gap-2 mt-5">

          <input

            value={text}

            onChange={(e) =>
              setText(e.target.value)
            }

            placeholder="Write a comment..."

            className="flex-1 border rounded-lg px-4 py-2 outline-none"

          />

          <button

            onClick={handleComment}

            className="bg-indigo-600 text-white px-5 rounded-lg hover:bg-indigo-700"

          >

            Post

          </button>

        </div>

      </div>

    </div>

  );

};

export default CommentModal;
