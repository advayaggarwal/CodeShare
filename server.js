const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));

const Document = require("./models/Document");

mongoose.connect("mongodb://localhost/codeshare", {

    useNewUrlParser: true
});



app.get("/", function (req, res) {
    const code = `# CodeShare
Sharing code is a good thing, and it should be _really_ easy to do it.
A lot of times, I want to show you something I 'm seeing - and that's where we
use pastebins.
CodeShare is the prettiest, easiest to use pastebin ever made.`;

    res.render("code-display", {
        code,
        language: 'plaintext'
    });
});

app.get("/new", function (req, res) {
    res.render("new");
});

app.get("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const document = await Document.findById(id);

        res.render("code-display", {
            code: document.value,
            id
        });
    } catch (e) {
        res.redirect("/");
    }
});

app.get("/:id/duplicate", async (req, res) => {
    const id = req.params.id;

    try {
        const document = await Document.findById(id);

        res.render("new", {
            value: document.value
        });
    } catch (e) {
        res.redirect(`/${id}`);
    }
});

app.post("/save", async (req, res) => {
    const value = req.body.value;

    try {
        const document = await Document.create({
            value
        });
        res.redirect(`/${document.id}`)
    } catch (e) {
        res.render("new", {
            value
        })
    }
});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});