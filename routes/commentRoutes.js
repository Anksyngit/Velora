import express from "express";

import {

  addComment,

  getComments,

} from "../controllers/commentController.js";

const router =
  express.Router();

// ADD COMMENT

router.post(
  "/add",
  addComment
);

// GET COMMENTS

router.get(
  "/:postId",
  getComments
);

export default router;