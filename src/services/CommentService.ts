import Comment from "../models/Comment";
import CommentRepository from "../repository/CommentRepository";


export default class CommentService {

    static async getByForum(forumId) {
        return CommentRepository.getByForum(forumId)
    }

    static async getByCommentReference(commentReferenceId) {
        return CommentRepository.getByCommentReference(commentReferenceId)
    }

    static validate(comment) {
        if (!comment.content) {
            throw new Error('Conteúdo é obrigatório')
        }
        //TODO CREATE VALIDATE TESTS SCENARIOS
    }

    static async add(comment) {
        this.validate(comment)
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