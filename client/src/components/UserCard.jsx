import React, { useState } from "react";
import {
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

import {
  MapPin,
  UserPlus,
  UserCheck,
  Plus,
  MessageCircle,
  Eye,
} from "lucide-react";

const UserCard = ({ user }) => {
  const navigate = useNavigate();

  const { getToken } = useAuth();

  const [isFollowing, setIsFollowing] = useState(
    user.isFollowing || false
  );

  const isConnected = user.isConnected || false;

  const handleFollow = async (e) => {
    
    console.log("FOLLOW CLICKED");
    
    e.stopPropagation();

    try {

      const token = await getToken();

      const endpoint = isFollowing
        ? "unfollow"
        : "follow";

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/${endpoint}`,
        {
          id: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setIsFollowing(!isFollowing);
      }

    } catch (error) {
      console.log(error);
    }
  };

  const handleMessage = (e) => {
    e.stopPropagation();

    if (isConnected) {
      navigate(`/messages/${user._id}`);
    }
  };

  const handleViewProfile = (e) => {
    e.stopPropagation();
    navigate(`/profile/${user._id}`);
  };

  return (
    <div
      className="p-4 pt-6 flex flex-col items-center w-72 shadow border border-gray-200 rounded-md cursor-pointer hover:shadow-md transition"
      onClick={() => navigate(`/profile/${user._id}`)}
    >
      <img
        src={user.profile_picture}
        alt=""
        className="rounded-full w-16 h-16 object-cover shadow-md mx-auto"
      />

      <p className="mt-4 font-semibold">
        {user.full_name}
      </p>

      {user.username && (
        <p className="text-gray-500 font-light">
          @{user.username}
        </p>
      )}

      {user.bio && (
        <p className="text-gray-600 mt-2 text-center text-sm px-4">
          {user.bio.slice(0, 100)}
        </p>
      )}

      <div className="flex gap-3 mt-4 flex-wrap justify-center">
        {user.location && (
          <span className="flex items-center gap-1 text-sm border border-gray-200 rounded-full px-3 py-1 text-gray-600">
            <MapPin className="w-3 h-3" />
            {user.location}
          </span>
        )}

        <span className="flex items-center gap-1 text-sm border border-gray-200 rounded-full px-3 py-1 text-gray-600">
          {user.followers?.length || 0} Followers
        </span>
      </div>

      {/* Buttons */}

      <div className="flex gap-2 mt-4 w-full">

        <button
          onClick={handleFollow}
          className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md text-white transition ${
            isFollowing
              ? "bg-indigo-400"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          }`}
        >
          {isFollowing ? (
            <>
              <UserCheck className="w-4 h-4" />
              Following
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Follow
            </>
          )}
        </button>

        <button
          onClick={handleMessage}
          className="p-2 px-3 rounded-md bg-slate-100 hover:bg-slate-200"
        >
          {isConnected ? (
            <MessageCircle className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={handleViewProfile}
          className="p-2 px-3 rounded-md bg-slate-100 hover:bg-slate-200"
        >
          <Eye className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};

export default UserCard;