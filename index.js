const express = require("express");
const mongoose = require("mongoose");

const app = express();

require("dotenv").config();

const connection_string = process.env.CONNECTION_STRING;
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Welcome to api");
});

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
