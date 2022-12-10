import { Router } from "express";
import { storage } from "../storage/storage.js";
import multer from "multer";
const upload = multer({ storage });
import { ROUTES } from "../helpers/routes.js";

export const imagesRoutes = Router();

imagesRoutes.post(ROUTES.IMAGES.UPLOAD, upload.single("image"), (req, res) => {
  if (req.file) {
    return res.status(200).send(req.file.path);
  } else {
    return res.status(500);
  }
});
