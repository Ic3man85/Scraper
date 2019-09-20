let express = require('express');
let Entertainment = require("../models/Entertainment");
let cheerio = require('cheerio');
let axios = require('axios');

let router = express.Router();

router.get("/entertainment", function (req, res) {

    Entertainment.find({ "saved": false })
        .then(function (data) {

            let hbsObject = {
                article: data
            };
            console.log(hbsObject);
            res.render("entertainment", hbsObject);
        });
});

router.get("/scrape-entertainment", function (req, res) {

    axios.get("https://www.ksl.com/news/entertainment").then(function (response) {

        let $ = cheerio.load(response.data);

        $(".queue_story").each(function (i, element) {

            let result = {};

            result.title = $(this).find("h2").text();
            result.link = "https://www.ksl.com" + $(this).find("a").attr("href");
            result.body = $(this).find("h5").text();

            Entertainment.create(result)
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
});

router.post("/saved/:id", function (req, res) {

        Entertainment.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
            .then(function (dbEntertainment) {
    
                res.send(dbEntertainment);
            })
            .catch(function (err) {
                if (err) {
                    console.log(err);
                }
            });
    });
    

router.get("/saved", function (req, res) {

    Entertainment.find({ "saved": true })
        .populate("notes")
        .then(function (data) {
            let hbsObject = {
                article: data
            };
            console.log(hbsObject);
            res.render("saved", hbsObject);
        });
});

router.get("/entertainment/clear", function (req, res) {

    Entertainment.remove({ "saved": false })
        .then(function (err, data) {
            if (err) {
                console.log(err);
            }
            console.log("removed")
        });
});

module.exports = router;