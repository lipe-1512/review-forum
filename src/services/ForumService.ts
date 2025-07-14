import { Forum } from "../models/Forum"
import ForumRepository from "../repository/ForumRepository"
import MovieServices from "./MovieServices"

export default class ForumService {

    private static instance: ForumService;

    private constructor() {}

    static getInstance(): ForumService {
        if (!ForumService.instance) {
        ForumService.instance = new ForumService();
        }
        return ForumService.instance;
    }
    
    getById(id: Number): Promise<Forum | null> {
        return ForumRepository.getInstance().getById(id)
    }
    getAll(): Promise<Forum[]> {
        return ForumRepository.getInstance().getAll()
    }
    searchByTitle(title: string): Promise<Forum[]> {
        return ForumRepository.getInstance().searchByTitle(title)
    }
    searchByCreatorUser(username: string): Promise<Forum[]> {
        return ForumRepository.getInstance().searchByCreatorUser(username)
    }
    
    async saveForum(forum: any): Promise<any> {
        const relatedMovie= await MovieServices.getById(forum.relatedMovieId)
        if (!relatedMovie) {
            throw Error('TODO create a this error properly')
        }

        if (!forum.title) {
            throw new Error('O títutlo do forum é requerido')
        }

        return ForumRepository.getInstance().saveForum(new Forum(forum.title, forum.description, forum.username, relatedMovie))
    }

}