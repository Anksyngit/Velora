import Setup from "./pages/Setup";
import React, {
  useEffect,
} from "react";

import {
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";

import axios from "axios";

import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import Chatbox from "./pages/Chatbox";
import Connection from "./pages/Connection";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import Createpost from "./pages/Createpost";
import Layout from "./pages/Layout";
import Reels from "./pages/Reels";

import {
  useUser,
} from "@clerk/clerk-react";

import {
  Toaster,
} from "react-hot-toast";

// SOCKET
import socket from "./socket";

const App = () => {

  const {
    user,
    isLoaded,
  } = useUser();

  const navigate = useNavigate();
  const location = useLocation();
  // ============================
  // USER SYNC
  // ============================

  useEffect(() => {

    const syncUser =
      async () => {

        try {

          if (!user) return;

          const profilePicture =
            user.imageUrl;

          

          const bio =
            "Hey There! I am using Velora.";

          const banner =
            `https://picsum.photos/seed/${user.id}/1200/400`;



          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/user/sync`,
            {
              clerkId: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              full_name: user.fullName,
              bio,
              banner,
              profile_picture: profilePicture,
            }
          );

          console.log("✅ User synced", response.data);

          if (!response.data.profileCompleted) {
            if (location.pathname !== "/setup") {
              navigate("/setup");
            }
          } else {
            if (location.pathname === "/setup") {
              navigate("/");
            }
          }

          // SOCKET JOIN
          socket.emit(
            "join",
            user.id
          );

        } catch (error) {

          console.log(
            "❌ Sync error:",
            error.response
              ?.data ||
              error.message
          );

        }

      };

    if (isLoaded) {

      syncUser();

    }

  }, [user, isLoaded, navigate, location.pathname]);

  // ============================
  // LOADING
  // ============================

  if (!isLoaded) {

    return (

      <div className="h-screen flex items-center justify-center text-xl font-semibold">

        Loading...

      </div>

    );

  }

  // ============================
  // ROUTES
  // ============================

  return (
    <>

      <Toaster />

      <Routes>

      {/* Setup Page */}
      <Route
        path="/setup"
        element={!user ? <Login /> : <Setup />}
      />
        <Route
          path="/"
          element={
            !user
              ? <Login />
              : <Layout />
          }
        >

          {/* FEED */}
          <Route
            index
            element={<Feed />}
          />

          {/* MESSAGES */}
          <Route
            path="messages"
            element={<Messages />}
          />

          <Route
            path="messages/:userId"
            element={<Chatbox />}
          />

          {/* CONNECTIONS */}
          <Route
            path="connections"
            element={<Connection />}
          />

          {/* REELS */}
          <Route
            path="reels"
            element={<Reels />}
          />

          {/* DISCOVER */}
          <Route
            path="discover"
            element={<Discover />}
          />

          {/* PROFILE */}
          <Route
            path="profile"
            element={<Profile />}
          />

          <Route
            path="profile/:profileId"
            element={<Profile />}
          />

          {/* CREATE POST */}
          <Route
            path="create-post"
            element={<Createpost />}
          />

        </Route>

      </Routes>

    </>
  );

};

export default App;