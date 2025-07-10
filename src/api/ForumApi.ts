import { Router, Request, Response } from "express";
import ForumService from "../services/ForumService";

const forumRouter = Router()


/**
 * @swagger
 * /api/forums/:
 *   get:
 *     summary: Get all forums
 *     responses:
 *       200:
 *         description: List all forums
 */
forumRouter.get('/', async (request: Request, response: Response) => {
    let result = await ForumService.getInstance().getAll()

    response.send(result)
})


/**
 * @swagger
 * /api/forums/:
 *   post:
 *     summary: Create a forum
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
    let result = ForumService.getInstance().saveForum(forumDTO).then((result) => {
        response.send(result).status(201)
    }).catch((e) => {
        response.send({'fail': e.message}).status(400)
    })
})


export default forumRouter