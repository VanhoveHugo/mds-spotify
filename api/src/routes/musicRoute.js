const musicController = require("../controllers/musicController");
/**
 * @swagger
 * definitions:
 *   schemas:
 *      Music:
 *          type: object
 *          required:
 *              - title
 *              - artist
 *              - provider
 *              - provider_id
 *          properties:
 *              title:
 *                  type: string
 *                  description: The music's title ( Auto generated )
 *              artist:
 *                  type: string
 *                  description: The music's artist(s) ( Auto generated )
 *              provider:
 *                  type: string
 *                  description: The music's provider ( Auto generated )
 *              provider_id:
 *                  type: string
 *                  description: The id of the music ( spotify, deezer & youtube )
 *              preview:
 *                  type: string
 *                  description: The music's preview url ( Auto generated if provider given  )
 */

module.exports = (server) => {
    /**
     * @swagger
     * /musics/{id}:
     *   post:
     *     summary: Create Method
     *     tags: [Music]
     *     parameters:
     *       - name: id
     *         in: query
     *         description: The music's id ( spotify, deezer & youtube )
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       201:
     *         description: Musique enregistrée avec succès
     *       400:
     *         description: Identifiant Spotify invalide
     *       409:
     *         description: Musique déjà enregistrée
     *       500:
     *         description: Une erreur s'est produite lors du traitement
     */
    server.post("/musics/:id", musicController.create)

    /**
     * @swagger
     * /musics/{id}:
     *   get:
     *     summary: Get Method
     *     tags: [Music]
     *     parameters:
     *       - in: path
     *         name: id
     *         description: The music's id ( spotify, deezer & youtube )
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       201:
     *         description: JSON de la musique
     *       400:
     *         description: Musique non enregistrée
     *       500:
     *         description: Une erreur s'est produite lors du traitement
     */
    server.get("/musics/:id", musicController.get)
}