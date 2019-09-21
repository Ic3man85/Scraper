let express = require('express');
let Article = require("../models/Article");
let cheerio = require('cheerio');
let axios = require('axios');

let router = express.Router();

router.get("/news", function (req, res) {

    Article.find({ "saved": false })
        .then(function (data) {

            let hbsObject = {
                article: data
            };
            console.log(hbsObject);
            res.render("news", hbsObject);
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

router.get("/news/:id", function (req, res) {

    Article.findOne({ "_id": req.params.id })
        
        .populate("note")
        .then(function (error, data) {
            
            if (error) {
                console.log(error);
            }
            else {
                res.json(data);
            }
        });
});
router.get("/api/news", function (req, res) {

    Article.find({saved: false })
        
        .populate("note")
        .then(function (error, data) {
            
            if (error) {
                console.log(error);
            }
            else {
                res.json(data);
            }
        });
});


router.post("/saved/:id", function (req, res) {

        Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
            .then(function (dbArticle) {
    
                res.send(dbArticle);
            })
            .catch(function (err) {
                if (err) {
                    console.log(err);
                }
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

router.get("/news/clear", function (req, res) {

    Article.remove({ "saved": false })
        .then(function (err, data) {
            if (err) {
                console.log(err);
            }
            console.log("removed")
        });
});

module.exports = router;