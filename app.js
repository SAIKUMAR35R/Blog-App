//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://SaiKumar:mongodb55@cluster0.uu5h1xg.mongodb.net/blogDB",{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const homeStartingContent = "Welcome to the Blog page, update your daily activities"
const aboutContent = "Redirect to the compose Route to enter details of the Activities and hit Publish to post";
const contactContent = "Its the contact page";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = mongoose.Schema({
  title:String,
  description:String
});

const Post = mongoose.model("Post",postSchema);

app.get("/", (req, res) => {
  Post.find({})
    .then((posts) => {
      res.render("home", {
        paraInfo: homeStartingContent,
        posts: posts
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});


app.get("/posts/:postTitle", function(req, res){

  const requestedPostTitle = req.params.postTitle;
  
    Post.findOne({title: requestedPostTitle}).then((post)=>{
      res.render("post", {
        postTitle: post.title,
        postInfo: post.description
      });
    })
});

app.get("/about",(req,res)=>{
  res.render("about",{aboutInfo:aboutContent});
});

app.get("/contact",(req,res)=>{
  res.render("contact",{contactInfo:contactContent});
});

app.get("/compose",(req,res)=>{
  res.render("compose");
});

app.post("/compose",(req,res)=>{
  const post = new Post({
    title:req.body.inputTitle,
    description:req.body.inputDescription
  });
  post.save();
  res.redirect("/");
});


app.listen(3000,()=>{
  console.log("server running at 3000");
});


