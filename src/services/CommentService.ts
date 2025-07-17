import Comment from "../models/Comment";
import CommentRepository from "../repository/CommentRepository";
import ForumService from "./ForumService";


export default class CommentService {

    static async getByForum(forumId) {
        return CommentRepository.getByForum(forumId)
    }

    static async getCommentReplies(commentReferenceId) {
        return CommentRepository.getByCommentReference(commentReferenceId)
    }

    static async validate(comment) {
        if (!comment.content) {
            throw new Error('Conteúdo é obrigatório')
        }

        if (!comment.usernameAuthor) {
            throw new Error('Nome de usuário do autor é obrigatório')
        }

        if (!comment.forum) {
            throw new Error('Fórum é obrigatório')
        }
        
        let forum = await ForumService.getById(comment.forumId)

        if (!forum) {
            throw new Error('Fórum não encontrado')
        }

        if (comment.replyToCommentId) {
            const referencedComment = await CommentRepository.getById(comment.replyToCommentId);
            if (!referencedComment) {
                throw new Error('Comentário de referência não encontrado')
            }
        }

        //TODO CREATE VALIDATE TESTS SCENARIOS
    }

    static async add(comment) {
        await this.validate(comment)
        return CommentRepository.save(comment)
    }

    static async getById(id) {
        return CommentRepository.getById(id)
    }

    static async update(comment) {

        const id = comment.id
        if (!id) {
            throw new Error('Comentário não encontrado com esse id')
        }

        let savedComment = this.getById(id)
        savedComment = {...comment}
        return CommentRepository.save(savedComment)
    }
}