import React, {
  useEffect,
  useState,
} from "react";
import axios from "axios";
import {
  BadgeCheck,
  MessageCircle,
  Heart,
  Share2,
} from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import CommentModal from "./CommentModal";

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const { user } = useUser();

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const images = post.image_urls || [];
  const postUser = post.user;

  // FIXED: use post.likes instead of post.likes_count
  const [likes, setLikes] = useState(post.likes || []);

  const [openComments, setOpenComments] =
    useState(false);

  const postwithHashtags = post.content
    ? post.content.replace(
        /(#\w+)/g,
        '<span class="text-indigo-600">$1</span>'
      )
    : "";

  // ============================
  // LIKE / UNLIKE
  // ============================

  const handleLike = async () => {
    console.log("❤️ LIKE CLICKED");
    console.log("BASE URL:", BASE_URL);

    if (!user) {
      console.log("No user logged in.");
      return;
    }

    try {
      const alreadyLiked = likes.some(
        (id) => id.toString() === user.id
      );

      if (alreadyLiked) {
        setLikes(
          likes.filter(
            (id) => id.toString() !== user.id
          )
        );

        console.log("Sending Unlike Request...");

        const response = await axios.post(
          `${BASE_URL}/api/post/unlike`,
          {
            postId: post._id,
            clerkId: user.id,
          }
        );

        console.log("Unlike Response:", response.data);
      } else {
        setLikes([...likes, user.id]);

        console.log("Sending Like Request...");

        const response = await axios.post(
          `${BASE_URL}/api/post/like`,
          {
            postId: post._id,
            clerkId: user.id,
          }
        );

        console.log("Like Response:", response.data);
      }
    } catch (error) {
      console.error("LIKE ERROR:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl">

      {/* USER */}

      <div
        onClick={() =>
          navigate(`/profile/${postUser?.clerkId}`)
        }
        className="inline-flex items-center gap-3 cursor-pointer"
      >
        <img
          src={
            postUser?.profile_picture ||
            `https://ui-avatars.com/api/?name=${postUser?.full_name}`
          }
          alt=""
          className="w-10 h-10 rounded-full shadow object-cover"
        />

        <div>
          <div className="flex items-center gap-1">
            <span>{postUser?.full_name}</span>

            <BadgeCheck className="w-4 h-4 text-blue-500" />
          </div>

          <div className="text-gray-500 text-sm">
            @{postUser?.username || "user"}
            {" • "}
            {moment(post.createdAt).fromNow()}
          </div>
        </div>
      </div>

      {/* CONTENT */}

      {post.content && (
        <div
          className="text-gray-800 text-sm whitespace-pre-line"
          dangerouslySetInnerHTML={{
            __html: postwithHashtags,
          }}
        />
      )}

      {/* IMAGES */}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {images.map((img, index) => {
            const cleanPath = img?.replace(/\\/g, "/");

            const imageUrl = cleanPath?.startsWith("http")
              ? cleanPath
              : `${BASE_URL}/${cleanPath}`;

            return (
              <img
                key={index}
                src={imageUrl}
                alt=""
                className={`w-full h-48 object-cover rounded-lg ${
                  images.length === 1
                    ? "col-span-2 h-auto"
                    : ""
                }`}
              />
            );
          })}
        </div>
      )}

      {/* ACTIONS */}

      <div className="flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300">

        {/* LIKE */}

        <div className="flex items-center gap-1">
          <Heart
            onClick={handleLike}
            className={`w-5 h-5 cursor-pointer transition ${
              likes.some(
                (id) => id.toString() === user?.id
              )
                ? "text-red-500 fill-red-500"
                : "hover:text-red-500"
            }`}
          />

          <span>{likes.length}</span>
        </div>

        {/* COMMENT */}

        <div className="flex items-center gap-1">

          <MessageCircle

            onClick={() =>
              setOpenComments(true)
            }

            className="w-5 h-5 cursor-pointer hover:text-indigo-500"

          />

          <span>

            {post.comments?.length || 0}

          </span>

        </div>

        {/* SHARE */}

        <div className="flex items-center gap-1">
          <Share2 className="w-5 h-5 cursor-pointer hover:text-indigo-500" />

          <span>0</span>
        </div>

      </div>

      <CommentModal

        open={openComments}

        onClose={() =>
          setOpenComments(false)
        }

        post={post}

      />

    </div>
  );
};

export default PostCard;
