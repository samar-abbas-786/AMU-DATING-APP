const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/userSchema");
const bodyParser = require("body-parser");

// Database Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/AmU_DATING_APP")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Default route for rendering signup page
app.get("/", (req, res) => {
  return res.render("signup");
});

// Signup route
app.post("/user/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
  });
  return res.status(201).render("home");
});

// Login route
app.post("/user/login", (req, res) => {
  const { email, password } = req.body;
  const user = User.findOne({
    email: email,
    password: password,
  });
  if (!user) {
    return res.json({ message: "NO USER FOUND" });
  } else {
    return res.render("home");
  }
});

// Login page route
app.get("/login", (req, res) => {
  return res.render("login");
});

app.listen(PORT, () => {
  console.log(`App is Running at ${PORT}`);
});