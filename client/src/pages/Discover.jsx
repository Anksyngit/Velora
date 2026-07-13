import React, { useState } from "react";
import axios from "axios";
import { Search, Loader } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import UserCard from "../components/UserCard";

const Discover = () => {
  const { getToken } = useAuth();

  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    if (e.key !== "Enter") return;

    try {
      setLoading(true);

      const token = await getToken();

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/discover`,
        {
          input,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("DISCOVER RESPONSE:", data.users);
      console.log("FIRST USER:", data.users[0]);

      if (data.success) {
        setUsers(data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.log(error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto p-6">

        {/* Heading */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Discover People
          </h1>

          <p className="text-slate-600">
            Connect with amazing people and grow your network
          </p>
        </div>

        {/* Search */}

        <div className="mb-8 shadow-md rounded-md border border-slate-200 bg-white">
          <div className="p-6">

            <div className="relative">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />

              <input
                type="text"
                placeholder="Search by name, username, email or location..."
                className="pl-10 py-3 w-full border rounded-md"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleSearch}
              />

            </div>

          </div>
        </div>

        {/* Results */}

        {loading ? (
          <div
            className="flex justify-center items-center"
            style={{ height: "60vh" }}
          >
            <Loader className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-6">

            {users.length > 0 ? (
              users.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                />
              ))
            ) : (
              <p className="text-gray-500">
                Search for users to discover people.
              </p>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default Discover;