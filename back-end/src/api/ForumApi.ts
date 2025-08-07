import { Router, Request, Response } from "express";
import ForumService from "../services/ForumService";

const forumRouter = Router()


/**
 * @swagger
 * /api/forums/:
 *   get:
 *     summary: Get all forums
 *     tags: [forums]
 *     responses:
 *       200:
 *         description: List all forums
 */
forumRouter.get('/', async (request: Request, response: Response) => {
    let result = await ForumService.getAll()
    response.send(result)
})


/**
 * @swagger
 * /api/forums/{id}:
 *   get:
 *     summary: Search forums by ID
 *     tags: [forums]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fetch forum by ID
 *       404:
 *         description: Forum not found
 */
forumRouter.get('/:id', async (request: Request, response: Response) => {
    let id = parseInt(request.params.id)
    let result = await ForumService.getById(id)
    if (result) {
        response.send(result)
    } else {
        response.status(404).send({ message: "Forum not found" })
    }
})


/**
 * @swagger
 * /api/forums/search-by-title/{title}:
 *   get:
 *     summary: Search forums by title
 *     tags: [forums]
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List forums by title
 *       404:
 *         description: Forum not found
 */
forumRouter.get('/search-by-title/:title', async (request: Request, response: Response) => {
    let title = request.params.title
    let result = await ForumService.searchByTitle(title)
    if (result) {
        response.send(result)
    } else {
        response.status(404).send({ message: "Forum not found" })
    }
})


/**
 * @swagger
 * /api/forums/search-by-creator-user/{username}:
 *   get:
 *     summary: Search forums by creator username
 *     tags: [forums]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List forums by creator username
 *       404:
 *         description: Forum not found
 */
forumRouter.get('/search-by-creator-user/:username', async (request: Request, response: Response) => {
    let username = request.params.username
    let result = await ForumService.searchByCreatorUser(username)
    if (result) {
        response.send(result)
    } else {
        response.status(404).send({ message: "Forum not found" })
    }
})


/**
 * @swagger
 * /api/forums/:
 *   post:
 *     summary: Create a forum
 *     tags: [forums]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                  type: string
 *               username:
 *                  type: string
 *               movieId:
 *                  type: number
 *     responses:
 *       201:
 *         description: Movie created
 */
forumRouter.post('/', async (request: Request, response: Response) => {
    let forumDTO = request.body
    let result = ForumService.saveForum(forumDTO).then((result) => {
        console.log(result)
        response.status(201).send(result)
    }).catch((e) => {
        console.error(e)
        response.status(400).send({'message': e.message})
    })
})


/**
 * @swagger
 * /api/forums/{id}:
 *   put:
 *     summary: Update a forum 
 *     tags: [forums]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Forum updated successfully
 *       404:
 *         description: Forum not found
 *       400:
 *         description: Bad request
 */
forumRouter.put('/:id', async (request: Request, response: Response) => {
    let id = parseInt(request.params.id)
    let forumDTO = request.body
    let result = await ForumService.updateForum({ ...forumDTO, id })
    if (result) {
        response.send(result)
    } else {
        response.status(404).send({ message: "Forum not found" })
    }
})

export default forumRouter