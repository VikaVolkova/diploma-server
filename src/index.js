const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const articleRoutes = require("./article/article.routes");
const categoryRoutes = require("./category/category.routes");
const userRoutes = require("./user/user.routes");
const commentRoutes = require("./comment/comment.routes");
const imagesRoutes = require("./images/images.routes");
const path = require("path");

const app = express();

require("dotenv").config();

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/news", articleRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/user", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/images", imagesRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to api");
});

const connection_string = process.env.CONNECTION_STRING;
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

mongoose
  .connect(connection_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established"))
  .catch((err) =>
    console.error(`MongoDB connection is failed: ${err.message}`)
  );
