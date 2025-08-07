import { Router, Request, Response } from "express"
import MovieServices from "../services/MovieServices"
const MovieRouter = Router()


/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all movies
 *     tags: [movies]
 *     responses:
 *       200:
 *         description: List of movies
 */
MovieRouter.get('/', async (request, response) => {
    const results = await MovieServices.getAll()
    response.send(results)
})

/**
 * @swagger
 * /api/movies/get-by-id/{id}:
 *   get:
 *     summary: Get all movies
 *     tags: [movies]
 *     parameters:
 *      - name: id
 *        in: path
 *        description: Movie ID
 *        required: true
 *     responses:
 *       200:
 *         description: Desired movie
 *       404:
 *          description: No movie was founded with that ID
 */
MovieRouter.get('/get-by-id/:id', async (request: Request, response: Response) => {
    const id = request.params['id']
    const result = await MovieServices.getById(parseInt(id))
    response.send(JSON.stringify(result))
})

/**
 * @swagger
 * /api/movies/search/:
 *   get:
 *     summary: Get all movies
 *     tags: [movies]
 *     parameters:
 *      - name: name
 *        in: query
 *        type: string
 *        description: Search movies from their title
*        required: false
 *     responses:
 *       200:
 *         description: List of movies with likely titles
 *       404:
 *          description: No movie was founded with that title
 */
MovieRouter.get('/search', async(request: Request, response: Response) => {
    let params = request.query
    let result = await MovieServices.searchByName(params.name)
    response.send(result)
})


/**
 * @swagger
 * /api/movies/:
 *   post:
 *     summary: Create a movie
 *     tags: [movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movie created
 */
MovieRouter.post('/', async (request, response) => {
    const movieDTO = request.body
    const persistedMovie = await MovieServices.add(movieDTO)
    response.send(persistedMovie)
})



export default MovieRouter