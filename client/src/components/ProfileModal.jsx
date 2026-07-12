import React, { useState } from "react"
import { X } from "lucide-react"
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const ProfileModal = ({ user, onClose, onSave }) => {
    const { getToken } = useAuth();

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const [formData, setFormData] = useState({
        full_name: user.full_name || '',
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
    })

    const [profilePicPreview, setProfilePicPreview] = useState(user.profile_picture)
    const [coverPhotoPreview, setCoverPhotoPreview] = useState(user.cover_photo)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleProfilePicChange = async (e) => {

        console.log("1. handleProfilePicChange");

        const file = e.target.files[0];

        console.log("2. File =", file);

        if (!file) return;

        try {

            console.log("3. Creating FormData");

            const formData = new FormData();
            formData.append("image", file);

            console.log("4. Getting token");

            const token = await getToken();

            console.log("5. Token =", token);

            console.log("6. About to call axios");

            const response = await axios.post(
                `${BACKEND_URL}/api/upload/image`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("7. RESPONSE =", response.data);

            if (response.data.success) {

                console.log("8. Setting preview");

                setProfilePicPreview(response.data.url);

            }

        } catch (err) {

            console.log("XXXXXXXX ERROR XXXXXXXX");

            console.log(err);

            console.log(err.response);

            console.log(err.response?.data);

        }

    };

    const handleCoverChange = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        try {

            const formData = new FormData();

            formData.append("image", file);

            console.log("Getting token...");

            const token = await getToken();

            console.log("TOKEN =", token);

            console.log("Uploading...");

            const { data } = await axios.post(

                `${BACKEND_URL}/api/upload/image`,

                formData,

                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }

            );

            if (data.success) {

                setCoverPhotoPreview(data.url);

            }

        } catch (err) {

            console.log("UPLOAD FAILED");

            console.log(err);

            console.log(err.response);

            console.log(err.response?.data);

        }

    };

    const handleSave = async () => {

        console.log("SAVE BUTTON CLICKED");

        await onSave({
            ...formData,
            profile_picture: profilePicPreview,
            cover_photo: coverPhotoPreview,
        });

        console.log("ONSAVE FINISHED");

        onClose();

    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 relative max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                        <X className="w-5 h-5"/>
                    </button>
                </div>

                {/* Profile Picture */}
                <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Profile Picture</p>
                    <div className="flex items-center gap-4">
                        <img src={profilePicPreview} className="w-16 h-16 rounded-full object-cover shadow"/>
                        <label className="cursor-pointer text-sm text-indigo-500 hover:text-indigo-700 border border-indigo-300 px-3 py-1.5 rounded-lg transition">
                            Change Photo
                            <input type="file" accept="image/*" className="hidden" onChange={handleProfilePicChange}/>
                        </label>
                    </div>
                </div>

                {/* Cover Photo */}
                <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Cover Photo</p>
                    <div className="relative">
                        <img src={coverPhotoPreview} className="w-full h-28 object-cover rounded-xl shadow"/>
                        <label className="absolute bottom-2 right-2 cursor-pointer text-xs text-white bg-black/50 hover:bg-black/70 px-3 py-1 rounded-lg transition">
                            Change Cover
                            <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange}/>
                        </label>
                    </div>
                </div>

                {/* Name */}
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <input
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                </div>

                {/* Username */}
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700">Username</label>
                    <input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                </div>

                {/* Bio */}
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                    />
                </div>

                {/* Location */}
                <div className="mb-6">
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-600 cursor-pointer transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white cursor-pointer transition"
                    >
                        Save Changes
                    </button>
                </div>

            </div>
        </div>
    )
}

export default ProfileModal
