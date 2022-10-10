const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const articleRoutes = require("./article/article.routes");

const app = express();

require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/news", articleRoutes);

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
