import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useParams,
} from "react-router-dom";

import {
  Loader,
} from "lucide-react";

import ProfileInfo from "../components/ProfileInfo";

import EditProfileModal from "../components/ProfileModal";

import { useUser } from "@clerk/clerk-react";

const Profile = () => {

  const { profileId } =
    useParams();

  const { user: clerkUser } =
    useUser();

  const [user, setUser] =
    useState(null);

  const [posts, setPosts] =
    useState([]);

  const [activeTab,
    setActiveTab] =
    useState("posts");

  const [showEdit,
    setShowEdit] =
    useState(false);

  // FETCH PROFILE
  const fetchProfile =
    async () => {
      try {

        const targetId =
          profileId ||
          clerkUser?.id;

        // FETCH USERS
        const userResponse =
          await axios.get(
            "http://localhost:4000/api/user/all"
          );

        if (
          userResponse.data.success
        ) {

          const foundUser =
            userResponse.data.users.find(
              (u) =>
                u.clerkId ===
                targetId
            );

          setUser(foundUser);
        }

        // FETCH POSTS
        const postResponse =
          await axios.get(
            `http://localhost:4000/api/post/user/${targetId}`
          );

        if (
          postResponse.data.success
        ) {
          setPosts(
            postResponse.data.posts
          );
        }

      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {

    if (clerkUser) {
      fetchProfile();
    }

  }, [profileId, clerkUser]);

  return user ? (
    <div className="relative h-full overflow-y-scroll bg-gray-50 p-6">

      <div className="max-w-3xl mx-auto">

        {/* PROFILE CARD */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          {/* COVER */}
          <div className="h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">

            {user.cover_photo && (
              <img
                src={
                  user.cover_photo
                }
                className="w-full h-full object-cover"
              />
            )}

          </div>

          <ProfileInfo
            user={user}
            posts={posts}
            profileId={profileId}
            setShowEdit={
              setShowEdit
            }
            activeTab={
              activeTab
            }
            setActiveTab={
              setActiveTab
            }
          />

        </div>

        {/* POSTS */}
        <div className="mt-6 space-y-4">

          {activeTab ===
            "posts" &&
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-2xl shadow p-6"
              >

                <p className="font-semibold mb-2">
                  {
                    post.user
                      ?.full_name
                  }
                </p>

                <p>
                  {post.content}
                </p>

                {post.image_urls
                  ?.length > 0 && (
                  <img
                    src={
                      post.image_urls[0]
                    }
                    className="mt-4 rounded-xl w-full max-h-96 object-cover"
                  />
                )}

              </div>
            ))}

          {/* MEDIA */}
          {activeTab ===
            "media" && (
            <div className="grid grid-cols-3 gap-3">

              {posts
                .filter(
                  (p) =>
                    p.image_urls
                      ?.length > 0
                )
                .map((post) => (
                  <img
                    key={post._id}
                    src={
                      post.image_urls[0]
                    }
                    className="rounded-xl h-40 w-full object-cover"
                  />
                ))}

            </div>
          )}

          {/* LIKES */}
          {activeTab ===
            "likes" && (
            <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500">

              No liked posts yet

            </div>
          )}

        </div>
      </div>

      {/* EDIT MODAL */}
      {showEdit && (
        <EditProfileModal
          user={user}
          onClose={() =>
            setShowEdit(false)
          }
          onSave={(
            updatedUser
          ) => {
            setUser({
              ...user,
              ...updatedUser,
            });
          }}
        />
      )}

    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">

      <Loader className="w-8 h-8 animate-spin text-indigo-500" />

    </div>
  );
};

export default Profile;