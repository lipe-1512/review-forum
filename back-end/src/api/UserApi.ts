import { Router, Request, Response } from 'express';
import { UserService } from '../services/UserService';
// import { authenticateToken } from '../middleware/authMiddleware'; // Você precisará disto para proteger rotas

const userRoutes = Router();

// --- Rotas Públicas ---
userRoutes.post('/register', async (req: Request, res: Response) => {
    try {
        const user = await UserService.registerUser(req.body);
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

userRoutes.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await UserService.loginUser(email, password);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
});

// --- Rotas Protegidas ---
// (Em uma aplicação real, a partir daqui usaríamos um middleware de autenticação)
// Exemplo: userRoutes.use(authenticateToken);

// Perfil de usuário
userRoutes.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = await UserService.getUserProfile(parseInt(req.params.id));
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

userRoutes.put('/:id', async (req: Request, res: Response) => {
    try {
        // Validação: o usuário logado só pode editar o próprio perfil
        // const loggedInUserId = (req as any).user.id; 
        // if (loggedInUserId !== parseInt(req.params.id)) {
        //     return res.status(403).json({ message: 'Acesso negado.' });
        // }
        const updatedUser = await UserService.updateUser(parseInt(req.params.id), req.body);
        res.status(200).json(updatedUser);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

userRoutes.delete('/:id', async (req: Request, res: Response) => {
    try {
        await UserService.deleteUser(parseInt(req.params.id));
        res.status(204).send();
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// Sistema de Seguir
userRoutes.post('/:id/follow', async (req: Request, res: Response) => {
    try {
        const { currentUserId } = req.body; // Em uma aplicação real, isso viria do token autenticado
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

export default userRoutes; // Exportação padrão para manter consistência