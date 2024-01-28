const User = require("../models/userModel");
const UserController = require("../controllers/userController");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

beforeEach(() => {
    jest.mock("../models/userModel");
});

describe("Register", () => {
    test("Register with correct informations", async () => {
        jest.spyOn(User.prototype, "save").mockResolvedValue({
            email: "hugo.vanhove@spotify.com",
            password: "Hugo123#",
            role: false
        });

        const req = {
            body: {
                email: "hugo.vanhove@spotify.com",
                password: "Hugo123#",
                role: false
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await UserController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: `Utilisateur enregistré avec succès`,
        });
    });

    test("Reject with incorrect Email", async () => {
        jest.spyOn(User.prototype, "save").mockResolvedValue({
            email: "hugo.vanhove@spotify.",
            password: "Hugo123#",
        });

        const req = {
            body: {
                email: "hugo.vanhove@spotify.",
                password: "Hugo123#",
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await UserController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: `Format d'email invalide`,
        });
    });

    test("Reject with incorrect Password", async () => {
        jest.spyOn(User.prototype, "save").mockResolvedValue({
            email: "hugo.vanhove@spotify.com",
            password: "1234567",
        });

        const req = {
            body: {
                email: "hugo.vanhove@spotify.com",
                password: "1234567",
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await UserController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: `Le mot de passe doit contenir au moins 8 caractères`,
        });
    });

    test("Handle error server", async () => {
        jest.spyOn(User.prototype, "save").mockRejectedValue(new Error());

        const req = {
            body: {
                email: "hugo.vanhove@spotify.com",
                password: "Hugo123#",
            },
        };
        
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await UserController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: `Une erreur s'est produite lors du traitement`,
        });
    });
});


describe("Login", () => {
    test("Login with correct informations", async () => {
        const hash = await bcrypt.hash("StrongPassword", 10);
        const user = { email: "hugo.vanhove@spotify.com", password: hash };

        jest.spyOn(User, "findOne").mockResolvedValue(user);
        jest.spyOn(jwt, "sign").mockResolvedValue("token");

        const req = {
            body: {
                email: "hugo.vanhove@spotify.com",
                password: "StrongPassword",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await UserController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ token: "token" });
    });

    test("Reject with incorrect Email", async () => {
        jest.spyOn(User, "findOne").mockResolvedValue(null);

        const req = {
            body: {
                email: "benjamin-franklin@spotify.com",
                password: "StrongPassword",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await UserController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Email ou mot de passe incorrect",
        });
    })

    test("Reject with incorrect Password", async () => {
        const hash = await bcrypt.hash("StrongPassword", 10);
        const user = { email: "root", password: hash };

        jest.spyOn(User, "findOne").mockResolvedValue(user);

        const req = {
            body: {
                email: "root",
                password: "root",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await UserController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: "Email ou mot de passe incorrect",
        });
    })

    test("Handle error server", async () => {
        jest.spyOn(User, "findOne").mockRejectedValue(new Error());

        const req = {
            body: {
                email: "root",
                password: "StrongPassword",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await UserController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Une erreur s'est produite lors du traitement",
        });
    })
});