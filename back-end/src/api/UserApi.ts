import { Router, Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { authenticateToken } from '../middleware/authMiddleware';

const userRoutes = Router();

// --- Rotas Públicas ---
// Cadastro
userRoutes.post('/register', async (req: Request, res: Response) => {
    try {
        const user = await UserService.registerUser(req.body);
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// Login
userRoutes.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await UserService.loginUser(email, password);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
});

// RECUPERAÇÃO DE SENHA - ROTAS PÚBLICAS

/**
 * Solicita o reset de senha.
 * Envia um e-mail com link de recuperação (simulado).
 */
userRoutes.post('/forgot-password', async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "E-mail é obrigatório." });
        }
        await UserService.requestPasswordReset(email);
        res.status(200).json({
            message: "Se o seu e-mail estiver em nosso sistema, um link de recuperação foi enviado."
        });
    } catch (error: any) {
        // Log interno para depuração, sem vazar detalhes para o cliente
        console.error("Erro na solicitação de reset de senha:", error);
        res.status(500).json({ message: "Ocorreu um erro interno. Tente novamente mais tarde." });
    }
});

/**
 * Redefine a senha usando um token válido.
 */
userRoutes.post('/reset-password', async (req: Request, res: Response) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token e nova senha são obrigatórios." });
        }

        await UserService.resetPassword(token, newPassword);
        res.status(200).json({ message: "Senha redefinida com sucesso." });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// --- Rotas Protegidas ---
// Perfil de usuário (leitura pública permitida)
userRoutes.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = await UserService.getUserProfile(parseInt(req.params.id));
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// ATUALIZAÇÃO DO USUÁRIO
userRoutes.put('/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
        const loggedInUserId = res.locals.userId;
        const targetUserId = parseInt(req.params.id);

        if (loggedInUserId !== targetUserId) {
            return res.status(403).json({
                message: 'Acesso negado. Você não tem permissão para editar este perfil.'
            });
        }

        const updatedUser = await UserService.updateUser(targetUserId, req.body);
        res.status(200).json(updatedUser);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// EXCLUSÃO DO USUÁRIO
userRoutes.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
        const loggedInUserId = res.locals.userId;
        const targetUserId = parseInt(req.params.id);

        if (loggedInUserId !== targetUserId) {
            return res.status(403).json({
                message: 'Acesso negado. Você não tem permissão para excluir este perfil.'
            });
        }

        await UserService.deleteUser(targetUserId);
        res.status(204).send();
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// SISTEMA DE SEGUIR - ROTAS PROTEGIDAS E SEM NOTIFICAÇÃO NO API

// Seguir usuário
userRoutes.post('/:id/follow', authenticateToken, async (req: Request, res: Response) => {
    try {
        const currentUserId = res.locals.userId; // ID do token (seguro)
        const userIdToFollow = parseInt(req.params.id);

        if (currentUserId === userIdToFollow) {
            return res.status(400).json({ message: 'Você não pode seguir a si mesmo.' });
        }

        // A notificação será disparada DENTRO do UserService
        await UserService.followUser(currentUserId, userIdToFollow);

        res.status(200).json({ message: 'Usuário seguido com sucesso.' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// Deixar de seguir
userRoutes.post('/:id/unfollow', authenticateToken, async (req: Request, res: Response) => {
    try {
        const currentUserId = res.locals.userId; // ID do token (seguro)
        const userIdToUnfollow = parseInt(req.params.id);

        await UserService.unfollowUser(currentUserId, userIdToUnfollow);
        res.status(200).json({ message: 'Deixou de seguir o usuário com sucesso.' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

export default userRoutes;