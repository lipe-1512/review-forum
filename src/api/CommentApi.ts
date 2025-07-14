import { Router, Request, Response } from "express";
import CommentService from "../services/CommentService";

let commentRouter = Router()


commentRouter.get('/get-by-forum/{id}', async(request: Request, response:Response) => {
    const forumId = request.params.id

    CommentService.getByForum(forumId).then((comments) => {

        response.send(JSON.stringify(comments)).status(200)
    }).catch((error) {

    })
})


commentRouter.post('/', async(request: Request, response:Response) => {

    const comment = request.body

    CommentService.add(comment).then((savedComment) => {

    }).catch((err) => {

    })

})

commentRouter.get('/get-by-referenced-comment/{commentId}', async (request: Request, response:Response) => {

    const commentReference = request.params.commentId

    CommentService.getByCommentReference(commentReference).then((comments) => {
        response.status(200).send(JSON.stringify(comments))
    }).catch((err) => {

    })
})


commentRouter.get('/get-by-id/{id}', async (request: Request, response:Response) => {

    const id = request.params.id

    CommentService.getById(id).then((comment) => {
        response.send(comment).status(200)
    }).catch((error) => {
        
    })
})



