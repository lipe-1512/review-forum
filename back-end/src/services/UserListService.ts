import { UserListItem } from "../models/UserListItem";
import { UserListItemRepository } from "../repository/UserListItemRepository";
import { UserRepository } from "../repository/UserRepository";
import { MovieRepository } from "../repository/MovieRepository";

export class UserListService {
    
    //  Cenário 6: Adicionar item à lista
    static async addItemToList(userId: number, movieId: number, listType: string): Promise<UserListItem> {
        const user = await UserRepository.findOneBy({ id: userId });
        const movie = await MovieRepository.getById(movieId);
        
        if (!user) throw new Error("Usuário não encontrado.");
        if (!movie) throw new Error("Filme não encontrado.");
        
        // Verifica se o item já está na lista
        const existingItem = await UserListItemRepository.findOneBy({ user: { id: userId }, movie: { id: movieId }, listType });
        if (existingItem) throw new Error("Este item já está na sua lista.");
        
        const newItem = UserListItemRepository.create({ user, movie, listType });
        return await UserListItemRepository.save(newItem);
    }

    //  Cenário 7: Remover item da lista
    static async removeItemFromList(userId: number, movieId: number, listType: string): Promise<void> {
        const result = await UserListItemRepository.delete({ user: { id: userId }, movie: { id: movieId }, listType });
        if (result.affected === 0) {
            throw new Error("Item não encontrado na lista.");
        }
    }

    static async getUserList(userId: number, listType: string): Promise<UserListItem[]> {
        return await UserListItemRepository.find({
            where: { user: { id: userId }, listType },
            relations: ['movie'],
        });
    }
}