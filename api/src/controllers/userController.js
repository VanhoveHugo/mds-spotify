const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
    try {
        if(!req.body) return res.status(400).json({message: "Données invalides"});
        if(!req.body.email 
        || !req.body.password) return res.status(400).json({message: "Données invalides"});

        // check if user already exists
        
        // check if email is valid with regex
        const regex = /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;
        if(!regex.test(req.body.email)) return res.status(400).json({message: "Format d'email invalide"});

        // check if password is strong enough 8 characters
        if(req.body.password.length < 8) return res.status(400).json({message: "Le mot de passe doit contenir au moins 8 caractères"});

        // hash password with bcrypt
        let hash = await bcrypt.hash(req.body.password, 10);
        
        // set informations to save in database
        let newUser = new User(
            {
                email: req.body.email,
                password: hash,
                role: false
            }
        );

        // save user in database & handle response
        await newUser.save().then((user) => {
            if(!user || user.length === 0) return res.status(500).json({message: "Une erreur s'est produite lors du traitement"});
            return res.status(201).json({message: "Utilisateur enregistré avec succès"})
        })
    } catch (error) {
        return res.status(500).json({message: "Une erreur s'est produite lors du traitement"});
    }
}

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(500).json({message: "Email ou mot de passe incorrect"});

        const valid = await bcrypt.compare(req.body.password, user.password);
        if(user.email === req.body.email && valid) {
            const userData = {
                id: user._id, 
                email: user.email,
                role: user.role === true ? "admin" : "user"
            };
            const token = await jwt.sign(userData, process.env.JWT_KEY || "StR0ngP4SsW@rd!", { expiresIn: "10h"});
            req.headers.authorization = token;
            req.user = userData;
            res.status(200).json({token});
        } else {
            return res.status(401).json({message: "Email ou mot de passe incorrect"});
        }
    } catch (error) {
        return res.status(500).json({message: "Une erreur s'est produite lors du traitement"});
    }
};