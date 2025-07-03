import { Router, Request, Response } from "express"
import MovieServices from "../services/MovieServices"
const MovieRouter = Router()


/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies
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
 * /movies/get-by-id/{id}:
 *   get:
 *     summary: Get all movies
*     parameters:
*      - name: id
*        in: path
*        description: Movie ID
*        required: true
 *     responses:
 *       200:
 *         description: List of movies
 *       404:
 *          description: No movie was founded with that ID
 */
MovieRouter.get('/get-by-id/:id', async (request: Request, response: Response) => {
    const id = request.params['id']
    const result = await MovieServices.getById(Number(id))
    response.send(JSON.stringify(result))
})

MovieRouter.get('/search', async(request: Request, response: Response) => {
    let params = request.query
    console.log(params)
    let result = await MovieServices.searchByName(params.name)
    response.send(result)
})

MovieRouter.post('/', async (request, response) => {
    const movieDTO = request.body
    const persistedMovie = await MovieServices.save(movieDTO)
    response.send(persistedMovie)
})



export default MovieRouter