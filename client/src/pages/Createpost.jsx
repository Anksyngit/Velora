import React, { useState, useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const { user } = useUser();

  // ✅ Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setImages((prev) => [...prev, ...previews]);
    setImageFiles((prev) => [...prev, ...files]);
  };

  // ✅ Remove image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Clear post
  const handleClear = () => {
    setContent("");
    setImages([]);
    setImageFiles([]);
  };

  // ✅ SUBMIT POST (FIXED 🔥)
  const handleSubmit = async () => {
    if (!content.trim() && imageFiles.length === 0) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("content", content);
      formData.append("clerkId", user.id);

      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const res = await axios.post(
        "http://localhost:4000/api/post/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success("Post created 🔥");
        handleClear();

        // 🔥 AUTO REFRESH FEED
        setTimeout(() => {
          window.location.reload();
        }, 800);
      }

    } catch (err) {
      console.log(err);
      toast.error("Failed to post ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-2xl mx-auto p-6">

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Create Post
          </h1>
          <p className="text-slate-600">
            Share your thoughts with the World
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow p-6">

          {/* User */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={user?.imageUrl}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-800">
                {user?.fullName}
              </p>
              <p className="text-gray-500 text-sm">
                @{user?.username || user?.id}
              </p>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            className="w-full border border-gray-200 rounded-xl p-3 text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {images.map((src, index) => (
                <div key={index} className="relative">
                  <img
                    src={src}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 text-sm text-indigo-500 hover:text-indigo-700"
            >
              <ImagePlus className="w-5 h-5" />
              Add Image
            </button>

            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />

            <div className="flex gap-3">
              <button
                onClick={handleClear}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-600"
              >
                Clear
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white disabled:opacity-60"
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreatePost;