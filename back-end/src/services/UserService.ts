// Caminho: back-end/src/services/UserService.ts

import { User } from "../models/User";
import { UserRepository } from "../repository/UserRepository";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class UserService {

    //  Cenário 1: Cadastro de usuário
    static async registerUser(userData: Partial<User>): Promise<Omit<User, 'password'>> {
        if (!userData.username || !userData.email || !userData.password) {
            throw new Error("Nome de usuário, email e senha são obrigatórios.");
        }

        const existingUser = await UserRepository.findOne({ where: [{ email: userData.email }, { username: userData.username }] });
        if (existingUser) {
            throw new Error("Email ou nome de usuário já cadastrado.");
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = UserRepository.create({ ...userData, password: hashedPassword });
        const savedUser = await UserRepository.save(user);
        
        const { password, ...userResult } = savedUser; // Remove a senha do objeto de retorno
        return userResult;
    }
    
    // Autenticação (Login)
    static async loginUser(email: string, pass: string): Promise<{ token: string, user: Omit<User, 'password'> }> {
        const user = await UserRepository.createQueryBuilder("user")
            .addSelect("user.password") // Força a inclusão do campo de senha
            .where("user.email = :email", { email })
            .getOne();

        if (!user) {
            throw new Error("Credenciais inválidas.");
        }

        const isPasswordValid = await bcrypt.compare(pass, user.password);
        if (!isPasswordValid) {
            throw new Error("Credenciais inválidas.");
        }

        const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '24h' });
        
        const { password, ...userResult } = user;
        return { token, user: userResult };
    }

    //  Cenário 2: Atualizar informações
    static async updateUser(userId: number, updates: Partial<User>): Promise<User | null> {
        // Remove campos sensíveis que não devem ser atualizados diretamente
        delete updates.password; 
        delete updates.email;
        
        await UserRepository.update(userId, updates);
        return UserRepository.findOneBy({ id: userId });
    }
    
    //  Cenário 3: Excluir conta
    static async deleteUser(userId: number): Promise<void> {
        const result = await UserRepository.delete(userId);
        if (result.affected === 0) {
            throw new Error("Usuário não encontrado.");
        }
    }
    
    //  Cenário 4 & 5: Seguir e Deixar de Seguir
    static async followUser(currentUserId: number, userIdToFollow: number): Promise<void> {
        if (currentUserId === userIdToFollow) throw new Error("Você não pode seguir a si mesmo.");
        
        const currentUser = await UserRepository.findOne({ where: { id: currentUserId }, relations: ['following'] });
        const userToFollow = await UserRepository.findOneBy({ id: userIdToFollow });

        if (!currentUser || !userToFollow) throw new Error("Usuário não encontrado.");
        
        const isAlreadyFollowing = currentUser.following.some(u => u.id === userIdToFollow);
        if (isAlreadyFollowing) throw new Error("Você já está seguindo este usuário.");

        currentUser.following.push(userToFollow);
        await UserRepository.save(currentUser);
    }

    static async unfollowUser(currentUserId: number, userIdToUnfollow: number): Promise<void> {
        // CORREÇÃO: Adicionado 'relations: ['following']' para carregar a lista de quem o usuário segue
        const currentUser = await UserRepository.findOne({ where: { id: currentUserId }, relations: ['following'] });
        if (!currentUser) throw new Error("Usuário não encontrado.");

        const isFollowing = currentUser.following.some(u => u.id === userIdToUnfollow);
        if (!isFollowing) throw new Error("Você não está seguindo este usuário.");

        currentUser.following = currentUser.following.filter(u => u.id !== userIdToUnfollow);
        await UserRepository.save(currentUser);
    }
    
    // Método auxiliar para buscar perfil
    static async getUserProfile(userId: number): Promise<User | null> {
        return UserRepository.findOne({
            where: { id: userId },
            relations: ['reviews', 'followers', 'following', 'listItems']
        });
    }
}