import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import UserRepositoryClass from '../repository/UserRepository';
import { User } from '../models/User';

export class UserService {
  async create(userData: Partial<User>): Promise<User> {
    const { name, email, password } = userData;
    if (!email || !password || !name) {
      throw new Error('Nome, email e senha são obrigatórios.');
    }

    const existingUser = await UserRepositoryClass.findByEmail(email);
    if (existingUser) {
      throw new Error('E-mail já cadastrado no sistema.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = UserRepositoryClass.create({
      name,
      email,
      password: hashedPassword,
    });
    return UserRepositoryClass.save(newUser);
  }

  async update(id: number, updateData: Partial<User>): Promise<User | null> {
    const user = await UserRepositoryClass.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }
    UserRepositoryClass.merge(user, updateData);
    return UserRepositoryClass.save(user);
  }

  async delete(id: number): Promise<void> {
    const result = await UserRepositoryClass.delete(id);
    if (result.affected === 0) {
      throw new Error('Usuário não encontrado.');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await UserRepositoryClass.findByEmail(email);
    if (!user) {
      // Silently succeed to prevent email enumeration
      return;
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    Object.assign(user, {
      passwordResetToken: crypto.createHash('sha256').update(resetToken).digest('hex'),
      passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    await UserRepositoryClass.save(user);
    // Em um app real, aqui você enviaria um e-mail para o usuário com o `resetToken`
    console.log(`Password reset token for ${email}: ${resetToken}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    // @ts-ignore
    const user = await UserRepositoryClass.findOneBy({
      passwordResetToken: hashedToken,
    });

    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
        throw new Error('Token é inválido ou expirou.');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    // @ts-ignore
    user.passwordResetToken = null;
    // @ts-ignore
    user.passwordResetExpires = null;

    await UserRepositoryClass.save(user);
  }

  // Novos métodos para seguir, deixar de seguir e manipular listas pessoais

  async followUser(userId: number, followId: number): Promise<void> {
    await UserRepositoryClass.followUser(userId, followId);
  }

  async unfollowUser(userId: number, unfollowId: number): Promise<void> {
    await UserRepositoryClass.unfollowUser(userId, unfollowId);
  }

  async addItemToList(userId: number, listName: string, itemId: number): Promise<void> {
    await UserRepositoryClass.addItemToList(userId, listName, itemId);
  }

  async removeItemFromList(userId: number, listName: string, itemId: number): Promise<void> {
    await UserRepositoryClass.removeItemFromList(userId, listName, itemId);
  }
}
