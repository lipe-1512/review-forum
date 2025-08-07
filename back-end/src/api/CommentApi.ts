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
        console.log(comments)
        response.send(comments).status(200)
    }).catch((error) => {
        response.status(500).send({ 'message': 'Error fetching comments' })
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
            response.status(404).send({ 'message': 'No comments found' })
        } else {
            response.status(200).send(comments)
        }
    }).catch((err) => {
        console.error('Error fetching comment replies:', err)
        response.status(500).send({ 'message': 'Error fetching comment replies' })
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
            response.status(404).send({ 'message': 'Comment not found' })
        } else {
            response.status(200).send(comment)
        }
    }).catch((error) => {
        response.status(500).send({ 'message': 'Error fetching comment' })
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
 *               forum:
 *                 type: number
 *               username:
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
            response.status(400).send({ 'message': err.message })
        } else {
            response.status(500).send({ 'message': 'Error creating comment' })
        }
    })
})


/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Update a comment
 *     tags: [comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Bad request, validation error
 *       500:
 *         description: Internal server error
 */
commentRouter.put('/:id', async(request: Request, response:Response) => {
    const id = request.params.id
    const comment = request.body
    CommentService.update({id, ...comment}).then((updatedComment) => {
        response.status(200).send(updatedComment)
    }).catch((err) => {
        console.error(err)
        response.status(500).send({ 'message': `${err.message}` })
    })
})



export default commentRouter;