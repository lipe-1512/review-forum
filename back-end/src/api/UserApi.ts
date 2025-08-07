import { Router, Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { authenticateToken } from '../middleware/authMiddleware';

const userRoutes = Router();



//  Cenário 1: Cadastro de usuário
userRoutes.post('/register', async (req: Request, res: Response) => {
    try {
        const user = await UserService.registerUser(req.body);
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// Autenticação (Login)
userRoutes.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await UserService.loginUser(email, password);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
});

//  Cenário 8: Recuperação de conta (a lógica estaria no UserService)
// userRoutes.post('/forgot-password', ...);
// userRoutes.post('/reset-password', ...);

// --- Rotas Protegidas (deveriam usar um middleware de autenticação) ---
// Exemplo: userRoutes.use(authenticateToken);

// Obter perfil de um usuário
userRoutes.get('/:id', async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);
        const user = await UserService.getUserProfile(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao buscar perfil do usuário' });
    }
});

//  Cenário 2: Atualizar informações
userRoutes.put('/:id', async (req: Request, res: Response) => {
    // Em uma aplicação real, aqui você validaria se o usuário logado é o mesmo do req.params.id
    try {
        const userId = parseInt(req.params.id);
        const updatedUser = await UserService.updateUser(userId, req.body);
        res.status(200).json(updatedUser);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

//  Cenário 3: Excluir conta
userRoutes.delete('/:id', async (req: Request, res: Response) => {
    // Adicionar validação de permissão aqui
    try {
        const userId = parseInt(req.params.id);
        await UserService.deleteUser(userId);
        res.status(204).send(); // 204 No Content é uma boa resposta para delete
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

//  Cenário 4 & 5: Seguir e Deixar de Seguir
userRoutes.post('/:id/follow', async (req: Request, res: Response) => {
    try {
        const { currentUserId } = req.body; // Em produção, este ID viria do token JWT
        const userIdToFollow = parseInt(req.params.id);
        await UserService.followUser(currentUserId, userIdToFollow);
        res.status(200).json({ message: "Usuário seguido com sucesso." });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

userRoutes.post('/:id/unfollow', async (req: Request, res: Response) => {
    try {
        const { currentUserId } = req.body;
        const userIdToUnfollow = parseInt(req.params.id);
        await UserService.unfollowUser(currentUserId, userIdToUnfollow);
        res.status(200).json({ message: "Deixou de seguir o usuário com sucesso." });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

export default userRoutes;