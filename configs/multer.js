import multer from "multer";
import path from "path";
import fs from "fs";

// ==============================
// CREATE UPLOADS FOLDER
// ==============================

const uploadPath =
  "uploads";

if (
  !fs.existsSync(uploadPath)
) {

  fs.mkdirSync(
    uploadPath
  );

}

// ==============================
// STORAGE CONFIG
// ==============================

const storage =
  multer.diskStorage({

    destination:
      function (
        req,
        file,
        cb
      ) {

        cb(
          null,
          uploadPath
        );

      },

    filename:
      function (
        req,
        file,
        cb
      ) {

        const uniqueName =
          Date.now() +
          "-" +
          file.originalname;

        cb(
          null,
          uniqueName
        );

      },

  });

// ==============================
// MULTER CONFIG
// ==============================

const upload =
  multer({

    storage,

    limits: {

      fileSize:
        100 *
        1024 *
        1024,

    },

  });

export default upload;