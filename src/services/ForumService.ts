import { Forum } from "../models/Forum"
import ForumRepository from "../repository/ForumRepository"
import MovieServices from "./MovieServices"

export default class ForumService {

    static getById(id: Number): Promise<Forum | null> {
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
        return ForumRepository.saveForum(existingForum);
    }
    
    static async saveForum(forum: any): Promise<any> {
        const relatedMovie= await MovieServices.getById(forum.movieId)
        
        if (!relatedMovie) {
            throw Error('Filme relacionado não encontrado')
        }

        if (!forum.title) {
            throw new Error('O títutlo do forum é requerido')
        }

        return ForumRepository.saveForum(new Forum(forum.title, forum.description, forum.username, relatedMovie))
    }

}