import User from "../models/user.js";

// ======================================
// ✅ SYNC USER
// ======================================

export const syncUser = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const {
      clerkId,
      email,
      full_name,
      bio,
      banner,
      profile_picture,
    } = req.body;
    // VALIDATE
    if (!clerkId) {
      return res.json({
        success: false,
        message: "No clerkId",
      });
    }
    // FIND USER
    let user = await User.findOne({
      clerkId,
    });
    // ======================================
    // ✅ CREATE NEW USER
    // ======================================
    if (!user) {
      user = await User.create({
        clerkId,
        email,
        full_name,
        // Empty username until setup page
        username: "",
        // User has not completed setup
        profileCompleted: false,
        bio: "Hey There! I am using Velora.",
        banner:
          banner ||
          `https://picsum.photos/seed/${clerkId}/1200/400`,
        profile_picture:
          profile_picture ||
          `https://ui-avatars.com/api/?name=${full_name}`,
      });
      console.log("✅ New user created");
    }
    // ======================================
    // ✅ UPDATE EXISTING USER
    // ======================================
    else {
      user.full_name = full_name || user.full_name;
      user.email = email || user.email;
      user.bio = bio || user.bio;
      user.banner = banner || user.banner;
      user.profile_picture =
        profile_picture || user.profile_picture;
      await user.save();
      console.log("ℹ️ User updated");
    }
    res.json({
      success: true,
      user,
      profileCompleted: user.profileCompleted,
    });
  } catch (error) {
    console.log("❌ ERROR:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// ✅ GET CURRENT USER
// ======================================

export const getUserData = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;

    const user = await User.findOne({
      clerkId,
    })
      .populate("followers")
      .populate("following")
      .populate("connections");

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user,
      profileCompleted: user.profileCompleted,
    });

  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// ✅ GET ALL USERS
// ======================================

