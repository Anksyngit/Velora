import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
import StoryModal from "./StoryModal";
import StoryViewer from "./StoryViewer";

const Storiesbar = () => {
  const [stories, setStories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewStory, setViewStory] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStories = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/story`
      );

      if (data.success) {
        setStories(data.stories);
      } else {
        setStories([]);
      }
    } catch (error) {
      console.log(error);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div className="w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4">
      <div className="flex gap-4 pb-5">

        {/* Create Story */}

        <div
          onClick={() => setShowModal(true)}
          className="rounded-lg shadow-sm min-w-30 max-w-30 h-40 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white"
        >
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="size-10 bg-indigo-500 rounded-full flex items-center justify-center mb-3">
              <Plus className="w-5 h-5 text-white" />
            </div>

            <p className="text-sm font-medium text-slate-700 text-center">
              Create Story
            </p>
          </div>
        </div>

        {/* Loading */}

        {loading && (
          <div className="flex items-center text-gray-500">
            Loading stories...
          </div>
        )}

        {/* Stories */}

        {!loading &&
          stories.map((story) => (
            <div
              key={story._id}
              onClick={() => setViewStory(story)}
              className="relative rounded-lg overflow-hidden shadow-lg min-w-30 w-30 h-40 cursor-pointer hover:scale-105 transition duration-200"
            >
              {/* Story Image */}

              {story.media_type === "image" && (
                <img
                  src={story.media_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}

              {/* Story Video */}

              {story.media_type === "video" && (
                <video
                  src={story.media_url}
                  className="w-full h-full object-cover"
                  muted
                />
              )}

              {/* Text Story */}

              {story.media_type === "text" && (
                <div
                  className="w-full h-full flex items-center justify-center text-center p-3 text-white font-semibold"
                  style={{
                    backgroundColor: story.background_color,
                  }}
                >
                  {story.content}
                </div>
              )}

              {/* User Image */}

              <img
                src={
                  story.user?.profile_picture ||
                  "https://ui-avatars.com/api/?name=User"
                }
                alt=""
                className="absolute top-3 left-3 size-10 rounded-full ring-2 ring-white object-cover"
              />

              {/* Username */}

              <p className="absolute bottom-2 left-2 right-2 text-xs font-semibold text-white drop-shadow truncate">
                {story.user?.full_name}
              </p>
            </div>
          ))}

      </div>

      {showModal && (
        <StoryModal
          setShowModal={setShowModal}
          fetchStories={fetchStories}
        />
      )}

      {viewStory && (
        <StoryViewer
          viewStory={viewStory}
          setViewStory={setViewStory}
        />
      )}
    </div>
  );
};

export default Storiesbar;