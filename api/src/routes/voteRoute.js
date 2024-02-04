const voteController = require("../controllers/voteController");
const { verifyToken } = require("../middlewares/tokenMiddlewares");

module.exports = (server) => {
    server.post("/votes/:id", verifyToken, voteController.create)
    server.get("/votes/:id", voteController.get)
}