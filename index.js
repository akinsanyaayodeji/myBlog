import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("ayodeji-render", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = {
  name: String,
  email: String,
  username: String,
  password: String,
};
const messageSchema = {
  name: String,
  email: String,
  subject: String,
  message: String,
};
const postSchema = {
  author: String,
  postTitle: String,
  postBody: String,
};

const User = mongoose.model("User", userSchema);
const Message = mongoose.model("Message", messageSchema);
const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find().then(function (posts) {
    res.render("home", {
      posts: posts,
    });
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/contact", function (req, res) {
  res.render("contact");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});
app.get("/compose", function (req, res) {
  res.render("compose");
});
app.get("/dejiAdmin", function (req, res) {
  User.find().then(function (users) {
    res.render("admin", {
      users: users,
    });
  });
});

app.post("/register", function (req, res) {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });

  User.findOne({ username: user.username }).then(function (foundUser) {
    if (foundUser) {
      res.send("<h1>Username already exist</h1>");
    } else {
      user.save().then(res.redirect("/login"));
    }
  });
});
app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username }).then(function (foundUser) {
    if (foundUser.password === password) {
      res.redirect("/compose");
    } else {
      res.redirect("/");
    }
  });
});
app.post("/contact", function (req, res) {
  const message = new Message({
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message,
  });
  message.save().then(function () {
    res.send("<h1>Your Message has been sent Successfully</h1>");
  });
});
app.post("/compose", function (req, res) {
  const post = new Post({
    author: req.body.author,
    postTitle: req.body.postTitle,
    postBody: req.body.postBody,
  });
  post.save().then(function () {
    res.redirect("/");
  });
});
const port = 3000;
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
