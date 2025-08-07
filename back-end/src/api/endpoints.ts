import commentRouter from "./CommentApi";
import forumRouter from "./ForumApi";
import MovieRouter from "./MovieApi";
import { Router } from "express";
import userRoutes from "./UserApi";
import reviewRoutes from "./ReviewApi";
import userListRoutes from "./UserListApi";
import notificationRoutes from "./NotificationApi";

const endpointsRouter = Router();   

endpointsRouter.use('/movies', MovieRouter)
endpointsRouter.use('/forums', forumRouter)
endpointsRouter.use('/comments', commentRouter)
endpointsRouter.use('/users', userRoutes)
endpointsRouter.use('/reviews', reviewRoutes)
endpointsRouter.use('/lists', userListRoutes)
endpointsRouter.use('/notifications', notificationRoutes)

export default endpointsRouter