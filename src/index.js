import express, { json, static as _static } from "express";
import { connect } from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { articleRoutes } from "./article/article.routes.js";
import { categoryRoutes } from "./category/category.routes.js";
import { userRoutes } from "./user/user.routes.js";
import { commentRoutes } from "./comment/comment.routes.js";
import { imagesRoutes } from "./images/images.routes.js";
import { join } from "path";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { ROUTES } from "./helpers/routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

dotenv.config();

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ORIGIN_PATH,
    credentials: true,
  })
);
app.use(json());
app.use(ROUTES.IMAGES_ROUTE, _static(join(__dirname, "images")));

app.use(ROUTES.ARTICLE_ROUTES, articleRoutes);
app.use(ROUTES.CATEGORY_ROUTES, categoryRoutes);
app.use(ROUTES.USER_ROUTES, userRoutes);
app.use(ROUTES.COMMENT_ROUTES, commentRoutes);
app.use(ROUTES.IMAGES_ROUTES, imagesRoutes);

app.get(ROUTES.BASE, (req, res) => {
  res.send("Welcome to api");
});

const connection_string = process.env.CONNECTION_STRING;
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

connect(connection_string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connection established"))
  .catch((err) =>
    console.error(`MongoDB connection is failed: ${err.message}`)
  );
