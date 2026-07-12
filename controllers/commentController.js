import Comment from "../models/comment.js";
import User from "../models/user.js";
import Post from "../models/post.js";
import Notification from "../models/notification.js";

// ==============================
// ADD COMMENT
// ==============================

export const addComment = async (req, res) => {

  try {

    const {
      postId,
      clerkId,
      text,
    } = req.body;

    if (!text || !text.trim()) {

      return res.json({

        success: false,

        message: "Comment cannot be empty."

      });

    }

    const user = await User.findOne({

      clerkId,

    });

    const post = await Post.findById(postId);

    if (!user || !post) {

      return res.json({

        success: false,

        message: "User or Post not found."

      });

    }

    const comment = await Comment.create({

      post: postId,

      user: user._id,

      text: text.trim(),

    });

    await comment.populate(

      "user",

      "full_name username profile_picture clerkId"

    );

    // ==============================
    // COMMENT NOTIFICATION
    // ==============================

    if (post.user.toString() !== user._id.toString()) {

      const receiver = await User.findById(post.user);

      await Notification.create({

        receiverId: receiver.clerkId,

        senderId: user.clerkId,

        senderName: user.full_name,

        senderProfile: user.profile_picture,

        type: "COMMENT",

        postId: post._id,

        message: `${user.full_name} commented on your post.`,

      });

    }

    res.json({

      success: true,

      comment,

    });

  }

  catch (error) {

    console.log(error);

    res.json({

      success: false,

      message: error.message,

    });

  }

};

// ==============================
// GET COMMENTS
// ==============================

export const getComments = async (req, res) => {

  try {

    const { postId } = req.params;

    const comments = await Comment.find({

      post: postId,

    })

    .populate(

      "user",

      "full_name username profile_picture clerkId"

    )

    .sort({

      createdAt: -1,

    });

    res.json({

      success: true,

      comments,

    });

  }

  catch (error) {

    console.log(error);

    res.json({

      success: false,

      message: error.message,

    });

  }

};