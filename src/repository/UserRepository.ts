import { AppDataSource } from '../infra/db';
import { User } from '../models/User';
import { Movie } from '../models/Movie';
import { UserListItem, ListType } from '../models/UserListItem';
import { Repository } from 'typeorm';

const userRepository: Repository<User> = AppDataSource.getRepository(User);
const movieRepository: Repository<Movie> = AppDataSource.getRepository(Movie);
const userListItemRepository: Repository<UserListItem> = AppDataSource.getRepository(UserListItem);

export default class UserRepositoryClass {
  static findByEmail(email: string): Promise<User | null> {
    return userRepository.findOneBy({ email });
  }

  static findById(id: number): Promise<User | null> {
    return userRepository.findOneBy({ id });
  }

  static save(user: User): Promise<User> {
    return userRepository.save(user);
  }

  static async delete(id: number): Promise<{ affected?: number }> {
    const result = await userRepository.delete(id);
    return { affected: result.affected ?? undefined };
  }

  static create(userData: Partial<User>): User {
    return userRepository.create(userData);
  }

  static merge(user: User, updateData: Partial<User>): User {
    return userRepository.merge(user, updateData);
  }

  static async followUser(userId: number, followId: number): Promise<void> {
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ['following'],
    });
    const userToFollow = await userRepository.findOneBy({ id: followId });
    if (!user || !userToFollow) {
      throw new Error('Usuário não encontrado.');
    }
    if (!user.following) {
      user.following = [];
    }
    if (!user.following.find(u => u.id === followId)) {
      user.following.push(userToFollow);
      await userRepository.save(user);
    }
  }

  // --- MÉTODO CORRIGIDO ---
  static async unfollowUser(userId: number, unfollowId: number): Promise<void> {
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ['following'],
    });

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }
    
    // Guarda a contagem inicial de usuários seguidos
    const initialFollowingCount = user.following ? user.following.length : 0;

    // Tenta remover o usuário da lista
    user.following = user.following.filter(u => u.id !== unfollowId);

    // Guarda a contagem final
    const finalFollowingCount = user.following.length;

    // Se as contagens são iguais, nada foi removido. Lança um erro.
    if (initialFollowingCount === finalFollowingCount) {
      throw new Error('Não é possível deixar de seguir um usuário que não está sendo seguido.');
    }

    // Se a contagem mudou, salva o usuário com a lista atualizada.
    await userRepository.save(user);
  }
  // --- FIM DA CORREÇÃO ---


  static async addItemToList(userId: number, listName: string, itemId: number): Promise<void> {
    const user = await userRepository.findOneBy({ id: userId });
    const movie = await movieRepository.findOneBy({ id: itemId });
    if (!user || !movie) {
      throw new Error('Usuário ou Filme não encontrado.');
    }

    const listType = ListType[listName.toUpperCase() as keyof typeof ListType];
    if (!listType) {
      throw new Error('Lista inválida.');
    }

    const existingItem = await userListItemRepository.findOne({
      where: { user: { id: user.id }, movie: { id: Number(movie.id) }, listType },
    });

    if (!existingItem) {
      const newItem = userListItemRepository.create({ user, movie, listType });
      await userListItemRepository.save(newItem);
    }
  }

  static async removeItemFromList(userId: number, listName: string, itemId: number): Promise<void> {
    const listType = ListType[listName.toUpperCase() as keyof typeof ListType];
    if (!listType) {
      throw new Error('Lista inválida.');
    }

    const existingItem = await userListItemRepository.findOne({
      where: { user: { id: userId }, movie: { id: itemId }, listType },
    });

    if (!existingItem) {
      throw new Error('Item não encontrado na lista.');
    }
    await userListItemRepository.remove(existingItem);
  }
}