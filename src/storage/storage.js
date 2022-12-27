import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinaryModule from "cloudinary";
import * as dotenv from "dotenv";
import {
  CLOUDINARY_FOLDER,
  CLOUDINARY_KEY,
  CLOUDINARY_SECRET,
  CLOUD_NAME,
} from "../helpers/index.js";
const cloudinary = cloudinaryModule.v2;

dotenv.config();

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: CLOUDINARY_FOLDER,
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});
