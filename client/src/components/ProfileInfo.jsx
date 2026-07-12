import React, { useState } from "react";
import moment from "moment";

import {
  Calendar,
  PenBox,
  MapPin,
  UserPlus,
  UserCheck,
} from "lucide-react";

import { useUser } from "@clerk/clerk-react";

const ProfileInfo = ({
  user,
  posts,
  profileId,
  setShowEdit,
  activeTab,
  setActiveTab,
}) => {
  const { user: clerkUser } = useUser();

  // Is this my own profile?
  const isOwnProfile =
    !profileId || clerkUser?.id === user.clerkId;

  // Temporary until Follow API is connected
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    // TODO: Connect Follow API
    setIsFollowing((prev) => !prev);
  };

  return (
    <div className="relative py-4 px-6 md:px-8 bg-white">
      <div className="flex flex-col md:flex-row items-start gap-6">

        {/* Profile Picture */}

        <div className="w-32 h-32 border-4 border-white shadow-lg absolute -top-16 rounded-full overflow-hidden">
          <img
            src={user.profile_picture || "https://via.placeholder.com/150"}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Info */}

        <div className="w-full pt-16 md:pt-0 md:pl-36">

          <div className="flex flex-col md:flex-row items-start justify-between">

            <div>

              <div className="flex items-center gap-3">

                <h1 className="text-2xl font-bold text-gray-900">
                  {user.full_name}
                </h1>

                {user.is_verified && (
                  <span className="text-blue-500 text-lg">
                    ✔
                  </span>
                )}

              </div>

              <p className="text-gray-600">
                {user.username
                  ? `@${user.username}`
                  : "No Username"}
              </p>

            </div>

            {isOwnProfile ? (

              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors mt-4 md:mt-0"
              >
                <PenBox className="w-4 h-4" />
                Edit
              </button>

            ) : (

              <button
                onClick={handleFollow}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition mt-4 md:mt-0 text-white ${
                  isFollowing
                    ? "bg-gray-400"
                    : "bg-indigo-600 hover:bg-indigo-700"
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

            )}

          </div>

          {/* Bio */}

          {user.bio && (
            <p className="text-gray-700 text-sm max-w-md mt-4">
              {user.bio}
            </p>
          )}

          {/* Extra Info */}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mt-4">

            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {user.location || "No Location"}
            </span>

            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Joined
              <span className="font-medium ml-1">
                {user.createdAt
                  ? moment(user.createdAt).fromNow()
                  : "Recently"}
              </span>
            </span>

          </div>

        </div>
      </div>

      {/* Stats */}

      <div className="flex items-center justify-center gap-8 mt-6 py-4 border-t border-gray-100">

        <div className="text-center">
          <span className="font-bold text-gray-900">
            {posts?.length || 0}
          </span>
          <span className="text-gray-500 ml-1">
            Posts
          </span>
        </div>

        <div className="text-center">
          <span className="font-bold text-gray-900">
            {user.followers?.length || 0}
          </span>
          <span className="text-gray-500 ml-1">
            Followers
          </span>
        </div>

        <div className="text-center">
          <span className="font-bold text-gray-900">
            {user.following?.length || 0}
          </span>
          <span className="text-gray-500 ml-1">
            Following
          </span>
        </div>

      </div>

      {/* Tabs */}

      <div className="flex items-center justify-center gap-2 mt-2 border-t border-gray-100 pt-2">

        {["Posts", "Media", "Likes"].map((tab) => (

          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.toLowerCase()
                ? "bg-indigo-600 text-white"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab}
          </button>

        ))}

      </div>

    </div>
  );
};

export default ProfileInfo;