import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { useUser, useAuth } from "@clerk/clerk-react";

import ProfileInfo from "../components/ProfileInfo";
import EditProfileModal from "../components/ProfileModal";

const Profile = () => {
  const { profileId } = useParams();

  const { user: clerkUser } = useUser();
  const { getToken } = useAuth();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const userResponse = await axios.get(
        `${BACKEND_URL}/api/user/all`
      );

      if (!userResponse.data.success) {
        setLoading(false);
        return;
      }

      let foundUser = null;

      if (profileId) {
        foundUser = userResponse.data.users.find(
          (u) => u._id === profileId
        );
      } else {
        foundUser = userResponse.data.users.find(
          (u) => u.clerkId === clerkUser?.id
        );
      }

      if (!foundUser) {
        setLoading(false);
        return;
      }

      setUser(foundUser);

      const postResponse = await axios.get(
        `${BACKEND_URL}/api/post/user/${foundUser._id}`
      );

      if (postResponse.data.success) {
        setPosts(postResponse.data.posts);
      } else {
        setPosts([]);
      }

    } catch (error) {
      console.log(error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedUser) => {
    try {

      const token = await getToken();

      const { data } = await axios.post(
        `${BACKEND_URL}/api/user/update`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("UPDATE RESPONSE:", data);

      if (data.success) {
        await fetchProfile();
        setShowEdit(false);
      } else {
        alert(data.message);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        User not found.
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-y-scroll bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">

        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <div className="h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">

            {(user.cover_photo || user.banner) && (
              <img
                src={user.cover_photo || user.banner}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}

          </div>

          <ProfileInfo
            user={user}
            posts={posts}
            profileId={profileId}
            setShowEdit={setShowEdit}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

        </div>

        <div className="mt-6 space-y-4">

          {activeTab === "posts" &&
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-2xl shadow p-6"
              >
                <p className="font-semibold mb-2">
                  {post.user?.full_name}
                </p>

                <p>{post.content}</p>

                {post.image_urls?.length > 0 && (
                  <img
                    src={post.image_urls[0]}
                    alt=""
                    className="mt-4 rounded-xl w-full max-h-96 object-cover"
                  />
                )}
              </div>
            ))}

          {activeTab === "media" && (
            <div className="grid grid-cols-3 gap-3">
              {posts
                .filter((post) => post.image_urls?.length > 0)
                .map((post) => (
                  <img
                    key={post._id}
                    src={post.image_urls[0]}
                    alt=""
                    className="rounded-xl h-40 w-full object-cover"
                  />
                ))}
            </div>
          )}

          {activeTab === "likes" && (
            <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
              No liked posts yet.
            </div>
          )}

        </div>

      </div>

      {showEdit && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEdit(false)}
          onSave={handleSave}
        />
      )}

    </div>
  );
};

export default Profile;