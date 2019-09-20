let express = require('express');
let logger = require('morgan');
let mongoose = require('mongoose');

let cheerio = require('cheerio');
let axios = require('axios');

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/sportNews";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//Require models
let db = require("./models");

let PORT = 3000;

let app = express();

//Middleware

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + "/public"));

let exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});

// MAIN ROUTES //////

app.get("/", function (req, res) {

    
    db.Article.find({ "saved": false })
        .then(function (data) {

            let hbsObject = {
                article: data
            };
            console.log(hbsObject);
            res.render("index", hbsObject);
        })
        .catch(function (err) {
            if (err) {
                res.json(err);
            }
        });
    
});

app.get("/saved", function (req, res) {

    db.Article.find({ "saved": true })
        .populate("notes")
        .then(function (data) {
            let hbsObject = {
                article: data
            };
            console.log(hbsObject);
            res.render("saved", hbsObject);
        });
});

app.get("/clear", function (req, res) {

    db.Article.remove({ "saved": false })
        .then(function (err, data) {
            if (err) {
                console.log(err);
            }
            console.log("removed")
        });
    db.Outdoor.remove({ "saved": false })
        .then(function (err, data) {
            if (err) {
                console.log(err);
            }
            console.log("removed")
        });
    db.Entertainment.remove({ "saved": false })
        .then(function (err, data) {
            if (err) {
                console.log(err);
            }
            console.log("removed");
            res.redirect("/");
        });
});

// ///////SCRAPES///////////

app.get("/scrape-main", function (req, res) {

    axios.get("https://www.ksl.com/").then(function (response) {

        let $ = cheerio.load(response.data);

        $(".queue_story").each(function (i, element) {

            let result = {};

            result.title = $(this).find("h2").text();
            result.link = "https://www.ksl.com" + $(this).find("a").attr("href");
            result.body = $(this).find("h5").text();

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
        });
        res.send("Complete");
    });
})
app.get("/scrape-outdoor", function (req, res) {

    axios.get("https://www.ksl.com/news/outdoors").then(function (response) {

        let $ = cheerio.load(response.data);

        $(".queue_story").each(function (i, element) {

            let result = {};

            result.title = $(this).find("h2").text();
            result.link = "https://www.ksl.com/news/outdoors" + $(this).find("a").attr("href");
            result.body = $(this).find("h5").text();

            db.Outdoor.create(result)
                .then(function (dbOutdoor) {
                    console.log(dbOutdoor);
                })
                .catch(function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
        });
        res.send("Complete");
    });
})
app.get("/scrape-entertainment", function (req, res) {

    axios.get("https://www.ksl.com/news/entertainment").then(function (response) {

        let $ = cheerio.load(response.data);

        $(".queue_story").each(function (i, element) {

            let result = {};

            result.title = $(this).find("h2").text();
            result.link = "https://www.ksl.com/news/entertainment" + $(this).find("a").attr("href");
            result.body = $(this).find("h5").text();

            db.Entertainment.create(result)
                .then(function (dbEntertainment) {
                    console.log(dbEntertainment);
                })
                .catch(function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
        });
        res.send("Complete");
    });
})

app.get("/articles", function (req, res) {

    db.Article.find({})
        .then(function (dbArticle) {

            res.json(dbArticle);
        }).catch(function (err) {

            res.json(err);
        });
});

app.post("/articles/saved/:id", function (req, res) {

    db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
        .then(function (dbArticle) {

            res.send(dbArticle);
        })
        .catch(function (err) {
            if (err) {
                console.log(err);
            }
        });
});


//////  POST ROUTES /////









