let express = require('express');
let logger = require('morgan');
let mongoose = require('mongoose');

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/sportNews";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

let PORT = 3000;

let app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + "/public"));

let exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

let main = require("./controllers/news-controller");
let outdoor = require("./controllers/outdoor-controller");
let entertain = require("./controllers/entertainment-controller");


app.get("/",function(req,res) {
    res.render("index");
})

app.use("/", main);
app.use("/", outdoor);
app.use("/", entertain);



app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
