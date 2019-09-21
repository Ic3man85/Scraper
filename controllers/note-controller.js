let express = require('express');
let Note = require('../models/Note');
let Article = require('../models/Article')
let Outdoor = require('../models/Outdoor');
let Entertainment = require('../models/Entertainment');

let router = express.Router();

router.post("/notes/save/:id",function(req,res) {

    let newNote = new Note({
        body: req.body.text,
        article: req.params.id
    });
    console.log(req.body);

    newNote.save(function(err,note) {

        if(err) {
            console.log(err);
        }
        else {
            Article.findOneAndUpdate({"_id": req.params.id},{$push: {"notes": note }})
                .then(function(err) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        res.send(note);
                    }
                });
        }
    });

});

router.delete("/notes/delete/:note_id/:article_id", function(req,res) {

    Note.findOneAndRemove({ "_id": req.params.note_id}, function(err) {
        if (err) {
            
            res.send(err);
        }
        else {
            Article.findOneAndUpdate({"_id": req.params.article_id}, { $pull: {"notes": req.params.note_id}})
                .then(function(err) {
                    if (err) {
                        res.send(err);
                    }
                    else { 
                        res.send("Note Removed");
                    }
                }) 
        }
    })
})

