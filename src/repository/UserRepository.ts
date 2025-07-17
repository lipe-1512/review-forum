import { AppDataSource } from '../infra/db';
import { User } from '../models/User';
import { Movie } from '../models/Movie';
import { UserListItem, ListType } from '../models/UserListItem';
import { Repository } from 'typeorm';

const userRepository: Repository<User> = AppDataSource.getRepository(User);
const movieRepository: Repository<Movie> = AppDataSource.getRepository(Movie);
const userListItemRepository: Repository<UserListItem> = AppDataSource.getRepository(UserListItem);

export default class UserRepositoryClass {
  static async findByEmail(email: string): Promise<User | null> {
    return userRepository.findOneBy({ email });
  }

  static async findById(id: number): Promise<User | null> {
    return userRepository.findOneBy({ id });
  }

  static async save(user: User): Promise<User> {
    return userRepository.save(user);
  }

  static async delete(id: number): Promise<{ affected?: number }> {
    const result = await userRepository.delete(id);
    // TypeORM DeleteResult.affected can be number | null | undefined
    // Normalize null to undefined to satisfy return type
    return { affected: result.affected ?? undefined };
  }

  static create(userData: Partial<User>): User {
    return userRepository.create(userData);
  }

  static merge(user: User, updateData: Partial<User>): User {
    return userRepository.merge(user, updateData);
  }

  // To fix type incompatibility, omit problematic properties from conditions
  static async findOneBy(conditions: Partial<Omit<User, 'following' | 'passwordResetToken' | 'passwordResetExpires'>> & { passwordResetToken?: string | null }): Promise<User | null> {
    // Use query builder to avoid type issues with nullable fields
    const query = userRepository.createQueryBuilder('user');

    if (conditions.passwordResetToken) {
      query.andWhere('user.passwordResetToken = :token', { token: conditions.passwordResetToken });
    }
    if (conditions.id) {
      query.andWhere('user.id = :id', { id: conditions.id });
    }
    if (conditions.email) {
      query.andWhere('user.email = :email', { email: conditions.email });
    }

    const user = await query.getOne();
    return user ?? null;
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

  static async unfollowUser(userId: number, unfollowId: number): Promise<void> {
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ['following'],
    });
    if (!user || !user.following) {
      throw new Error('Usuário não encontrado ou não está seguindo ninguém.');
    }
    user.following = user.following.filter(u => u.id !== unfollowId);
    await userRepository.save(user);
  }

  static async addItemToList(userId: number, listName: string, itemId: number): Promise<void> {
    const user = await userRepository.findOneBy({ id: userId });
    const movie = await movieRepository.findOneBy({ id: itemId });
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }
    if (!movie) {
      throw new Error('Filme não encontrado.');
    }

    const listType = ListType[listName.toUpperCase() as keyof typeof ListType];
    if (!listType) {
      throw new Error('Lista inválida.');
    }

    const existingItem = await userListItemRepository.findOne({
      where: { user: { id: userId }, movie: { id: itemId }, listType },
    });

    if (!existingItem) {
      const newItem = userListItemRepository.create({
        user,
        movie,
        listType,
      });
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