export const getAllUsers = async (req, res) => {
  try {

    const users = await User.find();

    res.json({
      success: true,
      users,
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// ✅ GET FOLLOWING USERS
// ======================================

export const getFollowingUsers = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const user = await User.findOne({
      clerkId
    }).populate("following");
    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }
    res.json({
      success: true,
      users: user.following
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

// ======================================
// ✅ UPDATE USER
// ======================================

export const updateUserData = async (req, res) => {
  try {

    const clerkId = req.auth?.userId;

    let {
      username,
      bio,
      location,
      full_name,
      profile_picture,
      cover_photo,
    } = req.body;

    const tempUser = await User.findOne({ clerkId });

    if (!tempUser) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    if (!username) {
      username = tempUser.username;
    }

    // Username check
    if (tempUser.username !== username) {

      const existingUser = await User.findOne({ username });

      if (existingUser) {
        username = tempUser.username;
      }

    }

    const user = await User.findOneAndUpdate(
      { clerkId },
      {
        username,
        bio,
        location,
        full_name,

        profile_picture:
          profile_picture || tempUser.profile_picture,

        cover_photo:
          cover_photo || tempUser.cover_photo,
      },
      {
        new: true,
      }
    );

    return res.json({
      success: true,
      user,
      message: "Profile updated",
    });

  } catch (error) {

    return res.json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// ✅ DISCOVER USERS
// ======================================

export const discoverUsers = async (req, res) => {
  try {

    const clerkId = req.auth?.userId;

    const { input } = req.body;

    const users = await User.find({
      $or: [
        { username: new RegExp(input, "i") },
        { email: new RegExp(input, "i") },
        { full_name: new RegExp(input, "i") },
        { location: new RegExp(input, "i") },
      ],
    });

    const filtered = users.filter(
      (user) => user.clerkId !== clerkId
    );

    res.json({
      success: true,
      users: filtered,
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// ✅ FOLLOW USER
// ======================================

export const followUsers = async (req, res) => {
  try {
    const clerkId = req.auth?.userId;
    const { id } = req.body;

    const user = await User.findOne({ clerkId });
    const toUser = await User.findById(id);

    if (!user || !toUser) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    if (user._id.toString() === toUser._id.toString()) {
      return res.json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    // Already following
    if (
      user.following.some((f) => f.toString() === id)
    ) {
      return res.json({
        success: false,
        message: "Already following",
      });
    }

    // Follow
    user.following.push(toUser._id);
    toUser.followers.push(user._id);

    // Check if other user already follows me
    const mutualFollow = toUser.following.some(
      (f) => f.toString() === user._id.toString()
    );

    if (mutualFollow) {

      if (
        !user.connections.some(
          (c) => c.toString() === toUser._id.toString()
        )
      ) {
        user.connections.push(toUser._id);
      }

      if (
        !toUser.connections.some(
          (c) => c.toString() === user._id.toString()
        )
      ) {
        toUser.connections.push(user._id);
      }

    }

    await user.save();
    await toUser.save();

    return res.json({
      success: true,
      connection: mutualFollow,
      message: mutualFollow
        ? "You are now connected."
        : "Followed successfully.",
    });

  } catch (error) {

    return res.json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// ✅ UNFOLLOW USER
// ======================================

export const unfollowUsers = async (req, res) => {
  try {

    const clerkId = req.auth?.userId;
    const { id } = req.body;

    const user = await User.findOne({ clerkId });
    const toUser = await User.findById(id);

    if (!user || !toUser) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Remove Following
    user.following = user.following.filter(
      (f) => f.toString() !== id
    );

    // Remove Followers
    toUser.followers = toUser.followers.filter(
      (f) => f.toString() !== user._id.toString()
    );

    // Remove Connection
    user.connections = user.connections.filter(
      (c) => c.toString() !== id
    );

    toUser.connections = toUser.connections.filter(
      (c) => c.toString() !== user._id.toString()
    );

    await user.save();
    await toUser.save();

    return res.json({
      success: true,
      message: "Unfollowed successfully",
    });

  } catch (error) {

    return res.json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// ✅ GET FOLLOWERS
// ======================================

export const getFollowers = async (req, res) => {
  try {

    const clerkId = req.auth?.userId;

    const user = await User.findOne({ clerkId }).populate("followers");

    return res.json({
      success: true,
      followers: user.followers,
    });

  } catch (error) {

    return res.json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// ✅ GET FOLLOWING
// ======================================

export const getFollowing = async (req, res) => {
  try {

    const clerkId = req.auth?.userId;

    const user = await User.findOne({ clerkId }).populate("following");

    return res.json({
      success: true,
      following: user.following,
    });

  } catch (error) {

    return res.json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// ✅ GET CONNECTIONS
// ======================================

export const getConnections = async (req, res) => {
  try {

    const clerkId = req.auth?.userId;

    const user = await User.findOne({ clerkId }).populate("connections");

    return res.json({
      success: true,
      connections: user.connections,
    });

  } catch (error) {

    return res.json({
      success: false,
      message: error.message,
    });

  }
};

// ======================================
// ✅ SETUP PROFILE
// ======================================

export const setupProfile = async (req, res) => {
  try {
    console.log("========== SETUP ==========");

    console.log("req.auth =", req.auth);

    const clerkId = req.auth?.userId;

    console.log("clerkId =", clerkId);

    const currentUser = await User.findOne({ clerkId });

    console.log("Current User =", currentUser);

    const { username, bio, location } = req.body;

    const existingUser = await User.findOne({ username });

    console.log("Username Exists =", existingUser);

    if (
      existingUser &&
      existingUser.clerkId !== clerkId
    ) {
      return res.json({
        success: false,
        message: "Username already exists",
      });
    }

    const user = await User.findOneAndUpdate(
      { clerkId },
      {
        username,
        bio,
        location,
        profileCompleted: true,
      },
      {
        new: true,
      }
    );

    console.log("Updated User =", user);

    return res.json({
      success: true,
      user,
      message: "Profile setup completed",
    });

  } catch (error) {
    console.log("SETUP ERROR =", error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};