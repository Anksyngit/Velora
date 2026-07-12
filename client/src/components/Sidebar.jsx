import React from "react";
import { assets } from "../assets/assets";

import {
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";

import MenuItems from "./MenuItems";

import {
  CirclePlus,
  LogOut,
  Clapperboard,
} from "lucide-react";

import {
  UserButton,
  useClerk,
  useUser,
} from "@clerk/clerk-react";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {

  const navigate = useNavigate();
  const location = useLocation();

  const { signOut } = useClerk();
  const { user } = useUser();

  return (

    <div
      className={`w-60 xl:w-72 bg-white border-r border-gray-200 flex flex-col justify-between items-center
      max-sm:absolute top-0 bottom-0 z-20 ${
        sidebarOpen
          ? "translate-x-0"
          : "max-sm:-translate-x-full"
      } transition-all duration-300 ease-in-out`}
    >

      <div className="w-full">

        {/* LOGO */}
        <img
          onClick={() => navigate("/")}
          src={assets.velora}
          className="w-20 ml-4 my-4 cursor-pointer"
          alt=""
        />

        <hr className="border-gray-300 mb-4" />

        <MenuItems
          setSidebarOpen={setSidebarOpen}
        />

        {/* REELS */}
        <button
          onClick={() => {
            navigate("/reels");
            setSidebarOpen(false);
          }}
          className={`w-[90%] mx-auto flex items-center gap-3 px-5 py-3 rounded-xl mt-2 transition ${
            location.pathname === "/reels"
              ? "bg-indigo-50 text-indigo-600"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Clapperboard className="w-5 h-5" />
          <p className="font-medium">Reels</p>
        </button>

        {/* CREATE POST */}
        <Link
          to="/create-post"
          className="flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white"
        >
          <CirclePlus className="w-5 h-5" />
          Create Post
        </Link>

      </div>

      {/* USER */}
      <div className="w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between">

        <div className="flex gap-3 items-center">

          <UserButton />

          <div>
            <h1 className="font-medium">
              {user?.fullName}
            </h1>

            <p className="text-xs text-gray-500">
              @{user?.username || user?.primaryEmailAddress?.emailAddress?.split("@")[0]}
            </p>
          </div>

        </div>

        <LogOut
          onClick={() => signOut()}
          className="w-5 h-5 text-gray-400 hover:text-gray-700 cursor-pointer"
        />

      </div>

    </div>
  );
};

export default Sidebar;