import { Router, Request, Response } from "express";
import MovieServices from "../services/MovieServices";

const MovieRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Endpoints para gerenciamento de filmes
 */

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: List of movies
 */
MovieRouter.get('/', async (request: Request, response: Response) => {
    try {
        const results = await MovieServices.getAll();
        response.status(200).send(results);
    } catch (error: any) {
        response.status(500).send({ message: "Erro ao buscar filmes." });
    }
});

/**
 * @swagger
 * /api/movies/get-by-id/{id}:
 *   get:
 *     summary: Get movie by ID
 *     tags: [Movies]
 *     parameters:
 *      - name: id
 *        in: path
 *        description: Movie ID
 *        required: true
 *        schema:
 *          type: integer
 *     responses:
 *       200:
 *         description: Desired movie
 *       404:
 *          description: No movie was found with that ID
 */
MovieRouter.get('/get-by-id/:id', async (request: Request, response: Response) => {
    try {
        const id = Number(request.params['id']);
        const result = await MovieServices.getById(id);
        if (result) {
            response.status(200).send(result);
        } else {
            response.status(404).send({ message: `Filme com ID ${id} não encontrado.` });
        }
    } catch (error: any) {
        response.status(500).send({ message: "Erro ao buscar filme por ID." });
    }
});

/**
 * @swagger
 * /api/movies/search:
 *   get:
 *     summary: Search for movies by title
 *     tags: [Movies]
 *     parameters:
 *      - name: name
 *        in: query
 *        type: string
 *        description: Search movies from their title
 *        required: true
 *     responses:
 *       200:
 *         description: List of movies with likely titles
 *       400:
 *         description: Query parameter 'name' is missing
 */
MovieRouter.get('/search', async(request: Request, response: Response) => {
    try {
        const queryName = request.query.name as string;
        if (!queryName) {
            return response.status(400).send({ message: "Parâmetro 'name' é obrigatório para a busca." });
        }
        const result = await MovieServices.searchByName(queryName);
        response.status(200).send(result);
    } catch (error: any) {
        response.status(500).send({ message: "Erro ao buscar filmes por nome." });
    }
});

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Create a movie
 *     tags: [Movies]
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
 *       201:
 *         description: Movie created
 *       400:
 *         description: Bad request (e.g., missing name)
 */
MovieRouter.post('/', async (request: Request, response: Response) => {
    try {
        const movieDTO = request.body;
        const persistedMovie = await MovieServices.add(movieDTO);
        response.status(201).send(persistedMovie);
    } catch (error: any) {
        response.status(400).send({ message: error.message });
    }
});

export default MovieRouter;