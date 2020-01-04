const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();
const middleware = require("./api/middleware");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middleware.checkTokenSetUser);
app.use(
  session({
    secret: "yanan",
    resave: true,
    saveUninitialized: true
  })
);

// Routes
app.use("/api/v1/users", require("./api/user"));

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  })
  .catch(e => {
    console.error(e);
  });
