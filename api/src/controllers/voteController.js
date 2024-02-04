const User = require("../models/userModel");
const Music = require("../models/musicModel");
const Vote = require("../models/voteModel");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

exports.create = async (req, res) => {
    try {
        if (!req.params.id) return res.status(400).json({ message: "Merci de renseigner un identifiant de musique" });
        if (!req.body.rating) return res.status(400).json({ message: "Merci de renseigner une note" });
        // check if id is already in database

        // get user
        const user = await User.findOne({ _id: req.user.id });
        if (!user) return res.status(400).json({ message: "Utilisateur non enregistré" });

        // check if user already voted for this music
        await Vote.findOne({ user_id: user.id, music_id: req.params.id }).then((vote) => {
            if (vote) return res.status(400).json({ message: "Vous avez déjà voté pour cette musique" });

            // can handle the update here
        });

        // check if music exists
        await Music.findOne({ provider_id: req.params.id }).then((music) => {
            if (!music) return res.status(400).json({ message: "Musique non enregistrée" });
        });

        // check if rating is valid
        if (req.body.rating < 1 || req.body.rating > 5) return res.status(400).json({ message: "Note invalide" });

        // set informations to save in database
        let newVote = new Vote({
            user_id: user._id,
            music_id: req.params.id,
            rating: req.body.rating
        });

        // save user in database & handle response
        newVote.save().then((vote) => {
            if (!vote) return res.status(500).json({ message: "Une erreur s'est produite lors du traitement" });
            return res.status(201).json({ message: "Vote enregistré avec succès" })
        })
    } catch (error) {
        return res.status(500).json({ message: "Une erreur s'est produite lors du traitement" });
    }
};

exports.get = async (req, res) => {
    try {
        if (!req.params.id) return res.status(400).json({ message: "Merci de renseigner un identifiant de musique" });

        // get music
        await Music.findOne({ provider_id: req.params.id }).then((music) => {
            if (!music) return res.status(400).json({ message: "Musique non enregistrée" });
        });

        // get votes
        const votes = await Vote.find({ music_id: req.params.id });

        // calculate average rating
        let total = 0;
        votes.forEach(vote => {
            total += vote.rating;
        });
        let average = total / votes.length;

        return res.status(200).json({ average: average, votes: votes });
    } catch (error) {
        return res.status(500).json({ message: "Une erreur s'est produite lors du traitement" });
    }
};