let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let uniqueValidator = require("mongoose-unique-validator");

let EntertainmentSchema = new Schema({
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

EntertainmentSchema.plugin(uniqueValidator);

let Entertainment = mongoose.model("Entertainment", EntertainmentSchema);

module.exports = Entertainment;
