import { Router } from "express";
import commentRouter from "./CommentApi";
import forumRouter from "./ForumApi";
import movieRouter from "./MovieApi";
import userRoutes from "./routes/user.routes"; // Sua rota de usuário

const endpointsRouter = Router();

endpointsRouter.use('/movies', movieRouter);
endpointsRouter.use('/forums', forumRouter);
endpointsRouter.use('/comments', commentRouter);
endpointsRouter.use('/users', userRoutes); // Rota de usuário adicionada

export default endpointsRouter;