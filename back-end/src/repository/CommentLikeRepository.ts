import { AppDataSource } from "../infra/setup_db";
import { CommentLike } from "../models/CommentLike";

export const CommentLikeRepository = AppDataSource.getRepository(CommentLike);
