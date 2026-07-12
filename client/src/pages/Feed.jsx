import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import Loading from "../components/Loading";
import Storiesbar from "../components/Storiesbar";
import PostCard from "../components/PostCard";
import RecentMessages from "../components/RecentMessages";
import Notifications from "../components/Notifications";

const Feed = () => {

  const [feeds, setFeeds] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // FETCH POSTS
  const fetchFeeds = async () => {

    try {

      const response =
        await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/post`
        );

      if (response.data.success) {

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

    }

    catch (error) {

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

      <div className="hidden xl:block sticky top-0 space-y-4 w-80">

        <Notifications />

        <RecentMessages />

      </div>

    </div>

  ) : (

    <Loading />

  );

};

export default Feed;