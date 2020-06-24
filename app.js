const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const lodash = require('lodash');

const app = express();

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

    newPost.save();
    
    res.redirect("/");

})

app.get("/entries/:postName", function (req, res) {

    // store the post name in request params     
    const requiredPost = lodash.lowerCase(req.params.postName); // a constante não mudará de valor durante a execução do loop... se outro loop for executado, ela será definida novamente
    
    // start a found boolean
    let found = false;

    // start an empty object for the post retrieved below
    let requiredEntry = {};

    // iterate through posts and find if the required url exists
    allPosts.forEach( function (post) {

        // create a lowercase version of the current selected post
        const storedPostTitle = lodash.lowerCase(post.title);
        
        // compare the required post title with current selected post
        // set found = true and required entry if title matches
        if ( requiredPost === storedPostTitle ) {
            found = true;
            requiredEntry = post;
            res.render("entry", {
                renderPost: requiredEntry
            });
        }                
    })

    if (found === false ) {
        console.log("There is no entry with this title");
    }
})

app.listen("3000", function() {
    console.log("The server is up and running on port 3000, mate <3");
})