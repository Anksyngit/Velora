import pkg from "cloudinary";


const { v2: cloudinary } =
  pkg;

cloudinary.config({

  cloud_name:
    "durg2oldn",

  api_key:
    "229178748759898",

  api_secret:
    "03Dl4bJnbr2_39ErR7130l-89mY",

});

export default cloudinary;