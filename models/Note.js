let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let NoteSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    body: {
        type: String
    }
});

let Note = mongoose.model("Note", NoteSchema);

module.exports = Note;