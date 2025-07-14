import { AppDataSource } from "../infra/setup_db";
import Comment from "../models/Comment";

export default class CommentRepository {
  
    private static commentRepo = AppDataSource.getRepository(Comment);


    static async getByForum(forumId) {
        return this.commentRepo.find({
            where: {
                forumId: forumId
            }
        })
    }

    static async getByCommentReference(commentReferenceId) {
        return this.commentRepo.find({
            where: {
                replyToCommentId: commentReferenceId
            }
        })
    }

    static async save(comment) {
        return this.commentRepo.save(comment)
    }

    static async getById(id) {
        return this.commentRepo.findOneBy({
            id
        })
    }

}