import React, {
  useEffect,
  useState,
} from "react";

import {
  useUser,
} from "@clerk/clerk-react";

const Reels = () => {

  const { user } =
    useUser();

  const [reels, setReels] =
    useState([]);

  const [video, setVideo] =
    useState(null);

  const [caption, setCaption] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // FETCH REELS
  const fetchReels =
    async () => {

      try {

        const response =
          await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/reels/all`
          );

        const data =
          await response.json();

        if (data.success) {

          setReels(
            data.reels
          );

        }

      } catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    fetchReels();

  }, []);

  // UPLOAD REEL
  const uploadReel =
    async () => {

      if (!video) return;

      try {

        setLoading(true);

        const formData =
          new FormData();

        formData.append(
          "video",
          video
        );

        formData.append(
          "userId",
          user.id
        );

        formData.append(
          "username",
          user.fullName
        );

        formData.append(
          "profile_picture",
          user.imageUrl
        );

        formData.append(
          "caption",
          caption
        );

        const response =
          await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/reels/create`,
            {
              method: "POST",
              body: formData,
            }
          );

        const data =
          await response.json();

        if (data.success) {

          setCaption("");

          setVideo(null);

          fetchReels();

        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  return (

    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black relative">

      {/* UPLOAD BOX */}
      <div className="fixed top-5 right-5 z-50 bg-white p-4 rounded-xl shadow-lg w-72">

        <h1 className="font-bold text-lg mb-3">
          Upload Reel
        </h1>

        <input
          type="file"
          accept="video/*"
          onChange={(e) =>
            setVideo(
              e.target.files[0]
            )
          }
          className="mb-3"
        />

        <input
          type="text"
          placeholder="Caption..."
          value={caption}
          onChange={(e) =>
            setCaption(
              e.target.value
            )
          }
          className="w-full border p-2 rounded mb-3"
        />

        <button
          type="button"
          onClick={uploadReel}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
        >

          {
            loading
              ? "Uploading..."
              : "Post Reel"
          }

        </button>

      </div>

      {/* NO REELS */}
      {
        reels.length === 0 && (

          <div className="h-screen flex items-center justify-center text-white text-xl">

            No reels uploaded yet

          </div>

        )
      }

      {/* REELS */}
      {
        reels.map((reel) => (

          <div
            key={reel._id}
            className="h-screen flex items-center justify-center snap-start relative"
          >

            <video
              src={reel.video}
              controls
              autoPlay
              loop
              className="h-full object-cover"
            />

            {/* USER INFO */}
            <div className="absolute bottom-10 left-5 text-white">

              <div className="flex items-center gap-3 mb-2">

                <img
                  src={
                    reel.profile_picture
                  }
                  className="w-12 h-12 rounded-full border-2 border-white"
                />

                <h1 className="font-bold text-lg">

                  {reel.username}

                </h1>

              </div>

              <p className="text-sm">

                {reel.caption}

              </p>

            </div>

          </div>

        ))
      }

    </div>

  );

};

export default Reels;