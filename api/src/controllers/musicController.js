const Music = require("../models/musicModel");
const fetch = require("node-fetch");

exports.create = async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).json({message: "Merci de renseigner un identifiant de musique"});

        // check if id is already in database
        Music.findOne({provider_id: req.params.id}).then((music) => {
            if(music) return res.status(400).json({message: "Musique déjà enregistrée"});
        });

        // set authorization header
        let Auth = "Bearer " + process.env.SPOTIFY_TOKEN;

        // check if spotify id is valid with request to spotify api
        fetch("https://api.spotify.com/v1/tracks/" + req.params.id, { method: "GET", headers: { "Authorization": Auth }})
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if(data.error) return res.status(400).json({message: "Identifiant Spotify invalide"});
                // set informations to save in database
                let newMusic = new Music({
                    title: data.name,
                    artist: data.artists[0].name,
                    provider: "spotify",
                    provider_id: req.params.id,
                    preview: data.preview_url
                });
                // save user in database & handle response
                newMusic.save().then((user) => {
                    if(!user || user.length === 0) return res.status(500).json({message: "Une erreur s'est produite lors du traitement"});
                    return res.status(201).json({message: "Musique enregistrée avec succès"})
                })
            })
            .catch(error => {
                return res.status(500).json({message: "Une erreur s'est produite lors du traitement"});
            })
    } catch (error) {
        return res.status(500).json({message: "Une erreur s'est produite lors du traitement"});
    }
};

exports.get = async (req, res) => {
    try {
        if(!req.params.id) return res.status(400).json({message: "Merci de renseigner un identifiant de musique"});

        Music.findOne({provider_id: req.params.id}).then((music) => {
            if(!music) return res.status(400).json({message: "Musique non enregistrée"});
            return res.status(200).json(music);
        });
    } catch (error) {
        return res.status(500).json({message: "Une erreur s'est produite lors du traitement"});
    }
};