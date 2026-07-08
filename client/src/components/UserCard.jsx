import React, { useState } from "react"
import { dummyUserData } from "../assets/assets"
import { useNavigate } from "react-router-dom"
import { MapPin, UserPlus, UserCheck, Plus, MessageCircle, Eye } from "lucide-react"

const UserCard = ({ user }) => {
    const currentUser = dummyUserData
    const navigate = useNavigate()

    const [isFollowing, setIsFollowing] = useState(
        currentUser.following.includes(user._id)
    )

    const isConnected = currentUser.connections.includes(user._id)

    const handleFollow = (e) => {
        e.stopPropagation()
        setIsFollowing(!isFollowing)
    }

    const handleMessage = (e) => {
        e.stopPropagation()
        if (isConnected) {
            navigate(`/messages/${user._id}`)
        }
    }

    const handleViewProfile = (e) => {
        e.stopPropagation()
        navigate(`/profile/${user._id}`)
    }

    return (
        <div
            className="p-4 pt-6 flex flex-col items-center w-72 shadow border border-gray-200 rounded-md cursor-pointer hover:shadow-md transition"
            onClick={() => navigate(`/profile/${user._id}`)}
        >
            <img
                src={user.profile_picture}
                className="rounded-full w-16 shadow-md mx-auto"
            />

            <p className="mt-4 font-semibold">{user.full_name}</p>

            {user.username && (
                <p className="text-gray-500 font-light">@{user.username}</p>
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

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4 w-full">

                {/* Follow Button */}
                <button
                    onClick={handleFollow}
                    className={`flex-1 flex items-center justify-center gap-2 p-2 text-sm rounded-md active:scale-95 transition cursor-pointer text-white ${
                        isFollowing
                            ? "bg-indigo-400"
                            : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                    }`}
                >
                    {isFollowing ? (
                        <UserCheck className="w-4 h-4" />
                    ) : (
                        <UserPlus className="w-4 h-4" />
                    )}
                    {isFollowing ? "Following" : "Follow"}
                </button>

                {/* Message Button */}
                <button
                    onClick={handleMessage}
                    className="p-2 px-3 text-sm rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition cursor-pointer flex items-center justify-center"
                >
                    {isConnected ? (
                        <MessageCircle className="w-4 h-4" />
                    ) : (
                        <Plus className="w-4 h-4" />
                    )}
                </button>

                {/* 👁 View Profile Button (NEW) */}
                <button
                    onClick={handleViewProfile}
                    className="p-2 px-3 text-sm rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition cursor-pointer flex items-center justify-center"
                >
                    <Eye className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

export default UserCard