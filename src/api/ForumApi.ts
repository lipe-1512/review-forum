import { Router, Request, Response } from "express";
import ForumService from "../services/ForumService";

const forumRouter = Router()



forumRouter.get('/', async (request: Request, response: Response) => {
    let result = await ForumService.getInstance().getAll()

    response.send(result)
})

forumRouter.post('/', async (request: Request, response: Response) => {
    let forumDTO = request.body
    let result = await ForumService.getInstance().saveForum(forumDTO)
    response.send(result)
})


export default forumRouter