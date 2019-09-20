let express = require('express');
let Outdoor = require("../models/Outdoor");
let cheerio = require('cheerio');
let axios = require('axios');

let router = express.Router();

router.get("/outdoor", function (req, res) {

    Outdoor.find({ "saved": false })
        .then(function (data) {

            let hbsObject = {
                article: data
            };
            console.log(hbsObject);
            res.render("outdoor", hbsObject);
        });
});

router.get("/scrape-outdoor", function (req, res) {

    axios.get("https://www.ksl.com/").then(function (response) {

        let $ = cheerio.load(response.data);

        $(".queue_story").each(function (i, element) {

            let result = {};

            result.title = $(this).find("h2").text();
            result.link = "https://www.ksl.com" + $(this).find("a").attr("href");
            result.body = $(this).find("h5").text();

            Outdoor.create(result)
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
});

router.get("api/outdoor",function(req,res) {

    Outdoor.find({"saved": false})
        .then(function(err,data) {
            if(err) {
                res.json(err);
            }
            res.send(data);
        });
});

router.get("/saved", function (req, res) {

    Outdoor.find({ "saved": true })
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

    Outdoor.remove({ "saved": false })
        .then(function (err, data) {
            if (err) {
                console.log(err);
            }
            console.log("removed")
        });
});

module.exports = router;