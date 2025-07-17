import { Router, Request, Response } from "express";
import ForumService from "../services/ForumService";

const forumRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Forums
 *   description: Endpoints para gerenciamento de fóruns
 */

/**
 * @swagger
 * /api/forums/:
 *   get:
 *     summary: Get all forums
 *     tags: [Forums]
 *     responses:
 *       200:
 *         description: List all forums
 */
forumRouter.get('/', async (request: Request, response: Response) => {
    try {
        const result = await ForumService.getInstance().getAll();
        response.status(200).send(result);
    } catch (e: any) {
        response.status(500).send({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/forums/{id}:
 *   get:
 *     summary: Search forums by ID
 *     tags: [Forums]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fetch forum by ID
 *       404:
 *         description: Forum not found
 */
forumRouter.get('/:id', async (request: Request, response: Response) => {
    try {
        const id = parseInt(request.params.id);
        const result = await ForumService.getInstance().getById(id);
        if (result) {
            response.status(200).send(result);
        } else {
            response.status(404).send({ message: "Forum not found" });
        }
    } catch (e: any) {
        response.status(500).send({ error: 'Error fetching forum by ID' });
    }
});

/**
 * @swagger
 * /api/forums/search-by-title/{title}:
 *   get:
 *     summary: Search forums by title
 *     tags: [Forums]
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List forums by title
 */
forumRouter.get('/search-by-title/:title', async (request: Request, response: Response) => {
    try {
        const title = request.params.title;
        const result = await ForumService.getInstance().searchByTitle(title);
        response.status(200).send(result);
    } catch (e: any) {
        response.status(500).send({ error: 'Error searching forums by title' });
    }
});

/**
 * @swagger
 * /api/forums/search-by-creator-user/{username}:
 *   get:
 *     summary: Search forums by creator username
 *     tags: [Forums]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List forums by creator username
 */
forumRouter.get('/search-by-creator-user/:username', async (request: Request, response: Response) => {
    try {
        const username = request.params.username;
        const result = await ForumService.getInstance().searchByCreatorUser(username);
        response.status(200).send(result);
    } catch (e: any) {
        response.status(500).send({ error: 'Error searching forums by creator' });
    }
});

/**
 * @swagger
 * /api/forums/:
 *   post:
 *     summary: Create a forum
 *     tags: [Forums]
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
 *         description: Bad request (e.g., missing title or invalid movieId)
 */
forumRouter.post('/', async (request: Request, response: Response) => {
    const forumDTO = request.body;
    try {
        const result = await ForumService.getInstance().saveForum(forumDTO);
        response.status(201).send(result);
    } catch (e: any) {
        response.status(400).send({ fail: e.message });
    }
});

/**
 * @swagger
 * /api/forums/{id}:
 *   put:
 *     summary: Update a forum 
 *     tags: [Forums]
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
    try {
        const id = parseInt(request.params.id);
        const forumDTO = request.body;
        // A lógica de update precisará ser implementada no service
        // const result = await ForumService.getInstance().updateForum({ ...forumDTO, id });
        // if (result) {
        //     response.status(200).send(result);
        // } else {
        //     response.status(404).send({ message: "Forum not found" });
        // }
        // Placeholder até a implementação do service:
        response.status(501).send({ message: "Update not implemented yet" });
    } catch (e: any) {
        response.status(400).send({ error: e.message });
    }
});

export default forumRouter;