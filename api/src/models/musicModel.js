const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let musicSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    provider: {
        type: String,
        required: true
    },
    provider_id: {
        type: String,
        required: true,
        unique: true
    },
    preview: {
        type: String
    },
});

module.exports = mongoose.model('Music', musicSchema);