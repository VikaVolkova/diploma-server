const express = require("express");
const { storage } = require("../storage/storage");
const multer = require("multer");
const upload = multer({ storage });

const imagesRoutes = express.Router();

imagesRoutes.post("/upload", upload.single("image"), (req, res) => {
  if (req.file) {
    return res.status(200).send(req.file.path);
  } else {
    return res.status(500).send("No file");
  }
});

module.exports = imagesRoutes;
