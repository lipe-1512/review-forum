import { Forum } from "../models/Forum";
import ForumRepository from "../repository/ForumRepository";
import MovieServices from "./MovieServices";
import { User } from "../models/User";
import { UserService } from "./UserService";
import { UserRepository } from "../repository/UserRepository"; 
export default class ForumService {

    static getById(id: number): Promise<Forum | null> {
        return ForumRepository.getById(id);
    }

    static getAll(): Promise<Forum[]> {
        return ForumRepository.getAll();
    }

    static searchByTitle(title: string): Promise<Forum[]> {
        return ForumRepository.searchByTitle(title);
    }
    static searchByCreatorUser(username: string): Promise<Forum[]> {
        return ForumRepository.searchByCreatorUser(username);
    }

    static async updateForum(forum: Forum): Promise<any> {
        const existingForum = await ForumRepository.getById(forum.id);
        if (!existingForum) {
            throw new Error('Forum not found');
        }

        existingForum.title = forum.title;
        existingForum.description = forum.description || '';

        return ForumRepository.saveForum(existingForum);
    }

    // MUDANÇA: Ajustar as validações
    static validate(forum: any) {

        if (!forum.title) {
            throw new Error('O título do forum é obrigatório');
        }

        // Valida se 'username' foi enviado
        if (!forum.username) {
            throw new Error('O usuário é um campo obrigatório');
        }

        // Valida se 'movieId' foi enviado com uma mensagem correta
        if (!forum.movieId) {
            throw new Error('O filme é um campo obrigatório');
        }
    }
    
    // MUDANÇA: Ajustar a lógica de salvar o fórum
    static async saveForum(forum: any): Promise<any> {
        
        // A validação agora está correta
        this.validate(forum);

        // Busca o objeto do usuário pelo nome de usuário recebido no DTO
        const creator = await UserRepository.findOneBy({ username: forum.username });
        if (!creator) {
            throw new Error(`O usuário '${forum.username}' não existe`);
        }
        
        // Busca o filme relacionado
        const relatedMovie = await MovieServices.getById(forum.movieId);
        if (!relatedMovie) {
            throw new Error(`O Filme com o ID ${forum.movieId} não existe`);
        }

        // Cria a instância do Forum usando os objetos completos 'creator' (User) e 'relatedMovie' (Movie)
        const newForum = new Forum(forum.title, forum.description, creator, relatedMovie);
        
        return ForumRepository.saveForum(newForum);
    }
}