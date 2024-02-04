const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let voteSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        ref: "User"
    },
    music_id: {
        type: String,
        required: true,
        ref: "Music"
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    vote_date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Vote', voteSchema);