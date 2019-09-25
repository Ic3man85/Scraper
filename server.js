let express = require('express');
let logger = require('morgan');
let mongoose = require('mongoose');
let Article = require('./models/Article');
let Note = require('./models/Note');
let axios = require('axios');
let cheerio = require('cheerio');


let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

var PORT = process.env.PORT || 3000;

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
                })
        })

        res.send("/");
    });
});


app.get('/clear', function (req, res) {
    Article.remove({ saved: false }, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log('removed');
        }

    });
    res.redirect('/');
});

app.get("/news", function (req, res) {
    Article.find({}, function (error, data) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(data);
        }
    });
});

app.get("/news/:id", function (req, res) {

    Article.findOne({ "_id": req.params.id })
        .populate("note")
        .exec(function (error, data) {
            if (error) {
                console.log(error);
            }
            else {
                res.json(data);
            }
        });
});


app.post("/news/saved/:id", function (req, res) {
    Article.findByIdAndUpdate({ "_id": req.params.id }, { "saved": true })
        .exec(function (err, data) {
            if (err) {
                console.log(err);
            }
            else {

                res.send(data);
            }
        });
});

app.post("/news/delete/:id", function (req, res) {
    Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false, "notes": [] })

        .exec(function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                res.send(data);
            }
        });
});


app.post("/notes/saved/:id", function (req, res) {
    var newNote = new Note({
        body: req.body.text,
        article: req.params.id
    });
    console.log(req.body)
    newNote.save(function (error, data) {

        if (error) {
            console.log(error);
        }
        else {
            Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "notes": data } })
                .exec(function (err) {

                    if (err) {
                        console.log(err);
                        res.send(err);
                    }
                    else {
                        res.send(data);
                    }
                });
        }
    });
});

app.delete("/notes/delete/:note_id/:news_id", function (req, res) {
    Note.findOneAndRemove({ "_id": req.params.note_id }, function (err) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            Article.findOneAndUpdate({ "_id": req.params.article_id }, { $pull: { "notes": req.params.note_id } })
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

app.set('port', PORT);
app.listen(app.get('port'), function() {
 console.log("listening to Port", app.get("port"));
});

// app.listen(PORT, function () {
//     console.log("App running on port " + PORT);
// });