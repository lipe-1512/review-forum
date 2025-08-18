import { User } from "../models/User";
import { UserRepository } from "../repository/UserRepository";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NotificationService } from './NotificationService'; // Importar o serviço de notificação
import crypto from 'crypto'; // Importar módulo crypto do Node.js
import { MoreThan } from 'typeorm'; // Importar MoreThan para verificar expiração

export class UserService {

    //  Cenário 1: Cadastro de usuário com validação de senha forte
    static async registerUser(userData: Partial<User>): Promise<Omit<User, 'password'>> {
        if (!userData.username || !userData.email || !userData.password) {
            throw new Error("Nome de usuário, email e senha são obrigatórios.");
        }

        // Validação de senha forte
        if (userData.password.length < 8) {
            throw new Error("A senha precisa ter no mínimo 8 caracteres.");
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(userData.password)) {
            throw new Error("A senha deve conter letra maiúscula, minúscula, número e caractere especial.");
        }

        const existingUser = await UserRepository.findOne({ 
            where: [{ email: userData.email }, { username: userData.username }] 
        });
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

    /**
     * Permite que um usuário siga outro.
     * Dispara uma notificação para o usuário seguido.
     * 
     * @param currentUserId ID do usuário que está seguindo
     * @param userIdToFollow ID do usuário a ser seguido
     */
    static async followUser(currentUserId: number, userIdToFollow: number): Promise<void> {
        if (currentUserId === userIdToFollow) {
            throw new Error("Você não pode seguir a si mesmo.");
        }
        
        const currentUser = await UserRepository.findOne({ 
            where: { id: currentUserId }, 
            relations: ['following'] 
        });
        const userToFollow = await UserRepository.findOneBy({ id: userIdToFollow });

        if (!currentUser || !userToFollow) {
            throw new Error("Usuário não encontrado.");
        }
        
        const isAlreadyFollowing = currentUser.following.some(u => u.id === userIdToFollow);
        if (isAlreadyFollowing) {
            throw new Error("Você já está seguindo este usuário.");
        }

        // Adiciona o usuário à lista de seguidos
        currentUser.following.push(userToFollow);
        await UserRepository.save(currentUser);

        // Disparar a notificação APÓS o sucesso da operação
        try {
            await NotificationService.createFollowNotification(userIdToFollow, currentUserId);
        } catch (error) {
            // Importante: falha na notificação não deve quebrar a operação principal
            console.error(`Falha ao criar notificação de seguir para o usuário ${userIdToFollow}:`, error);
        }
    }

    /**
     * Permite que um usuário deixe de seguir outro.
     * 
     * @param currentUserId ID do usuário que está deixando de seguir
     * @param userIdToUnfollow ID do usuário a ser desseguido
     */
    static async unfollowUser(currentUserId: number, userIdToUnfollow: number): Promise<void> {
        const currentUser = await UserRepository.findOne({ 
            where: { id: currentUserId }, 
            relations: ['following'] 
        });
        if (!currentUser) {
            throw new Error("Usuário não encontrado.");
        }

        const isFollowing = currentUser.following.some(u => u.id === userIdToUnfollow);
        if (!isFollowing) {
            throw new Error("Você não está seguindo este usuário.");
        }

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

    // NOVOS MÉTODOS: RECUPERAÇÃO DE SENHA

    /**
     * Solicita a recuperação de senha.
     * Gera um token e simula o envio de e-mail.
     * 
     * @param email Email do usuário que deseja recuperar a conta
     */
    static async requestPasswordReset(email: string): Promise<void> {
        const user = await UserRepository.findOneBy({ email });
        if (!user) {
            // Não retorne erro para evitar enumeração de e-mails
            // Para o cliente, o fluxo parece bem-sucedido
            return;
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora

        await UserRepository.save(user);

        // ------------------ LÓGICA DE ENVIO DE E-MAIL (MOCK) ------------------
        // Em um projeto real, use nodemailer, SendGrid, etc.
        const resetURL = `http://localhost:3001/reset-password/${resetToken}`; // Front-end
        console.log(`-- SIMULAÇÃO DE EMAIL --`);
        console.log(`Para: ${user.email}`);
        console.log(`Link de recuperação: ${resetURL}`);
        console.log(`------------------------`);
    }

    /**
     * Redefine a senha usando um token válido.
     * 
     * @param token Token de recuperação
     * @param newPassword Nova senha
     */
    static async resetPassword(token: string, newPassword: string): Promise<void> {
        const user = await UserRepository.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: MoreThan(new Date()), // Garante que o token ainda é válido
            }
        });

        if (!user) {
            throw new Error("Token de recuperação inválido ou expirado.");
        }

        // Reutiliza validação de senha forte
        if (newPassword.length < 8) {
            throw new Error("A nova senha precisa ter no mínimo 8 caracteres.");
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(newPassword)) {
            throw new Error("A nova senha deve conter letra maiúscula, minúscula, número e caractere especial.");
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await UserRepository.save(user);
    }
}