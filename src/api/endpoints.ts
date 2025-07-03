import forumRouter from "./ForumApi";
import MovieRouter from "./MovieApi";
import { Router } from "express";

const endpointsRouter = Router()

endpointsRouter.use('/movies', MovieRouter)
endpointsRouter.use('/forums', forumRouter)


export default endpointsRouter