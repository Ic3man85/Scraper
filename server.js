let express = require('express');
let logger = require('morgan');
let mongoose = require('mongoose');
let Article = require('./models/Article');
let axios = require('axios');
let cheerio = require('cheerio');


let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/News";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

let PORT = 3000;

let app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(__dirname + "/public"));

let exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main",
}));
app.set("view engine", "handlebars");


app.get("/", function (req, res) {
    Article.find({ "saved": false }, function (error, data) {
        var hbsObject = {
            article: data
        };
        console.log(hbsObject);
        res.render("news", hbsObject);
    });
});

app.get("/saved", function (req, res) {
    Article.find({ "saved": true }).populate("note").exec(function (error, news) {
        var hbsObject = {
            article: news
        };
        res.render("saved", hbsObject);
    });
});

///////////////////////////ROUTES TO SCRAPE
app.get("/scrape-main", function (req, res) {
    axios.get("https://www.ksl.com/news/utah").then(function (response) {

        let $ = cheerio.load(response.data);

        $(".queue_story").each(function (i, element) {

            let result = {};

            result.title = $(this).find("h2").text();
            result.link = "https://www.ksl.com" + $(this).find("a").attr("href");
            result.body = $(this).find("h5").text();

            Article.create(result)
                .then(function (data) {
                    console.log(data);
                })
                .catch(function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
        });
   
        res.send("Scrape Complete");
    });
    res.redirect("/");
});


//////////ROUTE: CLEAR UNSAVED
app.get('/clear', function(req, res) {
    Article.remove({ saved: false}, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log('removed');
        }

    });
    res.redirect('/');
});

////////////////////Gets the JSON
app.get("/news", function (req, res) {
    // Grab every doc in the Articles array
    Article.find({}, function (error, data) {
        // Log any errors
        if (error) {
            console.log(error);
        }
        // Or send the data to the browser as a json object
        else {
            res.json(data);
        }
    });
});

///////////////////////ROUTE FOR AN ARTICLE
app.get("/news/:id", function (req, res) {

    Article.findOne({ "_id": req.params.id })
        //Populate note
        .populate("note")
        /////////////////////?????ASK MATT ABOUT .then vs .exec????
        .exec(function (error, data) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            else {
                res.json(data);
            }
        });
});


///////////////////////ROUTES TO SAVE
app.post("/news/saved/:id", function (req, res) {
    // Use the article id to find and update its saved boolean
    Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
        // Execute the above query
        .exec(function (err, data) {
            // Log any errors
            if (err) {
                console.log(err);
            }
            else {

                res.send(data);
            }
        });
});

//////////////////////////ROUTE TO DELETE
app.post("/news/delete/:id", function (req, res) {
    //Anything not saved
    Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false, "notes": [] })

        .exec(function (err, data) {
            // Log any errors
            if (err) {
                console.log(err);
            }
            else {
                res.send(data);
            }
        });
});


////////////////////////ROUTE FOR COMMENT
app.post("/notes/saved/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    var newNote = new Note({
        body: req.body.text,
        article: req.params.id
    });
    console.log(req.body)
    // And save the new note the db
    newNote.save(function (error, note) {

        if (error) {
            console.log(error);
        }
        else {
            Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "notes": note } })
                /////???EXEC VS THEN???
                .exec(function (err) {

                    if (err) {
                        console.log(err);
                        res.send(err);
                    }
                    else {
                        res.send(note);
                    }
                });
        }
    });
});

/////////////////////////ROUTE TO DELTE A NOTE
app.delete("/notes/delete/:note_id/:news_id", function (req, res) {
    // Use the note id to find and delete it
    Note.findOneAndRemove({ "_id": req.params.note_id }, function (err) {
        // Log any errors
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            Article.findOneAndUpdate({ "_id": req.params.article_id }, { $pull: { "notes": req.params.note_id } })
                // Execute the above query
                .exec(function (err) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    }
                    else {
                        res.send("Note Deleted");
                    }
                });
        }
    });
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT);
});