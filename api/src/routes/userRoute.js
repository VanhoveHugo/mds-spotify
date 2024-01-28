const userController = require("../controllers/userController");
/**
 * @swagger
 * definitions:
 *   schemas:
 *      User:
 *          type: object
 *          required:
 *              - email
 *              - password
 *              - role
 *          properties:
 *              email:
 *                  type: string
 *                  unique: true
 *                  description: The user's email address
 *              password:
 *                  type: string
 *                  description: The user's password
 *              role:
 *                  type: boolean
 *                  description: The user's role
 */
module.exports = (server) => {
    /**
     * @swagger
     * /users/register:
     *   post:
     *     summary: Register Method
     *     tags: [User]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/definitions/schemas/User'
     *     responses:
     *       201:
     *         description: Utilisateur enregistré avec succès
     *       400:
     *         description: Données invalides
     *       500:
     *         description: Une erreur s'est produite lors du traitement
     */
    server.post("/users/register", userController.register)

    /**
     * @swagger
     * /users/login:
     *   post:
     *     summary: Login Method
     *     tags: [User]
     *     requestBody:
     *       required: true
     *       content:
     *          application/json:
     *              schema:
     *                  $ref: '#/definitions/schemas/User'
     *     responses:
     *       200:
     *         description: Utilisateur connecté avec succès
     *       401:
     *         description: Email ou mot de passe incorrect
     *       500:
     *         description: Erreur serveur
     */
    server.post("/users/login", userController.login);
}