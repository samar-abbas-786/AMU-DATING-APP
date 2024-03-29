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

//GET FORGOT PASSWORD-PAGE
app.get("/forgotpassword", (req, res) => {
  return res.render("forgotpassword");
});

//POST FORGOT PASSWORD
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.json({ message: "No User Available with this Email" });
    } else {
      res.send(`Your Password is :<h3>${user.password}</h3>`);
      console.log(user.password);
      console.log(user.name);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//CHANGE PASSWORD
app.post("/update-password", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "No user found with this email" });
    }
    user.password = password;
    await user.save();
    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login route
app.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log({ email, password });
  const user = await User.findOne({
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
