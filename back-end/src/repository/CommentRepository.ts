import { AppDataSource } from "../infra/setup_db";
import Comment from "../models/Comment";

export default class CommentRepository {
  
    private static commentRepo = AppDataSource.getRepository(Comment);


    static async getByForum(forumId) {
        return this.commentRepo.createQueryBuilder("comment").where(`comment.forum = ${forumId}`).orderBy('comment.modified_at', 'DESC').getMany()
    }

    static async getByCommentReference(commentReferenceId) {
        return this.commentRepo.createQueryBuilder("comment").where(`comment.replyToCommentId = ${commentReferenceId}`).orderBy('comment.modified_at', 'DESC').getMany()
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