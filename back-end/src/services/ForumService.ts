import { Forum } from "../models/Forum"
import ForumRepository from "../repository/ForumRepository"
import MovieServices from "./MovieServices"
import { User } from "../models/User"
import { UserService } from "./UserService"

export default class ForumService {

    static getById(id: number): Promise<Forum | null> {
        return ForumRepository.getById(id)
    }

    static getAll(): Promise<Forum[]> {
        return ForumRepository.getAll()
    }

    static searchByTitle(title: string): Promise<Forum[]> {
        return ForumRepository.searchByTitle(title)
    }
    static searchByCreatorUser(username: string): Promise<Forum[]> {
        return ForumRepository.searchByCreatorUser(username)
    }

    static async updateForum(forum: Forum): Promise<any> {
        const existingForum = await ForumRepository.getById(forum.id);
        if (!existingForum) {
            throw new Error('Forum not found');
        }

        existingForum.title = forum.title;
        existingForum.description = forum.description || '';

        this.validate(existingForum);
        return ForumRepository.saveForum(existingForum);
    }

    static validate(forum: any) {

        if (!forum.title) {
            throw new Error('O título do forum é obrigatório')
        }

        if (!forum.creatorId) {
            throw new Error('O criador do fórum é um campo obrigatório');
        }

        if (!forum.movieId) {
            throw new Error('O filme é um campo obrigatório');
        }
    }
    
    static async saveForum(forum: any): Promise<any> {

        this.validate(forum)

        const relatedMovie= await MovieServices.getById(forum.movieId)
        
        if (!relatedMovie) {
            throw Error(`O Filme com o ID ${forum.movieId} não existe`)
        }

        return ForumRepository.saveForum(new Forum(forum.title, forum.description, forum.username, relatedMovie))
    }

}