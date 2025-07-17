import { Router, Request, Response } from "express";
import CommentService from "../services/CommentService";

let commentRouter = Router()

/**
 * @swagger
 * /api/comments/get-by-forum/{id}:
 *   get:
 *     summary: Get comments by forum ID
 *     tags: [comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of comments for the specified forum
 */
commentRouter.get('/get-by-forum/:id', async(request: Request, response:Response) => {
    const forumId = request.params.id
    CommentService.getByForum(forumId).then((comments) => {
        response.send(comments).status(200)
    }).catch((error) => {
        response.status(500).send({ error: 'Error fetching comments' })
    })
})



/**
 * @swagger
 * /api/comments/get-by-referenced-comment/{commentId}:
 *   get:
 *     summary: Get comments by referenced comment ID
 *     tags: [comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Find a comment by its ID
 *       404:
 *        description: Comment not found
 *       500:
 *         description: Internal server error
 */
commentRouter.get('/get-by-referenced-comment/:commentId', async (request: Request, response: Response) => {
    const commentReference = request.params.commentId
    CommentService.getCommentReplies(commentReference).then((comments) => {
        if (!comments || comments.length == 0) {
            response.status(404).send({ error: 'No comments found' })
        } else {
            response.status(200).send(comments)
        }
    }).catch((err) => {
        console.error('Error fetching comment replies:', err)
        response.status(500).send({ error: 'Error fetching comment replies' })
    })
})




/**
* @swagger
* /api/comments/get-by-id/{id}:
*   get:
*     summary: Get a comment by ID
*     tags: [comments]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: number
*     responses:
*       200:
*         description: Comment found
*       404:
*         description: Comment not found
*       500:
*         description: Internal server error
*/
commentRouter.get('/get-by-id/:id', async (request: Request, response:Response) => {

    const id = request.params.id

    CommentService.getById(id).then((comment) => {
        if (!comment) {
            response.status(404).send({ error: 'Comment not found' })
        } else {
            response.status(200).send(comment)
        }
    }).catch((error) => {
        response.status(500).send({ error: 'Error fetching comment' })
    })
})



/**
 * @swagger
 * /api/comments/:
 *   post:
 *     summary: Create a comment
 *     tags: [comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               forumId:
 *                 type: number
 *               usernameAuthor:
 *                 type: string
 *               replyToCommentId:
 *                 type: number
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Bad request, validation error
 *       500:
 *         description: Internal server error
 */
commentRouter.post('/', async(request: Request, response:Response) => {
    const comment = request.body

    CommentService.add(comment).then((savedComment) => {
        response.status(201).send(savedComment)
    }).catch((err) => {
        if (err.message) {
            response.status(400).send({ error: err.message })
        } else {
            response.status(500).send({ error: 'Error creating comment' })
        }
    })
})



export default commentRouter;