import Comment from "../models/Comment";
import ForumService from "./ForumService";
import CommentRepository from "../repository/CommentRepository";

// Definindo uma interface para o DTO (Data Transfer Object) de Comment.
// Isso define a estrutura esperada dos dados que chegam da API.
interface CommentDTO {
    id?: number;
    content: string;
    usernameAuthor: string;
    forumId: number; // O ID do fórum ao qual o comentário pertence.
    replyToCommentId?: number;
    isEdited?: boolean;
}

export default class CommentService {

    /**
     * Busca todos os comentários de um fórum específico.
     * @param forumId - O ID do fórum (pode ser string vindo da URL).
     */
    static async getByForum(forumId: number | string): Promise<Comment[]> {
        const id = typeof forumId === 'string' ? parseInt(forumId, 10) : forumId;
        return CommentRepository.getByForum(id);
    }

    /**
     * Busca todas as respostas a um comentário específico.
     * @param commentReferenceId - O ID do comentário de referência.
     */
    static async getCommentReplies(commentReferenceId: number | string): Promise<Comment[]> {
        const id = typeof commentReferenceId === 'string' ? parseInt(commentReferenceId, 10) : commentReferenceId;
        return CommentRepository.getByCommentReference(id);
    }

    /**
     * Valida os dados de um comentário antes de criar ou atualizar.
     * @param comment - O objeto com os dados do comentário.
     */
    static async validate(comment: CommentDTO): Promise<void> {
        if (!comment.content) {
            throw new Error('Conteúdo é obrigatório');
        }

        if (!comment.usernameAuthor) {
            throw new Error('Nome de usuário do autor é obrigatório');
        }

        if (!comment.forumId) {
            throw new Error('Fórum é obrigatório');
        }
        
        const forum = await ForumService.getById(comment.forumId);

        if (!forum) {
            throw new Error('Fórum não encontrado');
        }

        if (comment.replyToCommentId) {
            const referencedComment = await CommentRepository.getById(comment.replyToCommentId);
            if (!referencedComment) {
                throw new Error('Comentário de referência não encontrado');
            }
        }
    }

    /**
     * Adiciona um novo comentário ao banco de dados.
     * @param commentDto - Os dados do comentário a ser criado.
     */
    static async add(commentDto: CommentDTO): Promise<Comment> {
        await this.validate(commentDto);
        
        // Cria uma nova instância da entidade Comment para ser salva no banco
        const newComment = new Comment(
            commentDto.content,
            commentDto.usernameAuthor,
            commentDto.forumId,
            false, // um novo comentário nunca é editado
            commentDto.replyToCommentId
        );
        
        return CommentRepository.save(newComment);
    }

    /**
     * Busca um comentário pelo seu ID.
     * @param id - O ID do comentário.
     */
    static async getById(id: number | string): Promise<Comment | null> {
        const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
        return CommentRepository.getById(numericId);
    }

    /**
     * Atualiza um comentário existente.
     * @param commentData - Os dados a serem atualizados, incluindo o ID.
     */
    static async update(commentData: Partial<CommentDTO>): Promise<Comment> {
        if (!commentData.id) {
            throw new Error('ID do comentário é obrigatório para atualização.');
        }

        const savedComment = await this.getById(commentData.id);
        if (!savedComment) {
            throw new Error(`Comentário com ID ${commentData.id} não encontrado.`);
        }

        // Mescla os dados novos no registro existente e marca como editado
        Object.assign(savedComment, commentData);
        savedComment.isEdited = true;

        return CommentRepository.save(savedComment);
    }
}