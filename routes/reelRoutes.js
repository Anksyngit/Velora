import express from "express";
import multer from "multer";

import {
  createReel,
  getReels,
} from "../controllers/reelController.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post(
  "/create",
  upload.single("video"),
  createReel
);

router.get(
  "/all",
  getReels
);

export default router;