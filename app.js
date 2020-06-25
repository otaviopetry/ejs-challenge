const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const lodash = require('lodash');

const app = express();

app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/workJournalDB', { useNewUrlParser: true, useUnifiedTopology: true });

// create the schema
const postSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: [true, 'Please, check post title.']
    },
    content: {
        type: String,
        required: [true, 'Your post content is empty.']
    },
    postURL: String
})

// create the model with schema
const Post = mongoose.model('Post', postSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

let allPosts = [];

app.get("/", function (req, res) {

    allPosts = [];

    Post.find( (err, posts) => {
        err 
        ? console.log(err)
        :
            posts.forEach ( (post) => {
                allPosts.push(post);
            });

            res.render("home", {
                data: allPosts
            });
    })
})

app.get("/about", function (req, res) {
    
    res.render("about", {
        content: "aboutText"
    });

})

app.get("/contact", function (req, res) {

    res.render("contact", {
        content: "contactText"
    });

})

app.get("/compose", function (req, res) {

    res.render("compose");

})

app.post("/compose", function (req, res) {

    // create new post using model
    const newPost = new Post({
        title: req.body.postTitle,
        content: req.body.postContent,
        postURL: lodash.kebabCase(req.body.postTitle)
    });

    newPost.save( (err) => {
        if (!err) {
            res.redirect('/');
        }
    });
})

app.get('/entries/:postId', function (request, response) {
    // store the wanted post ID
    const requiredPostId = request.params.postId;

    Post.findOne({ _id: requiredPostId}, function (error, post) {
        error
        ? console.warn(error)
        :
            response.render('entry', {
                renderPost: post
            })
    })
})

app.listen("3000", function() {
    console.log("The server is up and running on port 3000, mate <3");
})