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
    try {
        const result = await ForumService.getInstance().getAll();
        response.status(200).send(result);
    } catch (e: any) {
        response.status(500).send({ 'error': 'Internal server error' });
    }
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
 *         description: Forum created
 *       400:
 *         description: Bad request (e.g., missing title)
 */
forumRouter.post('/', async (request: Request, response: Response) => {
    const forumDTO = request.body;
    try {
        const result = await ForumService.getInstance().saveForum(forumDTO);
        // A versão correta é definir o status ANTES de enviar a resposta.
        response.status(201).send(result);
    } catch (e: any) {
        // Envia uma resposta de erro clara com o status 400.
        response.status(400).send({ 'fail': e.message });
    }
})


export default forumRouter;