import User from "../models/user.js";

// ======================================
// ✅ SYNC USER
// ======================================

export const syncUser = async (
  req,
  res
) => {
  try {

    console.log(
      "BODY:",
      req.body
    );

    const {
      clerkId,
      email,
      full_name,
      username,
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
    let user =
      await User.findOne({
        clerkId,
      });

    // ======================================
    // ✅ CREATE NEW USER
    // ======================================

    if (!user) {

      let finalUsername =
        username ||
        email.split("@")[0];

      // CHECK USERNAME
      const existing =
        await User.findOne({
          username:
            finalUsername,
        });

      if (existing) {

        finalUsername =
          finalUsername +
          Math.floor(
            Math.random() * 10000
          );
      }

      // CREATE USER
      user =
        await User.create({

          clerkId,

          email,

          full_name,

          username:
            finalUsername,

          bio:
            bio ||
            "Hey There! I am using Velora.",

          banner:
            banner ||
            `https://picsum.photos/seed/${clerkId}/1200/400`,

          profile_picture:
            profile_picture ||
            `https://ui-avatars.com/api/?name=${full_name}`,

        });

      console.log(
        "✅ New user created"
      );

    }

    // ======================================
    // ✅ UPDATE EXISTING USER
    // ======================================

    else {

      user.full_name =
        full_name ||
        user.full_name;

      user.email =
        email ||
        user.email;

      user.bio =
        bio ||
        user.bio;

      user.banner =
        banner ||
        user.banner;

      user.profile_picture =
        profile_picture ||
        user.profile_picture;

      await user.save();

      console.log(
        "ℹ️ User updated"
      );
    }

    // RESPONSE
    res.json({
      success: true,
      user,
    });

  } catch (error) {

    console.log(
      "❌ ERROR:",
      error
    );

    res.json({
      success: false,
      message:
        error.message,
    });
  }
};

// ======================================
// ✅ GET CURRENT USER
// ======================================

export const getUserData =
  async (req, res) => {
    try {

      const clerkId =
        req.auth?.userId;

      const user =
        await User.findOne({
          clerkId,
        });

      if (!user) {
        return res.json({
          success: false,
          message:
            "User not found",
        });
      }

      res.json({
        success: true,
        user,
      });

    } catch (error) {

      res.json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ======================================
// ✅ GET ALL USERS
// ======================================

export const getAllUsers =
  async (req, res) => {
    try {

      const users =
        await User.find();

      res.json({
        success: true,
        users,
      });

    } catch (error) {

      res.json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ======================================
// ✅ UPDATE USER
// ======================================

export const updateUserData =
  async (req, res) => {
    try {

      const clerkId =
        req.auth?.userId;

      let {
        username,
        bio,
        location,
        full_name,
      } = req.body;

      const tempuser =
        await User.findOne({
          clerkId,
        });

      if (!tempuser) {
        return res.json({
          success: false,
          message:
            "User not found",
        });
      }

      if (!username) {
        username =
          tempuser.username;
      }

      // USERNAME CHECK
      if (
        tempuser.username !==
        username
      ) {

        const existingUser =
          await User.findOne({
            username,
          });

        if (existingUser) {
          username =
            tempuser.username;
        }
      }

      // UPDATE
      const user =
        await User.findOneAndUpdate(
          { clerkId },
          {
            username,
            bio,
            location,
            full_name,
          },
          { new: true }
        );

      res.json({
        success: true,
        user,
        message:
          "Profile updated",
      });

    } catch (error) {

      res.json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ======================================
// ✅ DISCOVER USERS
// ======================================

export const discoverUsers =
  async (req, res) => {
    try {

      const clerkId =
        req.auth?.userId;

      const { input } =
        req.body;

      const users =
        await User.find({
          $or: [
            {
              username:
                new RegExp(
                  input,
                  "i"
                ),
            },
            {
              email:
                new RegExp(
                  input,
                  "i"
                ),
            },
            {
              full_name:
                new RegExp(
                  input,
                  "i"
                ),
            },
            {
              location:
                new RegExp(
                  input,
                  "i"
                ),
            },
          ],
        });

      const filtered =
        users.filter(
          (user) =>
            user.clerkId !==
            clerkId
        );

      res.json({
        success: true,
        users: filtered,
      });

    } catch (error) {

      res.json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ======================================
// ✅ FOLLOW USER
// ======================================

export const followUsers =
  async (req, res) => {
    try {

      const clerkId =
        req.auth?.userId;

      const { id } =
        req.body;

      const user =
        await User.findOne({
          clerkId,
        });

      const toUser =
        await User.findById(id);

      if (!user || !toUser) {
        return res.json({
          success: false,
          message:
            "User not found",
        });
      }

      // ALREADY FOLLOWING
      if (
        user.following.includes(
          toUser._id
        )
      ) {
        return res.json({
          success: false,
          message:
            "Already following",
        });
      }

      // FOLLOW
      user.following.push(
        toUser._id
      );

      await user.save();

      toUser.followers.push(
        user._id
      );

      await toUser.save();

      res.json({
        success: true,
      });

    } catch (error) {

      res.json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ======================================
// ✅ UNFOLLOW USER
// ======================================

export const unfollowUsers =
  async (req, res) => {
    try {

      const clerkId =
        req.auth?.userId;

      const { id } =
        req.body;

      const user =
        await User.findOne({
          clerkId,
        });

      const toUser =
        await User.findById(id);

      if (!user || !toUser) {
        return res.json({
          success: false,
          message:
            "User not found",
        });
      }

      // REMOVE FOLLOWING
      user.following =
        user.following.filter(
          (f) =>
            f.toString() !== id
        );

      await user.save();

      // REMOVE FOLLOWER
      toUser.followers =
        toUser.followers.filter(
          (f) =>
            f.toString() !==
            user._id.toString()
        );

      await toUser.save();

      res.json({
        success: true,
      });

    } catch (error) {

      res.json({
        success: false,
        message:
          error.message,
      });
    }
  };