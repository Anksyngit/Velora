import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Setup = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    console.log("1. Button clicked");

    if (!username.trim()) {
      console.log("2. Username empty");
      return toast.error("Username is required");
    }

    try {
      setLoading(true);

      console.log("3. Getting Clerk token...");

      const token = await getToken();

      console.log("4. Token:", token);

      const url = `${import.meta.env.VITE_BACKEND_URL}/api/user/setup`;

      console.log("5. POST URL:", url);

      const response = await axios.post(
        url,
        {
          username,
          bio,
          location,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("6. Full Response:", response);

      console.log("7. Response Data:", response.data);

      if (response.data.success) {
        toast.success("Profile setup completed!");

        console.log("8. Navigating to Feed");

        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("9. Axios Error:", error);

      console.log("10. Response:", error.response);

      console.log("11. Data:", error.response?.data);

      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-[420px]">

        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome to Velora 👋
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Complete your profile to continue.
        </p>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full border rounded-lg p-3 mb-4"
        />

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
          className="w-full border rounded-lg p-3 h-28 mb-4"
        />

        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (Optional)"
          className="w-full border rounded-lg p-3 mb-6"
        />

        <button
          onClick={handleContinue}
          disabled={loading}
          className="w-full bg-black text-white rounded-lg p-3 hover:bg-gray-900"
        >
          {loading ? "Saving..." : "Continue"}
        </button>

      </div>
    </div>
  );
};

export default Setup;