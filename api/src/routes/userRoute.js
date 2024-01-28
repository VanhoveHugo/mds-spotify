const userController = require("../controllers/userController");

module.exports = (server) => {
    server
    .post("/users/register", userController.register)
    .post("/users/login", userController.login);
}