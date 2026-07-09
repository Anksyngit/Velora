import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import Loading from "../components/Loading";

import Storiesbar from "../components/Storiesbar";

import PostCard from "../components/PostCard";

import RecentMessages from "../components/RecentMessages";

import { assets } from "../assets/assets";

const Feed = () => {

  const [feeds, setFeeds] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // FETCH REAL POSTS
  const fetchFeeds = async () => {
    try {

      const response =
        await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/post`
        );

      if (response.data.success) {

        // SORT NEWEST FIRST
        const sortedPosts =
          response.data.posts.sort(
            (a, b) =>
              new Date(
                b.createdAt
              ) -
              new Date(
                a.createdAt
              )
          );

        setFeeds(sortedPosts);
      }

      setLoading(false);

    } catch (error) {
      console.log(error);

      setFeeds([]);

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  return !loading ? (
    <div className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8">

      {/* LEFT */}
      <div className="w-full max-w-2xl">

        <Storiesbar />

        <div className="p-4 space-y-6">

          {feeds.map((post) => (
            <PostCard
              key={post._id}
              post={post}
            />
          ))}

        </div>
      </div>

      {/* RIGHT */}
      <div className="hidden xl:block sticky top-0">

        <div className="max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow">

          <h3 className="text-slate-800 font-semibold">
            Sponsored
          </h3>

          <img
            src={assets.sponsored_img}
            className="w-75 h-50 rounded-md"
          />

          <p className="text-slate-600">
            Email Marketing
          </p>

          <p className="text-slate-600">
            Supercharge your
            marketing with a
            powerful platform
            built for results.
          </p>

        </div>

        <RecentMessages />

      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Feed;