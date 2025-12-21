const cloudinary = require("cloudinary");
const multerStorageCloudinary = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new multerStorageCloudinary({
  cloudinary: cloudinary,
  folder: "wonderlust_dev",
  allowedFormats: ["jpeg", "jpg", "png"]
});

module.exports = { cloudinary, storage };


