const musicController = require("../controllers/musicController");

module.exports = (server) => {
    server.post("/musics/:id", musicController.create)
    server.get("/musics/:id", musicController.get)
}