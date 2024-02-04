const voteController = require("../controllers/voteController");
const { verifyToken } = require("../middlewares/tokenMiddlewares");
/**
 * @swagger
 * definitions:
 *   schemas:
 *      Vote:
 *          type: object
 *          required:
 *              - rating
 *              - vote_date
 *          properties:
 *              user_id:
 *                  type: string
 *                  description: The user's id
 *              music_id:
 *                  type: string
 *                  description: The music's id
 *              rating:
 *                  type: number
 *                  description: The rating of the music ( 1 to 5 )
 *              vote_date:
 *                  type: date
 *                  description: The date of the vote
 */

module.exports = (server) => {
     /**
     * @swagger
     * /votes/{id}:
     *   post:
     *     summary: Add a vote
     *     tags: [Vote]
     *     parameters:
     *       - name: id
     *         in: path
     *         description: The music's id ( spotify, deezer & youtube )
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *          application/x-www-form-urlencoded:
     *              schema:
     *                  type: object
     *                  properties:
     *                     rating:
     *                        type: number
     *                        description: The rating of the music ( 1 to 5 )
     *       security:
     *          - Authorization: []
     * 
     *     responses:
     *       201:
     *         description: Vote enregistré avec succès
     *       400:
     *         description: Merci de renseigner un identifiant de musique
     *       500:
     *         description: Une erreur s'est produite lors du traitement
     */
    server.post("/votes/:id", verifyToken, voteController.create)

     /**
     * @swagger
     * /votes/{id}:
     *   get:
     *     summary: Get a vote
     *     tags: [Vote]
     *     parameters:
     *       - name: id
     *         in: path
     *         description: The music's id ( spotify, deezer & youtube )
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: JSON with average rating and votes
     *       400:
     *         description: Merci de renseigner un identifiant de musique
     *       500:
     *         description: Une erreur s'est produite lors du traitement
     */
    server.get("/votes/:id", voteController.get)
}