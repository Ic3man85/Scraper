let mongoose = require('mongoose');

let Schema = mongoose.Schema;

var uniqueValidator = require('mongoose-unique-validator');

let ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    
    link: {
        type: String
    },

    body: {
        type: String
    },

    note: {
        type: Schema.Types.ObjectId,
        ref: "note"
    } 
});

ArticleSchema.plugin(uniqueValidator);

let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;