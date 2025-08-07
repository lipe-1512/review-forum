import { UserListItem } from "../models/UserListItem";
import { UserListItemRepository } from "../repository/UserListItemRepository";
import { UserRepository } from "../repository/UserRepository";
import  MovieRepository  from "../repository/MovieRepository";

export class UserListService {
    
    //  Cenário 6: Adicionar item à uma lista
    static async addItemToList(userId: number, movieId: number, listType: string): Promise<UserListItem> {
        const user = await UserRepository.findOneBy({ id: userId });
        const movie = await MovieRepository.getById(movieId);
        
        if (!user) throw new Error("Usuário não encontrado.");
        if (!movie) throw new Error("Filme não encontrado.");
        
        const existingItem = await UserListItemRepository.findOneBy({
            user: { id: userId },
            movie: { id: movieId },
            listType,
        });

        if (existingItem) {
            throw new Error("Este item já está nesta lista.");
        }
        
        const newItem = UserListItemRepository.create({ user, movie, listType });
        return await UserListItemRepository.save(newItem);
    }

    //  Cenário 7: Remover item de uma lista
    static async removeItemFromList(listItemId: number, userId: number): Promise<void> {
        // Busca o item para garantir que ele pertence ao usuário logado
        const listItem = await UserListItemRepository.findOne({
            where: { id: listItemId },
            relations: ['user']
        });

        if (!listItem) {
            throw new Error("Item da lista não encontrado.");
        }

        if (listItem.user.id !== userId) {
            throw new Error("Você não tem permissão para remover este item.");
        }

        await UserListItemRepository.delete(listItemId);
    }

    // Obter todos os itens de uma lista específica de um usuário
    static async getUserList(userId: number, listType: string): Promise<UserListItem[]> {
        return await UserListItemRepository.find({
            where: { user: { id: userId }, listType },
            relations: ['movie'],
            order: { added_at: 'DESC' },
        });
    }
}