const User = require("../models/userModel");
const Music = require("../models/musicModel");
const Vote = require("../models/voteModel");
const VoteController = require("../controllers/voteController");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

beforeEach(() => {
    jest.mock("../models/userModel");
});

describe("Create Vote", () => {
    test("Create a vote with correct informations", async () => {
        jest.spyOn(User, "findOne").mockResolvedValue({
            _id: "1",
            email: "hugo.vanhove@spotify.com",
            password: "Hugo123#",
            role: false
        });

        jest.spyOn(Music, "findOne").mockResolvedValue({
            _id: "1",
            title: "test",
            artist: "test",
            provider: "test",
            provider_id: "Hugo123#",
            preview: "test"
        });

        jest.spyOn(Vote, "findOne").mockResolvedValue(null);

    
        jest.spyOn(Vote.prototype, "save").mockResolvedValue({
            user_id: "1",
            music_id: "1",
            rating: 5
        });

        const req = {
            user: {
                id: "1"
            },
            params: {
                id: "1"
            },
            body: {
                rating: 5
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await VoteController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: `Vote enregistré avec succès`,
        });
    });

    test("Reject with incorrect rating", async () => {
        jest.spyOn(User, "findOne").mockResolvedValue({
            _id: "1",
            email: "hugo.vanhove@spotify.com",
            password: "Hugo123#",
            role: false
        });

        jest.spyOn(Music, "findOne").mockResolvedValue({
            _id: "1",
            title: "test",
            artist: "test",
            provider: "test",
            provider_id: "Hugo123#",
            preview: "test"
        });

        jest.spyOn(Vote, "findOne").mockResolvedValue(null);

        jest.spyOn(Vote.prototype, "save").mockResolvedValue({
            user_id: "1",
            music_id: "1",
            rating: 5
        });

        const req = {
            user: {
                id: "1"
            },
            params: {
                id: "1"
            },
            body: {
                rating: 6
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await VoteController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: `Note invalide`,
        });
    });

    test("Reject with non-existing music", async () => {
        jest.spyOn(User, "findOne").mockResolvedValue({
            _id: "1",
            email: "hugo.vanhove@spotify.com",
            password: "Hugo123#",
            role: false
        });

        jest.spyOn(Music, "findOne").mockResolvedValue(null);

        jest.spyOn(Vote, "findOne").mockResolvedValue(null);

        jest.spyOn(Vote.prototype, "save").mockResolvedValue({
            user_id: "1",
            music_id: "1",
            rating: 5
        });

        const req = {
            user: {
                id: "1"
            },
            params: {
                id: "1"
            },
            body: {
                rating: 5
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await VoteController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: `Musique non enregistrée`,
        });
    });

    test("Reject with non-existing user", async () => {
        jest.spyOn(User, "findOne").mockResolvedValue(null);

        jest.spyOn(Music, "findOne").mockResolvedValue({
            _id: "1",
            title: "test",
            artist: "test",
            provider: "test",
            provider_id: "Hugo123#",
            preview: "test"
        });

        jest.spyOn(Vote, "findOne").mockResolvedValue(null);

        jest.spyOn(Vote.prototype, "save").mockResolvedValue({
            user_id: "1",
            music_id: "1",
            rating: 5
        });

        const req = {
            user: {
                id: "1"
            },
            params: {
                id: "1"
            },
            body: {
                rating: 5
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await VoteController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: `Utilisateur non enregistré`,
        });
    });

    test("Reject with already existing vote", async () => {
        jest.spyOn(User, "findOne").mockResolvedValue({
            _id: "1",
            email: "hugo.vanhove@spotify.com",
            password: "Hugo123#",
            role: false
        }); 

        jest.spyOn(Music, "findOne").mockResolvedValue({
            _id: "1",
            title: "test",
            artist: "test",
            provider: "test",
            provider_id: "Hugo123#",
            preview: "test"
        });

        jest.spyOn(Vote, "findOne").mockResolvedValue({
            user_id: "1",
            music_id: "1",
            rating: 5
        });

        jest.spyOn(Vote.prototype, "save").mockResolvedValue({
            user_id: "1",
            music_id: "1",
            rating: 5
        });

        const req = {
            user: {
                id: "1"
            },
            params: {
                id: "1"
            },
            body: {
                rating: 5
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await VoteController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: `Vous avez déjà voté pour cette musique`,
        });
    });
});

describe("Get Votes", () => {
    test("Get votes with correct informations", async () => {
        const votes = [
            {
                user_id: "1",
                music_id: "1",
                rating: 5
            },
            {
                user_id: "2",
                music_id: "1",
                rating: 4
            }
        ];

        jest.spyOn(Vote, "find").mockResolvedValue(votes);

        const req = {
            params: {
                id: "1"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await VoteController.get(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            average: 4.5,
            votes: votes
        });
    });

    test("Reject with no id", async () => {
        const req = {
            params: {
                id: null
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await VoteController.get(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: `Merci de renseigner un identifiant de musique`,
        });
    });

    test("Reject with error", async () => {
        jest.spyOn(Vote, "find").mockRejectedValue(null);

        const req = {
            params: {
                id: "1"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await VoteController.get(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: `Une erreur s'est produite lors du traitement`,
        });
    });
});