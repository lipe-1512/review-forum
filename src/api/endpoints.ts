import { Router } from "express";
import commentRouter from "./CommentApi";
import forumRouter from "./ForumApi";
import movieRouter from "./MovieApi";
import userRoutes from "./routes/user.routes";

const endpointsRouter = Router();

endpointsRouter.use('/movies', movieRouter);
endpointsRouter.use('/forums', forumRouter);
endpointsRouter.use('/comments', commentRouter);
endpointsRouter.use('/users', userRoutes);

export default endpointsRouter;