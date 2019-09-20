let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let uniqueValidator = require('mongoose-unique-validator');

let OutdoorSchema = new Schema({
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

    saved: {
        type: Boolean,
        default: false
    },

    note: {
        type: Schema.Types.ObjectId,
        ref: "note"
    }
});

OutdoorSchema.plugin(uniqueValidator);

let Outdoor = mongoose.model("Outdoor", OutdoorSchema);

module.exports = Outdoor;