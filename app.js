const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const lodash = require('lodash');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

const allPosts = [];


app.get("/", function (req, res) {
    
    res.render("home", {
        data: allPosts
    });
    
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

    const userInput = {
        newPostTitle: req.body.postTitle,
        newPostContent: req.body.postContent,
        newPostHREF: lodash.kebabCase(req.body.postTitle)
    }
    
    allPosts.push(userInput);

    res.redirect("/");

})

app.get("/entries/:postName", function (req, res) {
    
    const requiredPost = lodash.lowerCase(req.params.postName); // a constante não mudará de valor durante a execução do loop... se outro loop for executado, ela será definida novamente
    
    let found = false;
    let requiredEntry = {};
    
    allPosts.forEach( function (post) {
        const storedPostTitle = lodash.lowerCase(post.newPostTitle);

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