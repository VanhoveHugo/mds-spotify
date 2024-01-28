const Music = require("../models/musicModel");
const MusicController = require("../controllers/musicController");

beforeEach(() => {
    jest.mock("../models/musicModel");
});

describe("Create Music", () => {
    test("Can't create music without id", async () => {
        const req = {
            params: {
                id: null
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await MusicController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: `Merci de renseigner un identifiant de musique`,
        });
    });

    test("Can't create music with existing id", async () => {
        jest.spyOn(Music, "findOne").mockResolvedValue({});

        const req = {
            params: {
                id: "Hugo123#"
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await MusicController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: `Musique déjà enregistrée`,
        });
    });
});


describe("Get Music", () => {
    test("Get existing music", async () => {
        const music = {
            title: "test",
            artist: "test",
            provider: "test",
            provider_id: "Hugo123#",
            preview: "test"
        }

        jest.spyOn(Music, "findOne").mockResolvedValue(music);

        const req = {
            params: {
                id: "Hugo123#"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await MusicController.get(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            title: "test",
            artist: "test",
            provider: "test",
            provider_id: "Hugo123#",
            preview: "test"
        });
    });

    test("Get non-existing music", async () => {
        jest.spyOn(Music, "findOne").mockResolvedValue(null);

        const req = {
            params: {
                id: "Hugo123#"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await MusicController.get(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Musique non enregistrée"});
    });

    test("Get music with no id", async () => {
        const req = {
            params: {
                id: null
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await MusicController.get(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Merci de renseigner un identifiant de musique"});
    });
});