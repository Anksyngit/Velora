import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Heart, MessageCircle, UserPlus, Send } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

const Notifications = () => {
  const { user } = useUser();

  const [notifications, setNotifications] = useState([]);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/notifications/${user.id}`
        );

        if (res.data.success) {
          setNotifications(res.data.notifications);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchNotifications();
  }, [user]);

  const getIcon = (type) => {
    switch (type) {
      case "LIKE":
        return <Heart className="w-4 h-4 text-red-500 fill-red-500" />;

      case "COMMENT":
        return <MessageCircle className="w-4 h-4 text-blue-500" />;

      case "FOLLOW":
        return <UserPlus className="w-4 h-4 text-green-500" />;

      case "MESSAGE":
        return <Send className="w-4 h-4 text-purple-500" />;

      default:
        return <Heart className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-5">

      <h2 className="font-semibold text-lg mb-4">
        🔔 Notifications
      </h2>

      {notifications.length === 0 ? (
        <p className="text-gray-400 text-sm">
          No notifications yet
        </p>
      ) : (
        <div className="space-y-4">

          {notifications.map((item) => (

            <div
              key={item._id}
              className="flex gap-3 items-start border-b pb-3 last:border-none"
            >

              <img
                src={item.senderProfile}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />

              <div className="flex-1">

                <div className="flex items-center gap-2">

                  {getIcon(item.type)}

                  <p className="text-sm">
                    {item.message}
                  </p>

                </div>

                <p className="text-xs text-gray-400 mt-1">
                  {moment(item.createdAt).fromNow()}
                </p>

              </div>

              {!item.isRead && (
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              )}

            </div>

          ))}

        </div>
      )}

    </div>
  );
};

export default Notifications;