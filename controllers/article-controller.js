let express = require('express');
let Article = require("../models/Article");
let cheerio = require('cheerio');
let axios = require('axios');

let router = express.Router();

router.get("/articles", function (req, res) {

    Article.find({ "saved": false })
        .then(function (data) {

            let hbsObject = {
                article: data
            };
            console.log(hbsObject);
            res.render("articles", hbsObject);
        });
});

router.get("/scrape-main", function (req, res) {

    axios.get("https://www.ksl.com/").then(function (response) {

        let $ = cheerio.load(response.data);

        $(".queue_story").each(function (i, element) {

            let result = {};

            result.title = $(this).find("h2").text();
            result.link = "https://www.ksl.com" + $(this).find("a").attr("href");
            result.body = $(this).find("h5").text();

            Article.create(result)
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
});

router.get("api/articles",function(req,res) {

    Article.find({"saved": false})
        .then(function(err,data) {
            if(err) {
                res.json(err);
            }
            res.send(data);
        });
});

router.get("/saved", function (req, res) {

    Article.find({ "saved": true })
        .populate("notes")
        .then(function (data) {
            let hbsObject = {
                article: data
            };
            console.log(hbsObject);
            res.render("saved", hbsObject);
        });
});

router.get("/clear", function (req, res) {

    Article.remove({ "saved": false })
        .then(function (err, data) {
            if (err) {
                console.log(err);
            }
            console.log("removed")
        });
});

module.exports = router;